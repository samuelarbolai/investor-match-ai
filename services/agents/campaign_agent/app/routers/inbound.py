from fastapi import APIRouter
from app.graph import run_flow
from app.models.payloads import KapsoEvent

router = APIRouter(prefix="/agents/campaign", tags=["campaign"])


@router.post("/proposals")
async def proposals(event: KapsoEvent):
    return await run_flow(event)


@router.post("/invoke")
async def invoke(event: KapsoEvent):
    return await run_flow(event)
