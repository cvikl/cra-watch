"""Fixture-mode tests: no network, no keys. Run with CRAWATCH_FAKE_LLM=1 (conftest sets it)."""
import json

from fastapi.testclient import TestClient

from crawatch import origit_bridge as O, pipeline, sentinel, store
from crawatch.monitor import _is_match
from crawatch.web import app


def test_taint_finds_fast_pay_utils():
    t = O.taint("fast-pay-utils")
    assert t["affected"], "demo repo must have tainted commits"
    assert "#42" in t["session_labels"]
    assert t["rollback_short"]


def test_sentinel_flags_hidden_instruction():
    flags = sentinel.run()
    high = [f for f in flags if f["risk"] in ("high", "critical")]
    assert high, "the vendored package carries a Unicode-tag instruction; Sentinel must flag it"
    assert any("hidden-unicode-instruction" in (f["classes"] or []) for f in high)


def test_match_requires_name_and_identifier():
    dep = {"name": "fast-pay-utils"}
    gh = "https://github.com/advisories/GHSA-demo-f4st-pay0-2100"
    assert _is_match(dep, "Malicious code in fast-pay-utils 2.1.0", "GHSA-demo-f4st-pay0-2100", gh) == "GHSA-DEMO-F4ST-PAY0-2100"
    assert _is_match(dep, "Vendor bulletin", "see GHSA-demo-f4st-pay0-2100", "https://x/advisories/fast-pay-utils.md", bulletin=True) == "GHSA-DEMO-F4ST-PAY0-2100"
    assert _is_match(dep, "fast-pay-utils release notes", "fast-pay-utils is great", "https://osv.dev/list") is None  # no identifier
    assert _is_match(dep, "Weekly npm advisories", "lodash CVE-2026-1234, fast-pay-utils, express", "https://nvd.nist.gov/weekly") is None  # mentioned, not about
    assert _is_match(dep, "fast-pay-utils CVE-2026-1", "", "https://github.com/x/y/issues/1") is None  # an issue tracker is not an advisory source
    assert _is_match({"name": "jest"}, "jest-config-ibm 1.0: CVE-2026-33750", "", "https://osv.dev/x") is None  # substring, not the package
    assert _is_match({"name": "typescript"}, "modelcontextprotocol/typescript-sdk CVE-2026-104850", "", "https://osv.dev/x") is None


def test_deadlines():
    d = pipeline.deadlines("2026-10-30T10:00:00Z")
    assert d["early_warning_24h"] == "2026-10-31T10:00:00Z"
    assert d["notification_72h"] == "2026-11-02T10:00:00Z"


def test_api_state_and_approve_flow():
    c = TestClient(app)
    assert c.get("/healthz").text == "ok"
    s = c.get("/api/state").json()
    assert s["commits"] and s["watchlist"]
    inc = pipeline.open_incident({"name": "fast-pay-utils", "version": "2.1.0"},
                                 {"title": "demo", "url": None, "content": "fast-pay-utils GHSA-demo-f4st-pay0-2100", "advisory_id": "GHSA-DEMO"}, "test")
    r = c.post(f"/api/incidents/{inc['id']}/approve")
    assert r.status_code == 409  # not yet in review
    assert c.get(f"/api/taint/fast-pay-utils").json()["affected"]
    assert c.get("/").status_code == 200
