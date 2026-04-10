from pydantic import BaseModel, EmailStr

# Pydantic schemas define the shape of request/response bodies.
# FastAPI validates incoming JSON against these automatically —
# if a field is missing or the wrong type, it returns a 422 before
# your code runs.

class RegisterRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    goal:     str | None = None

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user_id:      int
    name:         str
