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

class RoomsManager:
    def __init__(self):
        self.rooms = {}

    async def connect(self, websocket: WebSocket, roomId: str):
        if roomId in self.rooms:
            self.rooms[roomId]['users'].append(websocket)
            msg = {'event': 'state', 'value': self.rooms[roomId]['state']}
            await websocket.send_json(msg)
        else:
            self.rooms[roomId] = {'state': {}, 'users': [websocket]}

    def disconnect(self, websocket: WebSocket, roomId: str):
        self.rooms[roomId]['users'].remove(websocket)
        if len(self.rooms[roomId]['users']) == 0:
            del self.rooms[roomId]

    async def broadcast(self, msg: dict, roomId: str):
        for user in self.rooms[roomId]['users']:
            await user.send_json(msg)

    def set_current_state(self, state: dict,roomId: str):
        self.rooms[roomId]['state'] = state

roomsManager = RoomsManager()

@router.websocket("/{roomId}")
async def websocket_room(websocket: WebSocket, roomId: str):
    logger.info(f"new {roomId}")
    await websocket.accept()
    try:
        await roomsManager.connect(websocket, roomId)
        while True:
            data = await websocket.receive_json()
            logger.info(data)
            
            if (data['event'] == 'episodeUpdate'):
                roomsManager.set_current_state(data['value'], roomId)
                await roomsManager.broadcast({'event': 'state', 'value': data['value']}, roomId)
            else:
                await roomsManager.broadcast(data, roomId)

    except WebSocketDisconnect:
        logger.info(f"Client disconnected from {roomId}")
        roomsManager.disconnect(websocket, roomId)
        await websocket.close()
    except Exception as e:
        logger.error(f"Error in WebSocket connection: {e}")