"""Add example movies

Revision ID: d03ebf1c1ace
Revises: fb3e622232fe
Create Date: 2024-08-04 17:09:51.423020

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.models.base import Base
from app.models.movie import Movie, Genre


# revision identifiers, used by Alembic.
revision: str = 'd03ebf1c1ace'
down_revision: Union[str, None] = 'fb3e622232fe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    engine = create_engine('sqlite:///./watch-together.db')
    Session = sessionmaker(bind=engine)
    session = Session()

    # Добавление жанров
    genres = []

    action = Genre(name="Экшн")
    genres.append(action)

    drama = Genre(name="Драма")
    genres.append(drama)
    
    fantasy = Genre(name="Фентези")
    genres.append(fantasy)

    romance = Genre(name="Романтика")
    genres.append(romance)

    cartoon = Genre(name="Мультфильм")
    genres.append(cartoon)

    for i in genres:
        session.add(i)

    session.commit()

    # Добавление фильмов
    movie1 = Movie(
        title='Inception',
        image_url='static/img/inception.jpg',
        stream_url='static/movies/inception.mp4',
        rating=7.8,
        description='A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        year=2016,
        genres=[action, drama]
    )
    movie2 = Movie(
        title='The Dark Knight',
        image_url='static/img/dark_knight.jpg',
        stream_url='static/movies/dark_knight.mp4',
        rating=9.0,
        description='When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        year=2005,
        genres=[romance]
    )
    movie3 = Movie(
        title='The Sopranos',
        image_url='static/img/sopranos.jpg',
        stream_url='static/movies/sopranos.mp4',
        rating=9.5,
        description='When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        year=1999,
        genres=[action, drama]
    )
    session.add(movie1)
    session.add(movie2)
    session.add(movie3)
    session.commit()

    session.close()



def downgrade() -> None:
    engine = create_engine('sqlite:///./watch-together.db')
    Session = sessionmaker(bind=engine)
    session = Session()

    # Удаление фильмов и жанров
    session.query(Movie).delete()
    session.query(Genre).delete()
    session.commit()

    session.close()
