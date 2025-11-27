from typing import Optional, Dict, Any
from pydantic import BaseModel


class KapsoMessage(BaseModel):
    id: str
    body: str
    type: str
    created_at: str


class KapsoEvent(BaseModel):
    event_type: str
    conversation_id: str
    owner_id: str
    contact_id: str
    phone_number: str
    messages: list[KapsoMessage]
    metadata: Optional[Dict[str, Any]] = None
