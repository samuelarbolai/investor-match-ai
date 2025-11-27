from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class KapsoText(BaseModel):
    body: str


class KapsoMessage(BaseModel):
    id: str
    from_: Optional[str] = Field(default=None, alias="from")
    text: Optional[KapsoText] = None
    type: str
    timestamp: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    kapso: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(populate_by_name=True)

    def body_text(self) -> Optional[str]:
        if self.text and self.text.body:
            return self.text.body
        if isinstance(self.kapso, dict):
            return self.kapso.get("last_message_text")
        return None


class KapsoConversation(BaseModel):
    id: str
    contact_name: Optional[str] = None
    phone_number: Optional[str] = None
    kapso: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    status: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    last_active_at: Optional[str] = None
    phone_number_id: Optional[str] = None


class KapsoEventEntry(BaseModel):
    message: KapsoMessage
    conversation: KapsoConversation
    phone_number_id: str
    is_new_conversation: bool


class KapsoBatchPayload(BaseModel):
    type: str
    data: List[KapsoEventEntry]
    batch: Optional[bool] = None
    batch_info: Optional[Dict[str, Any]] = None


class KapsoConversationEventPayload(BaseModel):
    conversation: KapsoConversation
    phone_number_id: str


class NormalizedMessage(BaseModel):
    id: str
    body: Optional[str] = None
    type: str
    direction: str
    timestamp: Optional[str] = None
    raw: Dict[str, Any] = Field(default_factory=dict)


class NormalizedKapsoEvent(BaseModel):
    event_type: str
    conversation_id: Optional[str] = None
    owner_id: Optional[str] = None
    contact_id: Optional[str] = None
    phone_number: Optional[str] = None
    phone_number_id: Optional[str] = None
    messages: List[NormalizedMessage] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    headers: Dict[str, str] = Field(default_factory=dict)
    idempotency_key: Optional[str] = None
    batch: bool = False


class KapsoWebhook(BaseModel):
    """
    Accept either the batch format with `type` + `data`
    or the single conversation event payload.
    """

    batch_payload: Optional[KapsoBatchPayload] = None
    conversation_event: Optional[KapsoConversationEventPayload] = None

    @classmethod
    def parse_raw_payload(cls, raw_json: str) -> "KapsoWebhook":
        try:
            return cls(batch_payload=KapsoBatchPayload.model_validate_json(raw_json))
        except Exception:
            pass

        return cls(
            conversation_event=KapsoConversationEventPayload.model_validate_json(
                raw_json
            )
        )

    def to_normalized(self, headers: Dict[str, str]) -> NormalizedKapsoEvent:
        event_type = headers.get("x-webhook-event", "")
        idempotency_key = headers.get("x-idempotency-key")
        base_metadata: Dict[str, Any] = {
            "headers": headers,
        }
        messages: List[NormalizedMessage] = []
        conversation_id = None
        phone_number = None
        phone_number_id = None
        owner_id = None
        contact_id = None

        def normalize_entry(entry: KapsoEventEntry) -> None:
            nonlocal conversation_id, phone_number, phone_number_id, owner_id, contact_id
            message = entry.message
            direction = (message.kapso or {}).get("direction", "inbound")
            normalized = NormalizedMessage(
                id=message.id,
                body=message.body_text(),
                type=message.type,
                direction=direction,
                timestamp=message.timestamp,
                raw=message.model_dump(mode="json"),
            )
            messages.append(normalized)
            conversation = entry.conversation
            conversation_id = conversation.id
            phone_number = phone_number or conversation.phone_number
            phone_number_id = entry.phone_number_id or conversation.phone_number_id
            meta = conversation.metadata or {}
            base_metadata.setdefault("conversation_metadata", meta)
            if meta.get("flow") and "flow" not in base_metadata:
                base_metadata["flow"] = meta["flow"]
            owner_id = owner_id or meta.get("owner_id") or meta.get("owner_slug")
            contact_id = contact_id or meta.get("contact_id") or meta.get("target_id")

        if self.batch_payload:
            base_metadata["batch_info"] = self.batch_payload.batch_info or {}
            base_metadata["kapso_type"] = self.batch_payload.type
            for entry in self.batch_payload.data:
                normalize_entry(entry)
        elif self.conversation_event:
            base_metadata["kapso_type"] = "conversation_event"
            conv = self.conversation_event.conversation
            conversation_id = conv.id
            phone_number_id = self.conversation_event.phone_number_id
            phone_number = conv.phone_number
            meta = conv.metadata or {}
            base_metadata.setdefault("conversation_metadata", meta)
            if meta.get("flow") and "flow" not in base_metadata:
                base_metadata["flow"] = meta["flow"]
            owner_id = meta.get("owner_id") or meta.get("owner_slug")
            contact_id = meta.get("contact_id") or meta.get("target_id")
            last_message_text = (conv.kapso or {}).get("last_message_text")
            messages.append(
                NormalizedMessage(
                    id=f"{conversation_id}-latest",
                    body=last_message_text,
                    type="text",
                    direction=(conv.kapso or {}).get("direction", "inbound"),
                    timestamp=(conv.kapso or {}).get("last_message_timestamp"),
                    raw=conv.model_dump(mode="json"),
                )
            )

        return NormalizedKapsoEvent(
            event_type=event_type,
            conversation_id=conversation_id,
            owner_id=owner_id,
            contact_id=contact_id,
            phone_number=phone_number,
            phone_number_id=phone_number_id,
            messages=messages,
            metadata=base_metadata,
            headers=headers,
            idempotency_key=idempotency_key,
            batch=bool(self.batch_payload and len(self.batch_payload.data) > 1),
        )
