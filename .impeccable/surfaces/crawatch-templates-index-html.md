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

THESIS: The incident is a controlled document, not a dashboard. The page refuses the category default (KPI tiles, a chart, a feed) and the terminal opposite (a log). It is built like a GMP deviation report: numbered fields, a classification scale, an evidence index, a signature block. Reading it is reviewing it.

OWN-WORLD: White document ground on a cool grey desk (two neutral layers), ink navy text, hairline rules, field labels in small caps-free uppercase tracking, tabular numerals everywhere a time or count appears. One accent: signal vermilion, used only for the live clock, the stamp and primary action; a verified green for approved; amber for medium, vermilion for high and critical on the Sentinel scale. Face: Archivo (variable, width axis) for everything, condensed for document headers, normal for body, tabular figures for the clock. Controls look like form controls on a controlled document: rectangular, 1px ink border, no rounding beyond 2px. Stamps are the only rotated element on the page.

STORY: The reviewer sees the clock first, then what the system did (seven numbered steps with who did it: Tavily, Origit, Nemotron Nano, Nemotron Ultra), then the draft, then signs. They believe it because every line is indexed to evidence.

FIRST VIEWPORT: Document band at top (product mark, manufacturer and product, system status for Nebius, Nemotron Nano and Ultra, Tavily, Origit). Below, two columns: left 340px register (watchlist with last poll, Sentinel flags per commit as a scale), right the deviation report: a header grid of fields (Incident no., Dependency and version, Advisory ID, Severity class, Awareness time, Early warning due with the countdown in 56px tabular numerals), the step ladder, then the draft on a paper sheet with the signature block and the primary action Approve and file at its end. Empty state: the report area shows the Sentinel register as the controlled document "pre-incident checks".

FORM: controlled document / deviation report, candidate 7 on the ordered list (1 EUR-Lex article page, 2 incident runbook, 3 audit working paper, 4 timetable clock board, 5 SWIFT field message, 6 laminated procedure card, 7 GMP deviation report). Seed key c99d8693, degraded roll, no challengers. Code-led.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
