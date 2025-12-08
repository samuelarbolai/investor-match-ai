import logging
import os
import time
from typing import Dict, Tuple

from app.clients import supabase

_CACHE_TTL_SECONDS = int(os.environ.get("AGENT_PROMPT_CACHE_TTL", "60"))
_CACHE: Dict[Tuple[str, str, str], Tuple[str, float]] = {}


def get_prompt(agent_name: str, prompt_type: str, *, language: str = "multi", default: str) -> str:
    print(f"Loading prompt for agent={agent_name}, type={prompt_type}, language={language}")
    
    key = (agent_name, prompt_type, language)
    now = time.time()
    cached = _CACHE.get(key)
    if cached and now - cached[1] < _CACHE_TTL_SECONDS:
        return cached[0]

    try:
        response = (
            supabase.SUPABASE
            .table("agents")
            .select("id")
            .eq("slug", agent_name)
            .order("updated_at", desc=True)
            .limit(1)
            .execute()
        )
        data = getattr(response, "data", None)
        if data is None:
            raise RuntimeError(f"Agent not found: {agent_name}")
        agent_id = data[0].get("id")
        print("Agent ID:" + agent_id)
    except Exception as exc:  # pragma: no cover - logging only
        logging.error(
            "[ParserPromptLoader] agent fetch failed for %s: %s",
            agent_name,
            exc,
        )
        raise

    try:
        response = (
            supabase.SUPABASE
            .table("prompts")
            .select("id","content")
            .eq("agent_id", agent_id)
            .eq("type", prompt_type)
            .eq("language", language)
            .order("updated_at", desc=True)
            .limit(1)
            .execute()
        )
        data = getattr(response, "data", None)
        if isinstance(data, list) and data:
            print("Prompt ID:" + data[0].get("id"))
            content = data[0].get("content")
            print("Prompt Content:" + content[:50] + "...")
            if content:
                _CACHE[key] = (content, now)
                return content
    except Exception as exc:  # pragma: no cover - logging only
        logging.error(
            "[ParserPromptLoader] prompt fetch failed for %s/%s/%s: %s",
            agent_name,
            prompt_type,
            language,
            exc,
        )
        raise

    logging.error(
        "[ParserPromptLoader] no prompt found for %s/%s/%s in agent_prompts",
        agent_name,
        prompt_type,
        language,
    )
    raise RuntimeError(
        f"Prompt missing for {agent_name}/{prompt_type}/{language}; add row to agent_prompts"
    )
