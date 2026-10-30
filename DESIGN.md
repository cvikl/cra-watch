---
name: CRA Watch
description: A page of the Origit console in daylight. Glass panels on paper, pills for everything you touch, one clock.
colors:
  ink: "#0d1117"
  fg: "#1f2328"
  fg-2: "#424a53"
  muted: "#59636e"
  muted-2: "#818b98"
  paper: "#f6f8fa"
  panel: "rgba(255, 255, 255, .78)"
  panel-solid: "#ffffff"
  topbar: "rgba(255, 255, 255, .72)"
  tile: "#f6f8fa"
  tile-2: "#eaeef2"
  btn: "#f6f8fa"
  btn-hover: "#eaeef2"
  tab-selected: "#ffffff"
  hair: "rgba(31, 35, 40, .15)"
  hair-2: "rgba(31, 35, 40, .08)"
  glass-border: "rgba(31, 35, 40, .1)"
  link: "#0969da"
  link-bg: "rgba(9, 105, 218, .1)"
  accent: "#9a6700"
  accent-bg: "rgba(212, 167, 44, .2)"
  danger: "#d1242f"
  danger-bg: "rgba(255, 129, 130, .22)"
  ok: "#1a7f37"
  ok-bg: "rgba(74, 194, 107, .22)"
  green-btn: "#1f883d"
  purple: "#8250df"
  tab: "#fd8c73"
typography:
  display:
    fontFamily: "Onest, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tabular-nums"
  headline:
    fontFamily: "Onest, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Onest, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Onest, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.005em"
    fontFeature: "tabular-nums"
  label:
    fontFamily: "Onest, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
  key:
    fontFamily: "'SF Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "10px"
    fontWeight: 600
    letterSpacing: "0.06em"
  mono:
    fontFamily: "'SF Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    letterSpacing: "0"
rounded:
  pill: "999px"
  lg: "16px"
  tile: "12px"
  md: "10px"
  code: "6px"
  dot: "50%"
spacing:
  2xs: "2px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  gutter: "32px"
components:
  button:
    backgroundColor: "{colors.btn}"
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "36px"
  button-hover:
    backgroundColor: "{colors.btn-hover}"
    textColor: "{colors.fg}"
  button-ghost:
    backgroundColor: "{colors.btn}"
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    padding: "0 13px"
    height: "30px"
    typography: "{typography.label}"
  button-primary:
    backgroundColor: "{colors.green-btn}"
    textColor: "{colors.panel-solid}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.ok}"
    textColor: "{colors.panel-solid}"
  pill-system:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  pill-sha:
    backgroundColor: "{colors.link-bg}"
    textColor: "{colors.link}"
    rounded: "{rounded.pill}"
    height: "22px"
    width: "72px"
    typography: "{typography.mono}"
  counter:
    backgroundColor: "rgba(31, 35, 40, .1)"
    textColor: "{colors.fg-2}"
    rounded: "{rounded.pill}"
    padding: "0 6px"
    height: "20px"
  stamp:
    backgroundColor: "rgba(31, 35, 40, .08)"
    textColor: "{colors.fg-2}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "24px"
  stamp-live:
    backgroundColor: "{colors.accent-bg}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "24px"
  stamp-ok:
    backgroundColor: "{colors.ok-bg}"
    textColor: "{colors.ok}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "24px"
  stamp-fail:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "24px"
  stamp-filed:
    backgroundColor: "{colors.ok-bg}"
    textColor: "{colors.ok}"
    rounded: "{rounded.tile}"
    padding: "8px 14px"
  severity-high:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "22px"
  severity-medium:
    backgroundColor: "{colors.accent-bg}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "22px"
  severity-low:
    backgroundColor: "{colors.link-bg}"
    textColor: "{colors.link}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "22px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "20px 22px 24px"
  register-block:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "16px 18px 14px"
  tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.fg}"
    rounded: "{rounded.tile}"
    padding: "12px 14px"
  step:
    backgroundColor: "{colors.panel-solid}"
    textColor: "{colors.fg}"
    rounded: "{rounded.tile}"
    padding: "12px 12px 14px"
  sheet:
    backgroundColor: "{colors.panel-solid}"
    textColor: "{colors.fg}"
    rounded: "{rounded.tile}"
    padding: "22px 26px 18px"
  callout:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.muted}"
    rounded: "{rounded.tile}"
    padding: "12px 14px"
  notice:
    backgroundColor: "rgba(255, 129, 130, .14)"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "14px 18px"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.fg-2}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "32px"
  tab-selected:
    backgroundColor: "{colors.tab-selected}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "32px"
