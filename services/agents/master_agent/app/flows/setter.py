from typing import Dict, Any
from app.models.chat import ConversationContext
from app.models.payloads import KapsoEvent


async def run_setter_flow(event: KapsoEvent, context: ConversationContext) -> Dict[str, Any]:
    return {
        "reply": "Setter flow not yet implemented",
        "setter_supported": False,
    }
