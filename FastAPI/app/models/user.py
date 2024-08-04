from datetime import datetime, UTC
from typing import Optional
from sqlalchemy import Integer, Float, DateTime, String
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from app.models.base import Base

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(nullable=False, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    # Relationships
    