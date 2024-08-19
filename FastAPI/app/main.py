from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from app import database
from app.routers import movies, users, animes
from app.models.base import Base
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.init_db()
    FastAPICache.init(InMemoryBackend())
    yield


app = FastAPI(
    root_path='/api',
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory='static'), name='static')


app.include_router(movies.router, prefix='/movies', tags=['movies'])
app.include_router(users.router, prefix='/users', tags=['users'])
app.include_router(animes.router, prefix='/animes', tags=['animes'])