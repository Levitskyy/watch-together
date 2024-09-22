from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class User(UserCreate):
    id: int
    disabled: bool
    verified: bool
    role: str
    created_at: datetime
    updated_at: datetime

    class ConfigDict:
        from_attributes = True
