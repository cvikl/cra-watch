---
name: CRA Watch
description: A documentary product page that is also the live console. Paper ground, white panels, hairline rules, IBM Plex, one red clock.
colors:
  paper: "#F4F6F8"
  surface: "#FFFFFF"
  ink: "#131A23"
  ink-2: "#465262"
  ink-3: "#5F6B7A"
  rule: "#D5DBE2"
  red: "#B3261E"
  red-bg: "#FBE9E7"
  green: "#0E6A4E"
  green-bg: "#E2F1EA"
  amber: "#8A5A00"
  amber-bg: "#FBF0D9"
  blue: "#1F4E8C"
  blue-bg: "#E4ECF7"
  primary-hover: "#000000"
typography:
  display:
    fontFamily: "IBM Plex Sans Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(36px, 6vw, 64px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "IBM Plex Sans Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(24px, 3.4vw, 32px)"
    fontWeight: 600
    lineHeight: 1.15
  clock:
    fontFamily: "IBM Plex Sans Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.1
    fontVariation: "tabular-nums"
  figure:
    fontFamily: "IBM Plex Sans Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
    fontVariation: "tabular-nums"
  wordmark:
    fontFamily: "IBM Plex Sans Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
  lede:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  table:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.6
  note:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.06em"
  tag:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 500
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
rounded:
  hair: "2px"
  xs: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "6px"
  sm: "8px"
  base: "12px"
  md: "16px"
  lg: "20px"
  xl: "28px"
  section: "40px"
  tail: "64px"
components:
  button-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-default-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.paper}"
  button-small:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.note}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  tag-verified:
    backgroundColor: "{colors.green-bg}"
    textColor: "{colors.green}"
    typography: "{typography.tag}"
    rounded: "{rounded.xs}"
    padding: "2px 7px"
  tag-pending:
    backgroundColor: "{colors.blue-bg}"
    textColor: "{colors.blue}"
    typography: "{typography.tag}"
    rounded: "{rounded.xs}"
    padding: "2px 7px"
  tag-attention:
    backgroundColor: "{colors.amber-bg}"
    textColor: "{colors.amber}"
    typography: "{typography.tag}"
    rounded: "{rounded.xs}"
    padding: "2px 7px"
  tag-danger:
    backgroundColor: "{colors.red-bg}"
    textColor: "{colors.red}"
    typography: "{typography.tag}"
    rounded: "{rounded.xs}"
    padding: "2px 7px"
  tag-neutral:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-3}"
    typography: "{typography.tag}"
    rounded: "{rounded.xs}"
    padding: "2px 7px"
  advisory-cite:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "18px 20px"
  stat-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    rounded: "{rounded.lg}"
    padding: "16px 18px"
  clock-running:
    textColor: "{colors.red}"
    typography: "{typography.clock}"
  clock-stopped:
    textColor: "{colors.green}"
    typography: "{typography.clock}"
  step:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.table}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  table-register:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.table}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
  doc-sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "24px 28px"
  flash-error:
    backgroundColor: "{colors.red-bg}"
    textColor: "{colors.red}"
    typography: "{typography.table}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  evidence-line:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
---

# Design System: CRA Watch

## Overview

**Creative North Star: "The Record, Read as a Page"**

CRA Watch is one page that explains itself while it runs. It is built as a documentary product page in the manner of a long-form technical write-up (the model was the `amend` project page, light only): a headline sentence that states the situation in plain words, a short lede, a cited advisory in a box, a few buttons, then one section after another in fixed order, each a white panel on a pale paper ground, divided by a single hairline. The same markup is the live console: the headline changes with incident state, the clock ticks in a stat tile, the eight steps fill in, the draft lands in a sheet, and the operational registers sit folded at the bottom. There is no dashboard chrome, no top bar, no sidebar, no cards floating on shadows. Everything is typeset, bordered and left-aligned inside a 1000px column.

The material is IBM Plex, self-hosted under the OFL in three cuts: Sans for reading, Sans Condensed for every headline and figure, Mono for anything a machine said (identifiers, timestamps, model ids, table heads, status tags). Colour is scarce and semantic: a cool near-black ink and two greys on paper and white; one red that belongs to the running clock and to danger; green for verified, done and filed; amber for attention; blue for links and the step that is running. Tints of each exist only as the ground of a small tag or a highlighted row. Nothing casts a shadow, nothing blurs, nothing glows.

