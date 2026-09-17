from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    role: str = Field(default="STUDENT", description="Role: STUDENT, COMPANY, or ADMIN")

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        role_upper = v.strip().upper()
        if role_upper not in ["STUDENT", "COMPANY", "ADMIN"]:
            raise ValueError("Role must be one of: STUDENT, COMPANY, ADMIN")
        return role_upper

class UserCreate(UserBase):
    name: str = Field(..., min_length=2, max_length=120, description="Full Name of user or company")
    password: str = Field(..., min_length=6, max_length=128, description="Plaintext password, min 6 characters")
    phone: Optional[str] = Field(None, max_length=20)

    @field_validator("name")
    @classmethod
    def sanitize_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return cleaned

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    email: str
    name: str

class UserOut(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
