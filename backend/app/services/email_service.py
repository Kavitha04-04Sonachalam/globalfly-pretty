"""
GlobalFly Email Service
=======================
Uses Python's built-in smtplib — no extra packages needed.

Design principles:
- Email delivery NEVER prevents a saved application from succeeding.
  All send calls are wrapped so failures are logged, not raised.
- SMTP credentials are read from environment variables only.
  Nothing is hard-coded.
- If SMTP_PASSWORD is empty the service logs a warning and skips sending.
- Resume files are NOT attached to emails for privacy / size reasons;
  the notification email notes that a resume was uploaded.
"""

import logging
import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

logger = logging.getLogger("globalfly.email")

# ── SMTP config from environment ───────────────────────────────────────────────
SMTP_HOST    = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT    = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER    = os.getenv("SMTP_USER", "")
SMTP_PASSWORD= os.getenv("SMTP_PASSWORD", "")
COMPANY_EMAIL= os.getenv("COMPANY_EMAIL", "")
SEND_CONFIRM = os.getenv("SEND_APPLICANT_CONFIRMATION", "true").lower() == "true"


def _is_configured() -> bool:
    """Return True only when all required env vars are present."""
    if not SMTP_USER or not SMTP_PASSWORD or not COMPANY_EMAIL:
        logger.warning(
            "Email not configured — set SMTP_USER, SMTP_PASSWORD, COMPANY_EMAIL in .env"
        )
        return False
    return True


def _send(to: str, subject: str, html: str, text: str) -> bool:
    """
    Low-level send via SMTP STARTTLS.
    Returns True on success, False on any failure (never raises).
    """
    if not _is_configured():
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"GLOBALFLY Consultancy <{SMTP_USER}>"
    msg["To"]      = to
    msg["Reply-To"]= COMPANY_EMAIL

    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html,  "html"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            server.ehlo()
            server.starttls(context=context)
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, [to], msg.as_string())
        logger.info("Email sent  to=%s  subject=%r", to, subject)
        return True
    except smtplib.SMTPAuthenticationError:
        logger.error(
            "SMTP auth failed — check SMTP_USER / SMTP_PASSWORD in .env "
            "(Gmail users: use an App Password, not your account password)"
        )
    except smtplib.SMTPException as exc:
        logger.error("SMTP error sending to %s: %s", to, exc)
    except Exception as exc:
        logger.error("Unexpected email error to %s: %s", to, exc)
    return False


# ── HTML helpers ───────────────────────────────────────────────────────────────

def _html_table(rows: list[tuple[str, str]]) -> str:
    cells = "".join(
        f"<tr><td style='padding:6px 12px;font-weight:600;color:#475569;"
        f"white-space:nowrap;vertical-align:top'>{k}</td>"
        f"<td style='padding:6px 12px;color:#0F172A'>{v or '—'}</td></tr>"
        for k, v in rows
    )
    return (
        f"<table style='border-collapse:collapse;width:100%;font-family:sans-serif;"
        f"font-size:14px;border:1px solid #E2E8F0;border-radius:8px;overflow:hidden'>"
        f"<tbody>{cells}</tbody></table>"
    )


def _base_html(title: str, badge_color: str, body: str) -> str:
    return f"""
<!DOCTYPE html><html><body style='margin:0;padding:0;background:#F8FAFC;font-family:sans-serif'>
<div style='max-width:620px;margin:32px auto;background:#fff;border-radius:12px;
            box-shadow:0 2px 8px rgba(0,0,0,.08);overflow:hidden'>
  <div style='background:{badge_color};padding:24px 32px'>
    <h1 style='margin:0;color:#fff;font-size:20px'>🌐 GLOBALFLY Consultancy</h1>
    <p  style='margin:4px 0 0;color:rgba(255,255,255,.85);font-size:13px'>{title}</p>
  </div>
  <div style='padding:28px 32px'>{body}</div>
  <div style='padding:16px 32px;background:#F1F5F9;font-size:11px;color:#94A3B8;text-align:center'>
    GLOBALFLY Consultancy Pvt Ltd · Confidential · {datetime.utcnow().strftime('%d %b %Y')}
  </div>
</div></body></html>"""


# ── Public API ─────────────────────────────────────────────────────────────────

