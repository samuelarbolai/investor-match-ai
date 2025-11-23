# main.py
from fastapi import FastAPI, HTTPException
from app.models import ConversationIn, InvestorMatchResponse
from app.services import analyze_conversation_llm, call_investor_match, send_to_rest_server


app = FastAPI(
    title="Investor Match Conversation Router",
    version="0.1.0",
    description="Receives a conversation, decides POST vs PATCH, and forwards to Investor Match API."
)


@app.post("/v1/conversations", response_model=InvestorMatchResponse)
async def handle_conversation(payload: ConversationIn):
    """
    Entry point for the conversational workflow.

    1. Receives the full conversation as text.
    2. Calls LLM (currently stub) to:
       - decide whether to POST or PATCH
       - build the right body
    3. Calls the Investor Match API.
    4. Returns status + backend response.
    """
    conversation = payload.conversation

    if not conversation.strip():
        raise HTTPException(status_code=400, detail="Conversation must not be empty")

    # 1) Use LLM to convert conversation → mode + payload
    try:
        decision = await analyze_conversation_llm(conversation)
    except Exception as e:
        raise HTTPException(500, f"LLM error: {str(e)}")

    # 2) Call Investor Match API with that decision
    try:
        result = await call_investor_match(decision)
        print("Investor Match API result:", result)
    except Exception as e:
        # In production you'd log this and hide details
        raise HTTPException(status_code=500, detail=str(e))

    # 3) Return the structured result
    result = await call_investor_match(decision)
    return result.model_dump()