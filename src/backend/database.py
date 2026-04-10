from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# ---------------------------------------------------------------------------
# RIGHT NOW: SQLite — a single file on disk, zero setup required.
#
# TO SWITCH TO POSTGRESQL LATER: replace this one line with:
#   DATABASE_URL = "postgresql://user:password@localhost:5432/lift"
#
# That's literally it. SQLAlchemy abstracts the database entirely —
# your models, queries, and relationships stay identical.
# ---------------------------------------------------------------------------
DATABASE_URL = "sqlite:///./lift.db"

engine = create_engine(
    DATABASE_URL,
    # SQLite-specific: allows the same connection across threads (needed for FastAPI)
    connect_args={"check_same_thread": False},
    # Remove connect_args entirely when switching to PostgreSQL
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

class Base(DeclarativeBase):
    pass

# Dependency — FastAPI injects a fresh DB session into each request, then
# closes it automatically when the request finishes.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
