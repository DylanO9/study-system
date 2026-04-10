from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
import models

# ---------------------------------------------------------------------------
# Passwords
# ---------------------------------------------------------------------------
# bcrypt is a slow-by-design hashing algorithm. "Slow" is intentional —
# it makes brute-force attacks impractical. bcrypt generates a unique salt
# automatically, so every hash is different even for the same password.
def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


# ---------------------------------------------------------------------------
# JWT (JSON Web Tokens)
# ---------------------------------------------------------------------------
# How it works:
#   1. User logs in with email + password
#   2. We verify the password, then sign a token with our SECRET_KEY
#   3. The token is returned to the frontend and stored in localStorage
#   4. Every subsequent request sends that token in the Authorization header
#   5. We verify the signature — if valid, we know who the user is without
#      hitting the database on every request
#
# The token has 3 parts (separated by dots): header.payload.signature
# The payload contains the user's id ("sub") and expiry time — it is NOT
# encrypted, just signed. Never put sensitive data in a JWT payload.
#
# SECRET_KEY signs the token. Anyone with this key can forge tokens, so
# in production it must be a long random string stored in an env variable.
SECRET_KEY  = "change-this-to-a-long-random-secret-in-production"
ALGORITHM   = "HS256"
EXPIRE_MINS = 60 * 24 * 7  # 7 days

def create_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


# ---------------------------------------------------------------------------
# Auth dependency — use this on any protected route
# ---------------------------------------------------------------------------
# FastAPI's dependency injection means you just add `current_user: User = Depends(get_current_user)`
# to a route function and FastAPI automatically runs this function first,
# passing the result in. If the token is missing or invalid, it returns 401
# before your route logic even runs.
bearer = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> models.User:
    user_id = decode_token(credentials.credentials)
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
