from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.config import get_settings
from app.models.movie import Anime
from app.schemas.movie import AnimeBase
import requests
import logging
from fastapi_cache.decorator import cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

# @router.post('/parse')
# async def parse_animes(limit: int, db: Annotated[AsyncSession, Depends(get_db)]) -> int:
#     counter = 0
#     payload = {
#         'token': get_settings().KODIK_TOKEN,
#         'types': 'anime,anime-serial',
#         'sort': 'shikimori_rating',
#         'has_field': 'shikimori_id',
#         'material_data': 'true',
#     }
    
#     r = requests.get('https://kodikapi.com/list', params=payload)
#     r = r.json()
#     next_url = r['next_page']
#     while next_url:
#         for anime in r['results']:
#             new_anime = Anime(
#                 kodik_id=anime.get('id'),
#                 shikimori_id=anime.get('shikimori_id'),
#                 title=anime.get('title'),
#                 title_en=anime['material_data'].get('title_en'),
#                 year=anime.get('year'),
#                 anime_kind=anime['material_data'].get('anime_kind'),
#                 description=anime['material_data'].get('description'),
#                 poster_url=anime['material_data'].get('poster_url'),
#                 anime_genres=anime['material_data'].get('anime_genres'),
#                 shikimori_rating=anime['material_data'].get('shikimori_rating'),
#                 minimal_age=anime['material_data'].get('minimal_age'),
#                 anime_studios=anime['material_data'].get('anime_studios'),
#             )
#             try:
#                 db.add(new_anime)
#                 await db.commit()
#             except IntegrityError:
#                 await db.rollback()
#                 logger.info(f"Insertion failed for {new_anime.title}")
#             else:
#                 counter += 1
#                 logger.info(counter)
            
#         r = requests.get(next_url)
#         r = r.json()
#         next_url = r['next_page']
    
#     return counter


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
        query = query.order_by(Anime.shikimori_rating.asc() if asc else Anime.shikimori_rating.desc())
    elif order_by == 'year':
        query = query.order_by(Anime.year.asc() if asc else Anime.year.desc())
    elif order_by == 'title':
        query = query.order_by(Anime.title.asc() if asc else Anime.title.desc())
    
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

    # Фильтрация по названию
    if title:
        query = query.where(or_(Anime.title.ilike(f"%{title}%"), Anime.title_en.ilike(f"%{title}%")))
    
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

# @router.post('/delete')
# async def delete_by_genres(db: Annotated[AsyncSession, Depends(get_db)], 
#                            genres_to_delete: list[str]) -> str:
#     query = delete(Anime).where(Anime.anime_genres.op('&&')(genres_to_delete))

#     try:
#         await db.execute(query)
#         await db.commit()
#     except:
#         await db.rollback()
#         return 'Failed to delete'
#     else:
#         return 'Deleted succesfully'
    
@router.get('/{id}')
async def get_anime(id: int, db: Annotated[AsyncSession, Depends(get_db)]) -> AnimeBase:
    query = select(Anime)
    query = query.where(Anime.id == id)
    anime = await db.execute(query)
    anime = anime.scalar()
    return anime
