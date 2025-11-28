from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class MessageContext:
    role: str
    content: str
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class ConversationContext:
    id: str
    agent_slug: str
    summary: str
    prompt_version: Optional[str]
    recent_messages: List[MessageContext]
