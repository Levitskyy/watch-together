from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
import logging

from app.database import get_db
from app.models.movie import Movie, Genre
from app.schemas.movie import Movie as MovieSchema, Genre as GenreSchema

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=list[MovieSchema])
async def get_movies(
    title: str | None = Query(None),
    genres: list[str] | None = Query(None),
    min_year: int | None = Query(None),
    max_year: int | None = Query(None),
    min_rating: float | None = Query(None),
    db: Session = Depends(get_db)
) -> list[MovieSchema]:
    query = select(Movie).distinct()

    if title:
        query = query.where(Movie.title.ilike(f"%{title}%"))

    if genres:
        query = query.join(Movie.genres).where(Genre.name.in_(genres))
        logger.info(f"genres: {genres}")

    if min_rating:
        query = query.where(Movie.rating >= min_rating)

    if min_year and max_year:
        query = query.where(Movie.year >= min_year)
        query = query.where(Movie.year <= max_year)

    movies = db.scalars(query).all()
    return movies

@router.get("/genres")
async def get_genres(db: Session = Depends(get_db)) -> list[str]:
    query = select(Genre)
    genres = db.scalars(query).all()

    genre_names = [genre.name for genre in genres]
    
    return genre_names

@router.get("/{id}")
async def get_movie(id: int, db: Session = Depends(get_db)) -> MovieSchema:
    query = select(Movie)
    query = query.where(Movie.id == id)
    movie = db.scalar(query)

    return movie