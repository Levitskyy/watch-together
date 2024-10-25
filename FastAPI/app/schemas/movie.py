from pydantic import BaseModel, ConfigDict
from app.schemas.episode import AnimeEpisodeBase

class AnimeBase(BaseModel):
    id: int
    shikimori_id: str | None
    title: str
    title_en: str | None
    year: int | None
    anime_kind: str | None
    description: str | None
    poster_url: str | None
    anime_genres: list[str]
    shikimori_rating: float | None
    minimal_age: int | None
    anime_studios: list[str]
    shikimori_votes: int | None
    status: str | None
    released_episodes: int | None
    total_episodes: int | None
    other_titles: list[str] | None

    model_config = ConfigDict(from_attributes=True)
    

class AnimeWithEpisodes(AnimeBase):
    episodes: list[AnimeEpisodeBase] | None

    class ConfigDict:
        from_attributes = True

class MarkedAnime(BaseModel):
    anime: AnimeBase
    category: str | None
    rating: int | None