---

# Design System: CRA Watch

## Overview

**Creative North Star: "The Origit Console, in Daylight"**

CRA Watch is not a product with its own look. It is one page of the Origit console (origit.uk, the provenance console the founder built in September 2026) rendered for a lit office instead of a dark room. Every piece of grammar is Origit's: frosted glass panels with 16px corners floating on a ground that carries three faint radial glows (blue top-left, purple top-right, green bottom-centre), pills for every button, tag, tab and counter, SHA chips in link blue mono, session numbers in purple mono, Onest at a 13px base with Origit's nine-step size ramp, SF Mono for identifiers. What changed is only the light: the dark `#0d1117` ground became `#f6f8fa` paper, the panels became white at 78% opacity, the GitHub-dark accents became their GitHub-light counterparts. A reviewer who knows the console recognises it immediately; nothing on the page asks to be learned.

Colour is role-bound, not decorative. Link blue is the colour of anything that is a reference (SHAs, hunks, low risk, the running step, focus); amber is the colour of waiting and caution (the "awaiting approval" tag, medium severity, fixture markers, placeholders in the draft); red is the live clock, danger and failure; green is health, approval and the one primary action. Everything else is five greys on paper. The build refuses the category dashboard (no KPI cards, no charts, no feed) and the terminal (no log dump); the machinery is shown once, in words, with the model id and the time it took, inside the same glass.

Density is Origit's: 13px body, 12px labels, 11.5px metadata, hairlines between rows, tiles for fields. Depth is real but soft: panels blur what is behind them and cast a diffuse ink-tinted shadow; tiles, steps and the draft sheet sit flat inside them. Motion is state only: a sweep on the running step, a spin in a busy button, the approval stamp pressing onto the sheet.

**Key Characteristics:**
- Inherited world: origit.uk's component grammar and type ramp; the palette is its light counterpart, hue for hue.
- Paper ground with three fixed radial glows (blue, purple, green) under frosted white glass panels.
- Pills everywhere you touch or read a status: buttons, tags, tabs, SHAs, counters, system chips.
- Four role colours (link blue, amber, danger red, verified green) plus purple for session ids; five greys for text.
- Onest 13px base, nine fixed pixel sizes, tabular numerals on the whole page, SF Mono for identifiers.
- Three corner sizes: 16px glass, 12px tiles, 10px rows and code blocks; everything else is a pill.

## Colors

GitHub-light on paper: the Origit console's dark accents transposed to their light-mode equivalents, with ink-tinted translucency where the original used near-black.

### Primary
- **Link Blue** (`link`): the reference colour. Commit SHAs, diff hunks, the "more" link, the running step's sweep, the low-risk cell of the Sentinel scale, low severity, text selection and every keyboard focus ring. In the band clock the incident number sits in it. Its tint (`link-bg`, 10%) backs SHA pills, the current commit row and low-severity chips.

### Secondary
- **Verified Green** (`ok`): health and resolution. The stopped clock, "on" system pills, completed step bars, the step checkmark, approval stamps, the rollback row, added diff lines. Its tint (`ok-bg`) backs the approval stamps and the rollback row. **Action Green** (`green-btn`): the fill of the single primary button, which hovers to `ok`.
- **Danger Red** (`danger`): the live countdown, "off" system pills, failed step bars, high and critical severity, watchlist hits, error journal keys, deleted diff lines and the error notice border. Its tint (`danger-bg`) backs high-severity chips, the fail stamp, deleted lines and the notice.

### Tertiary
- **Audit Amber** (`accent`): waiting and caution. The "awaiting approval" tag, medium severity, the medium cells of the Sentinel scale, the FIXTURE marker in the ledger, placeholder text in the draft. Its tint (`accent-bg`) backs the live stamp, medium chips and placeholders.
- **Session Purple** (`purple`): Origit session numbers (`#42`) under a SHA, in mono. Nothing else.
- **Tab Coral** (`tab`): the 2px inset underline of the selected incident tab, inherited from Origit's selected-tab mark. Never used as text or fill.

