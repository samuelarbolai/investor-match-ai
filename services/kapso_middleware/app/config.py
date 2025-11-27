from typing import Optional

from pydantic import HttpUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    parser_url: Optional[HttpUrl] = None
    parser_api_key: Optional[str] = None
    log_bodies: bool = False

    kapso_base_url: HttpUrl = "https://app.kapso.ai/api/meta/"
    kapso_api_key: str
    kapso_webhook_secret: Optional[str] = None

    agent_onboarding_url: Optional[HttpUrl] = None
    agent_campaign_url: Optional[HttpUrl] = None
    agent_feedback_url: Optional[HttpUrl] = None
    agent_setter_url: Optional[HttpUrl] = None
    forward_to_parser: bool = False

    idempotency_store_url: Optional[str] = None
    idempotency_ttl_seconds: int = 600

    internal_access_token: Optional[str] = None

    max_signature_skew_seconds: int = 300

    class Config:
        env_file = ".env"


settings = Settings()
