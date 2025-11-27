from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.models.payloads import KapsoEvent

router = APIRouter(prefix="/agents/setter", tags=["setter"])


@router.post("/inbound")
async def inbound(_event: KapsoEvent):
    return JSONResponse({"status": "not-yet-implemented"})


@router.post("/invoke")
async def invoke(_event: KapsoEvent):
    return JSONResponse({"status": "not-yet-implemented"})
