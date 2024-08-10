from sqlalchemy import Column, ForeignKey, Integer, Table
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base

movie_genre_association = Table(
    'movie_genre_association', Base.metadata,
    Column('movie_id', Integer, ForeignKey('movies.id')),
    Column('genre_id', Integer, ForeignKey('genres.id'))
)


class Genre(Base):
    __tablename__ = 'genres'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name_en: Mapped[str] = mapped_column(nullable=False, unique=True)
    name_ru: Mapped[str] = mapped_column(nullable=False, unique=True)

    movies = relationship('Movie', secondary=movie_genre_association, back_populates='genres')


class Movie(Base):
    __tablename__ = 'movies'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(nullable=False)
    image_url: Mapped[str]
    stream_url: Mapped[str | None]
    rating: Mapped[float]
    description: Mapped[str]
    year: Mapped[int]

    genres = relationship('Genre', secondary=movie_genre_association, back_populates='movies')
