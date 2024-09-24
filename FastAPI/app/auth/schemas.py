from pydantic import BaseModel
from datetime import datetime

class TokenData(BaseModel):
    username: str | None = None
    role: str | None = None

class RefreshTokenBase(BaseModel):
    jti: str
    expiration_date: datetime | None
    username: str

class RefreshTokenWeb(RefreshTokenBase):
    role: str

class RefreshTokenDB(RefreshTokenBase):
    disabled: bool = False