from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.schemas.category import UserAnimeCategory as UserAnimeCategorySchema
from app.auth.utils import get_current_active_user
from app.models.user import User
from app.models.category import UserAnimeCategory
import requests
import logging
from fastapi_cache.decorator import cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()



@router.get('/category/{anime_id}')
async def get_my_anime_category(anime_id: int,
                                user: Annotated[User, Depends(get_current_active_user)],
                                db: Annotated[AsyncSession, Depends(get_db)] = None) \
                                -> str | None:
    query = select(UserAnimeCategory).where(and_(UserAnimeCategory.anime_id == anime_id,
                                                 UserAnimeCategory.user_id == user.id))\
                                                 .options(selectinload(UserAnimeCategory.category))
    result = await db.execute(query)
    result = result.scalar_one_or_none()

    if not result:
        try:
            result = UserAnimeCategory(anime_id=anime_id,
                                    user_id=user.id)
            db.add(result)
            await db.commit()
            await db.refresh(result)
        except IntegrityError:
            await db.rollback()
            raise HTTPException(status_code=404, detail='Anime not found')
        else:
            return None
    
    if not result.category:
        return None
    
    return result.category.name