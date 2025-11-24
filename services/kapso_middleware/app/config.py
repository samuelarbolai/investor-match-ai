from pydantic import HttpUrl
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    parser_url: HttpUrl
    parser_api_key: str | None = None  # optional header for auth
    log_bodies: bool = False

    class Config:
        env_file = ".env"

settings = Settings()