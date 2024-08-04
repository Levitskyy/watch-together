from typing import Annotated, List, Tuple
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import database
from app.models.base import Base
from app.models.user import User
from app.models.movie import Genre, Movie

app = FastAPI()

Base.metadata.create_all(bind=database.engine)

@app.get("/api/hello", status_code=200)
async def say_hello(db: Session = Depends(database.get_db)) -> int:
    user = User(username="Ivan", email="iv.levickiy@gmail.com", password_hash="123asd")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user.id