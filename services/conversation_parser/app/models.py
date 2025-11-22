# models.py
from pydantic import BaseModel
from typing import Optional, Literal, Dict, Any

class ConversationIn(BaseModel):
    """
    Incoming payload to our microservice.
    """
    conversation: str

class LlmDecision(BaseModel):
    """
    What the LLM (or logic) returns to tell us how to call Investor Match API.
    """
    mode: Literal["post", "patch"]
    contact_id: Optional[str] = None
    body: Dict[str, Any]  # This is the JSON body for POST or PATCH

class InvestorMatchResponse(BaseModel):
    """
    What our microservice returns to the client.
    Useful for debugging and viewing results.
    """
    mode: Literal["post", "patch"]
    contact_id: Optional[str] = None
    target_url: str
    status_code: int
    backend_response: Any