from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    return pwd_context.hash(password)

async def get_user(db: AsyncSession, username: str) -> User | None:
    query = select(User).where(User.username==username)
    user = await db.execute(query)
    user = user.scalars().one_or_none()
    return user