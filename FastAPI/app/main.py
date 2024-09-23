from fastapi import FastAPI, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import time

from app import database
from app.routers import movies, users, animes, episodes, rooms
from app.auth.routes import router as auth_router
from app.models.base import Base
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

@asynccontextmanager
async def lifespan(app: FastAPI):
    FastAPICache.init(InMemoryBackend())
    await database.init_db()
    yield


app = FastAPI(
    root_path='/api',
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "ws://localhost:3000",
    "http://localhost:8000",
    "ws://localhost:8000",
    "http://localhost:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time"]
)

app.mount("/static", StaticFiles(directory='static'), name='static')


app.include_router(movies.router, prefix='/movies', tags=['movies'])
app.include_router(users.router, prefix='/users', tags=['users'])
app.include_router(animes.router, prefix='/animes', tags=['animes'])
app.include_router(episodes.router, prefix='/episodes', tags=['episodes'])
app.include_router(rooms.router, prefix='/room', tags=['rooms'])
app.include_router(auth_router, prefix='/auth', tags=['auth'])


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response