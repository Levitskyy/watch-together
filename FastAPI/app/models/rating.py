from datetime import datetime, UTC
from sqlalchemy import ForeignKey, String, func, UniqueConstraint
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base


class Rating(Base):
    __tablename__ = 'Ratings'

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('Users.id'), index=True)
    anime_id: Mapped[int] = mapped_column(ForeignKey('Animes.id'), index=True)
    rating: Mapped[int] = mapped_column(nullable=False)
    
    # Relationships
    user = relationship('User', back_populates='ratings')
    anime = relationship('Anime', back_populates='ratings')

    __table_args__ = (UniqueConstraint('user_id', 'anime_id', name='unique_user_anime'),)