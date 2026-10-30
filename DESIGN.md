---
name: CRA Watch
description: A controlled document on a desk. One incident, one clock, one stamp.
colors:
  desk: "#e9ecf0"
  desk-2: "#dfe3e9"
  paper: "#ffffff"
  paper-2: "#f6f7f9"
  ink: "#17213a"
  ink-2: "#4a5468"
  ink-3: "#7a8396"
  rule: "#c9cfd9"
  rule-2: "#e3e7ed"
  accent: "#d6381c"
  accent-ink: "#b22d14"
  accent-soft: "#fbe9e5"
  ok: "#1f7a4d"
  ok-soft: "#e3f3ea"
  warn: "#b7791f"
  warn-soft: "#fbf0d9"
  focus: "#1f4fd6"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 90"
    fontFeature: "tabular-nums"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 85"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
    fontVariation: "'wdth' 100"
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  mono:
    fontFamily: "ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
  ramp:
    display: "3.75rem"
    displayMobile: "2.4rem"
    xl: "1.5rem"
    lg: "1.25rem"
    base: "1rem"
    md: "0.9rem"
    sm: "0.8rem"
    xs: "0.74rem"
    mono: "0.78rem"
    root: "15px"
    rootMobile: "14px"
rounded:
  none: "0"
  control: "2px"
  stamp: "3px"
  stamp-big: "4px"
  dot: "50%"
spacing:
  hair: "0.2rem"
  xs: "0.5rem"
  sm: "0.8rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "1.5rem"
  2xl: "2rem"
components:
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.4rem 0.8rem"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "0.3rem 0.6rem"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.2rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-ink}"
    textColor: "{colors.paper}"
  chip-system:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.2rem 0.45rem"
    typography: "{typography.label}"
  severity-high:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.none}"
    padding: "0.1rem 0.5rem"
  severity-medium:
    backgroundColor: "{colors.warn-soft}"
    textColor: "{colors.warn}"
    rounded: "{rounded.none}"
    padding: "0.1rem 0.5rem"
  severity-low:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok}"
    rounded: "{rounded.none}"
    padding: "0.1rem 0.5rem"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.stamp}"
    padding: "0.25rem 0.7rem"
  stamp-live:
    backgroundColor: "transparent"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.stamp}"
    padding: "0.25rem 0.7rem"
  stamp-ok:
    backgroundColor: "transparent"
    textColor: "{colors.ok}"
    rounded: "{rounded.stamp}"
    padding: "0.25rem 0.7rem"
  stamp-filed:
    backgroundColor: "transparent"
    textColor: "{colors.ok}"
    rounded: "{rounded.stamp-big}"
    padding: "0.5rem 0.9rem"
  document:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.6rem 2rem 2.2rem"
  register-block:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.9rem 1rem 1rem"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2rem 2.4rem 1.6rem"
  notice:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0.9rem"
  callout:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0.9rem"
  tab:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.7rem"
  tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: CRA Watch

## Overview

**Creative North Star: "The Deviation Report"**

CRA Watch is a controlled document, not a dashboard. The page is built the way a GMP deviation report is built: a numbered incident record with a header grid of fields, a classification scale, an evidence index, a drafted notice on its own sheet and a signature block at the end. Reading the page is reviewing it. The register of pre-incident checks sits beside the record like a binder on the same desk. The build refuses the category default (KPI tiles, charts, a feed) and the terminal opposite (a log dump); the machinery is shown once, in words, with the model id and the time it took.

The scene is office daylight: white paper on a cool grey desk, navy ink, hairline rules. There is one accent, signal vermilion, and it is spent on exactly three things: the live countdown, the "awaiting approval" stamp and the primary action. Verified green answers it when the draft is approved and the clock stops. Everything else is ink at three strengths. Density is high but ruled: fields and table rows are separated by hairlines, not whitespace, so the reviewer can scan a long record without losing the column.

Archivo, a single variable face, carries the whole document. Its width axis does the hierarchy work: condensed (wdth 85 to 90) for the incident number, the brand and the clock; normal width for everything readable; tabular figures wherever a time or a count appears. Controls are form controls on a form: rectangular, one-pixel ink border, two-pixel corners. The stamp is the only rotated element and the only thing that moves with any theatre.

