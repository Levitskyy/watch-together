from datetime import datetime, UTC
from sqlalchemy import ForeignKey, String, func, UniqueConstraint
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base


class Category(Base):
    __tablename__ = 'Categories'

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(63), unique=True)

    # relationship
    userAnimeCategory: Mapped["UserAnimeCategory"] = relationship(back_populates='category')


class UserAnimeCategory(Base):
    __tablename__ = 'UserAnimeCategories'

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('Users.id'))
    anime_id: Mapped[int] = mapped_column(ForeignKey('Animes.id'))
    category_id: Mapped[int | None] = mapped_column(ForeignKey('Categories.id'))
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), server_onupdate=func.now())

    __table_args__ = (UniqueConstraint('user_id', 'anime_id', name='unique_user_anime_category'),)

    # relationship
    category: Mapped["Category"] = relationship(back_populates='userAnimeCategory')