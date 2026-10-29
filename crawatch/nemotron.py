"""NVIDIA Nemotron on Nebius Token Factory (OpenAI-compatible). Two tiers, chosen by task weight.

  * NANO  (``settings.nemotron_nano``)  fast, cheap: classifies Sentinel evidence and scopes a CVE. Many calls.
  * ULTRA (``settings.nemotron_ultra``) deep reasoning: drafts the Article 14 early warning from the full context. One call.

Every call records model, tokens and latency in the store. With ``CRAWATCH_FAKE_LLM=1`` (tests only) deterministic
fixtures are returned and the call is labelled ``fixture`` so a fake answer can never pass for a model answer.
"""
from __future__ import annotations

import json
import re
import time
from pathlib import Path
from typing import Any

from openai import OpenAI

from . import store
from .config import settings

PROMPTS = Path(__file__).parent / "prompts"


class NemotronError(RuntimeError):
    pass


def prompt(name: str, **vars: str) -> str:
    text = (PROMPTS / f"{name}.md").read_text(encoding="utf-8")
    for k, v in vars.items():
        text = text.replace("{{" + k + "}}", v)
    return text


_client: OpenAI | None = None


def client() -> OpenAI:
    global _client
    if _client is None:
        if not settings.nebius_api_key:
            raise NemotronError("NEBIUS_API_KEY is not set: get one at tokenfactory.nebius.com")
        _client = OpenAI(base_url=settings.nebius_base_url, api_key=settings.nebius_api_key, timeout=180.0)
    return _client


def _parse_json(text: str) -> dict[str, Any]:
    m = re.search(r"```json\s*(\{.*?\})\s*```", text, re.S) or re.search(r"(\{.*\})", text, re.S)
    if not m:
        raise NemotronError(f"model did not return JSON: {text[:200]}")
    return json.loads(m.group(1))


def chat(tier: str, system: str, user: str, *, op: str, json_schema: dict[str, Any] | None = None,
         max_tokens: int = 2000, temperature: float = 0.1) -> tuple[str, dict[str, Any]]:
    """Returns (text, meta). ``tier`` is "nano" or "ultra"."""
    model = settings.nemotron_nano if tier == "nano" else settings.nemotron_ultra
    if settings.fake_llm:
        from . import fixtures
        text = fixtures.answer(op, user)
        meta = store.record_call("nebius", op, model, 0.0, tier=tier, fixture=True, prompt_chars=len(system) + len(user))
        return text, meta
    kwargs: dict[str, Any] = {}
    if json_schema:
        kwargs["response_format"] = {"type": "json_schema", "json_schema": {"name": op.replace("-", "_"), "schema": json_schema}}
    t0 = time.time()
    try:
        r = client().chat.completions.create(
            model=model, temperature=temperature, max_tokens=max_tokens,
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}], **kwargs)
    except Exception as e:  # surfaced verbatim in the UI: the judges should see real failures, not silence
        store.record_call("nebius", op, model, time.time() - t0, tier=tier, error=str(e)[:300])
        raise NemotronError(f"{model}: {e}") from e
    text = r.choices[0].message.content or ""
    usage = getattr(r, "usage", None)
    meta = store.record_call("nebius", op, model, time.time() - t0, tier=tier,
                             prompt_tokens=getattr(usage, "prompt_tokens", None),
                             completion_tokens=getattr(usage, "completion_tokens", None))
    return text, meta


# ----------------------------------------------------------------------------- tasks
SENTINEL_SCHEMA = {
    "type": "object",
    "properties": {
        "risk": {"type": "string", "enum": ["none", "low", "medium", "high", "critical"]},
        "classes": {"type": "array", "items": {"type": "string"}},
        "cwe": {"type": "array", "items": {"type": "string"}},
        "summary": {"type": "string"},
        "evidence": {"type": "array", "items": {"type": "string"}},
        "cra_relevance": {"type": "string"},
    },
    "required": ["risk", "classes", "cwe", "summary", "evidence", "cra_relevance"],
}

TRIAGE_SCHEMA = {
    "type": "object",
    "properties": {
        "severity": {"type": "string", "enum": ["low", "medium", "high", "critical"]},
        "cvss": {"type": ["number", "null"]},
        "vulnerability_class": {"type": "string"},
        "data_at_risk": {"type": "array", "items": {"type": "string"}},
        "affected_components": {"type": "array", "items": {"type": "string"}},
        "article_14_applies": {"type": "boolean"},
        "article_14_basis": {"type": "string"},
        "exploited_or_malicious": {"type": "boolean"},
        "summary": {"type": "string"},
    },
    "required": ["severity", "cvss", "vulnerability_class", "data_at_risk", "affected_components",
                 "article_14_applies", "article_14_basis", "exploited_or_malicious", "summary"],
}


def sentinel_classify(commit: dict[str, Any], evidence: list[dict[str, Any]], snippets: str) -> dict[str, Any]:
    user = prompt("sentinel-user", commit=json.dumps({k: commit[k] for k in ("short", "subject", "session_label", "read", "wrote", "added_deps")}, indent=1),
                  findings=json.dumps(evidence, indent=1, ensure_ascii=False), snippets=snippets)
    text, meta = chat("nano", prompt("sentinel-system"), user, op="sentinel-classify", json_schema=SENTINEL_SCHEMA, max_tokens=900)
    out = _parse_json(text)
    out["model"] = meta["model"]
    out["call"] = meta["id"]
    return out


def triage(advisory: dict[str, Any], taint: dict[str, Any], prior_flags: list[dict[str, Any]]) -> dict[str, Any]:
    user = prompt("triage-user", advisory=json.dumps(advisory, indent=1, ensure_ascii=False)[:12000],
                  taint=json.dumps(_taint_brief(taint), indent=1), flags=json.dumps(prior_flags, indent=1, ensure_ascii=False)[:6000])
    text, meta = chat("nano", prompt("triage-system"), user, op="cve-triage", json_schema=TRIAGE_SCHEMA, max_tokens=900)
    out = _parse_json(text)
    out["model"] = meta["model"]
    out["call"] = meta["id"]
    return out


def draft_article14(ctx: dict[str, Any]) -> dict[str, Any]:
    user = prompt("art14-user", context=json.dumps(ctx, indent=1, ensure_ascii=False))
    text, meta = chat("ultra", prompt("art14-system"), user, op="article14-draft", max_tokens=2200, temperature=0.2)
    body = text.strip()
    if body.startswith("```"):
        body = re.sub(r"^```[a-z]*\n|\n```$", "", body.strip())
    return {"text": body, "model": meta["model"], "call": meta["id"], "elapsed_s": meta["elapsed_s"],
            "prompt_tokens": meta.get("prompt_tokens"), "completion_tokens": meta.get("completion_tokens")}


def _taint_brief(t: dict[str, Any]) -> dict[str, Any]:
    return {
        "needle": t["needle"],
        "affected": [{"commit": c["short"], "session": c["session_label"], "subject": c["subject"], "wrote": c["wrote"],
                      "matched": c["matched"], "approver": c["approver"], "approved_at": c["approved_at"]} for c in t["affected"]],
        "sessions": t["session_labels"], "files_written": t["files_written"], "approvers": t["approvers"],
        "first_read": t["first_read"], "rollback_commit": t["rollback_short"],
    }