### Neutral
- **Ink** (`ink`): the brand name, the mark, selected tab text, and the mask colour for the sideways-scroll fade.
- **Foreground** (`fg`): body text, values, headings, step names, prose.
- **Foreground 2** (`fg-2`): secondary reading text: table cells, step text, commit subjects, stamps, counters, tabs at rest, journal rows.
- **Muted** (`muted`): labels, register headings, hints, sub lines, actors, legends, "quiet" states, pending step names.
- **Muted 2** (`muted-2`): timestamps, system ids, idle dots, the signature line, the scrollbar thumb.
- **Paper** (`paper`): the page ground under the glows. **Tile** (`tile`, same value): field tiles, callouts, evidence lines, diff blocks, default button fill (`btn`). **Tile 2** (`tile-2`): button hover and the mid tone of the skeleton sweep.
- **Panel** (`panel`): the frosted glass of documents, register blocks and the ledger, 78% white. **Panel Solid** (`panel-solid`): ladder steps, the draft sheet, the selected tab, primary button text. **Topbar** (`topbar`): the band's glass, 72% white.
- **Hair** (`hair`) and **Hair 2** (`hair-2`): 15% and 8% ink rules. `hair` borders controls, system pills, the band and table heads; `hair-2` divides rows, fields and steps. **Glass Border** (`glass-border`): the 10% ink edge of every frosted panel.

### Named Rules
**The Light Counterpart Rule.** Every colour here is the GitHub-light counterpart of the Origit console's dark token of the same name (`--link #4493f8` to `#0969da`, `--danger #f85149` to `#d1242f`, `--ok #3fb950` to `#1a7f37`, `--accent #d29922` to `#9a6700`, `--purple #a371f7` to `#8250df`). A new colour must have a dark twin in origit.uk's `:root` or it does not belong.

**The Reference Blue Rule.** Blue means "this points at something": a SHA, a hunk, a link, focus. It is never a brand colour and never fills a button.

**The Tinted State Rule.** Status chips, stamps and severity pills are always text in a role colour on that colour's own translucent tint, never a solid fill with white text. The only solid fill on the page is the primary button.

## Typography

**Display Font:** Onest variable (wght 400 to 700), self-hosted woff2 under the OFL, with -apple-system, "SF Pro Text", "Segoe UI", Helvetica and Arial as fallbacks
**Body Font:** Onest (same file)
**Label/Mono Font:** "SF Mono", ui-monospace, Menlo, Consolas for SHAs, session numbers, evidence, diffs, timestamps and uppercase keys

**Character:** Origit's console voice: a geometric grotesque at small sizes, tightened a little (-0.005em body, -0.015em headings, -0.03em on the clock), weights 400, 500 and 600 only (700 appears once, on the filed stamp). Tabular numerals are on for the whole body so the clock, counts and times never jitter.

### Hierarchy
The ramp is nine pixel tokens in `:root`, Origit's sizes exactly, and every `font-size` in app.css uses one (the only exceptions are the 10px and 10.5px mono keys and the 28px mobile clock):

| Token | Size | Used for |
|---|---|---|
| `--fs-display` | 40px, 600, line-height 1, -0.03em | the early-warning countdown only (28px under 768px); red while running, green when stopped |
| `--fs-title` | 22px, 600, -0.02em | the incident title (h1) in the document head |
| `--fs-h` | 19px, 600 | the band clock's time (-0.02em); the draft's h1 |
| `--fs-xl` | 15px, 600 | section titles, the brand name, the draft's h2 and h3 |
| `--fs-lg` | 14px | field values (500), step names (600), the primary button, the draft prose (line-height 1.6, 72ch), the signature line, the filed stamp |
| `--fs-base` | 13px, line-height 1.5 | body, default buttons (500), incident tabs (500, 600 selected) |
| `--fs-md` | 12.5px | tables, register rows, the band's product line, sub lines, notices, callouts, the flag grid, sources |
| `--fs-sm` | 12px | labels and register headings (500, muted), table heads, ghost buttons, the ledger summary, section hints |
| `--fs-xs` | 11.5px | system pills, SHAs, stamps (600), severity pills (500), journal, metadata, evidence, diffs, hints |

Mono keys (`STEP 1`, journal kinds, `via`) are 10px, 600, uppercase, 0.06em, muted; step timestamps are 10.5px mono. Inline code in the draft is 88% of its line on a 6px-cornered tint.

### Named Rules
**The Nine Sizes Rule.** New type uses one of the nine `--fs-*` tokens. No rem, no clamp, no eleventh size; the ramp is Origit's and it is shared across both consoles.

**The Quiet Label Rule.** Labels are 12px, 500, muted, sentence case, no tracking, directly above or beside the value they name. Uppercase tracking is reserved for the 10px mono keys (step numbers, journal kinds, source routes) and never applied to Onest.