**Key Characteristics:**
- Two-layer light scene: white paper documents on a cool grey desk, no dark surfaces.
- One accent (vermilion) reserved for the clock, the stamp and the primary action.
- Hairline rules and 1px ink borders structure the page; whitespace is secondary.
- One face (Archivo variable), width axis for hierarchy, tabular numerals for every figure.
- Rectangular, 2px-cornered controls; stamps are the single rotated, rounded element.
- Depth is flat except the draft sheet, which lifts off the record with one soft shadow.

## Colors

A daylight desk: three neutral layers, three ink strengths, and one signal red with green and amber as its answers.

### Primary
- **Signal Vermilion** (`accent`): the live countdown, the running step's sweep, the "awaiting approval" stamp border, the Approve and file button, the "off" dot on a system chip and the Sentinel scale at high. Used on well under a tenth of the page; its rarity is what makes the clock read as urgent.
- **Pressed Vermilion** (`accent-ink`): the darker, legible form of the accent for text and large figures: the clock digits, stamp text, severity chip text, watchlist hits, failed step bars, deletion lines in a diff, and the hover state of the primary button.
- **Vermilion Wash** (`accent-soft`): the background of high and critical severity chips, the error notice and the un-swept part of a running step bar.

### Secondary
- **Verified Green** (`ok`): approval and health. The stopped clock, the "Approved · Filed" stamp, the step checkmark, the "on" dot on a system chip, the live journal dot, low severity, added diff lines.
- **Green Wash** (`ok-soft`): low severity chip background and the rollback commit row in the affected-components table.

### Tertiary
- **Audit Amber** (`warn`): medium severity text, the "fixture" marker in the ledger, placeholder text in the draft (with a dashed underline in the same colour).
- **Amber Wash** (`warn-soft`): medium severity chip background and placeholder highlight in the draft.
- **Focus Blue** (`focus`): the 2px keyboard focus outline only. It appears nowhere else.

### Neutral
- **Desk** (`desk`): page background, the grey desk every document sits on.
- **Desk Shade** (`desk-2`): the mid tone in the loading skeleton sweep; the only second desk tone.
- **Paper** (`paper`): every document, register block, band and sheet; also the text colour on inverted controls (ink or accent fill).
- **Paper Shade** (`paper-2`): tinted surfaces inside a document: system chips, hovered and current register rows, inline code, evidence lines, diff blocks, callouts, unselected tabs.
- **Ink** (`ink`): body text, headings, 1px control borders, the 2px rule under the document head, the 1px rule above the signature block, the current-commit bar, selection background, filled "done" step bars.
- **Ink Light** (`ink-2`): secondary text: register headings, step actor and text, commit SHAs, file lists, callouts, ghost buttons.
- **Ink Faint** (`ink-3`): field labels, hints, timestamps, metadata, the quiet stamp, pending ladder steps. Always paired with 0.74 to 0.85rem sizes; never used for body copy.
- **Rule** (`rule`): document, register, chip and ladder borders; the dashed "unscanned" scale.
- **Rule Faint** (`rule-2`): hairlines between rows, fields and ladder steps; the idle step bar and empty scale cells.

### Named Rules
**The One Accent Rule.** Vermilion marks the live clock, the awaiting stamp, the primary action and high or critical severity. Nothing else on the page is red. A new red element must be one of those four things.

**The Answering Green Rule.** Green is only ever the answer to a vermilion state: the clock that stopped, the stamp that pressed, the step that completed, the system that is on. It never introduces a state of its own.

**The Three Inks Rule.** Text is `ink` (read it), `ink-2` (read it second) or `ink-3` (metadata, labels, times). No fourth grey.

## Typography

**Display Font:** Archivo variable (wdth 62 to 125, wght 100 to 900), self-hosted woff2 under the OFL, with Helvetica Neue and Arial as fallbacks
**Body Font:** Archivo (same file; the width axis changes, the face does not)
**Label/Mono Font:** system monospace stack (ui-monospace, SF Mono, Menlo) for commit SHAs, evidence lines and diffs

**Character:** One grotesque at three widths. Condensed Archivo for the document number and the clock reads like a form's pre-printed header; normal-width Archivo for the body reads like what was typed into it. Tabular numerals are on for the whole body (`tnum`), so columns of times and counts align without extra classes.

