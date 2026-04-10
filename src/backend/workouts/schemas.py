from pydantic import BaseModel
from datetime import date, datetime


# ── Exercises ────────────────────────────────────────────────────────────────
class ExerciseOut(BaseModel):
    id:           int
    name:         str
    muscle_group: str
    equipment:    str | None
    kind:         str | None

    model_config = {"from_attributes": True}


# ── Templates ─────────────────────────────────────────────────────────────────
class TemplateExerciseIn(BaseModel):
    exercise_name: str
    muscle_group:  str | None = None
    order:         int = 0

class TemplateExerciseOut(TemplateExerciseIn):
    id: int
    model_config = {"from_attributes": True}

class TemplateIn(BaseModel):
    name:      str
    exercises: list[TemplateExerciseIn] = []

class TemplateOut(BaseModel):
    id:         int
    name:       str
    created_at: datetime
    exercises:  list[TemplateExerciseOut]
    model_config = {"from_attributes": True}


# ── Workout logs ──────────────────────────────────────────────────────────────
class SetIn(BaseModel):
    exercise_name: str
    muscle_group:  str | None = None
    set_number:    int
    weight:        float | None = None
    reps:          int   | None = None
    order:         int = 0

class SetOut(SetIn):
    id: int
    model_config = {"from_attributes": True}

class WorkoutLogIn(BaseModel):
    name:        str
    date:        date
    template_id: int | None = None
    notes:       str | None = None
    sets:        list[SetIn] = []

class WorkoutLogOut(BaseModel):
    id:          int
    name:        str
    date:        date
    template_id: int | None
    notes:       str | None
    created_at:  datetime
    sets:        list[SetOut]
    model_config = {"from_attributes": True}
