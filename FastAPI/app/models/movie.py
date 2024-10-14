from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.types import String, ARRAY
from sqlalchemy import ForeignKey
from app.models.base import Base


class Anime(Base):
    __tablename__ = 'Animes'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    shikimori_id: Mapped[str | None] = mapped_column(unique=True)
    title: Mapped[str]
    title_en: Mapped[str | None]
    year: Mapped[int | None]
    anime_kind: Mapped[str | None]
    description: Mapped[str | None]
    poster_url: Mapped[str | None]
    anime_genres: Mapped[list[str]] = mapped_column(ARRAY(String))
    shikimori_rating: Mapped[float | None]
    minimal_age: Mapped[int | None]
    anime_studios: Mapped[list[str]] = mapped_column(ARRAY(String))
    shikimori_votes: Mapped[int | None]
    status: Mapped[str | None]
    released_episodes: Mapped[int | None]
    total_episodes: Mapped[int | None]
    other_titles: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    episodes: Mapped[list["AnimeEpisode"]] = relationship(back_populates="anime")

    # Relationships
    ratings = relationship('Rating', back_populates='anime')

class AnimeEpisode(Base):
    __tablename__ = 'AnimeEpisodes'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    season: Mapped[int]
    number: Mapped[int]
    translation_id: Mapped[int]
    translation_title: Mapped[str]
    translation_type: Mapped[str]
    url: Mapped[str | None]
    anime_id: Mapped[int] = mapped_column(ForeignKey("Animes.id"))
    anime: Mapped["Anime"] = relationship(back_populates="episodes")
