from fastapi import APIRouter
from app.graph import run_flow
from app.models.payloads import KapsoEvent

router = APIRouter(prefix="/agents/feedback", tags=["feedback"])


@router.post("/inbound")
async def inbound(event: KapsoEvent):
    return await run_flow(event)


@router.post("/invoke")
async def invoke(event: KapsoEvent):
    return await run_flow(event)
