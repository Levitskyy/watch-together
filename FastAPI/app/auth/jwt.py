from fastapi import HTTPException, status
from app.database import get_db
from app.auth.models import RefreshToken
from app.config import get_settings
from datetime import datetime, timedelta, timezone
from app.auth.schemas import RefreshTokenBase, RefreshTokenWeb, TokenData
from jwt.exceptions import InvalidTokenError
import jwt
import uuid
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, get_settings().JWT_SECRET_KEY, algorithm=get_settings().JWT_ALGORITHM)
    return encoded_jwt

async def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=7)
    jti = str(uuid.uuid4())
    to_encode.update({"exp": expire})
    to_encode.update({"jti": jti})
    encoded_jwt = jwt.encode(to_encode, get_settings().JWT_SECRET_KEY, algorithm=get_settings().JWT_ALGORITHM)
    expiration_time_naive = expire.replace(tzinfo=None)
    token_db = RefreshToken(jti=to_encode["jti"],
                            expiration_date=expiration_time_naive,
                            username=to_encode["sub"],
                            )
    async for db in get_db():
        try:
            db.add(token_db)
            await db.commit()
        except Exception as e:
            await db.rollback()
            logger.info(e)
    return encoded_jwt

def verify_token(token: str) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, get_settings().JWT_SECRET_KEY, algorithms=[get_settings().JWT_ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise credentials_exception
        token_data = TokenData(username=username, role=role)
        return token_data
    except InvalidTokenError:
        raise credentials_exception
    
def verify_refresh_token(token: str) -> RefreshTokenWeb:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, get_settings().JWT_SECRET_KEY, algorithms=[get_settings().JWT_ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        jti: str = payload.get("jti")
        if username is None or jti is None:
            logger.info('no username or jti in refresh token')
            raise credentials_exception
        token_data = RefreshTokenWeb(username=username, jti=jti, role=role, expiration_date=None)
        return token_data
    except InvalidTokenError:
        logger.info('invalid token error in verify refresh token')
        raise credentials_exception