**The Mono Identifier Rule.** Anything a machine issued (SHA, session number, advisory id, timestamp, file path, diff) is set in SF Mono at 11.5px or below. Prose is never mono; identifiers are never Onest.

## Layout

The page is a sticky 58px glass band over a desk grid: a 316px register column and a fluid report column (`316px minmax(0, 1fr)`), 24px gutter, `24px 32px 48px` padding, capped at 1400px and centred. The band is a four-column grid (brand, manufacturer and product, system pills right-aligned, clock) with a 20px gap and 32px side padding; it blurs the page behind it (18px blur, 160% saturate) and rules itself off with a hairline. The register sticks under the band (top 74px) only on viewports at least 1100px tall; otherwise it scrolls.

Inside a document: a head row with the title left and status tag right, closed by a hairline after 14px; six equal field tiles with a 10px gap (the clock tile spans two), 16px above and 4px below; sections open with 22px of top padding and a numbered 15px title whose counter is a pill. The ladder is seven equal tiles with an 8px gap. Sources read is a two-column CSS column list with a 24px gutter. The signature block is two columns, 16px gap, above a full-width action row with 10px gaps.

Rhythm is on a 2px grid with 8/10/12/16/24 doing the work: 6px between pills, 8px between tiles and inside rows, 10px between fields and under titles, 12px tile padding, 16px between register blocks and stacked documents, 24px the gutter, 32px the page margin. Register rows are 9px (watch), 7px (commits) and 6px (journal) tall-padded, divided by `hair-2`.

Responsive behaviour (two breakpoints):
- **Under 1100px:** single column; the register goes static above the report; the ladder wraps to four tiles, fields to three with the clock spanning all three; tables scroll sideways inside a full-bleed wrapper with a 28px fade mask at the right edge, and a "scroll sideways" hint appears in the section title.
- **Under 768px:** the band becomes a static two-column grid with the product line and system pills hidden, and the clock row inside it becomes the sticky element (92% white, hairlines top and bottom, full-bleed); desk and document padding tighten to 16px; fields and the ladder go two-up; the clock drops to 28px; the signature block and sources stack; the filed stamp moves inline above the prose.

## Elevation & Depth

Glass on paper, Origit's depth model with light-mode shadows. Documents, register blocks, the ledger and the band are translucent white panels (`panel`, `topbar`) that blur and saturate what is behind them (24px blur for panels, 18px for the band), edged with a 10% ink `glass-border`, and lifted by one diffuse, ink-tinted shadow. Inside the glass everything is flat: tiles, steps and the draft sheet are solid or tinted fills with hairline borders and no shadow. Buttons carry a 1px hairline shadow at rest that disappears on press. The selected incident tab lifts 1px with a coral underline inset. Nothing hovers or scales except the 1px press on buttons and the stamp landing.

### Shadow Vocabulary
- **Glass lift** (`box-shadow: 0 8px 24px rgba(31, 35, 40, .08), 0 1px 2px rgba(31, 35, 40, .06)`): every frosted panel (documents, register blocks, ledger). The light twin of Origit's `0 12px 32px rgba(1,4,9,.5)`.
- **Control rest** (`box-shadow: 0 1px 2px rgba(31, 35, 40, .06)`): default and ghost buttons; `0 2px 6px rgba(31, 35, 40, .15)` on the primary. Removed on `:active`.
- **Tab lift** (`box-shadow: inset 0 -2px 0 #fd8c73, 0 1px 3px rgba(31, 35, 40, .12)`): the selected incident tab only.

### Named Rules
**The Glass Casts, Tiles Don't Rule.** Only translucent panels (`panel`, `topbar`) blur and cast the glass-lift shadow. Anything inside a panel (tile, step, sheet, callout, evidence, diff) is flat with a hairline or no border.

**The Fixed Glow Rule.** The three radial glows are on `body` with `background-attachment: fixed`; they are the only gradients on the page besides the running-step sweep and the skeleton. No gradient fills on components.

## Shapes

Rounded glass, pill controls. Three corner sizes carry the containment hierarchy: 16px (`lg`) for the frosted panels, the notice and the ledger; 12px (`tile`) for field tiles, ladder steps, the draft sheet, callouts, diff blocks and the filed stamp; 10px (`md`) for hovered commit rows, evidence lines and the focus ring. Everything the reviewer presses or reads as a status is a full pill (999px): buttons, system pills, SHAs, counters, stamps, severity, incident tabs and their track, the band clock's incident number. Inline code is 6px; the Sentinel scale cells are 2px; dots are 6px circles. The 12px tile radius is written as a literal in app.css rather than a token; keep it at 12px.

