"""The public demo run: replays the fixed scenario live for whoever is watching the console.

Anyone can start it (no review token), so it is rate limited: one run at a time, a cooldown between runs and a daily
cap, because every run spends real Nemotron and Tavily calls. The run clears the incident register, scans the Origit
store with Sentinel, polls the advisory feed for the demo dependency through Tavily, and lets the pipeline do the rest.
The incident it opens may be approved without a token, so the viewer can finish the loop themselves.
"""
from __future__ import annotations

import threading
import time

from . import monitor, sentinel, store
from .config import settings

COOLDOWN_S = 90
DAILY_CAP = 80
_lock = threading.Lock()
_last_started = 0.0
_runs: list[float] = []


def can_start() -> tuple[bool, str]:
    now = time.time()
    with _lock:
        recent = [t for t in _runs if now - t < 86400]
        if now - _last_started < COOLDOWN_S:
            return False, f"a demo run started {int(now - _last_started)} s ago; wait {int(COOLDOWN_S - (now - _last_started))} s"
        if len(recent) >= DAILY_CAP:
            return False, "the daily demo budget is used up; the recorded incident stays on screen"
    return True, ""


def start() -> None:
    global _last_started
    with _lock:
        _last_started = time.time()
        _runs.append(_last_started)


def run() -> None:
    start()
    store.reset()
    # the demo dependency must carry its vendor-bulletin feed, whatever state the watchlist was created in
    wl = monitor.watchlist()
    for d in wl:
        if d["name"] == settings.demo_dependency and settings.demo_bulletin not in d.get("bulletins", []):
            d.setdefault("bulletins", []).append(settings.demo_bulletin)
    store.set_watchlist(wl)
    store.emit("demo", "Live demo started: Sentinel scan, then the advisory feed, then the pipeline. About a minute.", stage="demo")
    sentinel.run()
    opened = monitor.run_once(only=[settings.demo_dependency])
    if not opened:
        store.emit("demo", f"No advisory matched {settings.demo_dependency}; nothing to file.", stage="demo")