This world replaces the earlier direction contract for this surface (`.impeccable/surfaces/crawatch-templates-index-html.md`, which specified an Origit-derived glass console with a dark top bar, two columns and Onest at 13px) and the Primer-based system that followed it. Both are superseded by the build. The product is branded CRA Watch only: a stroked clock-face mark and the wordmark, nothing else. The provenance engine behind the blast-radius trace is not named anywhere in the UI (the step reads "provenance records"); it has no mark, colour or typeface here and must not acquire one.

**Key Characteristics:**
- One 1000px column on paper, white panels, 1px hairlines, no shadows, no gradients, light only.
- IBM Plex Sans 16px/1.6 for prose; Plex Sans Condensed for headlines and figures; Plex Mono 11 to 13px for machine facts.
- Headline sentences, not titles: the h1 says what is happening ("fast-pay-utils 2.1.0 is compromised. The clock is running.").
- One red number: the 44px countdown, green once filed.
- Status is a small mono tag on a tint; the word is always printed.
- Registers (watchlist, Sentinel, journal, ledger) live in native `details`, folded, at the foot of the page.

## Colors

A cool, low-chroma neutral set on paper, with four semantic hues that appear mostly as 12px tag text on their own tint.

### Primary
- **Ink** (`--ink`): all reading text, headlines, figures, the wordmark, the primary button fill. The page's one strong colour is its text.

### Secondary
- **Clock Red** (`--red`): the running countdown at 44px, the failed step's counter, danger tags (high and critical risk, CVE/GHSA hits, detect and error journal verbs), the error flash border and text, the red hand in the logo mark. **Red Tint** (`--red-bg`) grounds danger tags and the error flash.
- **Filed Green** (`--green`): the countdown once the incident is filed, done step counters, verified tags ("live", "approved and filed", the filed journal verb, low risk is not green). **Green Tint** (`--green-bg`) grounds verified tags and the rollback row in the blast-radius table.

### Tertiary
- **Attention Amber** (`--amber`): medium risk, "fixture" calls in the ledger, placeholder runs inside the draft. **Amber Tint** (`--amber-bg`) grounds those.
- **Link Blue** (`--blue`): every link, the focus ring, the running step's border and tag, low-risk and "demo running" tags, text selection. **Blue Tint** (`--blue-bg`) grounds pending tags and selection.

### Neutral
- **Paper** (`--paper`): the page ground, the primary button's text, inline code in the draft, evidence lines, neutral tags.
- **Surface** (`--surface`): every panel: advisory box, stat tiles, steps, table wrappers, the draft sheet, buttons.
- **Ink 2** (`--ink-2`): the lede, stat captions, step text, details summaries. Secondary prose that is still read.
- **Ink 3** (`--ink-3`): table heads, cite lines, notes, the footer, pending steps and their counters, neutral tags, the hovered default button border. Metadata.
- **Rule** (`--rule`): every border and divider: section rules, panel borders, table row lines, the 1px grid gap between stat tiles.

### Named Rules
**The Tag Pair Rule.** A semantic hue is always used as a pair: the hue for text, its `-bg` tint for ground. Tag text never sits on white and a tint never carries anything but its own hue.

**The One Red Number Rule.** The only red larger than 14px is the countdown. When the incident is filed the same number turns green; nothing else on the page changes colour.

**The Variable Rule.** Colour is written as a `:root` custom property. The single literal in the stylesheet is `#000` on the primary button's hover; the logo mark's red is the same `#B3261E` inlined in SVG.

## Typography

**Display Font:** IBM Plex Sans Condensed (with Arial Narrow, system-ui)
**Body Font:** IBM Plex Sans (with system-ui, Segoe UI)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace, Menlo, Consolas)

**Character:** A technical report set in one family. Condensed carries weight at headline size without taking width, so a full sentence fits on two lines at 64px; Sans at 16px/1.6 reads like documentation; Mono marks what came from a machine. Only the weights shipped are available: Sans 400/500/600, Condensed 600/700, Mono 400/500 (latin subset, `font-display: swap`, the 700 Condensed preloaded).

