import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.routers import webhooks, internal

logger = logging.getLogger("kapso-middleware")
logging.basicConfig(level=logging.INFO)

def create_app() -> FastAPI:
    application = FastAPI()
    application.include_router(webhooks.router)
    application.include_router(internal.router)
    return application

app = create_app()

@app.get("/health")
async def health():
    return {"status": "ok"}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error("Validation error at %s: %s", request.url.path, exc.errors())
    return JSONResponse(status_code=422, content={"detail": exc.errors()})

print("Kapso Middleware service is starting...")
