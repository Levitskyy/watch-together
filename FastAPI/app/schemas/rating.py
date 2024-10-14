from pydantic import BaseModel

class RatingBase(BaseModel):
    id: int
    user_id: int
    anime_id: int
    rating: int

    class ConfigDict:
        from_attributes = True

class AnimeRating(BaseModel):
    rating: float
    voters_count: int

class RateAnime(BaseModel):
    anime_id: int
    rating: int
