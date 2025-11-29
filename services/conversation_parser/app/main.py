# main.py
import hashlib
from pathlib import Path
import traceback
from fastapi import FastAPI, HTTPException, Request
from app.models import ConversationIn, InvestorMatchResponse
from app.services import analyze_conversation_llm, call_investor_match


def _log_build_signature():
    file_path = Path(__file__).resolve()
    digest = hashlib.sha256(file_path.read_bytes()).hexdigest()[:12]
    print(f"[ConversationParser] Booting from {file_path} (sha:{digest})")


_log_build_signature()

app = FastAPI(
    title="Investor Match Conversation Router",
    version="0.1.0",
    description="Receives a conversation, decides POST vs PATCH, and forwards to Investor Match API."
)


@app.post("/v1/conversations", response_model=InvestorMatchResponse)
async def handle_conversation(request: Request):
    """
    Entry point for the conversational workflow with FULL observability:
    - Logs raw incoming request body
    - Logs validation errors
    - Logs LLM decisions
    - Logs outbound Investor Match API calls
    """

    # ============================================================
    # 🔥 1. Read & Log RAW incoming body (before validation)
    # ============================================================
    raw_body = await request.body()
    raw_text = raw_body.decode("utf-8")
    print("\n==============================")
    print("🔥 RAW REQUEST BODY RECEIVED:")
    print(raw_text)
    print("==============================\n")

    # ============================================================
    # 🧪 2. Try to parse payload into ConversationIn
    # ============================================================
    try:
        payload = ConversationIn.parse_raw(raw_body)
    except Exception as e:
        print("❌ VALIDATION ERROR parsing ConversationIn")
        print(str(e))
        print(traceback.format_exc())
        raise HTTPException(
            status_code=422,
            detail=f"Invalid request body: {str(e)}"
        )

    conversation = payload.conversation or ""

    if not conversation.strip():
        raise HTTPException(status_code=400, detail="Conversation must not be empty")

    # ============================================================
    # 🤖 3. LLM: Analyze conversation → get mode + body
    # ============================================================
    try:
        decision = await analyze_conversation_llm(conversation)
        print("🤖 LLM DECISION:")
        print(decision)
    except Exception as e:
        print("❌ LLM ERROR:")
        print(str(e))
        print(traceback.format_exc())
        raise HTTPException(500, f"LLM error: {str(e)}")

    # ============================================================
    # 🌐 4. Outbound request to Investor Match API
    # ============================================================
    try:
        print("📤 SENDING REQUEST TO INVESTOR MATCH API")
        result = await call_investor_match(decision)
        print("📥 RESPONSE FROM INVESTOR MATCH API:")
        print(result)
    except Exception as e:
        print("❌ ERROR CALLING INVESTOR MATCH API:")
        print(str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

    # ============================================================
    # 🎉 5. Return structured pydantic response
    # ============================================================
    return result
