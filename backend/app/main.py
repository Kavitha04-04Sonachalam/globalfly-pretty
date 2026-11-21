"""
GlobalFly Consultancy Pvt Ltd — FastAPI Backend
Full validation: email format, phone (10-digit national), duplicates, consent, file type/size.
"""
import os, re
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional

from dotenv import load_dotenv, find_dotenv
_env_path = find_dotenv() or str(Path(__file__).resolve().parents[2] / ".env")
load_dotenv(_env_path, override=False)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.database import engine, Base, get_db
from app.models.models import (
    NursingApplication, ChefApplication,
    EngineeringApplication, ContactEnquiry,
)
from app.services import email_service

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GlobalFly Consultancy Pvt Ltd API",
    description="Backend API for GlobalFly overseas recruitment & consultancy platform.",
    version="2.0.0",
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Validation helpers ─────────────────────────────────────────────────────────

EMAIL_REGEX = re.compile(r"^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$", re.IGNORECASE)
ALLOWED_RESUME_TYPES = {"pdf", "doc", "docx"}
MAX_RESUME_BYTES = 10 * 1024 * 1024  # 10 MB


def normalize_email(email: str) -> str:
    return email.strip().lower()


def validate_email_format(email: str) -> str:
    """Return normalized email or raise 422."""
    cleaned = email.strip()
    if not cleaned:
        raise HTTPException(status_code=422, detail="Email address is required.")
    if not EMAIL_REGEX.match(cleaned):
        raise HTTPException(status_code=422, detail="Invalid email address format.")
    return normalize_email(cleaned)


def validate_phone(phone: str) -> str:
    """
    Validate that the national part of the phone number is exactly 10 digits.
    Accepts: +91 9876543210 | 9876543210 | +1 9876543210
    Strips leading country-code prefix (+XX…) then requires exactly 10 digits.
    """
    raw = phone.strip()
    if not raw:
        raise HTTPException(status_code=422, detail="Phone number is required.")
    # Remove optional country-code prefix (+1 to +4 digits, optionally followed by space/dash)
    national = re.sub(r"^\+\d{1,4}[\s\-.]?", "", raw)
    # Remove all remaining non-digit characters (spaces, dashes, dots)
    digits = re.sub(r"\D", "", national)
    if len(digits) != 10:
        raise HTTPException(
            status_code=422,
            detail="Please enter a valid 10-digit phone number."
        )
    return raw  # Return the original user-supplied value (do not silently modify)


def validate_resume(resume: Optional[UploadFile]) -> Optional[str]:
    """Validate file type and size. Resume is always optional."""
    if resume is None or not getattr(resume, "filename", None) or not resume.filename:
        return None
    ext = resume.filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_RESUME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '.{ext}'. Only PDF, DOC, and DOCX files are accepted."
        )
    # Check size via content (reads into memory; fine for 10 MB limit)
    if hasattr(resume, "size") and resume.size and resume.size > MAX_RESUME_BYTES:
        raise HTTPException(status_code=400, detail="Resume file must not exceed 10 MB.")
    return resume.filename


def parse_consent(consent: Optional[str]) -> bool:
    return consent in ("true", "True", "1", "on", True) if consent else False


def handle_integrity_error(e: IntegrityError, category: str) -> None:
    """Convert DB unique-constraint violation into a readable 409."""
    if "uq_" in str(e.orig) or "unique" in str(e.orig).lower():
        raise HTTPException(
            status_code=409,
            detail=(
                f"You have already submitted an application for this position using this email address. "
                f"Each applicant may apply once per category."
            )
        )
    raise HTTPException(status_code=500, detail="Database error. Please try again.")


# ── Health Check ───────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "GlobalFly Consultancy API", "version": "2.0.0"}


# ── Jobs (Static Catalogue) ────────────────────────────────────────────────────

@app.get("/api/jobs")
async def get_jobs():
    jobs = [
        {"id": "nursing",     "title": "Nurse / Nursing Professional",  "category": "Healthcare",     "route": "/jobs/nursing",     "ctaText": "View Nursing Opportunities"},
        {"id": "chef",        "title": "Professional Chef",             "category": "Chef & Kitchen", "route": "/jobs/chef",        "ctaText": "View Chef Opportunities"},
        {"id": "engineering", "title": "Engineering Professional",      "category": "Engineering",    "route": "/jobs/engineering", "ctaText": "View Engineering Opportunities"},
    ]
    return {"status": "ok", "data": jobs, "count": len(jobs)}


# ── Nursing Applications ───────────────────────────────────────────────────────

