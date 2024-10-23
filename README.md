<!--Установка-->
## Установка и запуск

1. Клонирование репозитория 

```git clone https://github.com/Levitskyy/watch-together.git```

2. Создать .env файл в папке FastAPI

```cd FastAPI && touch .env```
   
Содержимое .env:

```
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=db
DB_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
JWT_SECRET_KEY=secret
JWT_ALGORITHM=HS256
KODIK_TOKEN=secret
ACCESS_TOKEN_EXPIRE_MINUTES=10
REFRESH_TOKEN_EXPIRE_DAYS = 7
```

3. Запуск приложения

```docker compose up --build```
