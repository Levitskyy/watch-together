from typing import AsyncGenerator
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from app import config
from app.models.base import Base

engine = create_async_engine(config.get_settings().DB_URL, echo=True ,future=True)
async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
