"""cra-watch command line: serve the review UI, run Sentinel, run the monitor (the Serverless Job entrypoint)."""
from __future__ import annotations

import argparse
import json
import sys

from . import origit_bridge as O, store
from .config import settings


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="cra-watch")
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("serve", help="review UI and API")
    s.add_argument("--host", default="0.0.0.0")
    s.add_argument("--port", type=int, default=8000)
    sub.add_parser("sentinel", help="scan every agent commit in the Origit store and flag risks")
    m = sub.add_parser("monitor", help="poll advisory feeds for watched dependencies")
    m.add_argument("--loop", action="store_true")
    m.add_argument("--interval", type=int, default=None)
    sub.add_parser("taint", help="Origit taint for a dependency").add_argument("needle")
    sub.add_parser("reset", help="clear incidents, flags, calls and events (keeps the repo)")
    sub.add_parser("status", help="configuration and counts")
    a = p.parse_args(argv)

    if a.cmd == "serve":
        import uvicorn
        uvicorn.run("crawatch.web:app", host=a.host, port=a.port, log_level="info")
    elif a.cmd == "sentinel":
        from . import sentinel
        for f in sentinel.run():
            print(f"{f['short']} {f['session_label']:>4} {f['risk']:<8} {', '.join(f['classes'] or [])}  {f['summary'][:90]}")
    elif a.cmd == "monitor":
        from . import monitor
        if a.loop:
            monitor.loop(a.interval)
        else:
            for inc in monitor.run_once():
                print(json.dumps({k: inc[k] for k in ("id", "dependency", "status")}))
    elif a.cmd == "taint":
        print(json.dumps(O.taint(a.needle), indent=1))
    elif a.cmd == "reset":
        store.reset()
        print("state cleared")
    elif a.cmd == "status":
        print(json.dumps({"nebius": settings.nebius_ready, "tavily": settings.tavily_ready, "nano": settings.nemotron_nano,
                          "ultra": settings.nemotron_ultra, "repo": str(settings.repo_dir), "data": str(settings.data_dir),
                          "agent_commits": len(O.agent_commits()), "flags": len(store.flags()), "incidents": len(store.incidents())}, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
