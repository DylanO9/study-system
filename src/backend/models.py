from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    email      = Column(String, unique=True, index=True, nullable=False)
    password   = Column(String, nullable=False)
    goal       = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    templates    = relationship("WorkoutTemplate", back_populates="user", cascade="all, delete-orphan")
    workout_logs = relationship("WorkoutLog",      back_populates="user", cascade="all, delete-orphan")


# ---------------------------------------------------------------------------
# Global exercise library — shared across all users, seeded on startup.
# When we add the searchable picker, users select from here.
# ---------------------------------------------------------------------------
class Exercise(Base):
    __tablename__ = "exercises"

    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String, unique=True, nullable=False, index=True)
    muscle_group = Column(String, nullable=False)   # e.g. "Chest", "Back", "Legs"
    equipment    = Column(String, nullable=True)    # e.g. "Barbell", "Dumbbell", "Cable"
    kind         = Column(String, nullable=True)    # "compound" | "isolation"


# ---------------------------------------------------------------------------
# Workout templates — reusable blueprints owned by a user.
# Separate from workout logs — a template is the *plan*, not the *record*.
# ---------------------------------------------------------------------------
class WorkoutTemplate(Base):
    __tablename__ = "workout_templates"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    name       = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user      = relationship("User", back_populates="templates")
    exercises = relationship("TemplateExercise", back_populates="template",
                             cascade="all, delete-orphan", order_by="TemplateExercise.order")


class TemplateExercise(Base):
    __tablename__ = "template_exercises"

    id          = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("workout_templates.id"), nullable=False)
    # Store the name directly so templates survive exercise library changes
    exercise_name  = Column(String, nullable=False)
    muscle_group   = Column(String, nullable=True)
    order          = Column(Integer, default=0)

    template = relationship("WorkoutTemplate", back_populates="exercises")


# ---------------------------------------------------------------------------
# Workout logs — what actually happened on a given day.
# Optionally linked to a template (could also be ad-hoc).
# ---------------------------------------------------------------------------
class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    template_id = Column(Integer, ForeignKey("workout_templates.id"), nullable=True)
    name        = Column(String, nullable=False)   # snapshot of template name at log time
    date        = Column(Date, nullable=False)
    notes       = Column(String, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="workout_logs")
    sets = relationship("WorkoutSet", back_populates="log",
                        cascade="all, delete-orphan", order_by="WorkoutSet.order")


class WorkoutSet(Base):
    __tablename__ = "workout_sets"

    id            = Column(Integer, primary_key=True, index=True)
    log_id        = Column(Integer, ForeignKey("workout_logs.id"), nullable=False)
    exercise_name = Column(String, nullable=False)
    muscle_group  = Column(String, nullable=True)
    set_number    = Column(Integer, nullable=False)
    weight        = Column(Float,   nullable=True)
    reps          = Column(Integer, nullable=True)
    order         = Column(Integer, default=0)

    log = relationship("WorkoutLog", back_populates="sets")
