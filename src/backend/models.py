from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

# This class maps directly to a "users" table in whatever database you're using.
# SQLAlchemy handles writing the CREATE TABLE SQL — you never write it yourself.
# When you switch from SQLite to PostgreSQL, this model doesn't change at all.
class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    email      = Column(String, unique=True, index=True, nullable=False)
    password   = Column(String, nullable=False)   # stored as bcrypt hash, never plaintext
    goal       = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
