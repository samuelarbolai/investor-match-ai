import base64
import json
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class PubSubMessage(BaseModel):
    data: str
    attributes: Optional[Dict[str, str]] = None
    message_id: Optional[str] = None
    messageId: Optional[str] = Field(default=None, alias="messageId")
    publish_time: Optional[str] = Field(default=None, alias="publishTime")
    publishTime: Optional[str] = Field(default=None, alias="publishTimeAlt")

    def decode_data(self) -> Dict[str, Any]:
        """
        Decode the base64 payload into a JSON dict.
        """
        raw = base64.b64decode(self.data).decode("utf-8")
        return json.loads(raw)

    @property
    def effective_message_id(self) -> Optional[str]:
        return self.message_id or self.messageId


class PubSubEnvelope(BaseModel):
    message: PubSubMessage
    subscription: Optional[str] = None


class StageEventPayload(BaseModel):
    event: str
    owner_id: str
    target_ids: List[str]
    previous_stage: Optional[str] = None
    new_stage: str
    changed_at: str
    phone_number: Optional[str] = None
    phone_number_id: Optional[str] = None
    prospects: Optional[List[Dict[str, Any]]] = None
    flow: Optional[str] = None

    def to_metadata(self) -> Dict[str, Any]:
        metadata: Dict[str, Any] = {
            "flow": self.flow,
            "prospects": self.prospects or [],
            "stage_event": {
                "owner_id": self.owner_id,
                "target_ids": self.target_ids,
                "previous_stage": self.previous_stage,
                "new_stage": self.new_stage,
                "changed_at": self.changed_at,
            },
            "phone_number_id": self.phone_number_id,
        }
        return {key: value for key, value in metadata.items() if value is not None}
