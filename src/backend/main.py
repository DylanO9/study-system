from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
import models  # noqa: F401
from auth.router import router as auth_router
from workouts.router import router as workouts_router
from seed import seed_exercises

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lift API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_exercises(db)
    finally:
        db.close()

app.include_router(auth_router)
app.include_router(workouts_router)

@app.get("/health")
def health():
    return {"status": "ok"}