@app.post("/api/nursing-applications")
async def create_nursing_application(
    fullName:             str           = Form(...),
    email:                str           = Form(...),
    phone:                str           = Form(...),
    qualification:        str           = Form(...),
    currentLocation:      Optional[str] = Form(None),
    currentCityCountry:   Optional[str] = Form(None),
    graduationYear:       Optional[str] = Form(None),
    workExperience:       Optional[str] = Form(None),
    yearsOfExperience:    Optional[str] = Form(None),
    germanLevel:          Optional[str] = Form(None),
    passportAvailability: Optional[str] = Form(None),
    contactMethod:        Optional[str] = Form(None),
    message:              Optional[str] = Form(None),
    enquiry:              Optional[str] = Form(None),
    consent:              Optional[str] = Form(None),
    resume:               Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    # ── Validation ──
    full_name = fullName.strip()
    if len(full_name) < 2:
        raise HTTPException(status_code=422, detail="Full name must be at least 2 characters.")
    if len(full_name) > 150:
        raise HTTPException(status_code=422, detail="Full name must not exceed 150 characters.")
    if not qualification.strip():
        raise HTTPException(status_code=422, detail="Nursing qualification is required.")

    email_norm = validate_email_format(email)
    validate_phone(phone)
    resume_filename = validate_resume(resume)

    if not parse_consent(consent):
        raise HTTPException(status_code=422, detail="Privacy consent is required to submit.")

    # ── Duplicate check ──
    existing = db.query(NursingApplication).filter(
        NursingApplication.email_normalized == email_norm
    ).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="You have already submitted an application for this position using this email address."
        )

    # ── Persist ──
    record = NursingApplication(
        full_name=full_name,
        email=email.strip(),
        email_normalized=email_norm,
        phone=phone.strip(),
        qualification=qualification.strip(),
        current_location=(currentLocation or currentCityCountry or "").strip() or None,
        graduation_year=graduationYear,
        work_experience=workExperience,
        years_of_experience=yearsOfExperience or workExperience,
        german_level=germanLevel,
        passport_availability=passportAvailability,
        contact_method=contactMethod,
        message=message,
        enquiry=enquiry or message,
        consent=True,
        resume_filename=resume_filename,
    )
    try:
        db.add(record)
        db.commit()
        db.refresh(record)
    except IntegrityError as e:
        db.rollback()
        handle_integrity_error(e, "nursing")

    background_tasks.add_task(email_service.notify_nursing, {
        "id":                   record.id,
        "full_name":            record.full_name,
        "email":                record.email,
        "phone":                record.phone,
        "current_location":     record.current_location,
        "qualification":        record.qualification,
        "work_experience":      record.work_experience,
        "years_of_experience": record.years_of_experience,
        "german_level":         record.german_level,
        "passport_availability":record.passport_availability,
        "message":              record.message,
        "resume_filename":      record.resume_filename,
    })

    return {
        "status": "ok", "success": True, "id": record.id,
        "message": "Your Nursing Enquiry has been received successfully! Our Germany healthcare advisory team will contact you soon.",
    }

