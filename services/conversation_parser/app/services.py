# services.py
import asyncio
import hashlib
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
from app.prompts import get_system_prompt, build_user_prompt


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

    user_prompt = build_user_prompt(conversation)
    system_prompt = get_system_prompt()

    print("\n==============================")
    print("🤖 CALLING LLM WITH PROMPT:")
    print(user_prompt)
    print("==============================\n")

    try:
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": system_prompt},
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

    def normalize_body(body: dict) -> dict:
        # Fix common naming variants before hitting the API.
        if not isinstance(body, dict):
            return body
        fixed = dict(body)
        companies = fixed.get("companies")
        if isinstance(companies, list):
            normalized_companies = []
            for comp in companies:
                if not isinstance(comp, dict):
                    normalized_companies.append(comp)
                    continue
                comp_copy = dict(comp)
                if "name" not in comp_copy and comp_copy.get("company_name"):
                    comp_copy["name"] = comp_copy.pop("company_name")
                normalized_companies.append(comp_copy)
            fixed["companies"] = normalized_companies
        return fixed

    normalized_body = normalize_body(decision.body)
    headers = get_default_headers()
    idempotency_key = hashlib.sha256(
        json.dumps(
            {
                "mode": decision.mode,
                "contact_id": decision.contact_id or "new",
                "body": normalized_body,
            },
            sort_keys=True,
        ).encode("utf-8")
    ).hexdigest()
    headers["Idempotency-Key"] = idempotency_key

    print("\n==============================")
    print("🌐 CALLING INVESTOR MATCH API")
    print(f"Mode: {decision.mode}")
    print(f"Contact ID: {decision.contact_id}")
    print(f"Payload: {normalized_body}")
    print(f"Idempotency-Key: {idempotency_key}")
    print("==============================\n")

    url = f"{INVESTOR_MATCH_API_BASE}/v1/contacts"
    if decision.mode == "patch":
        if not decision.contact_id:
            raise ValueError("PATCH mode requires contact_id in LlmDecision")
        url = f"{INVESTOR_MATCH_API_BASE}/v1/contacts/{decision.contact_id}"
    elif decision.mode != "post":
        raise ValueError(f"Unknown mode: {decision.mode}")

    timeout = httpx.Timeout(10.0)
    backoff = [0.5, 1.0, 2.0]  # seconds
    resp = None
    last_error = None

    async with httpx.AsyncClient(timeout=timeout) as client:
        for attempt, delay in enumerate([0.0] + backoff):
            if delay:
                await asyncio.sleep(delay)
            try:
                if decision.mode == "post":
                    resp = await client.post(url, json=normalized_body, headers=headers)
                else:
                    resp = await client.patch(url, json=normalized_body, headers=headers)

                if resp.status_code < 500:
                    break

                last_error = Exception(f"server error {resp.status_code}: {resp.text}")
                print(f"⚠️ attempt {attempt + 1} failed with server error {resp.status_code}, retrying...")
            except httpx.HTTPError as exc:
                last_error = exc
                print(f"⚠️ attempt {attempt + 1} failed with HTTP error: {exc}")
                print(traceback.format_exc())
        else:
            pass

    if resp is None or (resp.status_code >= 500 and last_error):
        print("❌ ERROR SENDING REQUEST TO INVESTOR MATCH API")
        print(last_error)
        raise last_error

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
