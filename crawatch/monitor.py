"""The background monitor: polls advisory sources for every watched dependency and fires the pipeline on a match.

Deployed as a Nebius Serverless Job (see nebius/monitor-job.sh): the container runs ``cra-watch monitor --loop``
for the job's lifetime and polls every ``CRAWATCH_MONITOR_INTERVAL`` seconds. Each watched dependency has two feeds:
Tavily search over the advisory databases (NVD, GitHub Advisories, OSV, vendor bulletins) and, optionally, vendor
bulletin URLs that are read in full with Tavily extract. A match is an advisory that names the package and carries
a CVE or GHSA identifier.
"""
from __future__ import annotations

import re
import time
from typing import Any

from . import pipeline, store, tavily_client as TV
from .config import settings

ADVISORY_ID = re.compile(r"\b(CVE-\d{4}-\d{4,}|GHSA(?:-[0-9a-z]{4}){3,4})\b", re.I)


def default_watchlist() -> list[dict[str, Any]]:
    from . import origit_bridge as O
    items = []
    for d in O.dependencies():
        bulletins = [settings.demo_bulletin] if d["name"] == settings.demo_dependency and settings.demo_bulletin else []
        items.append({"name": d["name"], "version": d["version"], "registry": d["registry"], "added_in": d["added_in"],
                      "bulletins": bulletins, "enabled": True, "last_checked": None, "last_result": None})
    return items


def watchlist() -> list[dict[str, Any]]:
    wl = store.watchlist()
    if not wl:
        wl = default_watchlist()
        store.set_watchlist(wl)
    return wl


ADVISORY_SOURCE = re.compile(
    r"^https?://(nvd\.nist\.gov|osv\.dev|www\.cve\.org|cve\.org|security\.snyk\.io|socket\.dev)/"
    r"|^https?://github\.com/(advisories/|[^/]+/[^/]+/security/advisories/)", re.I)


def _names_package(name: str, text: str) -> bool:
    """Whole-word match: `jest` must not match `jest-config-...`, `typescript` must not match `typescript-sdk`."""
    return re.search(r"(?<![\w@/.-])" + re.escape(name.lower()) + r"(?![\w-])", (text or "").lower()) is not None


def _is_match(dep: dict[str, Any], title: str, text: str, url: str, *, bulletin: bool = False) -> str | None:
    """An advisory is about the package when it comes from an advisory source (or a registered vendor bulletin),
    names the package as a whole word in its title or URL, and carries a CVE or GHSA identifier. A body mention is
    not enough: generic advisory pages list dozens of packages, and issue trackers discuss false positives."""
    if not bulletin and not ADVISORY_SOURCE.match(url or ""):
        return None
    if not (_names_package(dep["name"], title) or _names_package(dep["name"], url)):
        return None
    m = ADVISORY_ID.search(f"{title}\n{text}\n{url}")
    return m.group(1).upper() if m else None


def check(dep: dict[str, Any]) -> dict[str, Any] | None:
    """One poll for one dependency. Returns the match (advisory dict) or None."""
    candidates: list[dict[str, Any]] = []
    for url in dep.get("bulletins", []):
        for r in TV.extract([url], op="bulletin-extract"):
            candidates.append({"title": f"Vendor bulletin for {dep['name']}", "url": r["url"], "content": r["text"][:4000],
                               "full_text": r["text"], "feed": "bulletin"})
    for r in TV.search_advisories(dep["name"], dep.get("version")):
        candidates.append({**r, "feed": "search"})
    for c in candidates:
        aid = _is_match(dep, c.get("title") or "", c.get("full_text") or c.get("content") or "", c.get("url") or "",
                        bulletin=c.get("feed") == "bulletin")
        if aid:
            c["advisory_id"] = aid
            return c
    return None


def already_open(dep_name: str) -> bool:
    return any(i["dependency"] == dep_name and i["status"] not in ("filed", "failed") for i in store.incidents())


def run_once(run_pipeline: bool = True) -> list[dict[str, Any]]:
    opened = []
    wl = watchlist()
    store.emit("monitor", f"Monitor poll: {sum(1 for d in wl if d.get('enabled', True))} watched dependencies", stage="monitor")
    for dep in wl:
        if not dep.get("enabled", True):
            continue
        dep["last_checked"] = store.now()
        try:
            match = check(dep)
        except Exception as e:
            dep["last_result"] = f"error: {e}"
            store.emit("monitor", f"{dep['name']}: feed error {e}", stage="monitor")
            continue
        if not match:
            dep["last_result"] = "no advisory"
            store.emit("monitor", f"{dep['name']}: no advisory matched", stage="monitor")
            continue
        dep["last_result"] = match["advisory_id"]
        if already_open(dep["name"]):
            store.emit("monitor", f"{dep['name']}: {match['advisory_id']} already has an open incident", stage="monitor")
            continue
        inc = pipeline.open_incident(dep, match, source=match["feed"])
        opened.append(inc)
        store.set_watchlist(wl)
        if run_pipeline:
            pipeline.run(inc)
    store.set_watchlist(wl)
    return opened


def loop(interval_s: int | None = None) -> None:
    interval = interval_s or settings.monitor_interval_s
    while True:
        run_once()
        time.sleep(interval)
