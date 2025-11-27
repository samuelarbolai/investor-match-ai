import os
import pytest

# Minimal env vars so pydantic settings can instantiate during import.
os.environ.setdefault("KAPSO_API_KEY", "test-api-key")
os.environ.setdefault("KAPSO_BASE_URL", "https://kapso.test/")
os.environ.setdefault("PARSER_URL", "https://parser.test")
os.environ.setdefault("AGENT_ONBOARDING_URL", "https://onboarding-agent.test")
os.environ.setdefault("AGENT_CAMPAIGN_URL", "https://campaign-agent.test")
os.environ.setdefault("AGENT_FEEDBACK_URL", "https://feedback-agent.test")
os.environ.setdefault("AGENT_SETTER_URL", "https://setter-agent.test")


@pytest.fixture
def anyio_backend():
    return "asyncio"
