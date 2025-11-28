from .onboarding import run_onboarding_flow
from .campaign import run_campaign_flow
from .feedback import run_feedback_flow
from .setter import run_setter_flow

def get_flow_runner(flow: str):
    mapping = {
        "onboarding": run_onboarding_flow,
        "campaign_proposal": run_campaign_flow,
        "feedback": run_feedback_flow,
        "setter": run_setter_flow,
    }
    return mapping.get(flow, run_onboarding_flow)