def notify_nursing(data: dict) -> None:
    """Send company notification for a nursing application."""
    has_resume = bool(data.get("resume_filename"))
    rows = [
        ("Full Name",    data.get("full_name")),
        ("Email",        data.get("email")),
        ("Phone",        data.get("phone")),
        ("Location",     data.get("current_location")),
        ("Qualification",data.get("qualification")),
        ("Experience",   data.get("work_experience") or data.get("years_of_experience")),
        ("German Level", data.get("german_level")),
        ("Passport",     data.get("passport_availability")),
        ("Message",      data.get("message") or data.get("enquiry")),
        ("Resume",       "✅ Uploaded" if has_resume else "Not uploaded"),
    ]
    html = _base_html(
        "New Nursing Application", "#0EA5E9",
        f"<h2 style='color:#0F172A;margin-top:0'>New Nursing Enquiry Received</h2>"
        f"{_html_table(rows)}"
        f"<p style='margin-top:20px;font-size:12px;color:#64748B'>"
        f"Application ID: #{data.get('id')} · Submitted: {datetime.utcnow().strftime('%d %b %Y %H:%M')} UTC</p>"
    )
    text = (
        f"GLOBALFLY — New Nursing Application\n"
        f"Name: {data.get('full_name')}\nEmail: {data.get('email')}\n"
        f"Phone: {data.get('phone')}\nQualification: {data.get('qualification')}\n"
        f"German: {data.get('german_level')}\nResume: {'Yes' if has_resume else 'No'}"
    )
    _send(COMPANY_EMAIL, f"[GLOBALFLY] New Nursing Application — {data.get('full_name')}", html, text)

    if SEND_CONFIRM and data.get("email"):
        _send_applicant_confirmation(
            data["email"], data.get("full_name", "Applicant"),
            "Nursing", "Germany Healthcare Recruitment", "#0EA5E9"
        )


def notify_chef(data: dict) -> None:
    """Send company notification for a chef application."""
    has_resume = bool(data.get("resume_filename"))
    rows = [
        ("Full Name",    data.get("full_name")),
        ("Email",        data.get("email")),
        ("Phone",        data.get("phone")),
        ("Location",     data.get("current_location")),
        ("Current Role", data.get("current_job_title")),
        ("Cuisine",      data.get("cuisine_specialisation")),
        ("Experience",   data.get("years_of_experience")),
        ("Qualification",data.get("qualification")),
        ("German Level", data.get("german_level")),
        ("English Level",data.get("english_level")),
        ("Preferred Role",data.get("preferred_role")),
        ("Message",      data.get("additional_message")),
        ("Resume",       "✅ Uploaded" if has_resume else "Not uploaded"),
    ]
    html = _base_html(
        "New Chef Application", "#F59E0B",
        f"<h2 style='color:#0F172A;margin-top:0'>New Chef Enquiry Received</h2>"
        f"{_html_table(rows)}"
        f"<p style='margin-top:20px;font-size:12px;color:#64748B'>"
        f"Application ID: #{data.get('id')} · {datetime.utcnow().strftime('%d %b %Y %H:%M')} UTC</p>"
    )
    text = (
        f"GLOBALFLY — New Chef Application\n"
        f"Name: {data.get('full_name')}\nEmail: {data.get('email')}\n"
        f"Cuisine: {data.get('cuisine_specialisation')}\nExperience: {data.get('years_of_experience')}"
    )
    _send(COMPANY_EMAIL, f"[GLOBALFLY] New Chef Application — {data.get('full_name')}", html, text)

    if SEND_CONFIRM and data.get("email"):
        _send_applicant_confirmation(
            data["email"], data.get("full_name", "Applicant"),
            "Chef / Culinary", "Germany Culinary Recruitment", "#F59E0B"
        )


def notify_engineering(data: dict) -> None:
    """Send company notification for an engineering application."""
    has_resume = bool(data.get("resume_filename"))
    rows = [
        ("Full Name",    data.get("full_name")),
        ("Email",        data.get("email")),
        ("Phone",        data.get("phone")),
        ("Location",     data.get("current_location")),
        ("Discipline",   data.get("discipline")),
        ("Qualification",data.get("qualification")),
        ("Experience",   data.get("experience")),
        ("German Level", data.get("german_level")),
        ("Message",      data.get("message")),
        ("Resume",       "✅ Uploaded" if has_resume else "Not uploaded"),
    ]
    html = _base_html(
        "New Engineering Application", "#6366F1",
        f"<h2 style='color:#0F172A;margin-top:0'>New Engineering Enquiry Received</h2>"
        f"{_html_table(rows)}"
        f"<p style='margin-top:20px;font-size:12px;color:#64748B'>"
        f"Application ID: #{data.get('id')} · {datetime.utcnow().strftime('%d %b %Y %H:%M')} UTC</p>"
    )
    text = (
        f"GLOBALFLY — New Engineering Application\n"
        f"Name: {data.get('full_name')}\nEmail: {data.get('email')}\n"
        f"Discipline: {data.get('discipline')}\nExperience: {data.get('experience')}"
    )
    _send(COMPANY_EMAIL, f"[GLOBALFLY] New Engineering Application — {data.get('full_name')}", html, text)

    if SEND_CONFIRM and data.get("email"):
        _send_applicant_confirmation(
            data["email"], data.get("full_name", "Applicant"),
            "Engineering", "Germany Engineering Recruitment", "#6366F1"
        )


