import json
from pathlib import Path
import pytest

from app.graph import run_flow
from app.models.payloads import KapsoEvent

FIXTURE = Path(__file__).parent / "data" / "sample_event.json"


@pytest.mark.asyncio
async def test_setter_scaffold_returns_placeholder():
    data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**data)
    result = await run_flow(event)
    assert result["status"] == "not-yet-implemented"
