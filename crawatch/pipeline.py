"""The incident pipeline: advisory match -> Origit taint -> Nemotron Nano triage -> Tavily context -> Nemotron Ultra draft.

Runs synchronously (it is called from the monitor job or from the review UI) and narrates every step into the event
log so the UI can show the pipeline live. The CRA clock starts at ``awareness`` (first detection); the three Article 14
deadlines are computed from it and travel with the incident.
"""
from __future__ import annotations

import datetime as dt
import traceback
from typing import Any

from . import nemotron, origit_bridge as O, sentinel, store, tavily_client as TV
from .config import settings


def deadlines(awareness: str) -> dict[str, str]:
    t = dt.datetime.strptime(awareness, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=dt.timezone.utc)
    f = lambda d: d.strftime("%Y-%m-%dT%H:%M:%SZ")
    return {"early_warning_24h": f(t + dt.timedelta(hours=24)), "notification_72h": f(t + dt.timedelta(hours=72)),
            "final_report_1m": f(t + dt.timedelta(days=30))}


def open_incident(dep: dict[str, Any], match: dict[str, Any], source: str) -> dict[str, Any]:
    inc = {
        "id": store.new_id("inc"), "opened_at": store.now(), "awareness": store.now(), "status": "detected",
        "dependency": dep["name"], "version": dep.get("version"), "advisory": match, "source": source,
        "steps": [], "taint": None, "prior_flags": [], "triage": None, "context": {}, "draft": None,
        "approved_at": None, "approved_by": None, "error": None,
    }
    inc["deadlines"] = deadlines(inc["awareness"])
    store.put_incident(inc)
    store.emit("detect", f"Advisory matched watched dependency {dep['name']}: {match.get('title') or match.get('url')}",
               stage="detect", incident=inc["id"], url=match.get("url"))
    return inc


def _step(inc: dict[str, Any], name: str, text: str, **data: Any) -> None:
    inc["steps"].append({"name": name, "at": store.now(), "text": text, **data})
    inc["status"] = name
    store.put_incident(inc)
    store.emit(name, text, stage=name, incident=inc["id"], **data)


def run(inc: dict[str, Any]) -> dict[str, Any]:
    try:
        return _run(inc)
    except Exception as e:  # the incident keeps the error; the UI shows it next to the step that failed
        inc["error"] = f"{type(e).__name__}: {e}"
        inc["status"] = "failed"
        store.put_incident(inc)
        store.emit("error", f"Pipeline failed: {inc['error']}", stage="error", incident=inc["id"], trace=traceback.format_exc()[-1500:])
        raise


