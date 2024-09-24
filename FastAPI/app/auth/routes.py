from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import delete, select
from app.auth.models import RefreshToken
from app.config import get_settings
from app.models.user import User
from app.schemas.user import UserCreate
from app.auth.jwt import create_access_token, create_refresh_token, verify_refresh_token, verify_token
from app.auth.utils import authenticate_user, get_user, verify_password, get_password_hash, get_current_user, get_current_active_user
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')


@router.post("/token")
async def login_for_tokens(response: Response, 
                           form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> dict:
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=get_settings().ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    refresh_token_expires = timedelta(days=get_settings().REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = await create_refresh_token(
        data={"sub": user.username, "role": user.role}, expires_delta=refresh_token_expires
    )
    # response.set_cookie(key='refresh_token',
    #                     value='',
    #                     httponly=True,
    #                     secure=True,
    #                     samesite='strict',
    #                     max_age= 0,
    #                     )

    response.set_cookie(key='refresh_token',
                        value=refresh_token,
                        httponly=True,
                        secure=True,
                        samesite='none',
                        max_age=get_settings().REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60, # in seconds
                        )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh")
async def refresh_access_token(request: Request, db: Annotated[AsyncSession, Depends(get_db)]) -> dict:
    refresh_token = request.cookies.get("refresh_token")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not refresh_token:
        logger.info('no refresh token in cookies')
        raise credentials_exception
    
    token_data = verify_refresh_token(refresh_token)
    query = select(RefreshToken).where(RefreshToken.jti == token_data.jti)
    db_token = await db.execute(query)
    db_token = db_token.scalars().one_or_none()
    if not db_token or db_token.disabled:
        logger.info('no refresh token in db or disabled')
        raise credentials_exception

    access_token_expires = timedelta(minutes=get_settings().ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": token_data.username, "role": token_data.role}, expires_delta=access_token_expires
    )
    logger.info(f"refreshing token:: {access_token}")
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]) -> dict:
    return {"username": current_user.username, "role" : current_user.role}

@router.post("/register")
async def register_user(user: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]) -> dict:
    user.password = get_password_hash(user.password)
    db_user = User(username=user.username,
                   password_hash=user.password,
                   email=user.email,
                   )
    try:
        db.add(db_user)
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Email or username already registered")
    return {"message": "User registered successfully"}

@router.post("/logout")
async def logout_user(user: Annotated[User, Depends(get_current_active_user)],
                      db: Annotated[AsyncSession, Depends(get_db)]) -> bool:
    query = select(RefreshToken).where(RefreshToken.username == user.username)
    tokens = await db.execute(query)
    tokens = tokens.scalars().all()
    for token in tokens:
        token.disabled = True
    try:
        await db.commit()
    except Exception as e:
        await db.rollback()
        return False
    else:
        return True

