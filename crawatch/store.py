"""Flat JSON state under DATA_DIR. One file per collection; append-only event log for the live timeline.

Collections: watchlist, flags (Sentinel risk flags per commit), incidents, calls (every model / search call,
with model, tokens and latency, so the judges can see exactly what ran), events.
"""
from __future__ import annotations

import json
import threading
import time
import uuid
from pathlib import Path
from typing import Any, Callable

from .config import settings

_lock = threading.RLock()
_listeners: list[Callable[[dict[str, Any]], None]] = []


def now() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


def _path(name: str) -> Path:
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    return settings.data_dir / f"{name}.json"


def load(name: str, default: Any) -> Any:
    p = _path(name)
    if not p.exists():
        return default
    with _lock:
        return json.loads(p.read_text(encoding="utf-8"))


def save(name: str, value: Any) -> None:
    with _lock:
        tmp = _path(name).with_suffix(".tmp")
        tmp.write_text(json.dumps(value, indent=1, ensure_ascii=False), encoding="utf-8")
        tmp.replace(_path(name))


def update(name: str, default: Any, fn: Callable[[Any], Any]) -> Any:
    with _lock:
        value = load(name, default)
        out = fn(value)
        save(name, value if out is None else out)
        return value if out is None else out


# ----------------------------------------------------------------------------- events
def subscribe(fn: Callable[[dict[str, Any]], None]) -> Callable[[], None]:
    _listeners.append(fn)
    return lambda: _listeners.remove(fn)


def emit(kind: str, text: str, **data: Any) -> dict[str, Any]:
    ev = {"id": new_id("ev"), "at": now(), "kind": kind, "text": text, **data}
    update("events", [], lambda evs: evs.append(ev))
    for fn in list(_listeners):
        try:
            fn(ev)
        except Exception:  # a dead SSE client must not break the pipeline
            pass
    return ev


def events(limit: int = 200) -> list[dict[str, Any]]:
    return load("events", [])[-limit:]


# ----------------------------------------------------------------------------- calls (model + search usage)
def record_call(provider: str, op: str, model: str | None, elapsed_s: float, **meta: Any) -> dict[str, Any]:
    c = {"id": new_id("call"), "at": now(), "provider": provider, "op": op, "model": model, "elapsed_s": round(elapsed_s, 2), **meta}
    update("calls", [], lambda cs: cs.append(c))
    return c


def calls() -> list[dict[str, Any]]:
    return load("calls", [])


# ----------------------------------------------------------------------------- collections
def watchlist() -> list[dict[str, Any]]:
    return load("watchlist", [])


def set_watchlist(items: list[dict[str, Any]]) -> None:
    save("watchlist", items)


def flags() -> dict[str, dict[str, Any]]:
    """commit sha -> Sentinel flag."""
    return load("flags", {})


def set_flag(sha: str, flag: dict[str, Any]) -> None:
    update("flags", {}, lambda f: f.__setitem__(sha, flag))


def incidents() -> list[dict[str, Any]]:
    return load("incidents", [])


def incident(iid: str) -> dict[str, Any] | None:
    return next((i for i in incidents() if i["id"] == iid), None)


def put_incident(inc: dict[str, Any]) -> None:
    def _put(items: list[dict[str, Any]]) -> None:
        for n, i in enumerate(items):
            if i["id"] == inc["id"]:
                items[n] = inc
                return
        items.append(inc)
    update("incidents", [], _put)


def reset() -> None:
    for name in ("events", "calls", "flags", "incidents"):
        save(name, [] if name != "flags" else {})
