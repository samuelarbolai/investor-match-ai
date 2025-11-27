import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

os.environ.setdefault("SUPABASE_URL", "https://supabase.local")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "service_role_dummy")
os.environ.setdefault("KAPSO_API_KEY", "test_kapso")
os.environ.setdefault("KAPSO_BASE_URL", "https://kapso.local/")
os.environ.setdefault("IM_API_BASE_URL", "https://api.local")
os.environ.setdefault("OPENAI_API_KEY", "test-openai")
os.environ.setdefault("SUPABASE_ALLOW_MOCKS", "true")
