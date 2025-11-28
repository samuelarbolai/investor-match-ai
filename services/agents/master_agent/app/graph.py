from app.flows import get_flow_runner
from app.models.payloads import KapsoEvent


async def run_flow(event: KapsoEvent):
    print("master agent routing inbound event")
    flow = (event.metadata or {}).get("flow") if event.metadata else None
    runner = get_flow_runner(flow or "onboarding")
    return await runner(event)
