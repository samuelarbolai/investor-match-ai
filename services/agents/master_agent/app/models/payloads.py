from typing import Optional, Dict, Any
from pydantic import BaseModel


class KapsoMessage(BaseModel):
    id: str
    body: Optional[str] = None
    type: str
    direction: Optional[str] = None
    created_at: Optional[str] = None


class KapsoEvent(BaseModel):
    event_type: str
    conversation_id: str
    owner_id: Optional[str] = None
    contact_id: Optional[str] = None
    phone_number: Optional[str] = None
    messages: list[KapsoMessage]
    metadata: Optional[Dict[str, Any]] = None