### Hierarchy
The ramp is eight tokens in `:root`, and every `font-size` in app.css uses one of them. Root is 15px (14px under 720px), so the rem values below are the only sizes on the page.

| Token | Size | Used for |
|---|---|---|
| `--fs-display` | 3.75rem (56px), 700, line-height 1, wdth 90, -0.01em | the early-warning countdown only; `--fs-display-mobile` 2.4rem under 720px; vermilion while running, green when stopped |
| `--fs-xl` | 1.5rem, 700, wdth 85, 0.005em | the incident number (h1) |
| `--fs-lg` | 1.25rem | the band's running-header clock; the draft sheet's h1 |
| `--fs-base` | 1rem, line-height 1.45 (prose 1.55 at 72ch) | body, document field values (500), the draft prose, section titles (700), the brand name (700, wdth 88) |
| `--fs-md` | 0.9rem | buttons, step names (700), the band product line, the primary action |
| `--fs-sm` | 0.8rem | register rows, tables, step text (line-height 1.35), hints, notes, journal, sources, tabs |
| `--fs-xs` | 0.74rem, 600, 0.08em, uppercase for labels | field labels, table headers, step numbers, journal keys, meta lines, severity chips, stamps (800, 0.14em), the big stamp's second line |
| `--fs-mono` | 0.78rem, ui-monospace | SHAs, evidence lines, diffs |

Inline code inside the draft prose is 0.85em of its line.

### Named Rules
**The Width Axis Rule.** Hierarchy comes from Archivo's width axis and weight, not from a second face. Condense (wdth 85 to 90) only for the incident number, the brand and the clock; everything readable stays at wdth 100.

**The Tabular Figures Rule.** Every time, duration, count, SHA column and step number renders in tabular numerals. The clock must never jitter as digits change.

**The Field Label Rule.** Labels are 0.74rem, 600, tracked 0.08em, uppercase, faint ink, and sit directly above or beside the value they name. They label a field; they are never used as decorative kickers above headings.

## Layout

The page is a desk grid: a 340px register column and a fluid report column (`340px minmax(0, 1fr)`), 1.25rem gutter, 1.25rem 1.5rem 3rem padding, capped at 1600px and centred. The band above is a sticky four-column grid (brand, manufacturer and product, system chips, running-header clock) at 0.85rem 1.5rem padding with a 1px rule beneath it. The register sticks under the band (top 72px) only on tall viewports (min-height 1100px); otherwise it scrolls with the page.

Inside the document, the header grid of fields is six equal columns, with the clock field spanning two; each field has 0.8rem vertical padding, a hairline on its right and 0.9rem of gap, under a 1px rule. The three-field variant (pre-incident checks) is `repeat(3, 1fr)`. Sections open with 1.4rem of top padding and a numbered title. The ladder is seven equal columns in one bordered row. Sources read is a two-column CSS column list. The signature block is two equal columns with a 1.2rem gap above a full-width action row.

Rhythm is tight and ruled: 0.2rem inside a field, 0.5rem between register rows and grid cells, 0.8rem under titles, 1rem between register blocks, 1.25rem between documents and around the desk, 1.5rem band and desk side padding, 2rem above the signature block and inside the sheet.

Responsive behaviour (two breakpoints only):
- **Under 1100px:** single column; the register goes static above the report; the ladder wraps to four columns with a hairline top on rows two onward; fields go to three columns with the clock spanning all three.
- **Under 720px:** root type drops to 14px; the band stacks and loses its stickiness while the clock row inside it becomes the sticky element (full-bleed, 1px rules top and bottom, white paper); desk and document padding tighten to 1rem; fields go two columns; the ladder goes two columns; the signature block and sources stack to one column; the clock drops to 2.4rem; the affected-components table scrolls sideways inside a full-bleed wrapper with a 28px fade mask at the right edge and a "scroll sideways" hint in the section title.

## Elevation & Depth

