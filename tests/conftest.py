import os
import tempfile

os.environ["CRAWATCH_FAKE_LLM"] = "1"
os.environ["TAVILY_API_KEY"] = os.environ.get("TAVILY_API_KEY", "test")
_tmp = tempfile.mkdtemp(prefix="crawatch-test-")
os.environ["CRAWATCH_DATA"] = _tmp
os.environ["CRAWATCH_REPO"] = os.path.join(_tmp, "payments-api")
