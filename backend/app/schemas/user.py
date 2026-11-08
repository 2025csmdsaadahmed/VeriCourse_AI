from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime

#Data accepted during registration

class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

#Data returned to the frontend

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

model_config = ConfigDict(from_attributes=True)

# Data accepted during login

class UserLogin(BaseModel):
    email: EmailStr
    password: str