@app.post("/api/chef-applications")
async def create_chef_application(
    fullName:              str           = Form(...),
    email:                 str           = Form(...),
    phone:                 str           = Form(...),
    currentLocation:       str           = Form(...),
    currentJobTitle:       str           = Form(...),
    cuisineSpecialisation: str           = Form(...),
    otherCuisine:          Optional[str] = Form(None),
    yearsOfExperience:     str           = Form(...),
    qualification:         str           = Form(...),
    germanLevel:           str           = Form(...),
    englishLevel:          str           = Form(...),
    preferredRole:         Optional[str] = Form(None),
    additionalMessage:     Optional[str] = Form(None),
    consent:               Optional[str] = Form(None),
    resume:                Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    full_name = fullName.strip()
    if len(full_name) < 2:
        raise HTTPException(status_code=422, detail="Full name must be at least 2 characters.")
    if not currentLocation.strip():
        raise HTTPException(status_code=422, detail="Current location is required.")
    if not currentJobTitle.strip():
        raise HTTPException(status_code=422, detail="Current job title is required.")
    if not cuisineSpecialisation.strip():
        raise HTTPException(status_code=422, detail="Cuisine specialisation is required.")
    if not yearsOfExperience.strip():
        raise HTTPException(status_code=422, detail="Years of experience is required.")
    if not qualification.strip():
        raise HTTPException(status_code=422, detail="Qualification is required.")
    if not germanLevel.strip():
        raise HTTPException(status_code=422, detail="German language level is required.")
    if not englishLevel.strip():
        raise HTTPException(status_code=422, detail="English language level is required.")

    email_norm = validate_email_format(email)
    validate_phone(phone)
    resume_filename = validate_resume(resume)

    if not parse_consent(consent):
        raise HTTPException(status_code=422, detail="Privacy consent is required to submit.")

    existing = db.query(ChefApplication).filter(
        ChefApplication.email_normalized == email_norm
    ).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="You have already submitted an application for this position using this email address."
        )

    record = ChefApplication(
        full_name=full_name,
        email=email.strip(),
        email_normalized=email_norm,
        phone=phone.strip(),
        current_location=currentLocation.strip(),
        current_job_title=currentJobTitle.strip(),
        cuisine_specialisation=cuisineSpecialisation.strip(),
        other_cuisine=otherCuisine.strip() if otherCuisine else None,
        years_of_experience=yearsOfExperience.strip(),
        qualification=qualification.strip(),
        german_level=germanLevel.strip(),
        english_level=englishLevel.strip(),
        preferred_role=preferredRole.strip() if preferredRole else None,
        additional_message=additionalMessage.strip() if additionalMessage else None,
        consent=True,
        resume_filename=resume_filename,
    )
    try:
        db.add(record)
        db.commit()
        db.refresh(record)
    except IntegrityError as e:
        db.rollback()
        handle_integrity_error(e, "chef")

    background_tasks.add_task(email_service.notify_chef, {
        "id":                   record.id,
        "full_name":            record.full_name,
        "email":                record.email,
        "phone":                record.phone,
        "current_location":     record.current_location,
        "current_job_title":    record.current_job_title,
        "cuisine_specialisation":record.cuisine_specialisation,
        "years_of_experience": record.years_of_experience,
        "qualification":        record.qualification,
        "german_level":         record.german_level,
        "english_level":        record.english_level,
        "preferred_role":       record.preferred_role,
        "additional_message":   record.additional_message,
        "resume_filename":      record.resume_filename,
    })

    return {
        "status": "ok", "success": True, "id": record.id,
        "message": "Your Chef Details have been sent successfully!",
    }


# ── Engineering Applications ───────────────────────────────────────────────────

@app.post("/api/engineering-applications")
async def create_engineering_application(
    fullName:        str           = Form(...),
    email:           str           = Form(...),
    phone:           str           = Form(...),
    currentLocation: str           = Form(...),
    discipline:      str           = Form(...),
    qualification:   str           = Form(...),
    experience:      str           = Form(...),
    germanLevel:     str           = Form(...),
    message:         Optional[str] = Form(None),
    consent:         Optional[str] = Form(None),
    resume:          Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    full_name = fullName.strip()
    if len(full_name) < 2:
        raise HTTPException(status_code=422, detail="Full name must be at least 2 characters.")
    if len(full_name) > 150:
        raise HTTPException(status_code=422, detail="Full name must not exceed 150 characters.")
    if not currentLocation.strip():
        raise HTTPException(status_code=422, detail="Current location is required.")
    if not discipline.strip():
        raise HTTPException(status_code=422, detail="Engineering discipline is required.")
    if not qualification.strip():
        raise HTTPException(status_code=422, detail="Qualification is required.")
    if not experience.strip():
        raise HTTPException(status_code=422, detail="Work experience is required.")
    if not germanLevel.strip():
        raise HTTPException(status_code=422, detail="German language level is required.")

    email_norm = validate_email_format(email)
    validate_phone(phone)
    resume_filename = validate_resume(resume)

    if not parse_consent(consent):
        raise HTTPException(status_code=422, detail="Privacy consent is required to submit.")

    existing = db.query(EngineeringApplication).filter(
        EngineeringApplication.email_normalized == email_norm
    ).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="You have already submitted an application for this position using this email address."
        )

    record = EngineeringApplication(
        full_name=full_name,
        email=email.strip(),
        email_normalized=email_norm,
        phone=phone.strip(),
        current_location=currentLocation.strip(),
        discipline=discipline.strip(),
        qualification=qualification.strip(),
        experience=experience.strip(),
        german_level=germanLevel.strip(),
        message=message.strip() if message else None,
        consent=True,
        resume_filename=resume_filename,
    )
    try:
        db.add(record)
        db.commit()
        db.refresh(record)
    except IntegrityError as e:
        db.rollback()
        handle_integrity_error(e, "engineering")

    background_tasks.add_task(email_service.notify_engineering, {
        "id":              record.id,
        "full_name":       record.full_name,
        "email":           record.email,
        "phone":           record.phone,
        "current_location":record.current_location,
        "discipline":      record.discipline,
        "qualification":   record.qualification,
        "experience":      record.experience,
        "german_level":    record.german_level,
        "message":         record.message,
        "resume_filename": record.resume_filename,
    })

    return {
        "status": "ok", "success": True, "id": record.id,
        "message": "Your Engineering Enquiry has been received successfully! Our technical team will review your profile.",
    }


