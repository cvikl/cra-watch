"""Deterministic answers for CRAWATCH_FAKE_LLM=1 (tests and UI work without a key). Never used in a demo run."""
from __future__ import annotations

import json


def answer(op: str, user: str) -> str:
    if op == "sentinel-classify":
        hidden = "[[hidden:" in user
        return json.dumps({
            "risk": "high" if hidden else "low",
            "classes": ["hidden-unicode-instruction", "embedded-malicious-code"] if hidden else ["unverified-dependency"],
            "cwe": ["CWE-506", "CWE-829"] if hidden else ["CWE-829"],
            "summary": "FIXTURE: hidden Unicode-tag instruction in a file the agent read." if hidden else "FIXTURE: new dependency.",
            "evidence": ["FIXTURE evidence"], "cra_relevance": "FIXTURE: would meet Art. 14(5)(b) if the package is compromised.",
        })
    if op == "cve-triage":
        return json.dumps({
            "severity": "high", "cvss": 8.2, "vulnerability_class": "FIXTURE embedded malicious code with credential exfiltration",
            "data_at_risk": ["environment variables", "payment data"], "affected_components": ["src/payout-export.ts"],
            "article_14_applies": True, "article_14_basis": "FIXTURE: Art. 14(5)(b) introduction of malicious code.",
            "exploited_or_malicious": True, "summary": "FIXTURE triage summary.",
        })
    return "# FIXTURE early warning\n\nThis text comes from the test fixture, not from Nemotron."
