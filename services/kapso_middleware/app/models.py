from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any, List

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