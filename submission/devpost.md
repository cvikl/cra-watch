# Devpost submission: CRA Watch

**Project name:** CRA Watch
**Tagline:** When a CVE hits a dependency your AI coding agent used, you have 24 hours under the EU Cyber Resilience Act. CRA Watch finds what the agent touched, drafts the Article 14 early warning on private Nemotron inference, and puts it in front of a human in minutes.
**Track:** Best Apps and Agents
**Also entering:** Best Use of Tavily
**Live demo:** https://cra-watch.vantapointlabs.com (read-only for visitors; the actions need the review token)
**Repository:** https://github.com/cvikl/cra-watch (MIT)

## Inspiration

Article 14 of the EU Cyber Resilience Act has applied since 11 September 2026: a manufacturer must send ENISA an early warning within 24 hours of becoming aware of an actively exploited vulnerability or a severe incident, and a compromised library introduced into a product counts (Art. 14(5)(b)). AI coding agents add a new question nobody can answer from git alone: when a package, README or MCP server turns out to be poisoned, which code did the agent write after reading it? We built Origit (IBM Bob 2.0 hackathon, September 2026) to record exactly that. CRA Watch is what happens when the advisory lands.

## What it does

1. **Monitor.** A Nebius Serverless Job polls NVD, GitHub Advisories, OSV and vendor bulletins through Tavily for every dependency an agent added. A match opens an incident and starts the 24 h clock.
2. **Trace.** `origit taint` returns every agent commit downstream of the component, the sessions, files written, approver, first-read time and the last clean commit to roll back to. Deterministic, milliseconds.
3. **Read.** Tavily extracts the advisory in full so the models work from the real text.
4. **Triage.** NVIDIA Nemotron 3 Nano 30B (the Nano tier) classifies severity, vulnerability class, data at risk and whether Article 14 applies, with structured JSON output.
5. **Context.** Tavily fetches background on the vulnerability class and the CRA Article 14 guidance.
6. **Draft.** NVIDIA Nemotron 3 Ultra writes the Article 14(4)(a) early warning from the advisory, the taint result, the triage and the guidance. Anything not in the evidence stays a placeholder.
7. **Review.** The compliance lead reads the incident record, approves, and the stamp shows how much of the 24 h window was used. Nothing is sent automatically.

**Sentinel** is the proactive layer. Before any CVE exists it scans what every agent commit read and wrote (hidden Unicode-tag instructions, dangerous sinks, unverified dependencies) and Nemotron Nano classifies each commit's risk with quoted evidence. When the advisory lands, the blast radius is already annotated and the draft is richer.

## How we built it

Python, FastAPI, vanilla JS. Nebius Token Factory serves both Nemotron tiers through the OpenAI-compatible API (`response_format: json_schema` for the classifiers). The console runs as a Nebius Serverless Endpoint; the monitor runs `cra-watch monitor --loop` on a Nebius Serverless Job with keys from SecretStash. Tavily search (domain-restricted, time-ranged) and extract are the intelligence layer; every Tavily and Nemotron call is logged with model, tokens and latency and shown in the run ledger. Origit is vendored as an MIT dependency. The demo repository ships as a git bundle with Origit records for agent sessions #42 to #49.

## Challenges

Honesty about what a model can do. "Generate adversarial inputs" sounds strong and is not buildable in a weekend; pattern analysis plus a classifier with quoted evidence is, and it is what Sentinel does. Serverless Jobs are triggered, not perpetual, so the monitor runs for the job's lifetime and is re-created on a schedule. Keeping the reviewer in control: the only path to "filed" is a person pressing the button.

## Accomplishments

An end-to-end product, not a proof of concept: monitor, provenance, tiered inference, review UI with a live clock. Tiered model selection with a reason: the small model runs per commit and per advisory, the large model once per incident on the full context. Tavily used three ways (feed polling, full-text extraction, regulatory grounding), each visible on screen.

## What we learned

Regulated-industry buyers want the audit trail more than the automation. Every line in the draft has to point to a commit, a record hash, a source URL or a model call.

## What's next

Sentinel on every push through the Origit console; the ENISA single reporting platform's structured format; the 72 h notification and final report from the same record.

## Prior work statement

Origit (github.com/cvikl/origit, MIT, September 2026) existed before the submission period and is vendored unchanged under `vendor/origit`. Everything else was built during the submission period: the advisory monitor and the Tavily intelligence layer, the incident pipeline and CRA clock, tiered Nemotron inference on Nebius Token Factory, Sentinel, the review console, the Serverless Job and Endpoint packaging, tests and documentation.

## Built with

Nebius Token Factory, Nebius Serverless Jobs, Nebius Serverless Endpoints, NVIDIA Nemotron 3 Ultra, NVIDIA Nemotron 3 Nano, Tavily, Origit, Python, FastAPI.

## Feedback on Nebius Token Factory and NVIDIA tools

- Token Factory: the OpenAI-compatible API and `json_schema` output worked first time; billing setup requiring a card before the hackathon promo code can be applied cost us hours on the deadline day, a promo path that bypasses the card would help hackathon teams.
- Serverless Jobs: clear CLI; a native schedule (cron) field would remove the re-create-from-CI step.
- Nemotron 3 Nano as the classifier tier is fast and cheap enough to run on every commit.
