import httpx

from .config import settings


async def send_to_parser(conversation: str) -> dict:
    if not settings.parser_url:
        raise RuntimeError("Parser URL not configured")

    headers = {"Content-Type": "application/json"}
    if settings.parser_api_key:
        headers["Authorization"] = f"Bearer {settings.parser_api_key}"

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            str(settings.parser_url),
            json={"conversation": conversation},
            headers=headers,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
