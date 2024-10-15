from pydantic import BaseModel
from datetime import datetime

class Category(BaseModel):
    id: int
    name: str

    class ConfigDict:
        from_attributes = True

class UserAnimeCategory(BaseModel):
    id: int
    user_id: int
    anime_id: int
    category_id: int | None
    updated_at: datetime

    class ConfigDict:
        from_attributes = True
