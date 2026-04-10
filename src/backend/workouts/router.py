from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth.utils import get_current_user
import models
from workouts.schemas import (
    ExerciseOut,
    TemplateIn, TemplateOut,
    WorkoutLogIn, WorkoutLogOut,
)

router = APIRouter(tags=["workouts"])


# ── Exercise library ──────────────────────────────────────────────────────────
@router.get("/exercises", response_model=list[ExerciseOut])
def list_exercises(db: Session = Depends(get_db)):
    return db.query(models.Exercise).order_by(models.Exercise.muscle_group, models.Exercise.name).all()


# ── Templates ─────────────────────────────────────────────────────────────────
@router.get("/templates", response_model=list[TemplateOut])
def list_templates(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.WorkoutTemplate)
        .filter(models.WorkoutTemplate.user_id == current_user.id)
        .order_by(models.WorkoutTemplate.created_at)
        .all()
    )


@router.post("/templates", response_model=TemplateOut, status_code=201)
def create_template(
    body: TemplateIn,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tmpl = models.WorkoutTemplate(user_id=current_user.id, name=body.name)
    db.add(tmpl)
    db.flush()
    for ex in body.exercises:
        db.add(models.TemplateExercise(template_id=tmpl.id, **ex.model_dump()))
    db.commit()
    db.refresh(tmpl)
    return tmpl


@router.put("/templates/{template_id}", response_model=TemplateOut)
def update_template(
    template_id: int,
    body: TemplateIn,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tmpl = db.query(models.WorkoutTemplate).filter(
        models.WorkoutTemplate.id == template_id,
        models.WorkoutTemplate.user_id == current_user.id,
    ).first()
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found")

    tmpl.name = body.name
    # Replace exercises entirely
    for ex in tmpl.exercises:
        db.delete(ex)
    db.flush()
    for ex in body.exercises:
        db.add(models.TemplateExercise(template_id=tmpl.id, **ex.model_dump()))
    db.commit()
    db.refresh(tmpl)
    return tmpl


@router.delete("/templates/{template_id}", status_code=204)
def delete_template(
    template_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tmpl = db.query(models.WorkoutTemplate).filter(
        models.WorkoutTemplate.id == template_id,
        models.WorkoutTemplate.user_id == current_user.id,
    ).first()
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found")
    db.delete(tmpl)
    db.commit()


# ── Workout logs ──────────────────────────────────────────────────────────────
@router.get("/workouts", response_model=list[WorkoutLogOut])
def list_workouts(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.WorkoutLog)
        .filter(models.WorkoutLog.user_id == current_user.id)
        .order_by(models.WorkoutLog.date.desc())
        .all()
    )


@router.post("/workouts", response_model=WorkoutLogOut, status_code=201)
def save_workout(
    body: WorkoutLogIn,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = models.WorkoutLog(
        user_id=current_user.id,
        name=body.name,
        date=body.date,
        template_id=body.template_id,
        notes=body.notes,
    )
    db.add(log)
    db.flush()
    for s in body.sets:
        db.add(models.WorkoutSet(log_id=log.id, **s.model_dump()))
    db.commit()
    db.refresh(log)
    return log


@router.get("/workouts/{log_id}", response_model=WorkoutLogOut)
def get_workout(
    log_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = db.query(models.WorkoutLog).filter(
        models.WorkoutLog.id == log_id,
        models.WorkoutLog.user_id == current_user.id,
    ).first()
    if not log:
        raise HTTPException(status_code=404, detail="Workout not found")
    return log
