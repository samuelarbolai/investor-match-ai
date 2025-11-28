import logging
import os
import time
from typing import Dict, Tuple

from app.clients import supabase

_CACHE_TTL_SECONDS = int(os.environ.get("AGENT_PROMPT_CACHE_TTL", "60"))
_CACHE: Dict[Tuple[str, str, str], Tuple[str, float]] = {}


def get_prompt(agent_name: str, prompt_type: str, *, language: str = "multi", default: str) -> str:
    key = (agent_name, prompt_type, language)
    now = time.time()
    cached = _CACHE.get(key)
    if cached and now - cached[1] < _CACHE_TTL_SECONDS:
        return cached[0]

    try:
        response = (
            supabase.SUPABASE
            .table("agent_prompts")
            .select("content")
            .eq("agent_name", agent_name)
            .eq("prompt_type", prompt_type)
            .eq("language", language)
            .order("updated_at", desc=True)
            .limit(1)
            .execute()
        )
        data = getattr(response, "data", None)
        if isinstance(data, list) and data:
            content = data[0].get("content")
            if content:
                _CACHE[key] = (content, now)
                return content
    except Exception as exc:  # pragma: no cover - logging only
        logging.warning(
            "[ParserPromptLoader] falling back to default for %s/%s (%s)",
            agent_name,
            prompt_type,
            exc,
        )

    _CACHE[key] = (default, now)
    return default
