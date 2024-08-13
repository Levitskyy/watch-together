from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import User, UserCreate
from app.models.user import User as UserModel
from app.database import get_db

router = APIRouter()

@router.post('/new')
async def new_user(user: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]) -> User:
    db_user = UserModel(username=user.username, email=user.email, password_hash=user.password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.get('/{id}')
async def get_user(id: int, db: Annotated[AsyncSession, Depends(get_db)]) -> User:
    query = select(UserModel)
    query = query.where(UserModel.id == id)
    user = await db.execute(query)
    user = user.scalar()
    return user