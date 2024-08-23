from pydantic import BaseModel


class MovieBase(BaseModel):
    title: str
    image_url: str
    stream_url: str | None
    rating: float
    description: str
    year: int
    genres: list[str]


class MovieCreate(MovieBase):
    pass


class Movie(MovieBase):
    id: int

    class ConfigDict:
        from_attributes = True

class AnimeBase(BaseModel):
    id: int
    kodik_id: str | None
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

    class ConfigDict:
        from_attributes = True