### Hierarchy
- **Display** (Condensed 700, clamp(36px, 6vw, 64px), 1.02, -0.01em, `text-wrap: balance`): the single h1, a complete sentence that states the incident's condition.
- **Headline** (Condensed 600, clamp(24px, 3.4vw, 32px), 1.15): section h2s, also sentences ("Eight steps, one of them a person").
- **Clock** (Condensed 700, 44px, 1.1, tabular numerals; 36px below 560px): the countdown figure alone.
- **Figure** (Condensed 700, 30px, 1.1, tabular numerals): the other stat tiles (awareness time, severity, affected commits).
- **Wordmark** (Condensed 700, 22px, 1): "CRA Watch" beside the 30px mark.
- **Lede** (Sans 400, 19px, 1.6, Ink 2, max 720px): the paragraph under the h1.
- **Body** (Sans 400, 16px, 1.6, max 720px): paragraphs. Inside the draft sheet, 15px with the sheet's own ramp (h1 24px, h2 19px Condensed 600; h3 16px Sans 600).
- **Table** (Sans 400, 14.5px): table cells, step text, the error flash. Buttons are Sans 600 at 15px (13.5px small).
- **Note** (Sans 400, 13.5px, Ink 3): captions under buttons, the footer, the draft's provenance line.
- **Label** (Mono 500, 11px, 0.06em, uppercase, Ink 3): table heads. Step tags use the same cut at 11px without uppercase.
- **Tag** (Mono 500, 12px): status tags, the advisory cite line.
- **Mono** (Mono 400, 13px): inline code, SHAs, model ids, file paths; 12.5px/1.55 in evidence lines.

### Named Rules
**The Sentence Headline Rule.** h1 and h2 are sentences with a full stop or a clause, never nouns or labels. The headline is the state of the system.

**The Machine Mono Rule.** Anything produced by a system rather than written for a reader (SHA, timestamp, model id, path, token count, status word, column head) is set in Plex Mono at 11 to 13px. Prose never is.

**The Condensed Number Rule.** Figures compared across tiles are Condensed 700 with `tabular-nums`; the countdown is the only one that changes colour.

## Layout

One column, `.wrap` at max 1000px, centred, with 16px body padding either side and 64px below the footer. The page is a stack of bands separated by 1px rules in `--rule`: the hero (40px top, 32px bottom), then each `section` at 40px vertical padding, then the footer at 32px. Prose, the lede and paragraphs cap at 720px; the advisory box at 760px; tables, stat grids and the draft sheet run the full 1000px.

Inside a band the rhythm is: h2 (14px below), then content blocks with 16px to 20px margins (stat grid 20px, tables and steps 16px, draft sheet 16px), buttons in a `.cta` flex row with a 10px gap. Stat tiles are an auto-fit grid of 210px minimum columns with a 1px gap filled by the rule colour, so the tiles read as one bordered table. Steps are a grid of 36px counter, fluid text and an auto-width right tag, 12px gap, 8px between rows. Table cells are 10px 12px.

One breakpoint at 560px: steps collapse to two columns with the tag dropping under the text, the clock steps to 36px, the draft sheet padding goes from 24px 28px to 18px. Tables scroll horizontally in their wrapper rather than reflow.

## Elevation & Depth

Flat. There are no shadows anywhere in the stylesheet, no blur, no gradient. Depth is drawn: white panels on paper with a 1px `--rule` border, rows divided by the same hairline, the stat grid showing its rule-coloured gaps. Emphasis is tonal: the running step takes a blue border, the rollback row a green tint, the error flash a red tint with a red border, a draft placeholder an amber tint. The one motion is a 200ms border-colour transition on steps, gated behind `prefers-reduced-motion: no-preference`.

### Named Rules
**The Drawn Depth Rule.** A new surface gets `background: var(--surface)` and `border: 1px solid var(--rule)`. It does not get a shadow, a blur, a gradient or a second border.

## Shapes

Small radii graded by size of thing: 8px on large panels (advisory box, stat grid, table wrappers, draft sheet), 6px on controls and rows (buttons, steps, error flash), 4px on evidence lines, 3px on tags and inline code, 2px on the thin red bars. Borders are 1px throughout; the logo mark is a 30px stroked circle (2.6px) with a 2.8px red hand. Nothing is a pill, nothing is a full circle but the mark.

## Components

### Buttons
- **Shape:** 6px corners, 1px border, Sans 600 15px, 10px 16px padding, `font: inherit` reset.
- **Default:** white fill, ink text, rule border; hover darkens the border to Ink 3. "Download the draft", "Source on GitHub".
- **Primary:** ink fill, paper text, ink border; hover to pure black (`#000`). One per state: "Run the live demo", "Review the early warning", "Approve and file". Busy state is a label change ("Working…"), disabled is 50% opacity with `not-allowed`.
- **Small:** 6px 12px padding, 13.5px. Register actions ("Poll feeds", "Run scan"), "Copy", "Download .md", "Re-run".
- **Focus:** the global 2px blue outline at 2px offset.
- **Row button** (`.row-btn`): a bare blue underlined mono link used for commit SHAs in the Sentinel register.