def notify_contact(data: dict) -> None:
    """Send company notification for a general contact enquiry."""
    rows = [
        ("Full Name", data.get("full_name")),
        ("Email",     data.get("email")),
        ("Phone",     data.get("phone")),
        ("Subject",   data.get("subject")),
        ("Message",   data.get("message")),
    ]
    html = _base_html(
        "New Contact Enquiry", "#10B981",
        f"<h2 style='color:#0F172A;margin-top:0'>New Contact Form Submission</h2>"
        f"{_html_table(rows)}"
        f"<p style='margin-top:20px;font-size:12px;color:#64748B'>"
        f"Enquiry ID: #{data.get('id')} · {datetime.utcnow().strftime('%d %b %Y %H:%M')} UTC</p>"
    )
    text = (
        f"GLOBALFLY — New Contact Enquiry\n"
        f"Name: {data.get('full_name')}\nEmail: {data.get('email')}\n"
        f"Subject: {data.get('subject')}\nMessage: {data.get('message')}"
    )
    _send(COMPANY_EMAIL, f"[GLOBALFLY] New Contact Enquiry — {data.get('subject')}", html, text)

    if SEND_CONFIRM and data.get("email"):
        _send_applicant_confirmation(
            data["email"], data.get("full_name", ""),
            "Contact", "General Enquiry", "#10B981"
        )


def _send_applicant_confirmation(
    to_email: str, name: str, form_type: str, team_label: str, color: str
) -> None:
    """Send a polite confirmation email to the applicant."""
    subject = f"GLOBALFLY — We've received your {form_type} enquiry"
    html = _base_html(
        f"Your {form_type} Enquiry Confirmation", color,
        f"""
        <h2 style='color:#0F172A;margin-top:0'>Dear {name},</h2>
        <p style='color:#475569;line-height:1.7'>
          Thank you for reaching out to <strong>GLOBALFLY Consultancy Pvt Ltd</strong>.<br>
          We have successfully received your <strong>{form_type}</strong> enquiry and our
          <strong>{team_label}</strong> team will review your details shortly.
        </p>
        <p style='color:#475569;line-height:1.7'>
          We typically respond within <strong>2–3 business days</strong>. If you have any
          urgent questions, please reply to this email directly.
        </p>
        <p style='color:#475569;line-height:1.7'>
          Warm regards,<br>
          <strong>GLOBALFLY Consultancy Team</strong><br>
          <em style='color:#94A3B8'>Germany Overseas Recruitment &amp; Visa Advisory</em>
        </p>
        """
    )
    text = (
        f"Dear {name},\n\n"
        f"Thank you for your {form_type} enquiry with GLOBALFLY Consultancy Pvt Ltd.\n"
        f"Our {team_label} team will review your details and contact you within 2-3 business days.\n\n"
        f"Warm regards,\nGLOBALFLY Consultancy Team"
    )
    _send(to_email, subject, html, text)


# ── Test-email utility (call via: python -m app.services.email_service) ────────

if __name__ == "__main__":
    import sys
    from pathlib import Path
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parents[3] / ".env")

    # Re-read after dotenv load
    import importlib, app.services.email_service as _self
    importlib.reload(_self)

    logging.basicConfig(level=logging.DEBUG)

    test_to = sys.argv[1] if len(sys.argv) > 1 else COMPANY_EMAIL
    print(f"Sending test email to: {test_to}")

    ok = _self._send(
        to=test_to,
        subject="[GLOBALFLY] Test Email — SMTP Verified",
        html=_self._base_html(
            "SMTP Test", "#2563EB",
            "<h2>SMTP is working correctly!</h2>"
            "<p>If you received this, email delivery is fully configured.</p>"
        ),
        text="GLOBALFLY SMTP test — email delivery is working correctly.",
    )
    print("Result:", "✅ Delivered" if ok else "❌ Failed — check logs above")
