# services.py
import json
import traceback
from typing import Dict, Any, Optional
from openai import OpenAI
import httpx
import requests

from app.config import (
    INVESTOR_MATCH_API_BASE,
    REST_SERVER_BASE,
    get_default_headers,
    OPENAI_API_KEY
)
from app.models import InvestorMatchResponse, LlmDecision
from app.prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE


# ---------------------------------------------------------
# OpenAI Client
# ---------------------------------------------------------
client = OpenAI(api_key=OPENAI_API_KEY)


# ---------------------------------------------------------
# Call LLM
# ---------------------------------------------------------
async def _call_llm(conversation: str) -> str:
    """
    Calls the LLM using the base SYSTEM_PROMPT + conversation text.
    Returns raw LLM text output.
    """

    user_prompt = USER_PROMPT_TEMPLATE.format(conversation=conversation)

    print("\n==============================")
    print("🤖 CALLING LLM WITH PROMPT:")
    print(user_prompt)
    print("==============================\n")

    try:
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.0
        )
    except Exception as e:
        print("❌ ERROR DURING OPENAI CALL")
        print(str(e))
        print(traceback.format_exc())
        raise

    llm_output = response.choices[0].message.content

    print("\n==============================")
    print("🤖 RAW LLM OUTPUT:")
    print(llm_output)
    print("==============================\n")

    return llm_output


# ---------------------------------------------------------
# Parse & Validate LLM Output
# ---------------------------------------------------------
async def analyze_conversation_llm(conversation: str) -> LlmDecision:
    """
    Sends conversation → LLM → returns structured LlmDecision.
    Strict JSON parsing + schema enforcement.
    """

    raw_output = await _call_llm(conversation)

    print("\n==============================")
    print("📦 PARSING LLM JSON OUTPUT")
    print("==============================\n")

    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError:
        print("❌ JSON PARSE ERROR")
        print(raw_output)
        raise ValueError(f"LLM did not return valid JSON. Raw output:\n{raw_output}")

    print("🧾 Parsed JSON:")
    print(parsed)

    # Required keys
    if "mode" not in parsed:
        raise ValueError("LLM JSON missing required key: 'mode'")
    if parsed["mode"] not in ("post", "patch"):
        raise ValueError("LLM mode must be either 'post' or 'patch'")
    if "body" not in parsed:
        raise ValueError("LLM JSON missing required key: 'body'")

    decision = LlmDecision(
        mode=parsed["mode"],
        contact_id=parsed.get("contact_id"),
        body=parsed["body"]
    )

    print("\n==============================")
    print("👍 LLM DECISION OBJECT:")
    print(decision)
    print("==============================\n")

    return decision


# ---------------------------------------------------------
# Call Investor Match API
# ---------------------------------------------------------
async def call_investor_match(decision: LlmDecision) -> InvestorMatchResponse:
    """
    Makes actual HTTP request to Investor Match API:
      - POST /v1/contacts
      - PATCH /v1/contacts/{id}
    """

    headers = get_default_headers()

    print("\n==============================")
    print("🌐 CALLING INVESTOR MATCH API")
    print(f"Mode: {decision.mode}")
    print(f"Contact ID: {decision.contact_id}")
    print(f"Payload: {decision.body}")
    print("==============================\n")

    async with httpx.AsyncClient() as client:
        try:
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

        except Exception as e:
            print("❌ ERROR SENDING REQUEST TO INVESTOR MATCH API")
            print(str(e))
            print(traceback.format_exc())
            raise

    print("\n==============================")
    print("📥 INVESTOR MATCH API RESPONSE")
    print(f"Status: {resp.status_code}")
    print(f"Text: {resp.text}")
    print("==============================\n")

    # Try JSON parsing
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


# ---------------------------------------------------------
# OPTIONAL: Send to local REST server (alternative flow)
# ---------------------------------------------------------
def send_to_rest_server(mode: str, contact_id: Optional[str], payload: dict):
    """
    Sends POST or PATCH requests to an alternate REST server.
    Not used in Cloud Run path but kept for compatibility.
    """

    print("\n==============================")
    print("🔄 CALLING LOCAL REST SERVER")
    print(f"Mode: {mode}")
    print(f"Contact ID: {contact_id}")
    print(f"Payload: {payload}")
    print("==============================\n")

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

    print("\nLOCAL REST SERVER RESPONSE:")
    print("Status:", response.status_code)
    print("Body:", response.text)

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
