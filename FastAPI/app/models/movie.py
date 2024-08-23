from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy.types import String, ARRAY
from app.models.base import Base


class Anime(Base):
    __tablename__ = 'Animes'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    kodik_id: Mapped[str | None] = mapped_column(unique=True)
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
