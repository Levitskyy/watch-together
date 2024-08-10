<!--Установка-->
## Установка и запуск

1. Клонирование репозитория 

```git clone https://github.com/Levitskyy/watch-together.git```

2. Переход в директорию React/watch-together

```cd React/watch-together```

3. Установка зависимостей

```npm install```

4. Запуск фронта

  ```npm start```
  
5. Переход назад и создание виртуального окружения

```cd ../../```
```py -m venv env```

6. Активация виртуального окружения

```env/Scripts/activate```

7. Установка зависимостей

```pip install -r requirements.txt```

8. Запуск бека

```cd FastAPI```
```uvicorn app.main:app --host "localhost" --port 8000```
