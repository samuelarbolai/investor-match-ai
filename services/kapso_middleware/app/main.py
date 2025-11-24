import logging
import traceback
import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from .models import KapsoWebhook
from .transcript import build_transcript
from .parser_client import send_to_parser
from .config import settings

app = FastAPI()
logger = logging.getLogger("chat-orchestration")
logging.basicConfig(level=logging.INFO)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error("❌ Validation error at %s: %s", request.url.path, exc.errors())
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.post("/webhooks/kapso")
async def kapso_webhook(request: Request):
    print("📨 Incoming Kapso request headers:")
    for k, v in request.headers.items():
        print(f"  {k}: {v}")

    raw_body = await request.body()
    raw_text = raw_body.decode("utf-8")
    print("\n==============================")
    print("🔥 RAW KAPSO WEBHOOK BODY:")
    print(raw_text or "[EMPTY]")
    print("==============================\n")

    if not raw_text.strip():
          print("❌ Empty body received.")
          raise HTTPException(status_code=400, detail="Body empty")

    try:
        payload = KapsoWebhook.parse_raw_payload(raw_text)
    except Exception as exc:
        print("❌ ERROR parsing Kapso payload:")
        print(str(exc))
        print(traceback.format_exc())
        raise HTTPException(status_code=422, detail=f"Invalid payload:{str(exc)}")

    if settings.log_bodies:
        print("🧾 Parsed Kapso payload:")
        print(payload.model_dump_json())

    transcript = build_transcript(payload)
    print("🧵 BUILT TRANSCRIPT:")
    print(transcript or "[EMPTY]")

    if not transcript:
        print("❌ Transcript was empty, rejecting request.")
        raise HTTPException(status_code=400, detail="Conversation transcript empty")

    try:
        print("📤 SENDING PAYLOAD TO PARSER:")
        print({"conversation": transcript})
        parser_resp = await send_to_parser(transcript)
        print("📥 PARSER RESPONSE:")
        print(parser_resp)
    except Exception as exc:
        print("❌ PARSER CALL FAILED:")
        print(str(exc))
        print(traceback.format_exc())
        raise HTTPException(status_code=502, detail=str(exc))

    return JSONResponse({"status": "queued", "parser_response": parser_resp})