def _run(inc: dict[str, Any]) -> dict[str, Any]:
    dep = inc["dependency"]
    # 1. Provenance: which agent commits are downstream of the dependency (milliseconds, deterministic)
    t = O.taint(dep)
    inc["taint"] = t
    inc["prior_flags"] = sentinel.flags_for([c["sha"] for c in t["affected"]])
    lead = ""
    if inc["prior_flags"]:
        first = min(f["scanned_at"] for f in inc["prior_flags"])
        secs = (dt.datetime.strptime(inc["awareness"], "%Y-%m-%dT%H:%M:%SZ") - dt.datetime.strptime(first, "%Y-%m-%dT%H:%M:%SZ")).total_seconds()
        lead = f" {int(secs // 3600)} h {int(secs % 3600 // 60)} min" if secs >= 3600 else f" {int(secs // 60)} min {int(secs % 60)} s"
        lead += " before the advisory"
    _step(inc, "trace", f"Origit taint: {len(t['affected'])} commits across sessions {', '.join(t['session_labels']) or 'none'}; "
                        f"{len(t['files_written'])} files written; rollback {t['rollback_short'] or 'n/a'}; "
                        f"{len(inc['prior_flags'])} of them already flagged by Sentinel{lead}",
          affected=len(t["affected"]), sessions=t["session_labels"], rollback=t["rollback_short"], prior_flags=len(inc["prior_flags"]))

    # 2. Read the advisory in full (Tavily extract) so the models work from the real text, not a snippet
    adv = inc["advisory"]
    if adv.get("url"):
        ex = TV.extract([adv["url"]], op="advisory-extract")
        if ex and ex[0]["text"]:
            adv["full_text"] = ex[0]["text"][:20000]
    _step(inc, "read", f"Tavily extracted the advisory in full ({len(adv.get('full_text') or adv.get('content') or '')} chars)",
          url=adv.get("url"))

    # 3. Nano triage: severity, class, data at risk, does Article 14 apply
    tri = nemotron.triage({k: adv.get(k) for k in ("title", "url", "content", "full_text")}, t, inc["prior_flags"])
    inc["triage"] = tri
    _step(inc, "triage", f"Nemotron Nano: {tri['severity'].upper()}, {tri['vulnerability_class']}; Article 14 "
                         f"{'applies' if tri['article_14_applies'] else 'does not apply'}: {tri['article_14_basis']}",
          severity=tri["severity"], model=tri["model"])

    # 4. Tavily context for the drafter: vulnerability-class background and the CRA Article 14 guidance
    ctx_class = TV.background(tri["vulnerability_class"])
    ctx_cra = TV.cra_guidance()
    inc["context"] = {"class_background": ctx_class, "cra_guidance": ctx_cra}
    _step(inc, "context", f"Tavily: {len(ctx_class)} sources on the vulnerability class, {len(ctx_cra)} on CRA Article 14",
          sources=[r["url"] for r in ctx_class + ctx_cra])

    # 5. Ultra drafts the early warning from everything above
    context = {
        "manufacturer": settings.manufacturer, "product": settings.product_name,
        "awareness": inc["awareness"], "deadlines": {**inc["deadlines"], "note": "early warning 24 h and notification 72 h run from awareness; the final report is due one month after the corrective measure is available, the date given is indicative"},
        "advisory": {"title": adv.get("title"), "url": adv.get("url"), "text": (adv.get("full_text") or adv.get("content") or "")[:12000]},
        "triage": {k: v for k, v in tri.items() if k not in ("model", "call")},
        "taint": nemotron._taint_brief(t), "prior_sentinel_flags": inc["prior_flags"],
        "web_background_on_vulnerability_class_from_tavily": [{"title": r["title"], "url": r["url"], "excerpt": r["content"][:700]} for r in ctx_class],
        "cra_article_14_guidance_from_tavily": [{"title": r["title"], "url": r["url"], "excerpt": r["content"][:700]} for r in ctx_cra],
    }
    draft = nemotron.draft_article14(context)
    inc["draft"] = draft
    _step(inc, "draft", f"Nemotron Ultra drafted the Article 14(4)(a) early warning in {draft['elapsed_s']} s", model=draft["model"])
    inc["status"] = "review"
    store.put_incident(inc)
    store.emit("review", "Draft ready for human review", stage="review", incident=inc["id"])
    return inc


def approve(iid: str, by: str = "reviewer") -> dict[str, Any]:
    inc = store.incident(iid)
    if not inc or inc["status"] != "review":
        raise ValueError("incident is not awaiting review")
    inc["status"] = "filed"
    inc["approved_at"] = store.now()
    inc["approved_by"] = by
    store.put_incident(inc)
    elapsed = (dt.datetime.strptime(inc["approved_at"], "%Y-%m-%dT%H:%M:%SZ") - dt.datetime.strptime(inc["awareness"], "%Y-%m-%dT%H:%M:%SZ")).total_seconds()
    store.emit("filed", f"Early warning approved and filed {int(elapsed // 60)} min {int(elapsed % 60)} s after awareness; "
                        f"{int((24 * 3600 - elapsed) // 3600)} h of the 24 h window left", stage="filed", incident=iid)
    return inc
