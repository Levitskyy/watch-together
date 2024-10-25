from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_, delete, func, or_, select, outerjoin
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.config import get_settings
from app.models.movie import Anime, AnimeEpisode
from app.models.user import User
from app.models.category import UserAnimeCategory
from app.models.rating import Rating
from app.schemas.movie import AnimeBase, MarkedAnime
from app.auth.utils import get_current_active_user
import requests
import logging
from fastapi_cache.decorator import cache
from app.utils import search
import asyncio
import aiohttp

logging.basicConfig(filename='backend.log',
                    filemode='a',
                    format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                    datefmt='%H:%M:%S',
                    level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()


@router.get('/search')
async def search_anime_by_title(title: str, 
                                limit: int = 10, 
                                skip: int = 0, 
                                order_by: Annotated[str, Query()] = 'rating',
                                asc: Annotated[bool, Query()] = False,
                                db: Annotated[AsyncSession, Depends(get_db)] = None) -> list[AnimeBase]:
    query = select(Anime)
    query = query.where(or_(Anime.title.ilike(f"%{title}%"), Anime.title_en.ilike(f"%{title}%")))
    
    if order_by == 'rating':
        query = query.order_by(Anime.shikimori_rating.asc() if asc else Anime.shikimori_rating.desc(), Anime.id.asc())
    elif order_by == 'year':
        query = query.order_by(Anime.year.asc() if asc else Anime.year.desc(), Anime.id.asc())
    elif order_by == 'title':
        query = query.order_by(Anime.title.asc() if asc else Anime.title.desc(), Anime.id.asc())
    
    query = query.limit(limit).offset(skip)
    animes = await db.execute(query)
    animes = animes.scalars().all()
    return animes

@router.get('/filter')
async def filter_anime(
    limit: int = 10, 
    skip: int = 0, 
    title: Annotated[str | None, Query()] = None,
    genres: Annotated[list[str] | None, Query()] = None,
    min_year: Annotated[int | None, Query()] = None,
    max_year: Annotated[int | None, Query()] = None,
    min_rating: Annotated[float | None, Query()] = None,
    anime_kind: Annotated[list[str] | None, Query()] = None,
    minimal_age: Annotated[int | None, Query()] = None,
    anime_studios: Annotated[list[str] | None, Query()] = None,
    genres_and: Annotated[bool, Query()] = False,
    order_by: Annotated[str, Query()] = 'rating',
    asc: Annotated[bool, Query()] = False,
    db: Annotated[AsyncSession, Depends(get_db)] = None,

) -> list[AnimeBase]:
    query = select(Anime)

    title_queries = search.create_search_queries(title)
    # Фильтрация по названию
    if title_queries:
        ru_q = [Anime.title.ilike(f"%{q_title}%") for q_title in title_queries]
        en_q = [Anime.title_en.ilike(f"%{q_title}%") for q_title in title_queries]
        query = query.where(or_(*ru_q, *en_q))
    
    # Фильтрация по жанрам
    if genres:
        if genres_and:
            query = query.where(and_(*[Anime.anime_genres.any(genre) for genre in genres]))
        else:
            query = query.where(or_(*[Anime.anime_genres.any(genre) for genre in genres]))

    # Фильтрация по году
    if min_year is not None:
        query = query.where(Anime.year >= min_year)
    if max_year is not None:
        query = query.where(Anime.year <= max_year)

    # Фильтрация по рейтингу
    if min_rating is not None:
        query = query.where(Anime.shikimori_rating >= min_rating)

    # Фильтрация по типу аниме
    if anime_kind:
        query = query.where(Anime.anime_kind.in_(anime_kind))

    # Фильтрация по минимальному возрасту
    if minimal_age is not None:
        query = query.where(Anime.minimal_age >= minimal_age)

    # Фильтрация по студиям
    if anime_studios:
        query = query.where(or_(*[Anime.anime_studios.any(studio) for studio in anime_studios]))

    # Сортировка с уникальным идентификатором
    if order_by == 'rating':
        query = query.order_by(Anime.shikimori_rating.asc() if asc else Anime.shikimori_rating.desc(),
                            Anime.id.asc())
    elif order_by == 'year':
        query = query.order_by(Anime.year.asc() if asc else Anime.year.desc(),
                            Anime.id.asc())
    elif order_by == 'title':
        query = query.order_by(Anime.title.asc() if asc else Anime.title.desc(),
                            Anime.id.asc())


    query = query.limit(limit).offset(skip)
    animes = await db.execute(query)
    animes = animes.scalars().all()
    return animes

@router.get('/genres')
@cache(expire=600)
async def get_all_genres(db: Annotated[AsyncSession, Depends(get_db)]) -> list[str]:
    # Возможно стоит сделать кеширование с redis

    query = select(func.unnest(Anime.anime_genres).label('genre')).distinct()
    result = await db.execute(query)
    genres = [row[0] for row in result.fetchall()]
    return genres

@router.get('/kinds')
@cache(expire=600)
async def get_all_kinds(db: Annotated[AsyncSession, Depends(get_db)]) -> list[str]:
    # Возможно стоит сделать кеширование с redis

    query = select(Anime.anime_kind).distinct()
    result = await db.execute(query)
    kinds = result.scalars().all()
    return kinds

@router.get('/title/{id}')
async def get_anime(id: int, db: Annotated[AsyncSession, Depends(get_db)]) -> AnimeBase:
    query = select(Anime)
    query = query.where(Anime.id == id)
    anime = await db.execute(query)
    anime = anime.scalar()
    return anime

@router.get('/my/marked')
async def get_my_marked_animes(
    user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[MarkedAnime]:
    query = (
        select(Anime, UserAnimeCategory, Rating)
        .join(UserAnimeCategory, UserAnimeCategory.anime_id == Anime.id)
        .join(Rating, Rating.anime_id == Anime.id)
        .where(
            or_(
                UserAnimeCategory.category_id is not None,
                and_(Rating.rating is not None, Rating.rating > 0)
            )
        )
        .where(
            or_(
                UserAnimeCategory.user_id == user.id,
                Rating.user_id == user.id
            )
        )
    )

    result = await db.execute(query)

    anime_list = []
    for row in result.fetchall():
        anime, user_anime_category, rating = row
        anime_data = AnimeBase.model_validate(anime)
        anime_list.append(
            MarkedAnime(
                anime=anime_data,
                category=str(user_anime_category.category_id) if user_anime_category else None,
                rating=rating.rating if rating else None,
            )
        )

    return anime_list