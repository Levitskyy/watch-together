from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.config import get_settings
from app.models.rating import Rating
from app.schemas.rating import RatingBase, AnimeRating, RateAnime
from app.auth.utils import get_current_active_user
from app.models.user import User
import requests
import logging
from fastapi_cache.decorator import cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()



@router.get('/rating/{anime_id}')
async def get_anime_rating_and_count(anime_id: int,
                                db: Annotated[AsyncSession, Depends(get_db)] = None) -> AnimeRating:
    query = select(func.avg(Rating.rating), func.count(Rating.rating)).where(Rating.anime_id==anime_id)
    rating = await db.execute(query)
    rating = rating.first()
    
    if not rating[0] or not rating[1]:
        raise HTTPException(status_code=404, detail='Anime not found')
    
    return AnimeRating(rating=round(rating[0], 2), voters_count=rating[1])

@router.post('/rating/rate')
async def rate_anime(rating: RateAnime, 
                     user: Annotated[User, Depends(get_current_active_user)], 
                     db: Annotated[AsyncSession, Depends(get_db)] = None) -> bool:
    new_rating = Rating(user_id=user.id,
                        anime_id=rating.anime_id,
                        rating=rating.rating,
                        )
    try:
        db.add(new_rating)
        await db.commit()
        
        return True
    except IntegrityError:
        # user has already rated the anime
        await db.rollback()
        query = select(Rating).where(and_(Rating.anime_id==rating.anime_id, Rating.user_id==user.id))
        new_rating = await db.execute(query)
        new_rating = new_rating.scalar()
        new_rating.rating = rating.rating
        await db.commit()
        await db.refresh(new_rating)

        return True