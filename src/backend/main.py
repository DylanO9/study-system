from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models  # noqa: F401 — ensures models are registered before create_all
from auth.router import router as auth_router

# Create all tables on startup if they don't exist yet.
# When you switch to PostgreSQL you'd replace this with Alembic migrations,
# which give you proper version-controlled schema changes.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lift API")

# CORS — allows the React dev server (localhost:5175) to talk to this API.
# In production, replace the wildcard with your actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/health")
def health():
    return {"status": "ok"}
