from datetime import datetime, UTC
from sqlalchemy import String, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base
from app.models.rating import Rating
from app.models.category import UserAnimeCategory


class User(Base):
    __tablename__ = 'Users'

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[str] = mapped_column(nullable=False, default='user')
    verified: Mapped[bool] = mapped_column(nullable=False, default=False)
    disabled: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), server_onupdate=func.now())

    # Relationships
    ratings: Mapped[list["Rating"]] = relationship(back_populates='user')
    userAnimeCategories: Mapped[list["UserAnimeCategory"]] = relationship(back_populates='user')
