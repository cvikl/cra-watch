"""Exercise the inference tiers: re-run the real triage and drafting prompts on the stored incident until a spend cap.

Real calls, real prompts, no fixtures; Tavily is not called (the stored advisory text and context are reused).
Spend is estimated from token usage at Token Factory list prices and the loop stops at the cap.
  python scripts/exercise.py --cap 15 --workers 3
"""
from __future__ import annotations

import argparse
import copy
import json
import os
import random
import sys
import threading
import time

os.environ.setdefault("CRAWATCH_DATA", os.path.join(os.path.dirname(__file__), "..", "data"))
from crawatch import nemotron, sentinel, store, origit_bridge as O  # noqa: E402

PRICE = {  # $ per 1M tokens, prompt / completion
    "nvidia/Nemotron-3-Ultra-550b-a55b": (1.00, 3.00),
    "nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B": (0.06, 0.24),
}
lock = threading.Lock()
spent = 0.0
calls = 0


def cost(meta: dict) -> float:
    pi, po = PRICE.get(meta.get("model"), (1.0, 3.0))
    return (meta.get("prompt_tokens") or 0) / 1e6 * pi + (meta.get("completion_tokens") or 0) / 1e6 * po


def charge(meta: dict) -> None:
    global spent, calls
    with lock:
        spent += cost(meta)
        calls += 1


def base_context() -> tuple[dict, dict, dict]:
    incs = [i for i in store.incidents() if i.get("draft") and i.get("triage")]
    if not incs:
        sys.exit("no completed incident in the data dir; run the demo once first")
    inc = incs[-1]
    adv = {k: inc["advisory"].get(k) for k in ("title", "url", "content", "full_text")}
    return inc, adv, inc["taint"]


def worker(n: int, cap: float, inc: dict, adv: dict, taint: dict, log) -> None:
    rnd = random.Random(n)
    while True:
        with lock:
            if spent >= cap:
                return
        try:
            # vary the awareness time so each run is a distinct document, then triage (Nano) and draft (Ultra)
            tri = nemotron.triage(adv, taint, inc.get("prior_flags", []))
            charge(store.calls()[-1])
            ctx = copy.deepcopy(inc.get("context", {}))
            aware = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - rnd.randint(0, 86400 * 30)))
            from crawatch.pipeline import deadlines
            from crawatch.config import settings
            context = {
                "manufacturer": settings.manufacturer, "product": settings.product_name, "awareness": aware, "deadlines": deadlines(aware),
                "advisory": {"title": adv.get("title"), "url": adv.get("url"), "text": (adv.get("full_text") or adv.get("content") or "")[:12000]},
                "triage": {k: v for k, v in tri.items() if k not in ("model", "call")}, "taint": nemotron._taint_brief(taint),
                "prior_sentinel_flags": inc.get("prior_flags", []),
                "web_background_on_vulnerability_class_from_tavily": [{"title": r["title"], "url": r["url"], "excerpt": r["content"][:700]} for r in ctx.get("class_background", [])],
                "cra_article_14_guidance_from_tavily": [{"title": r["title"], "url": r["url"], "excerpt": r["content"][:700]} for r in ctx.get("cra_guidance", [])],
            }
            nemotron.draft_article14(context)
            charge(store.calls()[-1])
            if rnd.random() < 0.3:  # a Sentinel pass now and then: ten Nano calls
                for c in O.agent_commits():
                    recs = {sha: rec for sha, _s, rec in O.commits()}
                    sentinel.flag_commit(c, recs[c["sha"]])
                    charge(store.calls()[-1])
            with lock:
                log(f"spent ${spent:.2f} after {calls} calls")
        except Exception as e:  # keep going on transient API errors
            log(f"error: {str(e)[:160]}")
            time.sleep(10)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--cap", type=float, default=15.0)
    ap.add_argument("--workers", type=int, default=3)
    a = ap.parse_args()
    inc, adv, taint = base_context()
    print(f"exercising on {inc['id']} ({inc['dependency']}), cap ${a.cap:.2f}, {a.workers} workers", flush=True)
    last = [0]

    def log(msg: str) -> None:
        dollar = int(spent)
        if "error" in msg or dollar > last[0]:
            last[0] = dollar
            print(f"{time.strftime('%H:%M:%S')} {msg}", flush=True)

    threads = [threading.Thread(target=worker, args=(n, a.cap, inc, adv, taint, log), daemon=True) for n in range(a.workers)]
    for t in threads:
        t.start()
    while any(t.is_alive() for t in threads):
        time.sleep(5)
    print(f"done: ${spent:.2f} spent over {calls} calls", flush=True)


if __name__ == "__main__":
    main()
