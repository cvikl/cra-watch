---
version: 1
slug: "crawatch-templates-index-html"
primary_target: "crawatch/templates/index.html"
related_targets: ["crawatch/static/app.css","crawatch/static/app.js"]
---

# Surface: CRA Watch review console (crawatch/templates/index.html)

Scope: the single-page console. Visitor mode: Operate.

Audience and job: the compliance lead of an EU fintech, at a daylight office desk, with a 24 h Article 14 clock running. Task: see what was detected, check what the system traced and read, review the drafted early warning, approve it. The engineering lead reads the affected commits and the rollback commit on the same page.

Proof and content: real Origit records (sessions #42 to #49), the synthetic fast-pay-utils advisory (labelled), live pipeline events, the call ledger (model id, tokens, latency), the Nemotron Ultra draft.

Constraints: light scene; no build step (Jinja + vanilla JS + CSS); every claim links to a commit, a source URL or a model call; approve is the only way to "filed"; nothing invented (member states, contacts stay placeholders).

Memorable moment: the approval stamp. Approving the draft presses a stamp onto the document that carries the time elapsed since awareness, and the countdown stops.

## Direction contract

THESIS: CRA Watch is a page of the Origit console, not a product of its own. It inherits origit.uk's world (the console the founder built for Origit) in a light rendition the founder chose on 30 Oct 2026, and refuses both the category dashboard and the terminal log.

OWN-WORLD: Origit's grammar: glass panels with 16px corners on a paper ground with three faint glows (blue, purple, green), pill buttons, tags and tabs, SHA pills in link blue, session labels in purple mono, GitHub-light palette (link #0969da, amber #9a6700, danger #d1242f, verified green #1a7f37), Onest at Origit's 13px base and its size ramp, SF Mono for identifiers. Tiles (#f6f8fa, 12px corners) hold fields and steps.

STORY: The reviewer recognises the Origit console, sees the clock, reads the seven steps signed by Tavily, Origit, Nemotron Nano and Ultra, reads the draft, approves. Every line links to a commit, a source or a model call.

FIRST VIEWPORT: Origit top bar (mark, "Origit Console", "CRA Watch · Article 14 early warning", manufacturer and product, five system pills, the running clock). Two columns: 316px register (watched dependencies, Sentinel checks with the four-cell scale, journal) and the incident card: title and status tag, six tiles with the 40px countdown, the seven-step ladder, affected components, assessment, sources, the draft sheet with the signature block and the green primary action.

FORM: a console page inside an established world (origit.uk); no concept roll (the world was pinned by the founder). Replaces the earlier GMP deviation-report world (seed c99d8693). Code-led.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