Borders are quiet: 1px `glass-border` on glass, 1px `hair` on controls and system pills (tinted to the role colour at 35% when a pill is on or off), 1px `hair-2` on tiles and steps, hairlines between rows. The one dashed border is the unscanned Sentinel scale. Nothing rotates; the stamp lands square. The brand mark is a 26px monochrome clock face (a ring, a hub and four ticks) in `ink`.

## Components

### Buttons
Origit's pills: soft grey, hairline border, a whisper of shadow, pressed down one pixel.
- **Shape:** full pill (999px), 1px `hair` border.
- **Default:** `btn` fill, `fg` text, 36px tall, 0 16px, 13px / 500, rest shadow `0 1px 2px rgba(31,35,40,.06)`. Hover goes to `btn-hover`. Active translates down 1px and drops the shadow. Disabled sits at 45% opacity. Transitions 0.15s on background, transform and shadow.
- **Ghost:** the same pill at 30px tall, 0 13px, 12px text; used for register actions (Poll feeds, Run scan).
- **Primary:** `green-btn` fill with white text, 40px tall, 0 20px, 14px, shadow `0 2px 6px rgba(31,35,40,.15)`; hovers to `ok`. Used once per page: Approve and file.
- **Busy:** text goes transparent and a 14px two-tone ring in `fg` spins in place (0.7s linear).
- **Focus:** 2px `link` outline, 2px offset, 10px radius, on every control.

### Chips
- **System pill:** hairline-bordered pill, 3px 9px, 11.5px `muted` text, a 6px dot (`muted-2` idle). On: `ok` text, dot and a 35% green border. Off: `danger` text, dot and a 35% red border. A faint mono system id (max 160px, ellipsed) may follow.
- **SHA pill:** 72 by 22px, `link` mono 11.5px on `link-bg`, centred; a `purple` 600 mono session number sits under it.
- **Counter:** 20px pill, 10% ink fill, `fg-2` 11.5px / 500; the section number in every section title.
- **Stamp (status tag):** 24px pill, 0 10px, 11.5px / 600, 8% ink fill with `fg-2` text. Variants: quiet (`muted` text), live (`accent` on `accent-bg`, "awaiting approval"), ok (`ok` on `ok-bg`), fail (`danger` on `danger-bg`).
- **Severity:** 22px pill, 0 9px, 11.5px / 500. High and critical: `danger` on `danger-bg`. Medium: `accent` on `accent-bg`. Low: `link` on `link-bg`.
- **Live pill:** the journal's "live" indicator, the system pill's grammar with a `::before` dot that goes green when the stream opens.

### Cards / Containers
- **Document and register block (glass):** `panel` fill, 24px blur and 160% saturate, 1px `glass-border`, 16px corners, glass-lift shadow. Document padding 20px 22px 24px (16px 16px 20px on mobile); register block 16px 18px 14px with a 30px head row holding a 12px muted heading and its ghost button. Stacked documents are 16px apart.
- **Tile (field):** `tile` fill, 12px corners, 12px 14px padding, no border; a 12px label over a 14px / 500 value with an optional 11.5px muted sub line. Values break anywhere so hashes never overflow.
- **Step:** `panel-solid` fill, 1px `hair-2`, 12px corners, 12px 12px 14px padding, clipped, with a 3px state bar across its top edge.
- **Sheet:** `panel-solid`, 1px `hair-2`, 12px corners, 22px 26px 18px padding (16px on mobile); prose at 14px / 1.6 / 72ch. The only white surface with long text.
- **Callout:** `tile` with 1px `hair-2`, 12px corners, 12px 14px, 12.5px `muted` text. **Notice:** 14% danger wash with a 35% `danger` border, 16px corners, 14px 18px, 12.5px `fg` text; its button borrows a 45% red border.
- **Ledger:** a details element whose summary is a glass bar (12px 18px, 12px / 500 muted, counts right); open, its corners square off at the bottom and a glass well (max 320px, own scroll) holds the call table. FIXTURE calls are marked in `accent` 600.
- **Evidence line:** `tile` with a 25% red hairline, 10px corners, 8px 12px, 11.5px mono. **Diff:** `tile`, 12px corners, 11.5px/20px mono, rows tinted `ok-bg` (add), `danger-bg` (del) and `link-bg` with `link` text (hunk).

### Inputs / Fields
There are no text inputs. The field tile is the input-like unit (see Tile above). The signature line is a 30px-tall `muted-2` bottom rule that fills with the approver's name at 14px / 600.