### Chips
- **Status tag** (`.s`, Mono 500 12px, 2px 7px, 3px corners, no wrap): the only classification device. Variants: `.v` verified (green on green tint): "live", "approved and filed", the filed journal verb; `.p` pending (blue on blue tint): low risk, "demo running"; `.h` attention (amber on amber tint): medium risk, "fixture"; `.d` danger (red on red tint): high and critical risk, CVE/GHSA hits, detect and error verbs; `.n` neutral (Ink 3 on paper): "none", "clean", "not scanned", "not polled", "offline", source kinds. The word is always printed; the tag is lowercase mono.

### Cards / Containers
- **Advisory cite box** (`.advisory`): white, hairline, 8px corners, 18px 20px padding, max 760px. A 12px mono cite line in Ink 3 (advisory id as link, package@version, CVSS, feed and time) above the advisory title in body type.
- **Stat tiles** (`.stats`): bordered auto-fit grid with 1px rule gaps; each tile white, 16px 18px, a Condensed 30px figure over a 14px Ink 2 caption. The first tile holds the clock.
- **Table wrapper** (`.tbl`): white, hairline, 8px corners, horizontal scroll; the table inside is 14.5px with mono uppercase 11px heads and hairline row dividers.
- **Draft sheet** (`.doc`): white, hairline, 8px corners, 24px 28px padding, 15px/1.6 body with its own heading ramp; inline code on paper at 13px mono; `<placeholder>` runs on amber tint (`.ph`). Rendered from Markdown by marked and sanitised by DOMPurify.
- **Error flash** (`.flash`): red tint, red border and text, 6px corners, 12px 16px, message left and a small "Re-run" button pushed right.
- **Evidence lines** (`.evidence li`): paper ground, hairline, 4px corners, 12.5px mono, pre-wrap.
- **Details**: native `details` with an Ink 2 summary sentence; the body is a table wrapper. Used for the four registers.

### Inputs / Fields
None. The console is read, open and approve; the only prompt is the browser's `window.prompt` for the review token on a public deployment.

### Navigation
No bar, tabs or sidebar. The hero carries the logo link (30px mark and 22px Condensed wordmark in ink, 10px gap, 28px below) and the primary buttons anchor to `#draft`. The footer is a 13.5px Ink 3 paragraph.

### Steps (signature)
`ol.steps`: a counted list of white 6px-cornered rows (36px counter column, fluid text, auto tag; 10px 14px padding, 8px apart). The counter is Mono 600 14px in red; `.done` turns it green, `.pending` greys the whole row to Ink 3, `.running` draws the row border in blue and sets its tag blue, `.failed` keeps the red counter. Each row is a bold step name followed by a 14.5px Ink 2 sentence, and a right-aligned 11px mono tag naming the actor and time ("Nemotron Ultra · 09:14:02", "a person · running"). Eight rows: Sentinel, then detect, trace, read, triage, context, draft, review.

### Countdown (signature)
`b.clock` inside the first stat tile: Condensed 700 44px (36px below 560px), tabular numerals, red while the window is open, green with `.stopped` once filed, re-rendered once a second with no easing. Its caption reads "left in the 24-hour window" or "time from awareness to filing". The h1 announces the same state in words.

## Do's and Don'ts

### Do:
- **Do** write every colour as a `:root` variable and use hue and `-bg` tint as a pair; the stylesheet's only literal is the primary button's `#000` hover.
- **Do** make h1 and h2 sentences that state the condition of the system, in Plex Sans Condensed.
- **Do** set machine facts (SHAs, times, model ids, paths, status words, column heads) in Plex Mono at 11 to 13px and prose in Plex Sans at 16px/1.6.
- **Do** build a new surface as a white panel with a 1px rule border and an 8px (panel) or 6px (control, row) radius; separate bands with a single hairline.
- **Do** keep text columns at 720px inside the 1000px wrap; let tables, tile grids and the draft sheet run full width.
- **Do** print the status word inside its tag and use the ink-fill primary button only for the step that advances the incident.
- **Do** keep the clock the only red figure and turn it green on filing.

### Don't:
- **Don't** add shadows, blur, glows, gradients, glass or a dark bar; the page is paper and white panels, light only.
- **Don't** introduce a top bar, sidebar, tabs or a second column; the page reads top to bottom.
- **Don't** name or brand the provenance engine in the UI; the product is CRA Watch, the mark and wordmark are its whole identity, and the step says "provenance records".
- **Don't** add a weight that is not shipped (Sans 400/500/600, Condensed 600/700, Mono 400/500) or load fonts from a third party.
- **Don't** use pills, full-round corners or filled lifecycle badges; status is a 3px-cornered 12px mono tag.
- **Don't** signal with colour alone or use the semantic hues as decoration; every red, green, amber or blue element carries its word or is a link.
