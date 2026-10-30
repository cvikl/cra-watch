# CRA Watch

**Autonomous EU Cyber Resilience Act Article 14 agent.** When a security advisory hits a dependency that an AI coding
agent introduced, CRA Watch traces which agent sessions and commits are affected, drafts the Article 14(4)(a) early
warning and puts it in front of a reviewer, inside the 24-hour window. Built for the
[Nebius x NVIDIA Global AI Hackathon](https://nebiusglobalaihackathon.devpost.com/), Coding and Agentic Engineering track.

> Git tells you what changed. Origit tells you what the agent read before it changed it. CRA Watch turns that into the filing.

## What it does

| Layer | What happens | Runs on |
|---|---|---|
| **Monitor** | Polls NVD, GitHub Advisories, OSV and vendor bulletins for every watched dependency. A match (package name + CVE/GHSA id) opens an incident. | Tavily search + extract, on a **Nebius Serverless Job** |
| **Provenance** | `origit taint <dependency>`: every agent commit downstream of the dependency, the sessions, files written, approver, first-read time and the last clean commit to roll back to. Deterministic, milliseconds. | [Origit](https://github.com/cvikl/origit) (MIT, prior work, vendored) |
| **Triage** | Severity, vulnerability class, data at risk, whether Article 14 applies and on which limb. | **NVIDIA Nemotron 3 Nano 30B** (Nano tier) via Nebius Token Factory |
| **Context** | The full advisory text, background on the vulnerability class, and the CRA Article 14 guidance, fetched and fed to the drafter. | Tavily extract + search |
| **Draft** | The Article 14(4)(a) early warning, from the advisory, the taint result, the triage and the guidance. Placeholders for anything not in the evidence. | **NVIDIA Nemotron 3 Ultra** via Nebius Token Factory |
| **Review** | A compliance lead reads the record, approves, the clock stops. Nothing is sent automatically. | the web console (Nebius Serverless Endpoint) |
| **Sentinel** | *Proactive layer.* Before any CVE exists, scans what each agent read and wrote (hidden Unicode-tag instructions, dangerous sinks, unverified dependencies) and Nemotron Nano classifies the risk per commit. When a CVE lands, the blast radius is already annotated. | Origit pre-filter + CRA Watch sink scan + Nemotron Nano |

Tiered inference is deliberate: the small model runs often (one call per commit, one per advisory) and the large model
runs once per incident on the full context. Unpatched code and provenance records never leave Nebius.

## Why private inference

The analysis needs the vulnerable code, the agent's inputs and the firm's provenance records. Sending that to a public
API during a live incident is a second disclosure problem on top of the first. Serving open NVIDIA models on Nebius
keeps it in one tenancy.

## Run it

```bash
uv venv && uv pip install -e ".[dev]"          # Python 3.11+, git on PATH
cp .env.example .env                           # NEBIUS_API_KEY, TAVILY_API_KEY
.venv/bin/cra-watch serve                      # http://localhost:8000
.venv/bin/cra-watch sentinel                   # scan the Origit store with Nemotron Nano
.venv/bin/cra-watch monitor                    # one poll of the advisory feeds (--loop for the job)
.venv/bin/cra-watch taint fast-pay-utils       # the Origit query on its own
```

The first run restores the demo repository (`demo/payments-api.bundle`: a payments API with Origit records for agent
sessions #42 to #49, including the synthetic compromised dependency `fast-pay-utils@2.1.0`) into `data/`.

Tests run without keys: `CRAWATCH_FAKE_LLM=1 .venv/bin/python -m pytest`. Fixture answers are labelled `FIXTURE`
everywhere they appear so they can never pass for model output.

### Deploy on Nebius

- **Console**: build the image (`Dockerfile`), deploy as a Serverless Endpoint, `cra-watch serve`.
- **Monitor**: `nebius/monitor-job.sh` creates the Serverless Job that runs `cra-watch monitor --loop` with the keys
  from SecretStash. Serverless Jobs are triggered, not perpetual: the job polls for its lifetime (up to 168 h) and is
  re-created on a schedule.
- **Models**: `NEMOTRON_NANO` (default `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B`) and `NEMOTRON_ULTRA` (default
  `nvidia/Nemotron-3-Ultra-550b-a55b`), any Token Factory model id works.

## The demo

`fast-pay-utils` 2.1.0 carries hidden Unicode-tag prompt-injection text and an exfiltration payload (synthetic advisory
`GHSA-demo-f4st-pay0-2100`, CVSS 8.2, in `demo/advisories/`). An agent read it in session #42 and built the payout
export on top of it; sessions #43 to #49 propagated. Every test passed.

1. **Sentinel** flags sessions #42, #43 and #45 as HIGH before any advisory exists: the hidden instruction is in what the agent read.
2. The **monitor** polls; the advisory appears on the vendor bulletin feed; Tavily reads it in full; the incident opens and the 24 h clock starts.
3. **Origit taint** returns 7 affected commits, 8 files, the approver role and the clean rollback commit in milliseconds.
4. **Nemotron Nano** classifies HIGH, payment data at risk, Article 14(5)(b) applies.
5. **Tavily** fetches the vulnerability-class background and the CRA Article 14 guidance.
6. **Nemotron Ultra** drafts the early warning.
7. The reviewer approves. The stamp shows how much of the window was used.

## What is new since Origit

Origit (IBM Bob 2.0 hackathon, Sep 2026) recorded agent provenance and answered the taint query. Everything in this
repository except `vendor/origit` was built for this hackathon: the advisory monitor and Tavily intelligence layer,
the incident pipeline and the CRA clock, tiered Nemotron inference on Nebius Token Factory, Sentinel, the review
console, the Serverless Job and Endpoint packaging.

## Honest limits

- Sentinel does pattern analysis plus model classification. It does not generate exploits.
- The early warning is a draft; a person approves and files it through the ENISA platform themselves.
- Member states, contact details and user counts are placeholders unless they are in the evidence.

MIT licensed. Team: Tim (build), Bernard Liu (legal and compliance), Jeremy (offensive security).