The system is flat. Depth is conveyed by the two-layer scene (white paper on grey desk) and by borders: 1px `rule` around documents and register blocks, a 2px ink rule under the document head, hairlines between rows. One exception is deliberate: the draft sheet sits on top of the incident record with a single soft shadow, so the thing the reviewer signs reads as a separate sheet of paper laid on the file. The big approval stamp uses `mix-blend-mode: multiply` so its ink sits into that paper rather than on it. Inset state is a 2px ink bar (`box-shadow: inset 2px 0 0`) on the current commit row.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 1px 2px rgba(23, 33, 58, .06), 0 8px 24px -12px rgba(23, 33, 58, .25)`): the draft sheet only. Ink-tinted, diffuse, no offset edge.

### Named Rules
**The One Sheet Rule.** Only the draft sheet casts a shadow. Documents, register blocks, chips, buttons and stamps are flat; they get a border, not a lift.

## Shapes

Rectangular paper. Documents, register blocks, chips, tables, fields, tabs and the ladder have square corners and a 1px border. Buttons are the only control with a corner, and it is 2px. Stamps are the exception that proves the form: 3px corners (4px for the big filed stamp), a 2px (3px) border in their own colour, tracked uppercase text and a rotation of -2deg (the small stamps) or -8deg (the filed stamp). Status dots are 7px circles. The Sentinel scale is four 10px cells with 2px gaps filled left to right (one green, two amber, three vermilion, four pressed vermilion; dashed `rule` outline when unscanned). The product mark is a 22px square outline with a clock hand, square line caps.

Borders carry meaning: ink borders on things you act on (buttons, the section number box, the tab in focus), `rule` borders on containers, `rule-2` hairlines on dividers. The quiet stamp is dashed and unrotated; it is a placeholder for a stamp that has not been pressed.

## Components

### Buttons
Form controls on a controlled document: small, bordered, confident, no decoration.
- **Shape:** rectangular with 2px corners, 1px border.
- **Outline (default):** paper background, ink text and border, 0.4rem 0.8rem padding, 0.82rem / 600 / 0.01em. Hover inverts to ink fill with paper text. Active nudges down 1px. Disabled sits at 45% opacity and does not invert.
- **Ghost:** `rule` border, `ink-2` text, 0.74rem, 0.3rem 0.6rem; used for register actions (Poll feeds, Run scan). Hover darkens the border to ink.
- **Primary:** vermilion fill and border, paper text, 0.7rem 1.2rem, 0.92rem. Hover goes to pressed vermilion. Used once per page: Approve and file.
- **Busy:** text goes transparent and a 14px two-tone ring spins in place (0.7s linear); white ring on the primary.
- **Focus:** 2px `focus` blue outline, 2px offset, on every control.

### Chips
- **System chip:** inline, 1px `rule` border, `paper-2` fill, 0.2rem 0.45rem, 0.74rem, square corners, with a 7px dot that is green when the system is on and vermilion when off; a faint secondary id (max 180px, ellipsed). Chips wrap within a 560px band column.
- **Severity chip:** uppercase 0.78rem / 700 / 0.08em, 1px border in `currentColor`, 0.1rem 0.5rem. High and critical: pressed vermilion on vermilion wash. Medium: amber on amber wash. Low: green on green wash.
- **Stamp:** inline, 2px border and text in one colour, 0.25rem 0.7rem, 0.78rem / 800 / 0.14em uppercase, 3px corners, rotated -2deg. Variants: quiet (faint ink, dashed, unrotated, 600), live (vermilion border, pressed vermilion text: "awaiting approval"), ok (green), fail (pressed vermilion).

### Cards / Containers
- **Document (`doc`):** paper, 1px `rule` border, square corners, 1.6rem 2rem 2.2rem padding (1.1rem 1rem 1.4rem on mobile); stacked documents are 1.25rem apart. Its head is a flex row ending in a 2px ink rule.
- **Register block:** paper, 1px `rule` border, 0.9rem 1rem 1rem padding, an uppercase 0.8rem heading with its action button on the same line, rows separated by `rule-2` hairlines.
- **Sheet:** paper with the sheet-lift shadow, no border, 2rem 2.4rem 1.6rem padding, 72ch prose; the only container that is not flat.
- **Notice:** vermilion wash with a vermilion border and pressed-vermilion text, 0.7rem 0.9rem; its button adopts the pressed vermilion border. **Callout:** `paper-2` with a `rule` border and `ink-2` text, same padding.
- **Ledger:** a details element whose summary is a bordered paper bar with an uppercase 0.8rem heading left and the call counts right; open, the table sits in a bordered paper well capped at 320px with its own scroll. Fixture calls are marked in amber.

### Inputs / Fields
There are no text inputs. The document field is the input-like unit: a label above a 0.95rem / 500 value with an optional 0.76rem faint sub line, 0.8rem vertical padding, a hairline on its right. Values break anywhere so hashes never overflow the column.

### Navigation
- **Band:** sticky paper strip with a 1px rule beneath; brand mark and name (condensed 700) with a faint subtitle, manufacturer and product as label/value pairs, the system chips, and a running-header clock (incident number in condensed 0.9rem, time in 1.25rem pressed vermilion tabular figures, a faint uppercase label beneath) separated by a 1px left rule. Under 720px the band is static and the clock row is the sticky element.
- **Incident tabs:** `paper-2` bordered buttons, 0.78rem; the selected tab inverts to ink fill with paper text.
- **Register rows:** commit rows hover to `paper-2` bleeding 0.5rem outside the block; the current one adds a 2px inset ink bar on the left.

### Step Ladder (signature component)
Seven numbered steps in one bordered row, hairlines between. Each step: a faint tracked step number, a 0.9rem / 700 name, a 0.76rem actor line in `ink-2`, a 0.76rem text block and a faint tabular timestamp. A 3px bar on the top edge carries state: `rule-2` when pending (and the step's text drops to faint ink), ink when done (with a 12px green inline checkmark after the name), pressed vermilion when failed, and when running a vermilion sweep that scrolls across a vermilion-wash track (1.1s linear). Background transitions are 0.25s ease-out. Reduced motion stops the sweep.

### Clock (signature component)
The early-warning countdown is the display face: 3.75rem condensed tabular figures in pressed vermilion, in a field spanning two header columns, with the three deadlines beneath in faint 0.76rem. It turns green and stops on approval. A copy at 1.25rem rides in the band so the reviewer can read the draft without losing the time.

### Approval Stamp (signature component)
On approval the sheet is stamped: "Approved · Filed" and the elapsed time since awareness, absolutely placed top right of the sheet, green 3px border and text, 1rem / 900 / 0.16em uppercase, 4px corners, rotated -8deg, multiply-blended into the paper. It presses in over 0.35s with a `cubic-bezier(.2, .9, .3, 1)` scale from 1.6 to 1 and fades in by 60%. The animation is removed under reduced motion; the stamp still appears.

### Signature Block
Two columns above the actions, separated from the prose by a 1px ink rule and 2rem of space: "Drafted by" (model id, 0.86rem) and "Reviewed and approved by", whose value is an empty 1.9rem-tall signature line (1px ink bottom border) until approval writes the name onto it at 0.9rem / 600. The action row holds the primary button, outline buttons for copy and download, and a faint 0.78rem hint.

## Do's and Don'ts

### Do:
- **Do** put every document, register block and sheet on white paper with a 1px `rule` border over the grey desk; the two-layer scene is the whole depth model.
- **Do** spend vermilion only on the live clock, the awaiting stamp, the primary action and high or critical severity, and answer it with green when the state resolves.
- **Do** set every figure (times, counts, SHAs, step numbers) in tabular numerals and keep the countdown in condensed Archivo (wdth 90) at 3.75rem.
- **Do** build new controls as 1px-ink-bordered rectangles with 2px corners, 0.82rem / 600 text, inverting to ink fill on hover.
- **Do** structure dense data with `rule-2` hairlines between rows and fields rather than extra vertical space.
- **Do** keep field labels at 0.74rem / 600 / 0.08em uppercase in faint ink, directly attached to the value they name.
- **Do** give every live or running state a motion that stops under `prefers-reduced-motion` and leaves the state still legible.

### Don't:
- **Don't** add a second accent, a chart, a KPI tile, a gradient surface or a dark panel; this is a document in daylight, not a dashboard.
- **Don't** cast shadows on anything except the draft sheet; containers get borders.
- **Don't** round corners beyond 2px on controls; only stamps carry 3 to 4px corners and only stamps rotate.
- **Don't** introduce a second typeface for display or headings; use Archivo's width axis instead. Monospace is for commit SHAs, evidence paths and diffs only.
- **Don't** use `ink-3` for body copy or at sizes above 0.85rem; it is a metadata colour.
- **Don't** use focus blue for anything but the keyboard focus outline.
