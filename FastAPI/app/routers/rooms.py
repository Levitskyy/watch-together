from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import and_, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.config import get_settings
from app.models.movie import Anime, AnimeEpisode
from app.schemas.episode import AnimeEpisodeBase
import requests
import logging
from fastapi_cache.decorator import cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

@router.websocket("/{roomId}")
async def websocket_room(websocket: WebSocket, roomId: str):
    logger.info(f"new {roomId}")
    await websocket.accept()
    try:
        await websocket.send_text(f"Connection established")
        while True:
            data = await websocket.receive_text()
            logger.info(data)
            await websocket.send_text(f"Message was: {data}")
    except WebSocketDisconnect:
        logger.info(f"Client disconnected from {roomId}")
    except Exception as e:
        logger.error(f"Error in WebSocket connection: {e}")