"""Tavily is the intelligence layer: it finds advisories, reads them in full and pulls the regulatory text.

Three uses, all visible in the UI and in the call log:
  * ``search_advisories(dependency)``   real-time search over NVD, GitHub Advisories, OSV, vendor bulletins
  * ``extract(urls)``                   full text of an advisory or bulletin (what the Ultra prompt reads)
  * ``background(query)``               analysis of the vulnerability class and the CRA Article 14 guidance
Every call is recorded with its latency and result count.
"""
from __future__ import annotations

import time
from typing import Any

import httpx

from . import store
from .config import settings

API = "https://api.tavily.com"
ADVISORY_DOMAINS = ["nvd.nist.gov", "github.com", "osv.dev", "cve.org", "security.snyk.io", "socket.dev", "npmjs.com"]
CRA_DOMAINS = ["eur-lex.europa.eu", "digital-strategy.ec.europa.eu", "enisa.europa.eu", "europa.eu"]


class TavilyError(RuntimeError):
    pass


def _post(path: str, body: dict[str, Any], timeout: float = 60.0) -> dict[str, Any]:
    if not settings.tavily_api_key:
        raise TavilyError("TAVILY_API_KEY is not set")
    headers = {"Authorization": f"Bearer {settings.tavily_api_key}", "Content-Type": "application/json"}
    r = httpx.post(API + path, json=body, headers=headers, timeout=timeout)
    if r.status_code >= 400:
        raise TavilyError(f"Tavily {path} failed: {r.status_code} {r.text[:200]}")
    return r.json()


def search(query: str, *, domains: list[str] | None = None, max_results: int = 6, depth: str = "advanced",
           time_range: str | None = None, topic: str = "general", op: str = "search") -> list[dict[str, Any]]:
    body: dict[str, Any] = {"query": query, "search_depth": depth, "max_results": max_results, "topic": topic,
                            "include_answer": False, "include_raw_content": False}
    if domains:
        body["include_domains"] = domains
    if time_range:
        body["time_range"] = time_range
    t0 = time.time()
    data = _post("/search", body)
    results = [{"title": r.get("title"), "url": r.get("url"), "content": r.get("content", ""), "score": r.get("score")}
               for r in data.get("results", [])]
    store.record_call("tavily", op, None, time.time() - t0, query=query, results=len(results),
                      urls=[r["url"] for r in results])
    return results


def extract(urls: list[str], op: str = "extract") -> list[dict[str, Any]]:
    """Full page text for each URL (markdown). Used for the advisory, the vendor bulletin and the CRA text."""
    t0 = time.time()
    data = _post("/extract", {"urls": urls, "extract_depth": "advanced", "format": "markdown"}, timeout=90.0)
    out = [{"url": r.get("url"), "text": r.get("raw_content", "")} for r in data.get("results", [])]
    failed = [f.get("url") for f in data.get("failed_results", [])]
    store.record_call("tavily", op, None, time.time() - t0, urls=urls, extracted=len(out), failed=failed,
                      chars=sum(len(r["text"]) for r in out))
    return out


def search_advisories(name: str, version: str | None = None) -> list[dict[str, Any]]:
    q = f'"{name}" {version or ""} security advisory CVE vulnerability'.strip()
    return search(q, domains=ADVISORY_DOMAINS, max_results=8, op="advisory-search", time_range="month")


def background(vuln_class: str) -> list[dict[str, Any]]:
    return search(f"{vuln_class} npm supply chain attack analysis", max_results=5, op="class-background")


def cra_guidance() -> list[dict[str, Any]]:
    q = "Cyber Resilience Act Article 14 early warning 24 hours ENISA notification actively exploited vulnerability severe incident"
    return search(q, domains=CRA_DOMAINS, max_results=5, op="cra-guidance")
