"""Origit provenance, read through the Origit core (MIT, prior work).

Origit attaches a hashed record to every agent commit: what the agent read, wrote, added and ran, who approved.
CRA Watch asks it two questions: ``taint(needle)`` (which commits and sessions are downstream of a component)
and ``agent_commits()`` (every recorded commit with the text the agent read and wrote, for Sentinel).
The repository lives in a working clone restored from demo/payments-api.bundle on first use.
"""
from __future__ import annotations

import hashlib
import subprocess
from functools import lru_cache
from typing import Any

from origit import notes as N
from origit import sessions as S
from origit import taint as T

from .config import settings


def _git(*args: str, check: bool = True) -> str:
    p = subprocess.run(["git", "-C", str(settings.repo_dir), *args], capture_output=True, text=True)
    if check and p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or f"git {' '.join(args)} failed")
    return p.stdout


def ensure_repo() -> str:
    """Clone the demo bundle (commits + refs/notes/origit) into DATA_DIR if no repository is there yet."""
    repo = settings.repo_dir
    if (repo / ".git").exists():
        return str(repo)
    if not settings.demo_bundle.exists():
        raise RuntimeError(f"no repository at {repo} and no bundle at {settings.demo_bundle}")
    repo.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "clone", "-q", str(settings.demo_bundle), str(repo)], check=True, capture_output=True)
    subprocess.run(["git", "-C", str(repo), "fetch", "-q", str(settings.demo_bundle), "refs/notes/origit:refs/notes/origit"],
                   check=True, capture_output=True)
    _commits.cache_clear()
    return str(repo)


@lru_cache(maxsize=1)
def _commits() -> tuple[tuple[str, str, dict[str, Any] | None], ...]:
    ensure_repo()
    return tuple(N.commits(str(settings.repo_dir)))


def commits() -> list[tuple[str, str, dict[str, Any] | None]]:
    """Newest-first (sha, subject, record|None)."""
    return list(_commits())


def session_labels() -> dict[str, str]:
    base = S.base(str(settings.repo_dir))
    return {sid: S.label(n) for sid, n in S.number_sessions(commits(), base).items()}


def short(sha: str) -> str:
    return sha[:7]


def file_at(sha: str, path: str) -> str | None:
    p = subprocess.run(["git", "-C", str(settings.repo_dir), "show", f"{sha}:{path}"], capture_output=True)
    if p.returncode != 0:
        return None
    return p.stdout.decode("utf-8", errors="replace")


@lru_cache(maxsize=64)
def _sha256_index(sha: str) -> dict[str, str]:
    """content sha256 -> path for every blob in the commit tree (resolves reads outside the tree, e.g. node_modules)."""
    out: dict[str, str] = {}
    listing = _git("ls-tree", "-r", "--format=%(objectname) %(path)", sha, check=False)
    for line in listing.splitlines():
        obj, _, path = line.partition(" ")
        blob = subprocess.run(["git", "-C", str(settings.repo_dir), "cat-file", "blob", obj], capture_output=True).stdout
        out[hashlib.sha256(blob).hexdigest()] = path
    return out


def reads_of(sha: str, rec: dict[str, Any]) -> dict[str, str]:
    """ref -> text for every file the agent read before this commit (resolved by path, else by content hash)."""
    out: dict[str, str] = {}
    for r in rec.get("read", []):
        if r.get("kind") != "file":
            continue
        text = file_at(sha, r["ref"])
        if text is None and r.get("sha256"):
            where = _sha256_index(sha).get(r["sha256"])
            text = file_at(sha, where) if where else None
        if text is not None:
            out[r["ref"]] = text
    return out


def writes_of(sha: str, rec: dict[str, Any]) -> dict[str, str]:
    out: dict[str, str] = {}
    for path in rec.get("wrote", []):
        text = file_at(sha, path)
        if text is not None:
            out[path] = text
    return out


def diff_of(sha: str, limit: int = 20_000) -> str:
    return _git("show", "--format=", "--no-color", "--unified=2", sha, check=False)[:limit]


def agent_commits() -> list[dict[str, Any]]:
    """Newest-first recorded agent commits: sha, short, subject, session label, approver, record."""
    labels = session_labels()
    out = []
    for sha, subject, rec in commits():
        if not rec or rec.get("actor", {}).get("kind") == "human":
            continue
        out.append({
            "sha": sha, "short": short(sha), "subject": subject,
            "session": rec["session"].get("id"), "session_label": labels.get(rec["session"].get("id"), "–"),
            "actor": rec["actor"].get("kind"), "approver": rec.get("approver"), "approved_at": rec.get("approved_at"),
            "read": [r.get("ref") for r in rec.get("read", [])], "wrote": list(rec.get("wrote", [])),
            "added_deps": [f"{d.get('name')}@{d.get('version')}" for d in rec.get("added_deps", [])],
            "record_sha256": rec.get("record_sha256"),
        })
    return out


def taint(needle: str) -> dict[str, Any]:
    """Origit taint query: affected commits, sessions, files, approvers, first read and the clean rollback commit."""
    result = T.query(commits(), needle)
    labels = session_labels()
    for c in result["affected"]:
        c["short"] = short(c["sha"])
        c["session_label"] = labels.get(c["session"], "–")
    for c in result["clean"]:
        c["short"] = short(c["sha"])
    result["session_labels"] = sorted({labels.get(s, "–") for s in result["sessions"]})
    result["rollback_short"] = short(result["rollback_commit"]) if result["rollback_commit"] else None
    if result["first_read"]:
        result["first_read"]["session_label"] = labels.get(result["first_read"]["session"], "–")
    return result


def dependencies() -> list[dict[str, Any]]:
    """Every dependency an agent added, newest first, with the commit that added it."""
    seen: dict[str, dict[str, Any]] = {}
    for sha, subject, rec in reversed(commits()):
        if not rec:
            continue
        for d in rec.get("added_deps", []):
            key = d.get("name", "")
            seen[key] = {"name": key, "version": d.get("version"), "registry": d.get("registry", "npm"),
                         "added_in": short(sha), "subject": subject}
    return list(seen.values())[::-1]
