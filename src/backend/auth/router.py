from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
from auth.schemas import RegisterRequest, LoginRequest, AuthResponse
from auth.utils import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already taken
    if db.query(models.User).filter(models.User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        name     = body.name,
        email    = body.email,
        password = hash_password(body.password),
        goal     = body.goal,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return AuthResponse(
        access_token = create_token(user.id),
        user_id      = user.id,
        name         = user.name,
    )

@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()

    # Deliberately vague error — never tell an attacker whether the email exists
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return AuthResponse(
        access_token = create_token(user.id),
        user_id      = user.id,
        name         = user.name,
    )
