from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, Query
from sqlalchemy import and_, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.schemas.category import UserAnimeCategory as UserAnimeCategorySchema, CategoryPost
from app.auth.utils import get_current_active_user
from app.models.user import User
from app.models.category import UserAnimeCategory, Category
import requests
import logging
from fastapi_cache.decorator import cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()


@router.get('/all')
async def get_all_categories(db: Annotated[AsyncSession, Depends(get_db)] = None) -> list[str]:
    query = select(Category)
    result = await db.execute(query)
    result = result.scalars().all()
    categories = list(x.name for x in result)

    if len(categories) == 0:
        raise HTTPException(status_code=404, detail='No categories')
    
    return categories


@router.get('/my/{anime_id}')
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

@router.post('/my/{anime_id}')
async def change_my_anime_category(anime_id: int,
                                   category: CategoryPost,
                                   user: Annotated[User, Depends(get_current_active_user)],
                                   db: Annotated[AsyncSession, Depends(get_db)] = None) \
                                   -> bool:
    query = select(UserAnimeCategory).where(and_(UserAnimeCategory.anime_id == anime_id,
                                                 UserAnimeCategory.user_id == user.id))
    uac = await db.execute(query)
    uac = uac.scalar_one_or_none()

    category = category.category
    query = select(Category).where(Category.name == category.lower())
    db_category = await db.execute(query)
    db_category = db_category.scalar_one_or_none()

    if not uac:
        try:
            uac = UserAnimeCategory(anime_id=anime_id,
                                    user_id=user.id,
                                    category_id=db_category.id if db_category else None)
            db.add(uac)
            await db.commit()
            await db.refresh(uac)
        except IntegrityError:
            await db.rollback()
            raise HTTPException(status_code=404, detail='Anime not found')
        else:
            return True
        
    uac.category_id = db_category.id if db_category else None
    try:
        await db.commit()
        await db.refresh(uac)
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=404, detail='No such category')
    else:
        return True
        
    