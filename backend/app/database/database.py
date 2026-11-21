"""
Database configuration for GlobalFly Consultancy.
Connects to PostgreSQL via psycopg2 (postgresql+psycopg2 driver).
DATABASE_URL is loaded exclusively from the backend/.env file — never hardcoded.
"""
import os
import logging

from pathlib import Path
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError, SQLAlchemyError

logger = logging.getLogger(__name__)

# Locate .env reliably regardless of working directory.
# find_dotenv() walks up from this file's location to find the nearest .env.
# Absolute fallback ensures it always works even if find_dotenv returns ''.
_env_path = find_dotenv() or str(Path(__file__).resolve().parents[2] / ".env")
load_dotenv(_env_path, override=False)
logger.debug("Loaded .env from: %s", _env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. "
        "Add it to backend/.env — e.g. "
        "postgresql+psycopg2://postgres:password@localhost:5432/globalfly_db"
    )

# Detect driver to set connection-specific arguments
is_sqlite = DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

# PostgreSQL connection pool settings
# (ignored for SQLite; SQLAlchemy applies sensible defaults)
pool_kwargs = {}
if not is_sqlite:
    pool_kwargs = {
        "pool_size": 5,          # Number of persistent connections to keep open
        "max_overflow": 10,      # Extra connections allowed beyond pool_size
        "pool_timeout": 30,      # Seconds to wait for a connection before raising
        "pool_recycle": 1800,    # Recycle connections after 30 min (avoids stale TCP)
        "pool_pre_ping": True,   # Test connection health before using it
    }

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,      # Set to True to print SQL statements for debugging
    **pool_kwargs,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def verify_connection() -> bool:
    """
    Test the database connection by executing a simple query.
    Called at startup to fail-fast if the database is unreachable.
    Returns True on success, raises RuntimeError on failure.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection verified successfully.")
        return True
    except OperationalError as e:
        raise RuntimeError(
            f"Cannot connect to the database. "
            f"Check DATABASE_URL in backend/.env and ensure PostgreSQL is running.\n"
            f"Detail: {e}"
        ) from e
    except SQLAlchemyError as e:
        raise RuntimeError(f"Unexpected database error during connection test: {e}") from e


def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy session per request.
    Always closes the session in the finally block, even on errors.
    """
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        db.rollback()
        logger.error("Database error during request — rolled back: %s", e)
        raise
    finally:
        db.close()
