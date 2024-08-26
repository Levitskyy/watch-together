from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.config import get_settings
from app.models.movie import Anime, AnimeEpisode
from app.schemas.episode import AnimeEpisodeBase
import requests
import logging
from fastapi_cache.decorator import cache

logging.basicConfig(filename='backend.log',
                    filemode='a',
                    format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                    datefmt='%H:%M:%S',
                    level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()



@router.get('/title/{anime_id}')
async def get_episodes_by_anime_id(anime_id: int,
                                db: Annotated[AsyncSession, Depends(get_db)] = None) -> list[AnimeEpisodeBase]:
    query = select(AnimeEpisode).where(AnimeEpisode.anime_id==anime_id) \
                                .order_by(AnimeEpisode.translation_id.asc(), AnimeEpisode.number.asc())
    episodes = await db.execute(query)
    episodes = episodes.scalars().all()
    
    if not episodes:
        raise HTTPException(status_code=404, detail='Episodes not found')
    
    return episodes