# ── General Contact Form ───────────────────────────────────────────────────────

@app.post("/api/contact")
async def create_contact(request: Request, db: Session = Depends(get_db), background_tasks: BackgroundTasks = BackgroundTasks()):
    try:
        data = await request.json()
    except Exception:
        data = {}

    full_name = (data.get("fullName") or data.get("name") or "").strip()
    email_raw = (data.get("email") or "").strip()
    phone     = (data.get("phone") or "").strip()
    subject   = (data.get("subject") or "").strip()
    message   = (data.get("message") or "").strip()
    consent   = data.get("consent", False)

    if len(full_name) < 2:
        raise HTTPException(status_code=422, detail="Full name must be at least 2 characters.")
    if len(full_name) > 150:
        raise HTTPException(status_code=422, detail="Full name must be at least 2 characters.")
    if not message or len(message) < 10:
        raise HTTPException(status_code=422, detail="Message must be at least 10 characters.")
    if not subject:
        raise HTTPException(status_code=422, detail="Subject is required.")
    if not consent:
        raise HTTPException(status_code=422, detail="Privacy consent is required to submit.")

    email_norm = validate_email_format(email_raw)

    # Phone is optional for contact form; validate only if provided
    if phone:
        validate_phone(phone)

    # Cooldown: reject accidental duplicate if same email submitted within last 60 seconds
    from sqlalchemy import text
    recent = db.execute(
        text("""
            SELECT id FROM contact_enquiries
            WHERE LOWER(TRIM(email)) = :email
              AND submitted_at >= NOW() - INTERVAL '60 seconds'
            LIMIT 1
        """),
        {"email": email_norm}  # email_norm = lower(trim)
    ).fetchone()
    if recent:
        raise HTTPException(
            status_code=429,
            detail="Your message was already received. Please wait a moment before submitting again."
        )

    record = ContactEnquiry(
        full_name=full_name,
        email=email_raw,
        phone=phone or None,
        subject=subject or None,
        message=message,
        consent=bool(consent),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    background_tasks.add_task(email_service.notify_contact, {
        "id":        record.id,
        "full_name": record.full_name,
        "email":     record.email,
        "phone":     record.phone,
        "subject":   record.subject,
        "message":   record.message,
    })

    return {
        "status": "ok", "success": True, "id": record.id,
        "message": "Thank you for reaching out to GLOBALFLY. Our consultancy team will get back to you shortly!",
    }


# ── Legacy / Utility Endpoints ─────────────────────────────────────────────────

@app.post("/api/candidates")
async def create_candidate():
    return {"status": "ok", "success": True, "message": "Candidate registration submitted successfully!"}

@app.post("/api/applications")
async def create_application():
    return {"status": "ok", "success": True, "message": "Job application received successfully!"}

@app.post("/api/eligibility")
async def create_eligibility():
    return {"status": "ok", "success": True, "message": "Your information has been submitted for an eligibility assessment."}

@app.post("/api/employer-enquiries")
async def create_employer_enquiry():
    return {"status": "ok", "success": True, "message": "Employer hiring request submitted successfully!"}


# ── Test-Email Endpoint ─────────────────────────────────────────────────────────

@app.get("/api/test-email")
async def test_email_endpoint():
    """
    Send a test email to the configured COMPANY_EMAIL.
    Use this to verify SMTP credentials without submitting a real form.
    Visit:  http://localhost:8000/api/test-email
    """
    import os
    smtp_user     = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    company_email = os.getenv("COMPANY_EMAIL", "")

    if not smtp_password:
        return {
            "status": "not_configured",
            "message": "SMTP_PASSWORD is empty in .env — add your Gmail App Password to activate email.",
            "smtp_user": smtp_user or "(not set)",
            "company_email": company_email or "(not set)",
        }

    ok = email_service._send(
        to=company_email,
        subject="[GLOBALFLY] ✅ Test Email — SMTP Verified",
        html=email_service._base_html(
            "SMTP Test", "#2563EB",
            "<h2 style='color:#0F172A;margin-top:0'>SMTP is working correctly!</h2>"
            "<p style='color:#475569'>If you received this email, GLOBALFLY email notifications are fully configured and active.</p>"
            "<p style='color:#94A3B8;font-size:12px'>Sent via /api/test-email endpoint</p>"
        ),
        text="GLOBALFLY SMTP test — email delivery is working correctly.",
    )
    if ok:
        return {"status": "ok", "delivered": True, "message": f"Test email delivered to {company_email}"}
    else:
        return {
            "status": "error",
            "delivered": False,
            "message": "SMTP send failed — check backend logs for the exact error (auth failure, wrong password, etc.)",
        }


    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
