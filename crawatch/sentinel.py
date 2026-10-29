"""Sentinel: proactive risk flags on agent commits, before any CVE exists.

Honest, buildable version. Step one is deterministic: the Origit pre-filter (hidden Unicode text in what the agent read,
new dependencies, external reads, secret files, code-execution commands) plus CRA Watch's own sink scan over the files
the agent wrote (eval, child_process, deserialisation, env + network, SQL concatenation). Step two is Nemotron Nano:
it reads the findings with the surrounding code and classifies the commit's risk, class and CWE with quoted evidence.
The flag is stored per commit sha; CRA Watch reads it when a CVE lands so the blast radius is already annotated.
"""
from __future__ import annotations

import re
from typing import Any

from origit import prefilter as PF

from . import nemotron, origit_bridge as O, store

# (name, class, regex) over code the agent wrote. Each hit becomes a finding with a snippet.
SINKS: list[tuple[str, str, re.Pattern[str]]] = [
    ("dynamic code execution", "code-injection", re.compile(r"\b(eval|new Function|vm\.run[A-Za-z]*|exec)\s*\(")),
    ("shell command", "command-injection", re.compile(r"\b(child_process|execSync|spawn(Sync)?|subprocess|os\.system|shell=True)\b")),
    ("unsafe deserialisation", "unsafe-deserialization", re.compile(r"\b(pickle\.loads?|yaml\.load\(|unserialize|Marshal\.load|ObjectInputStream)\b")),
    ("environment read", "credential-exfiltration", re.compile(r"process\.env\b|os\.environ\b|\.env['\"]")),
    ("outbound network call", "insecure-network-call", re.compile(r"\b(fetch|axios|http\.get|https\.get|request|urllib|requests\.(get|post))\s*\(")),
    ("base64 encoding", "embedded-malicious-code", re.compile(r"\b(btoa|Buffer\.from\([^)]*\)\.toString\(['\"]base64|base64\.b64encode)\b")),
    ("sql string concatenation", "sql-injection", re.compile(r"(SELECT|INSERT|UPDATE|DELETE)\b[^\n]*(\+|\$\{)")),
    ("telemetry at import", "embedded-malicious-code", re.compile(r"initializeTelemetry|setImmediate\(")),
]

RISK_RANK = {"none": 0, "low": 1, "medium": 2, "high": 3, "critical": 4}


def _snippet(text: str, pos: int, width: int = 3) -> str:
    lines = text.splitlines()
    ln = text[:pos].count("\n")
    lo, hi = max(0, ln - width), min(len(lines), ln + width + 1)
    return "\n".join(f"{i + 1:>4}  {lines[i][:200].rstrip()}" for i in range(lo, hi))


def scan_commit(c: dict[str, Any], rec: dict[str, Any]) -> tuple[list[dict[str, Any]], str]:
    """Deterministic pass: (findings, snippets). Zero model calls."""
    reads = O.reads_of(c["sha"], rec)
    writes = O.writes_of(c["sha"], rec)
    findings = [{"source": "origit-prefilter", "asi": f["asi"], "title": f["title"], "severity": f["severity"],
                 "cwe": f["cwe"], "evidence": f["evidence"], "ref": f.get("ref")}
                for f in PF.run(rec, list(writes), reads)]
    snippets: list[str] = []
    for ref, text in reads.items():
        if PF.has_hidden_text(text):
            decoded = PF.decode_unicode_tags(text)
            snippets.append(f"== {ref} (read)\n[[hidden: {decoded[:400]}]]")
    for path, text in writes.items():
        if "/node_modules/" in path or path.endswith((".lock", "-lock.json")):
            continue
        for title, cls, rx in SINKS:
            for m in list(rx.finditer(text))[:2]:
                findings.append({"source": "sink-scan", "title": title, "class": cls, "severity": "informational",
                                 "evidence": f"{path}: {m.group(0)}", "ref": path})
                snippets.append(f"== {path} (wrote), {title}\n{_snippet(text, m.start())}")
    # files the agent read that are vendored package code: scan them too, that is where the payload hides
    for ref, text in reads.items():
        if "node_modules" in ref or "/packages/" in ref:
            for title, cls, rx in SINKS:
                for m in list(rx.finditer(text))[:1]:
                    findings.append({"source": "sink-scan", "title": title, "class": cls, "severity": "informational",
                                     "evidence": f"{ref}: {m.group(0)}", "ref": ref})
                    snippets.append(f"== {ref} (read), {title}\n{_snippet(text, m.start())}")
    return findings, "\n\n".join(snippets)[:9000]


def flag_commit(c: dict[str, Any], rec: dict[str, Any], *, classify: bool = True) -> dict[str, Any]:
    findings, snippets = scan_commit(c, rec)
    flag: dict[str, Any] = {"sha": c["sha"], "short": c["short"], "subject": c["subject"], "session_label": c["session_label"],
                            "scanned_at": store.now(), "findings": findings, "risk": "none", "classes": [], "cwe": [],
                            "summary": "No pattern findings.", "evidence": [], "cra_relevance": "", "model": None}
    if findings and classify:
        verdict = nemotron.sentinel_classify(c, findings, snippets)
        flag.update({k: verdict.get(k) for k in ("risk", "classes", "cwe", "summary", "evidence", "cra_relevance", "model", "call")})
    elif findings:
        worst = max((f["severity"] for f in findings), key=lambda s: PF.SEVERITIES.index(s))
        flag.update({"risk": {"informational": "low"}.get(worst, worst), "summary": "Pattern findings, not yet classified by Nemotron."})
    store.set_flag(c["sha"], flag)
    return flag


def run(*, classify: bool = True, only_unflagged: bool = False) -> list[dict[str, Any]]:
    """Scan every recorded agent commit. Emits one event per flagged commit."""
    store.emit("sentinel", "Sentinel scan started over the Origit store", stage="sentinel")
    existing = store.flags()
    out = []
    recs = {sha: rec for sha, _s, rec in O.commits()}
    for c in O.agent_commits():
        if only_unflagged and c["sha"] in existing:
            out.append(existing[c["sha"]])
            continue
        flag = flag_commit(c, recs[c["sha"]], classify=classify)
        out.append(flag)
        if flag["risk"] != "none":
            store.emit("sentinel", f"{flag['short']} {flag['session_label']}: {flag['risk'].upper()} {', '.join(flag['classes'] or [])}",
                       stage="sentinel", sha=flag["sha"], risk=flag["risk"])
    n = sum(1 for f in out if f["risk"] not in ("none",))
    store.emit("sentinel", f"Sentinel scan finished: {n} of {len(out)} agent commits carry a risk flag", stage="sentinel")
    return out


def flags_for(shas: list[str]) -> list[dict[str, Any]]:
    fl = store.flags()
    return [{k: fl[s][k] for k in ("short", "session_label", "risk", "classes", "cwe", "summary", "evidence", "scanned_at")}
            for s in shas if s in fl and fl[s]["risk"] != "none"]
