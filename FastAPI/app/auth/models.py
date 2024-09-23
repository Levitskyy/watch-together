from app.models.base import Base
from datetime import datetime, UTC
from sqlalchemy import String, func
from sqlalchemy.orm import mapped_column, Mapped

class RefreshToken(Base):
    __tablename__ = 'RefreshTokens'

    jti: Mapped[str] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(64), index=True)
    expiration_date: Mapped[datetime] = mapped_column(server_default=func.now())
    disabled: Mapped[bool] = mapped_column(default=False)