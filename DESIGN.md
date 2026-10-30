---
name: CRA Watch
description: A one-column compliance document on Primer CSS. White page, Primer's type and colours, one red clock.
colors:
  fg-default: "#1f2328"
  fg-muted: "#59636e"
  fg-on-emphasis: "#ffffff"
  link-blue: "#0969da"
  verified-green: "#1a7f37"
  amber: "#9a6700"
  deadline-red: "#d1242f"
  bg-default: "#ffffff"
  bg-muted: "#f6f8fa"
  bg-accent-muted: "#ddf4ff"
  bg-attention-muted: "#fff8c5"
  bg-success-muted: "#dafbe1"
  bg-danger-muted: "#ffebe9"
  border-default: "#d1d9e0"
  border-muted: "#d1d9e0b3"
  accent-emphasis: "#0969da"
  danger-emphasis: "#cf222e"
  done-purple: "#8250df"
  neutral-emphasis: "#59636e"
  button-green: "#1f883d"
  button-green-hover: "#1c8139"
  button-default-bg: "#f6f8fa"
  button-default-hover: "#eff2f5"
  mark-tile: "#24292f"
  mark-arc: "#ff8182"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "6px"
  pill: "9999px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  base: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-default:
    backgroundColor: "{colors.button-default-bg}"
    textColor: "{colors.fg-default}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "5px 16px"
  button-default-hover:
    backgroundColor: "{colors.button-default-hover}"
  button-small:
    backgroundColor: "{colors.button-default-bg}"
    textColor: "{colors.fg-default}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "3px 12px"
  button-primary:
    backgroundColor: "{colors.button-green}"
    textColor: "{colors.fg-on-emphasis}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "5px 16px"
  button-primary-hover:
    backgroundColor: "{colors.button-green-hover}"
  button-primary-large:
    backgroundColor: "{colors.button-green}"
    textColor: "{colors.fg-on-emphasis}"
    typography: "{typography.body}"
    rounded: "0.5em"
    padding: "0.75em 1.5em"
  label-neutral:
    backgroundColor: "transparent"
    textColor: "{colors.fg-default}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 6px"
  label-accent:
    textColor: "{colors.link-blue}"
  label-attention:
    textColor: "{colors.amber}"
  label-danger:
    textColor: "{colors.deadline-red}"
  label-success:
    textColor: "{colors.verified-green}"
  label-large:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
  state-open:
    backgroundColor: "{colors.button-green}"
    textColor: "{colors.fg-on-emphasis}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  state-merged:
    backgroundColor: "{colors.done-purple}"
    textColor: "{colors.fg-on-emphasis}"
  state-closed:
    backgroundColor: "{colors.danger-emphasis}"
    textColor: "{colors.fg-on-emphasis}"
  state-draft:
    backgroundColor: "{colors.neutral-emphasis}"
    textColor: "{colors.fg-on-emphasis}"
  box:
    backgroundColor: "{colors.bg-default}"
    rounded: "{rounded.md}"
    padding: "16px"
  box-header:
    backgroundColor: "{colors.bg-muted}"
    textColor: "{colors.fg-default}"
    typography: "{typography.body}"
    padding: "16px"
  box-row-selected:
    backgroundColor: "{colors.bg-accent-muted}"
  draft-sheet:
    backgroundColor: "{colors.bg-default}"
    textColor: "{colors.fg-default}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "24px"
  draft-placeholder:
    backgroundColor: "{colors.bg-attention-muted}"
    rounded: "{rounded.sm}"
    padding: "0 3px"
  top-bar:
    backgroundColor: "{colors.bg-default}"
    textColor: "{colors.fg-default}"
    typography: "{typography.title}"
    padding: "12px 0"
  countdown:
    textColor: "{colors.deadline-red}"
    typography: "{typography.display}"
  countdown-stopped:
    textColor: "{colors.verified-green}"
---

# Design System: CRA Watch

## Overview

**Creative North Star: "The Filing, Read Top to Bottom"**

