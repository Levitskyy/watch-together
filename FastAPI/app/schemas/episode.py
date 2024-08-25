from pydantic import BaseModel

class AnimeEpisodeBase(BaseModel):
    id: int
    season: int
    number: int
    translation_id: int
    translation_title: str
    translation_type: str
    url: str | None
    anime_id: int

    class ConfigDict:
        from_attributes = True