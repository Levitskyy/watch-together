from pydantic import BaseModel


class GenreBase(BaseModel):
    name_en: str
    name_ru: str


class GenreCreate(GenreBase):
    pass


class Genre(GenreBase):
    id: int

    class ConfigDict:
        from_attributes = True


class MovieBase(BaseModel):
    title: str
    image_url: str
    stream_url: str | None
    rating: float
    description: str
    year: int
    genres: list[Genre]


class MovieCreate(MovieBase):
    pass


class Movie(MovieBase):
    id: int

    class ConfigDict:
        from_attributes = True
