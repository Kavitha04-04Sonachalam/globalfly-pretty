"""
SQLAlchemy ORM models for GlobalFly Consultancy form submissions.
All four submission types are persisted here.

Schema notes:
- email_normalized: LOWER(TRIM(email)) — used for case-insensitive duplicate prevention
- uq_*_email unique constraints: prevent duplicate job applications per category
- ContactEnquiry has no unique constraint (allows future legitimate enquiries)
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, UniqueConstraint

from ..database.database import Base


class NursingApplication(Base):
    """Nursing job enquiry / application form submissions."""
    __tablename__ = "nursing_applications"
    __table_args__ = (
        UniqueConstraint("email_normalized", name="uq_nursing_email"),
    )

    id                  = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name           = Column(String(150), nullable=False)
    email               = Column(String(255), nullable=False)
    email_normalized    = Column(String(255), nullable=False, index=True)
    phone               = Column(String(30),  nullable=False)
    qualification       = Column(String(100), nullable=False)
    current_location    = Column(String(100), nullable=True)
    graduation_year     = Column(String(10),  nullable=True)
    work_experience     = Column(String(50),  nullable=True)
    years_of_experience = Column(String(50),  nullable=True)
    german_level        = Column(String(80),  nullable=True)
    passport_availability = Column(String(50), nullable=True)
    contact_method      = Column(String(50),  nullable=True)
    message             = Column(Text,         nullable=True)
    enquiry             = Column(Text,         nullable=True)
    consent             = Column(Boolean,      default=False)
    resume_filename     = Column(String(255),  nullable=True)
    submitted_at        = Column(DateTime,     default=datetime.utcnow)


class ChefApplication(Base):
    """Chef job enquiry / application form submissions."""
    __tablename__ = "chef_applications"
    __table_args__ = (
        UniqueConstraint("email_normalized", name="uq_chef_email"),
    )

    id                    = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name             = Column(String(150), nullable=False)
    email                 = Column(String(255), nullable=False)
    email_normalized      = Column(String(255), nullable=False, index=True)
    phone                 = Column(String(30),  nullable=False)
    current_location      = Column(String(100), nullable=False)
    current_job_title     = Column(String(100), nullable=False)
    cuisine_specialisation= Column(String(100), nullable=False)
    other_cuisine         = Column(String(100), nullable=True)
    years_of_experience   = Column(String(50),  nullable=False)
    qualification         = Column(String(100), nullable=False)
    german_level          = Column(String(80),  nullable=False)
    english_level         = Column(String(50),  nullable=False)
    preferred_role        = Column(String(100), nullable=True)
    additional_message    = Column(Text,         nullable=True)
    consent               = Column(Boolean,      default=False)
    resume_filename       = Column(String(255),  nullable=True)
    submitted_at          = Column(DateTime,     default=datetime.utcnow)


class EngineeringApplication(Base):
    """Engineering job enquiry / application form submissions."""
    __tablename__ = "engineering_applications"
    __table_args__ = (
        UniqueConstraint("email_normalized", name="uq_engineering_email"),
    )

    id               = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name        = Column(String(150), nullable=False)
    email            = Column(String(255), nullable=False)
    email_normalized = Column(String(255), nullable=False, index=True)
    phone            = Column(String(30),  nullable=False)
    current_location = Column(String(100), nullable=False)
    discipline       = Column(String(100), nullable=False)
    qualification    = Column(String(100), nullable=False)
    experience       = Column(String(50),  nullable=False)
    german_level     = Column(String(80),  nullable=False)
    message          = Column(Text,         nullable=True)
    consent          = Column(Boolean,      default=False)
    resume_filename  = Column(String(255),  nullable=True)
    submitted_at     = Column(DateTime,     default=datetime.utcnow)


class ContactEnquiry(Base):
    """General contact form submissions. No unique constraint — allows future enquiries."""
    __tablename__ = "contact_enquiries"

    id           = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name    = Column(String(150), nullable=False)
    email        = Column(String(255), nullable=False)
    phone        = Column(String(30),  nullable=True)
    subject      = Column(String(200), nullable=True)
    message      = Column(Text,         nullable=False)
    consent      = Column(Boolean,      default=False)
    submitted_at = Column(DateTime,     default=datetime.utcnow)
