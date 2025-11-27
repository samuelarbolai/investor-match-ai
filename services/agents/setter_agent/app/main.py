import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from app.routers import inbound

app = FastAPI(title="Setter Agent")

app.include_router(inbound.router)


@app.get("/healthz")
async def healthcheck():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8080"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info")