### Navigation
- **Band:** sticky 58px glass strip (`topbar`, 18px blur, hairline beneath). Brand: 26px ink mark, "Origit" 15px / 600 with "Console" in `muted` 500, then a 12.5px `muted` product subtitle. Manufacturer and product as inline label and value pairs. System pills right-aligned. The band clock behind a hairline left rule: incident number as a `link` mono pill on `link-bg`, time at 19px / 600 in `danger` (`ok` when stopped), an 11.5px muted label beneath. Under 768px the band is static and the clock row is the sticky element.
- **Incident tabs:** Origit's segmented pill track (8% ink fill, 3px padding, 2px gaps); each tab a 32px pill in `fg-2` 13px / 500; the selected tab is white, `ink`, 600, with the coral underline inset and a 1px lift.
- **Register rows:** commit rows are 10px-cornered, bleed 8px outside the block, hover to 4% ink and sit on `link-bg` when current.

### Step Ladder (signature component)
Seven white tiles in one row with 8px gaps. Each step: a 10px mono key (`STEP 1`), a 14px / 600 name, an 11.5px `muted` actor line, an 11.5px `fg-2` text block clamped to seven lines, and a 10.5px mono `muted-2` timestamp. The 3px top bar carries state: 12% ink when pending (and the name drops to `muted`), `ok` when done (with a 12px green inline checkmark after the name), `danger` when failed, and when running a `link` sweep scrolling across a `link-bg` track (1.1s linear). Reduced motion stops the sweep.

### Clock (signature component)
The early-warning countdown is the display face: 40px / 600 / -0.03em tabular figures in `danger`, in a tile spanning two field columns, with the three deadlines beneath in 11.5px muted mono-aligned figures. It turns `ok` and stops on approval. A 19px copy rides in the band so the reviewer can read the draft without losing the time.

### Approval Stamp (signature component)
On approval the sheet gets a stamp top right: "Approved · Filed" over the elapsed time since awareness, `ok` 700 / 14px on `ok-bg` with a 45% green border, 12px corners, 8px 14px padding, the small line in 11.5px `fg-2` mono. It presses in over 0.35s with `cubic-bezier(.2, .9, .3, 1)` from scale 1.4 and fades by 60%; the prose's first block clears it with right padding. Under reduced motion the stamp appears without the press. Under 768px it sits inline above the prose.

### Sentinel Scale
Four 8px-tall cells with 2px gaps and 2px corners, 12% ink when empty, filled left to right: one `link` (low), two `accent` (medium), three `danger` (high), four `danger` (critical); dashed `hair` outline when unscanned. A 28 by 6px copy sits in the legend.

## Do's and Don'ts

### Do:
- **Do** build every new container as Origit glass: `panel` fill, 24px blur and 160% saturate, 1px `glass-border`, 16px corners, the glass-lift shadow; put tiles (`tile`, 12px corners, no shadow) inside it for fields.
- **Do** make every control and status a pill (999px) with text in a role colour on that colour's translucent tint; the only solid-filled control is the green primary.
- **Do** pick colours by role: `link` for references and focus, `accent` for waiting and medium, `danger` for the live clock and failure, `ok` for health and approval, `purple` for session numbers only.
- **Do** use one of the nine `--fs-*` sizes, weights 400 to 600, and keep labels at 12px / 500 muted sentence case with no tracking.
- **Do** set identifiers (SHAs, session numbers, timestamps, paths, diffs) in SF Mono at 11.5px or below; keep the 10px uppercase mono key for ordinals and kinds only.
- **Do** check any new token against origit.uk's `:root`; it needs a dark twin there (The Light Counterpart Rule).
- **Do** give every live or running state a motion that stops under `prefers-reduced-motion` and leaves the state legible.

### Don't:
- **Don't** add a chart, a KPI card, a dark panel, a solid coloured chip or a gradient fill; the only gradients are the three fixed body glows and the sweep.
- **Don't** cast shadows on anything inside a glass panel; tiles, steps, the sheet and callouts are flat.
- **Don't** use a fourth corner size: 16px glass, 12px tiles, 10px rows and code, 999px pills.
- **Don't** fill a button with blue, or use blue as a brand colour; blue points at things.
- **Don't** set Onest in uppercase or with letter-spacing above 0; tracked uppercase exists only in the 10px mono keys.
- **Don't** introduce a second sans or a display face; Onest 400 to 700 carries everything, SF Mono carries identifiers.
