"""Review UI and API. One page, live over server-sent events; every mutating call runs in a worker thread."""
from __future__ import annotations

import asyncio
import json
import queue
import threading
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from . import __version__, monitor, origit_bridge as O, pipeline, sentinel, store
from .config import settings

HERE = Path(__file__).parent
app = FastAPI(title="CRA Watch", version=__version__)
app.mount("/static", StaticFiles(directory=str(HERE / "static")), name="static")
templates = Jinja2Templates(directory=str(HERE / "templates"))

_jobs: dict[str, threading.Thread] = {}


def _background(name: str, fn, *args) -> bool:
    """Run fn in a thread unless a job with that name is still running. Returns whether it started."""
    t = _jobs.get(name)
    if t and t.is_alive():
        return False
    t = threading.Thread(target=fn, args=args, daemon=True, name=name)
    _jobs[name] = t
    t.start()
    return True


def _require_token(request: Request) -> None:
    if settings.review_token and request.headers.get("x-crawatch-token") != settings.review_token:
        raise HTTPException(401, "review token required")


# ----------------------------------------------------------------------------- pages
@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse(request, "index.html", {"version": __version__, "product": settings.product_name})


@app.get("/healthz", response_class=PlainTextResponse)
def healthz():
    return "ok"


# ----------------------------------------------------------------------------- state
def state() -> dict[str, Any]:
    O.ensure_repo()
    flags = store.flags()
    commits = O.agent_commits()
    for c in commits:
        f = flags.get(c["sha"])
        c["flag"] = {k: f[k] for k in ("risk", "classes", "cwe", "summary", "evidence", "cra_relevance", "scanned_at", "model", "findings")} if f else None
    return {
        "product": settings.product_name, "manufacturer": settings.manufacturer, "now": store.now(),
        "config": {"nebius": settings.nebius_ready, "tavily": settings.tavily_ready, "nano": settings.nemotron_nano,
                   "ultra": settings.nemotron_ultra, "fake_llm": settings.fake_llm, "interval_s": settings.monitor_interval_s},
        "jobs": {k: t.is_alive() for k, t in _jobs.items()},
        "watchlist": monitor.watchlist(), "commits": commits, "incidents": store.incidents()[::-1],
        "events": store.events(300), "calls": store.calls()[-200:],
    }


@app.get("/api/state")
def api_state():
    return state()


@app.get("/api/events")
async def api_events(request: Request):
    """Server-sent events: every store.emit() is pushed to the page as it happens."""
    q: queue.Queue = queue.Queue()
    unsub = store.subscribe(q.put)

    async def gen():
        try:
            yield "event: hello\ndata: {}\n\n"
            while True:
                if await request.is_disconnected():
                    break
                try:
                    ev = q.get_nowait()
                    yield f"data: {json.dumps(ev)}\n\n"
                except queue.Empty:
                    await asyncio.sleep(0.25)
                    yield ": keepalive\n\n"
        finally:
            unsub()

    return StreamingResponse(gen(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


# ----------------------------------------------------------------------------- actions
@app.post("/api/sentinel/run")
def api_sentinel(request: Request):
    _require_token(request)
    if not settings.nebius_ready:
        raise HTTPException(503, "Nebius Token Factory is not configured (NEBIUS_API_KEY)")
    started = _background("sentinel", sentinel.run)
    return {"started": started}


@app.post("/api/monitor/run")
def api_monitor(request: Request):
    _require_token(request)
    if not settings.tavily_ready:
        raise HTTPException(503, "Tavily is not configured (TAVILY_API_KEY)")
    started = _background("monitor", monitor.run_once)
    return {"started": started}


@app.post("/api/watchlist")
def api_watchlist(request: Request, body: dict[str, Any]):
    """Add or update a watched dependency: {name, version?, bulletins?: [url], enabled?}."""
    _require_token(request)
    wl = monitor.watchlist()
    item = next((d for d in wl if d["name"] == body["name"]), None)
    if not item:
        item = {"name": body["name"], "version": body.get("version"), "registry": body.get("registry", "npm"), "added_in": None,
                "bulletins": [], "enabled": True, "last_checked": None, "last_result": None}
        wl.append(item)
    for k in ("version", "bulletins", "enabled"):
        if k in body:
            item[k] = body[k]
    store.set_watchlist(wl)
    return item


@app.post("/api/incidents/{iid}/rerun")
def api_rerun(iid: str, request: Request):
    _require_token(request)
    inc = store.incident(iid)
    if not inc:
        raise HTTPException(404)
    inc["error"] = None
    store.put_incident(inc)
    return {"started": _background(f"pipeline:{iid}", pipeline.run, inc)}


@app.post("/api/incidents/{iid}/approve")
def api_approve(iid: str, request: Request, body: dict[str, Any] | None = None):
    _require_token(request)
    try:
        return pipeline.approve(iid, (body or {}).get("by", "reviewer"))
    except ValueError as e:
        raise HTTPException(409, str(e))


@app.get("/api/incidents/{iid}/draft.md", response_class=PlainTextResponse)
def api_draft(iid: str):
    inc = store.incident(iid)
    if not inc or not inc.get("draft"):
        raise HTTPException(404)
    return inc["draft"]["text"]


@app.get("/api/taint/{needle}")
def api_taint(needle: str):
    return O.taint(needle)


@app.get("/api/commits/{sha}")
def api_commit(sha: str):
    recs = {s: r for s, _s, r in O.commits()}
    full = next((s for s in recs if s.startswith(sha)), None)
    if not full:
        raise HTTPException(404)
    return {"sha": full, "record": recs[full], "diff": O.diff_of(full), "flag": store.flags().get(full)}


@app.post("/api/reset")
def api_reset(request: Request):
    _require_token(request)
    store.reset()
    return {"ok": True}


@app.exception_handler(Exception)
async def _errors(request: Request, exc: Exception):
    return JSONResponse({"error": f"{type(exc).__name__}: {exc}"}, status_code=500)
