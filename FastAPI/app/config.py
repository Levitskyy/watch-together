from pydantic_settings import SettingsConfigDict, BaseSettings


class Settings(BaseSettings):
    DB_URL: str = ""
    POSTGRES_USER: str = ""
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""
    JWT_SECRET_KEY: str = ""
    JWT_ALGORITHM: str = "HS256"
    KODIK_TOKEN: str = ""
    model_config = SettingsConfigDict(env_file=".env")


def get_settings() -> Settings:
    return Settings()