CRA Watch is a single 760px column read like a document: title and status, the time left, the pipeline that produced the evidence, two folded details, the draft, one green button. It inherits Primer CSS directly (GitHub's design system, vendored at `crawatch/static/vendor/primer.css`, light theme fixed through `data-color-mode="light"` on the root element). Nothing is themed or wrapped; the page is Primer's type ramp, colour variables, Box, Label, State, btn and TimelineItem, and the only custom stylesheet (`crawatch/static/app.css`, 23 lines) adds what Primer has no word for: the countdown sizes, the 760px page and its sticky white top bar, and column grids inside Box rows. The draft is rendered by marked, sanitised by DOMPurify and typeset by Primer's `markdown-body` inside a Box.

The world is quiet and bordered. White page, default ink, muted grey for everything secondary, 1px hairlines where a panel is needed. Status is said with pills: outline Labels classify (risk, source kind, a system up or down), filled State pills state the lifecycle of the incident (awaiting approval, filed, pipeline failed, demo running). Colour is reserved for meaning: blue is a link or a commit SHA, amber is a warning, red is the deadline and the failed step, green is the done step, the stopped clock and the approve button. The operational registers (watched dependencies, Sentinel register, journal, run ledger) live in a collapsed `details` in the footer so the reviewer's column stays the filing.

The product is branded CRA Watch only. The top bar carries a 24px clock-face mark in default ink and the words "CRA Watch"; the provenance engine behind the blast-radius trace is not named in the UI and has no mark, colour or typeface here. The earlier direction contract for this surface named an Origit-derived world (glass panels, glows, Onest at 13px, a dark console bar, two columns); the build supersedes it. Where brief and build disagree, the build is the system.

**Key Characteristics:**
- Primer components first; custom CSS only where Primer has no component (countdown sizes, page column and top bar, row grids).
- System font stack at 14px; no webfont, no build step.
- One display size on the page: the 56px countdown (40px below 544px).
- Outline pills classify, filled pills state lifecycle.
- Flat: hairlines and a grey Box header carry depth; the only shadows are Primer's own resting button shadow and State ring.
- One column, 760px, white edge to edge; nothing dark but the favicon.

## Colors

The palette is Primer's light theme used verbatim through its CSS variables (`--fgColor-*`, `--bgColor-*`, `--borderColor-*`); the frontmatter records the resolved values for tooling, the stylesheet never writes a hex except `#fff` on the two filled timeline badges.

### Primary
- **Link Blue** (`--fgColor-accent`, `--bgColor-accent-emphasis`): the advisory link under the title, source URLs, commit SHAs in the affected-commit and Sentinel rows, `Label--accent` for low risk, the running pipeline step's filled badge, and the selected commit row's wash (`--bgColor-accent-muted`). It is the colour of "this links to evidence".

### Secondary
- **Deadline Red** (`--fgColor-danger`): the running countdown (56px in the column, 14px in the top bar), `Label--danger` on high and critical risk and on a CVE/GHSA hit in the watchlist, detected and error journal verbs. `--bgColor-danger-emphasis` fills the failed step badge and the closed State pill ("Pipeline failed"); the error flash uses `--bgColor-danger-muted`.
- **Verified Green** (`--fgColor-success`): the stopped countdown after approval, `Label--success` on the "live" dot and the approval stamp, the filed journal verb, the done step badge (`--bgColor-success-emphasis`), the open State pill ("Awaiting approval", "Demo running"), and the primary button ("Run the live demo", "Approve and file"). The rollback row's wash is `--bgColor-success-muted`.

### Tertiary
- **Amber** (`--fgColor-attention`): `Label--attention` on medium risk and on "fixture" calls in the run ledger. `--bgColor-attention-muted` highlights `<placeholder>` fields inside the draft.
- **Done Purple** (`--bgColor-done-emphasis`): the merged State pill only, meaning "Filed". Appears nowhere else.

### Neutral
- **Default Ink** (`--fgColor-default`): body text, the h1, section heads, the brand, step names.
- **Muted Ink** (`--fgColor-muted`): all secondary text: the subtitle line, clock captions, actors, step descriptions, details summaries, the whole footer, timestamps, "clean" and "–".
- **Page White** (`--bgColor-default`): page, top bar, Box body, draft sheet.
- **Panel Grey** (`--bgColor-muted`): Box headers, default button fill, evidence blocks (`color-bg-subtle`), the pending timeline badge ground.
- **Hairline** (`--borderColor-default`, `--borderColor-muted`): the top bar's bottom rule, Box borders and headers; Box-row dividers and the timeline spine use the translucent muted variant.
- **Mark Slate** (#24292f) and **Mark Arc** (#ff8182): the favicon only, a dark tile with a 35% white clock ring, a white hand and a red arc from 12 to 3 marking the 24-hour window. The page itself has no dark surface; `theme-color` is white.

### Named Rules
**The Primer Variable Rule.** Colour is written as a Primer variable (`var(--fgColor-danger)`), never as a bare hex. A colour with no Primer light-theme variable is not a colour this system has.

**The Risk Ladder Rule.** Risk maps to Primer semantics and nothing else: none is muted text reading "clean", low is `Label--accent`, medium is `Label--attention`, high and critical are `Label--danger`. The word is always printed inside the pill; colour never carries risk alone.

**The One Red Rule.** Red at display size belongs to the countdown. Elsewhere red is 12px pill text or a journal verb. When the clock stops it turns green; nothing else on the page changes colour at approval.

## Typography

**Display Font:** Primer system stack (-apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial)
**Body Font:** the same stack
**Label/Mono Font:** ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono

**Character:** Whatever the reviewer's operating system considers plain. No webfont is loaded and there is no build step; the page reads like GitHub on the same machine. Monospace marks identifiers and machine facts (SHAs, timestamps, file paths, model ids, token counts) and nothing prose-like.

### Hierarchy
- **Display** (600, 56px, 40px below 544px, line-height 1, -0.02em, tabular numerals): the countdown, red while running, green when stopped. The only element above Primer's ramp.
- **Headline** (600, 24px, 22px below 768px, line-height 1.25; Primer `f2 lh-condensed`): the h1, which is the incident number ("INC-...") or "No open incident". One per page, with the State pill beside it.
- **Title** (600, 16px; Primer `f4`): the two section heads "Pipeline" and "Early warning", and the brand wordmark in the top bar. Box titles in the footer registers are Primer's `Box-title` at 14px/600.
- **Body** (400, 14px, line-height 1.5): the subtitle line under the h1, step names (600) with actors (muted), the draft (`markdown-body` pulled down from Primer's 16px to 14px so the filing reads at page size), the top-bar clock.
- **Label** (500 in pills, 400 elsewhere, 12px; Primer `f6` and `Label`): clock captions, step descriptions and times, details lists, the approval stamp, every footer register row, the footer note.
- **Mono** (400, 12px, tabular numerals): SHAs, HH:MM:SS, paths, model ids, token counts, evidence blocks.

### Named Rules
**The One Display Rule.** One number on the page is 56px, and it is the time left. The h1 stops at 24px; section heads at 16px.

**The Tabular Time Rule.** Anything that ticks or is compared in a column (countdown, top-bar clock, step times, ledger latencies) sets `font-variant-numeric: tabular-nums`.

## Layout

One column. `.page` is 760px wide, centred, with 16px side padding; it is the measure of the top bar, the main column and the footer alike. The top bar (`.top`) is sticky, white, 12px tall padding, a 1px hairline underneath: the mark and wordmark at left, the product name muted beside it (hidden below 544px), and, once an incident exists, a right-aligned link to `#report` carrying the incident number in 12px muted and the clock in 14px/600 red or green.

`main` has 32px vertical padding (`py-5`) and reads downward in fixed order: h1 row (title left, State pill and optional small demo button right, 32px below via `mb-4` + caption), countdown block (12px caption, 56px clock, 12px deadlines line, 32px below), "Pipeline" head and the condensed timeline, an optional error flash (16px above), then two native `details` (16px and 8px above) whose summaries are muted sentences ("8 affected commits across sessions #42, #47, roll back to a1b2c3d", "4 sources read by Tavily") and whose bodies are a Box of grid rows or a 12px list, then the "Early warning" section 32px below with the draft Box at 24px padding and an action row 12px below it.

The footer repeats the column at 12px muted with 24px vertical padding: a `details` whose summary names the four registers, then four Boxes stacked at 16px, then a one-paragraph note 24px below.

Inside Boxes the rhythm is Primer's stack: header and body at 16px padding, rows at 16px with a top hairline. Row content uses `.row-grid` (CSS grid, 8px gap, items centred) with per-register columns: commit rows (64px SHA, fluid subject, auto pill), watch rows (fluid, auto pill), journal rows (56px time, fluid), ledger rows (56px, 110px, fluid, 100px, 60px), affected rows (64px SHA, 36px session, fluid, auto pill; items start-aligned). One breakpoint, 543px: the ledger collapses to time and provider, the affected row's pill drops to a full-width second line, and the clock steps down to 40px.

The pipeline is Primer's condensed `TimelineItem`: a 2px spine in the muted hairline, 16px badges, 4px top padding per step, step name 14px/600 with actor appended muted and time floated right at 12px, description 12px muted. It always begins with Sentinel ("Nemotron Nano, at commit time") and ends with Review ("A person reads it and approves").

## Elevation & Depth

Flat. Depth is drawn, not cast: panels are white Boxes with a 1px `--borderColor-default` border and a `--bgColor-muted` header, rows divide by translucent hairlines, the top bar separates from the column by a single hairline and stays above it only because it is sticky. Selection and emphasis are tonal washes (accent-muted on the selected commit, success-muted on the rollback row, attention-muted on draft placeholders, danger-muted behind an error flash). The only shadows on the page are Primer's own: the resting 1px button shadow and the inset 1px ring on State pills and the done badge. No custom shadow exists in the overrides, and none should be added.

### Shadow Vocabulary
- **Button rest** (`box-shadow: 0px 1px 0px 0px #1f23280a`): Primer `btn` and `btn-primary` at rest; never applied by hand.
- **State ring** (`box-shadow: inset 0 0 0 1px <emphasis border>`): Primer `State` pills; keeps the filled pill crisp on white.
- **Running badge halo** (`box-shadow: 0 0 .2em var(--borderColor-accent-muted)`): Primer's own treatment on the active timeline badge.

### Named Rules
**The Drawn Depth Rule.** New surfaces get a 1px border and, if they need a lid, a `Box-header` fill. They do not get a shadow, a blur or a gradient.

## Shapes

Primer's two radii carry the page: 6px (`--borderRadius-medium`) on Boxes, buttons, the draft sheet, the evidence blocks (`rounded-2`); and the full pill (`--borderRadius-full`, 2em on State) on every status token. Timeline badges are 16px circles. Primer's `btn-large` on the approve button rounds at 0.5em (7px at 14px), a half-step the system tolerates because it is Primer's. The one custom radius is 4px on the amber placeholder highlight inside the draft, sized to sit inside a 14px line. Borders are 1px throughout; the only 2px stroke is the timeline spine. The favicon is a 64px tile with a 14px corner; the top-bar mark is the same clock face as a 24px stroked circle in `currentColor`.

## Components

### Buttons
- **Shape:** Primer `btn`, 6px corners, 1px border, 14px/500 text, 5px 16px padding, 80ms ease-out transition on colour and shadow.
- **Default small** (`btn btn-sm`, 12px text, 3px 12px padding): panel-grey fill, default ink, hairline border. "Poll feeds" and "Run scan" in footer Box headers, "Copy" and "Download" right-aligned under the draft, "Re-run" inside the error flash, "Run the live demo" beside the title once filed.
- **Primary** (`btn btn-primary`): button green fill, white text, translucent dark border. "Run the live demo" beside the "No open incident" title. Disabled while a precondition is unmet; while running it is replaced by a `State--open` "Demo running" pill.
- **Primary large** (`btn btn-primary btn-large`, 0.75em 1.5em, 0.5em radius): the single "Approve and file" button under the draft, with a 12px muted sentence beside it. The only large control on the page.
- **Hover / Focus:** Primer defaults: darker green or lighter grey on hover, 2px link-blue outline on `:focus-visible`. Busy state is a label change ("Working…"), never a spinner.

### Chips
- **Label** (outline pill, 12px/500, 18px line, 0 6px padding, hairline border in `currentColor`): classification. Neutral for source kind ("advisory", "class", "CRA"), "not polled", "offline". `Label--accent` low risk, `Label--attention` medium risk and "fixture", `Label--danger` high and critical risk and a CVE/GHSA hit, `Label--success` "live". The severity Label sits inline in the subtitle under the h1 ("high 8.2"); Sentinel flags on affected rows read "Sentinel high". `Label--large` (22px line, 0 8px) is the approval stamp, "Approved and filed HH:MM:SS after awareness", which replaces the approve button.
- **State** (filled pill, 14px/500, 4px 12px padding, 2em radius, white text, inset 1px ring): lifecycle only. `State--open` green "Awaiting approval" and "Demo running", `State--merged` purple "Filed", `State--closed` red "Pipeline failed", `State--draft` grey for any other status. One State per page, beside the h1.

### Cards / Containers
- **Box**: white, 1px hairline, 6px corners. `Box-header` panel grey with a 14px/600 `Box-title` and a right-aligned `btn-sm` or Label; `Box-row` 16px padding with a top hairline hosting a `row-grid`. Used for the four footer registers and for the affected-commit list inside its details.
- **Draft sheet** (`markdown-body Box p-4`): the Box at 24px padding carrying the rendered Markdown at 14px, with `<placeholder>` runs on amber (`.ph`).
- **Selected row**: `commit-row.selected` takes the accent-muted wash; `cursor: pointer`, `role="button"`, `tabindex="0"`; the commit detail renders below the register as a `Box-row` with 12px mono evidence blocks on `color-bg-subtle` at 8px padding.
- **Rollback row**: the last affected row on `color-bg-success`, "Last clean commit".
- **Details**: native `details` with a muted `summary` sentence; no Box around the disclosure, the Box (or list) sits inside 8px below the summary. Three uses: affected commits, sources, the footer registers.
- **Error flash**: Primer `flash flash-error`, danger-muted fill, 6px corners, message left and `btn-sm` "Re-run" right.

### Inputs / Fields
No text inputs exist on the page; the console is read, open and approve. The one prompt is the browser's own `window.prompt` for the review token on a public deployment.

### Navigation
- **Top bar** (`.top`): sticky white, hairline below, 12px vertical padding, `.page` measure. Brand link in default ink at 16px/600 with the 24px mark, no underline on hover; product name muted beside it; the mini clock (`.clock-mini`) right-aligned as a link to `#report`, incident number 12px muted then the time 14px/600 red or green.
- No tabs, no sidebar, no breadcrumbs. Incidents other than the current one are not navigated to in this build.

### Timeline (signature)
Primer `TimelineItem TimelineItem--condensed`: 16px badge on a 2px muted spine, step name 14px/600 default ink with the actor muted (`· Tavily`, `· Nemotron Ultra on Nebius`), time floated right at 12px, description 12px muted. Badge states: done is Primer's `TimelineItem-badge--success` (green fill, white check octicon), running is accent-emphasis fill with a white dot, failed is danger-emphasis fill with a white x, pending is a muted dot on panel grey. Eight steps: Sentinel, then detect, trace, read, triage, context, draft, review.

### Countdown (signature)
`.clock`: 56px/600 (40px below 544px), line-height 1, -0.02em, tabular numerals, `--fgColor-danger` while running, `--fgColor-success` once `stopped`. It sits between a 12px caption ("Early warning due in" or "Filed after") and a 12px line with awareness, 24 h and 72 h times, 32px above the Pipeline head. The top bar mirrors it at 14px. Approval swaps the approve button for the `Label--success Label--large` stamp and flips both clocks green; that is the whole approval animation.

## Do's and Don'ts

### Do:
- **Do** reach for a Primer component before writing CSS: Box for any panel, Label for any classification, State for any lifecycle status, btn for any action, TimelineItem for any sequence, flash for any inline error, native `details` for anything folded.
- **Do** write colour as a Primer variable (`var(--fgColor-danger)`), as `app.css` does; the only literal allowed is `#fff` on a filled badge.
- **Do** keep the type ramp to Primer's `f2` (24px), `f4` (16px), body (14px), `f6` (12px) and mono at 12px; the 56px countdown is the single exception.
- **Do** keep everything inside the 760px `.page` measure, including any new header or footer content.
- **Do** put identifiers and machine facts (SHAs, times, paths, model ids, token counts) in `text-mono` with tabular numerals.
- **Do** lay out Box-row content with `row-grid` and an 8px gap, collapsing to fewer columns below 544px, as the ledger and affected rows do.
- **Do** print the risk word inside its pill (`low`, `medium`, `high`, `critical`) and reserve "clean" and "–" in muted text for none and unscanned.
- **Do** use `btn-primary` only for the step that advances the incident (run the demo, approve and file), and `btn-large` only for approve.

### Don't:
- **Don't** add glass, backdrop blur, background glows, gradients or custom shadows; the rebuild dropped the earlier Origit-style glass world and the page is flat by construction.
- **Don't** add a dark bar or dark panel; the page is white edge to edge and the favicon is the only dark tile.
- **Don't** load a webfont or add a build step; the system stack at 14px is the typeface.
- **Don't** hard-code a hex that Primer already names, and don't invent a colour Primer's light theme lacks.
- **Don't** name or brand the provenance engine in the UI; the product is CRA Watch, the top bar carries only its mark and wordmark.
- **Don't** use a filled State pill for classification or an outline Label for lifecycle; the two pill families are not interchangeable.
- **Don't** add a second column or a second display-size number; the filing reads top to bottom and the countdown owns 56px.
- **Don't** signal with colour alone; every coloured token on the page carries its word (the risk pill, the step name, the journal verb).
