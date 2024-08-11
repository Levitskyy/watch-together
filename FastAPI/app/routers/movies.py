from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
import logging

from app.database import get_db
from app.models.movie import Movie, Genre
from app.schemas.movie import Movie as MovieSchema, Genre as GenreSchema, GenreCreate

from anime_parsers_ru import KodikParserAsync


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

parser = KodikParserAsync()

@router.get("/", response_model=list[MovieSchema])
async def get_movies(
    title: Annotated[str | None, Query()] = None,
    genres: Annotated[list[str] | None, Query()] = None,
    min_year: Annotated[int | None, Query()] = None,
    max_year: Annotated[int | None, Query()] = None,
    min_rating: Annotated[float | None, Query()] = None,
    db: Annotated[Session, Depends(get_db)] = None,
) -> list[MovieSchema]:
    query = select(Movie).distinct()

    if title:
        query = query.where(Movie.title.ilike(f"%{title}%"))

    if genres:
        query = query.join(Movie.genres).where(Genre.name_ru.in_(genres))
        logger.info(f"genres: {genres}")

    if min_rating:
        query = query.where(Movie.rating >= min_rating)

    if min_year and max_year:
        query = query.where(Movie.year >= min_year)
        query = query.where(Movie.year <= max_year)

    movies = db.scalars(query).all()
    return movies

@router.get("/genres")
async def get_genres(db: Annotated[Session, Depends(get_db)]) -> list[str]:
    query = select(Genre)
    genres = db.scalars(query).all()

    genre_names = [genre.name_ru for genre in genres]
    
    return genre_names

@router.post("/genres")
async def post_genres(genre: GenreCreate, db: Annotated[Session, Depends(get_db)]) -> GenreSchema:
    db_genre = Genre(
        name_ru=genre.name_ru,
        name_en=genre.name_en
    )
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

@router.get("/{id}")
async def get_movie(id: int, db: Annotated[Session, Depends(get_db)]) -> MovieSchema:
    query = select(Movie)
    query = query.where(Movie.id == id)
    movie = db.scalar(query)

    link = await parser.base_search_by_id("37991", "shikimori")
    for i in link['results']:
        logger.info(f"{i['title']} :: {i['shikimori_id']} :: {i['link']}")

    movie.stream_url = link['results'][0]['link']
    return movie