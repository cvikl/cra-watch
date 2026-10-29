# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

FastAPI + Jinja2 + vanilla JS and CSS, no build step (chosen by the founder for the hackathon; served from `crawatch/web.py`).

## Users

Primary: the compliance lead of a fintech that sells payment software in the EU and builds it with AI coding agents. Situation: a security advisory has hit a dependency an agent introduced; the EU Cyber Resilience Act gives them 24 hours to file an early warning. They are not developers. They review what the system found, read the drafted Article 14 notification, approve or send it back. Secondary (same screen, confirmed): the engineering lead who reads the affected commits and the rollback point.

## Product Purpose

CRA Watch turns a CVE on an agent-introduced dependency into a reviewable Article 14(4)(a) early warning before the 24 h clock runs out. It watches advisory feeds (Tavily), traces the blast radius through Origit's provenance records (which agent sessions read the component, which commits they produced, the last clean commit), classifies with NVIDIA Nemotron Nano and drafts with Nemotron Ultra on Nebius Token Factory, and puts a human in front of the result. Sentinel is the proactive layer: it pre-flags risky agent commits before any CVE exists. Success: the reviewer approves a correct draft with hours of the window left, and can show an auditor exactly what ran.

## Positioning

The only compliance tool that knows what the AI agent read before it wrote the vulnerable code. Git says what changed; Origit says what the agent read; CRA Watch turns that into the legal filing. Unpatched code never leaves private inference on Nebius.

## Operating Context

Hackathon: Nebius x NVIDIA Global AI Hackathon, Coding and Agentic Engineering track, submission 30 Oct 2026 17:00 GMT, judged on technological implementation, design (complete product, not a proof of concept), potential impact and quality of the idea; Best Use of Tavily prize judged by Tavily. The demo is a 3-minute screen-recorded video in office daylight. Demo data: the synthetic `fast-pay-utils` 2.1.0 advisory (GHSA-demo-f4st-pay0-2100, CVSS 8.2, hidden Unicode-tag prompt injection, credential exfiltration) against the `acme-payments/payments-api` repository with Origit records for sessions #42 to #49.

## Capabilities and Constraints

- Watchlist of dependencies (from Origit `added_deps`), monitor poll (Tavily search + vendor bulletin extract), incident pipeline with five steps (trace, read, triage, context, draft), review and approve, Sentinel scan with per-commit risk flags, live event stream, call log with model, tokens and latency.
- Terminology: early warning (24 h), notification (72 h), final report (1 month); taint; session (#42); clean rollback commit; Sentinel flag; Nano and Ultra tiers.
- Everything the models say carries its model id and call id. Fixture mode exists for tests only and is labelled.
- Human approval is the only way an incident reaches "filed". No sending to ENISA is built; the draft is copied out.
- No real customer, user count or member-state data: those are placeholders in the draft.

## Evidence on Hand

- `demo/payments-api.bundle`: real git history with Origit records (hashed provenance) for 10 agent commits.
- `demo/advisories/GHSA-demo-f4st-pay0-2100.md`: the synthetic advisory, labelled synthetic.
- Prior work: Origit (MIT), github.com/cvikl/origit, built for the IBM Bob 2.0 hackathon, Sep 2026.
- No testimonials, customers or benchmarks exist; none may be shown.

## Product Principles

- The clock is the product: awareness time and the three deadlines are always visible.
- Evidence over verdicts: every claim links to a commit, a record hash, a source URL or a model call.
- The reviewer approves; the system drafts. Nothing is filed without a person.
- Show the machinery once, in words: which model, which source, how long. Not a terminal, not a log dump.
- Familiar compliance-tool affordances; expression lives in precision, not decoration.

## Accessibility & Inclusion

Light scene, office daylight; body text contrast at least 4.5:1; keyboard-operable approve flow; the draft is plain text that screen readers and copy-paste handle.
