from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.database import get_db


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# @router.get("/", response_model=list[MovieSchema])
# async def get_movies(
#     title: Annotated[str | None, Query()] = None,
#     genres: Annotated[list[str] | None, Query()] = None,
#     min_year: Annotated[int | None, Query()] = None,
#     max_year: Annotated[int | None, Query()] = None,
#     min_rating: Annotated[float | None, Query()] = None,
#     db: Annotated[AsyncSession, Depends(get_db)] = None,
# ) -> list[MovieSchema]:
#     query = select(Movie).distinct()

#     if title:
#         query = query.where(Movie.title.ilike(f"%{title}%"))

#     if genres:
#         query = query.join(Movie.genres).where(Genre.name_ru.in_(genres))
#         logger.info(f"genres: {genres}")

#     if min_rating:
#         query = query.where(Movie.rating >= min_rating)

#     if min_year and max_year:
#         query = query.where(Movie.year >= min_year)
#         query = query.where(Movie.year <= max_year)

#     movies = await db.execute(query)
#     movies = movies.scalars().all()
#     return movies

# @router.get("/{id}")
# async def get_movie(id: int, db: Annotated[AsyncSession, Depends(get_db)]) -> MovieSchema:
#     query = select(Movie)
#     query = query.where(Movie.id == id)
#     movie = await db.execute(query)
#     movie = movie.scalar()
#     return movie