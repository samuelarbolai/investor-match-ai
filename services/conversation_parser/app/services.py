# services.py
import json
from typing import Dict, Any
from openai import OpenAI

import httpx
from app.config import INVESTOR_MATCH_API_BASE, get_default_headers
from app.models import InvestorMatchResponse
from app.prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE
from app.config import OPENAI_API_KEY
from app.models import LlmDecision

import requests
from app.config import REST_SERVER_BASE


client = OpenAI(api_key=OPENAI_API_KEY)



async def _call_llm(conversation: str) -> str:
    """
    Calls the LLM with the base system prompt + conversation.
    Returns the LLM's raw output (a JSON string).
    """
    user_prompt = USER_PROMPT_TEMPLATE.format(conversation=conversation)

    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.0
    )

    # Correct access for new SDK:
    llm_output = response.choices[0].message.content

    return llm_output



async def analyze_conversation_llm(conversation: str) -> LlmDecision:
    """
    Sends the conversation to the LLM and parses the output into a LlmDecision object.
    Includes strict JSON parsing + schema enforcement.
    """
    raw_output = await _call_llm(conversation)

    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError:
        raise ValueError(f"LLM did not return valid JSON. Raw output:\n{raw_output}")

    # Validate required keys
    if "mode" not in parsed:
        raise ValueError("LLM JSON missing required key: 'mode'")

    if parsed["mode"] not in ("post", "patch"):
        raise ValueError("LLM mode must be either 'post' or 'patch'")

    if "body" not in parsed:
        raise ValueError("LLM JSON missing required key: 'body'")

    # Construct pydantic object
    return LlmDecision(
        mode=parsed["mode"],
        contact_id=parsed.get("contact_id"),
        body=parsed["body"]
    )


async def call_investor_match(decision: LlmDecision) -> InvestorMatchResponse:
    """
    Given the LlmDecision, performs the actual HTTP request to the Investor Match API.
    Supports:
      - POST /v1/contacts        when mode == 'post'
      - PATCH /v1/contacts/{id}  when mode == 'patch'
    """
    headers = get_default_headers()

    async with httpx.AsyncClient() as client:
        if decision.mode == "post":
            url = f"{INVESTOR_MATCH_API_BASE}/v1/contacts"
            resp = await client.post(url, json=decision.body, headers=headers)

        elif decision.mode == "patch":
            if not decision.contact_id:
                raise ValueError("PATCH mode requires contact_id in LlmDecision")
            url = f"{INVESTOR_MATCH_API_BASE}/v1/contacts/{decision.contact_id}"
            resp = await client.patch(url, json=decision.body, headers=headers)

        else:
            raise ValueError(f"Unknown mode: {decision.mode}")

    # Try to decode JSON, but allow non-JSON responses gracefully
    try:
        backend_json = resp.json()
    except Exception:
        backend_json = {"raw_text": resp.text}

    return InvestorMatchResponse(
        mode=decision.mode,
        contact_id=decision.contact_id,
        target_url=url,
        status_code=resp.status_code,
        backend_response=backend_json
    )

def send_to_rest_server(mode: str, contact_id: str | None, payload: dict):
    """
    Sends POST or PATCH requests to the REST server.
    """

    # Decide which endpoint to hit
    if mode == "post":
        url = f"{REST_SERVER_BASE}/v1/contacts"
        response = requests.post(url, json=payload)

    elif mode == "patch":
        if not contact_id:
            raise ValueError("PATCH mode requires a contact_id")
        url = f"{REST_SERVER_BASE}/v1/contacts/{contact_id}"
        response = requests.patch(url, json=payload)

    else:
        raise ValueError(f"Unknown mode: {mode}")

    return {
        "url": url,
        "status_code": response.status_code,
        "response_json": safe_json(response)
    }

def safe_json(response):
    """Avoid crashes when response is not valid JSON."""
    try:
        return response.json()
    except:
        return response.text