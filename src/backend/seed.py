"""
Run once on startup to populate the global exercise library and
seed default templates for a given user.
"""
from sqlalchemy.orm import Session
import models

EXERCISES = [
    # Chest
    ("Bench Press",          "Chest",     "Barbell",   "compound"),
    ("Incline Bench Press",  "Chest",     "Barbell",   "compound"),
    ("Decline Bench Press",  "Chest",     "Barbell",   "compound"),
    ("Incline DB Press",     "Chest",     "Dumbbell",  "compound"),
    ("DB Fly",               "Chest",     "Dumbbell",  "isolation"),
    ("Cable Fly",            "Chest",     "Cable",     "isolation"),
    ("Chest Dip",            "Chest",     "Bodyweight","compound"),
    ("Push-Up",              "Chest",     "Bodyweight","compound"),

    # Shoulders
    ("Overhead Press",       "Shoulders", "Barbell",   "compound"),
    ("DB Shoulder Press",    "Shoulders", "Dumbbell",  "compound"),
    ("Lateral Raises",       "Shoulders", "Dumbbell",  "isolation"),
    ("Front Raises",         "Shoulders", "Dumbbell",  "isolation"),
    ("Face Pulls",           "Shoulders", "Cable",     "isolation"),
    ("Rear Delt Fly",        "Shoulders", "Dumbbell",  "isolation"),
    ("Arnold Press",         "Shoulders", "Dumbbell",  "compound"),

    # Triceps
    ("Tricep Pushdown",      "Triceps",   "Cable",     "isolation"),
    ("Skull Crushers",       "Triceps",   "Barbell",   "isolation"),
    ("Overhead Tricep Ext.", "Triceps",   "Dumbbell",  "isolation"),
    ("Close-Grip Bench",     "Triceps",   "Barbell",   "compound"),
    ("Tricep Dip",           "Triceps",   "Bodyweight","compound"),

    # Back
    ("Deadlift",             "Back",      "Barbell",   "compound"),
    ("Barbell Row",          "Back",      "Barbell",   "compound"),
    ("Pull-Up",              "Back",      "Bodyweight","compound"),
    ("Chin-Up",              "Back",      "Bodyweight","compound"),
    ("Lat Pulldown",         "Back",      "Cable",     "compound"),
    ("Seated Cable Row",     "Back",      "Cable",     "compound"),
    ("DB Row",               "Back",      "Dumbbell",  "compound"),
    ("T-Bar Row",            "Back",      "Barbell",   "compound"),
    ("Straight-Arm Pulldown","Back",      "Cable",     "isolation"),

    # Biceps
    ("Barbell Curl",         "Biceps",    "Barbell",   "isolation"),
    ("DB Curl",              "Biceps",    "Dumbbell",  "isolation"),
    ("Hammer Curl",          "Biceps",    "Dumbbell",  "isolation"),
    ("Incline DB Curl",      "Biceps",    "Dumbbell",  "isolation"),
    ("Cable Curl",           "Biceps",    "Cable",     "isolation"),
    ("Preacher Curl",        "Biceps",    "Barbell",   "isolation"),
    ("Concentration Curl",   "Biceps",    "Dumbbell",  "isolation"),

    # Legs
    ("Squat",                "Legs",      "Barbell",   "compound"),
    ("Front Squat",          "Legs",      "Barbell",   "compound"),
    ("Romanian Deadlift",    "Legs",      "Barbell",   "compound"),
    ("Leg Press",            "Legs",      "Machine",   "compound"),
    ("Hack Squat",           "Legs",      "Machine",   "compound"),
    ("Walking Lunges",       "Legs",      "Dumbbell",  "compound"),
    ("Bulgarian Split Squat","Legs",      "Dumbbell",  "compound"),
    ("Leg Extension",        "Legs",      "Machine",   "isolation"),
    ("Leg Curl",             "Legs",      "Machine",   "isolation"),
    ("Calf Raise",           "Legs",      "Machine",   "isolation"),
    ("Seated Calf Raise",    "Legs",      "Machine",   "isolation"),
    ("Hip Thrust",           "Legs",      "Barbell",   "compound"),

    # Core
    ("Plank",                "Core",      "Bodyweight","isolation"),
    ("Ab Rollout",           "Core",      "Bodyweight","isolation"),
    ("Hanging Leg Raise",    "Core",      "Bodyweight","isolation"),
    ("Cable Crunch",         "Core",      "Cable",     "isolation"),
    ("Sit-Up",               "Core",      "Bodyweight","isolation"),
    ("Russian Twist",        "Core",      "Bodyweight","isolation"),
]

DEFAULT_TEMPLATES = {
    "Push Day": [
        ("Bench Press",         "Chest"),
        ("Overhead Press",      "Shoulders"),
        ("Incline DB Press",    "Chest"),
        ("Lateral Raises",      "Shoulders"),
        ("Tricep Pushdown",     "Triceps"),
    ],
    "Pull Day": [
        ("Deadlift",            "Back"),
        ("Pull-Up",             "Back"),
        ("Barbell Row",         "Back"),
        ("Face Pulls",          "Shoulders"),
        ("Hammer Curl",         "Biceps"),
    ],
    "Leg Day": [
        ("Squat",               "Legs"),
        ("Romanian Deadlift",   "Legs"),
        ("Leg Press",           "Legs"),
        ("Walking Lunges",      "Legs"),
        ("Calf Raise",          "Legs"),
    ],
}


def seed_exercises(db: Session):
    """Populate the global exercise library if empty."""
    if db.query(models.Exercise).first():
        return  # already seeded
    for name, muscle, equipment, kind in EXERCISES:
        db.add(models.Exercise(name=name, muscle_group=muscle, equipment=equipment, kind=kind))
    db.commit()


def seed_user_templates(db: Session, user_id: int):
    """Give a new user the default starter templates."""
    for template_name, exercises in DEFAULT_TEMPLATES.items():
        tmpl = models.WorkoutTemplate(user_id=user_id, name=template_name)
        db.add(tmpl)
        db.flush()  # get tmpl.id before committing
        for order, (ex_name, muscle) in enumerate(exercises):
            db.add(models.TemplateExercise(
                template_id=tmpl.id,
                exercise_name=ex_name,
                muscle_group=muscle,
                order=order,
            ))
    db.commit()
