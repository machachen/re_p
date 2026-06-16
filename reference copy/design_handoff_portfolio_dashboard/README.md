# Handoff: BPM Portfolio Intelligence — Dashboard Redesign

> A complete design specification for re-skinning an existing real-estate
> portfolio web app to the **BPM design system**. Written so a Claude Code
> session (or any developer) who was **not** in the original design conversation
> can reproduce the look exactly, inside your existing codebase.

---

## 0. How to use this package (read first)

You (the engineer / Claude Code) have a **running app already**. The goal is **not**
to bolt this HTML on top of it. The goal is to **port the BPM visual system and
layout into your existing components**, screen by screen.

Recommended workflow with Claude Code:

1. Drop this whole `design_handoff_portfolio_dashboard/` folder into your repo
   (e.g. at the repo root, or in `docs/`).
2. Open the repo in Claude Code and prompt:
   > "Read `design_handoff_portfolio_dashboard/README.md` and the files in
   > `design_reference/`. This is the target design for our portfolio dashboard.
   > First, map our existing components to the ones described here. Then propose a
   > migration plan before changing any code."
3. Have Claude Code do **tokens first** (Section 6), then **shell/layout**
   (Section 4), then **one component at a time** (Section 5). Don't let it
   rewrite everything in one pass.

### What the files in `design_reference/` actually are

They are **design references written in HTML/React-via-Babel** — a high-fidelity
prototype showing the intended look and behaviour. They are **not** production
code to copy verbatim:

- The `.jsx` files use inline `style={{…}}` objects and load React through an
  in-browser Babel `<script>` tag. That's a prototyping convenience, **not** the
  pattern to ship. Re-implement each component using **your codebase's
  conventions** — your styling solution (CSS Modules / Tailwind / styled-components /
  vanilla CSS), your component library, your state management.
- The data inside (`ASSETS`, `MAP_BUBBLES`, etc.) is **mock data**. Wire the real
  components to your real data layer.
- The point you must preserve is the **visual result and the layout structure**,
  documented exhaustively below.

**Fidelity: HIGH (hifi).** Colors, type, spacing, and interactions are final.
Reproduce them pixel-accurately, but through your stack's idioms.

---

## 1. Overview

**Product:** BPM Intelligence — a portfolio-wide analytics workbench for
multi-asset real-estate holders (institutional landlords, family offices, REITs).

**This screen:** the **portfolio dashboard** — the default landing view. It shows,
top to bottom:

- A sticky top bar (brand, primary nav, live-data tick, EN/繁中 locale toggle, avatar)
- A left sidebar (portfolios, saved filters, the client's named analyst)
- A page header (bilingual title + action buttons)
- A four-up KPI strip (gross mark, cap rate, WALT, exposures changed)
- A two-column band: geographic exposure map (left) + "this quarter in one paragraph" (right)
- A sortable holdings table (click a row → asset detail drawer slides in from the right)
- An "ask your analyst" composer
- A thin footer (version, data sources, copyright)

**Audience:** sophisticated bilingual capital allocators. The whole product must
read as **institutional-grade** — think the intersection of Goldman Sachs,
BlackRock, and Bain. Sober, precise, document-like. Data gets the visual budget,
not chrome.

---

## 2. The design language in one screen (the non-negotiables)

If you preserve nothing else, preserve these — they are what make it "BPM":

1. **Flat, hairline-bordered surfaces.** Cards are a `1px` solid border in
   `--rule` (#D8D5CE) with **no shadow** and **no border-radius**. The hairline
   *is* the card. Shadows appear only on menus and the drawer.
2. **Warm paper, not white.** The page background is `--paper` (#F5F1EA), a warm
   off-white. Cards sit on `--bone` (#FBF8F2). Pure white is rare.
3. **Near-zero radius.** Cards/tables: `0`. Buttons/inputs: `2px`. Status pills:
   fully round. Nothing else is rounded.
4. **Serif display, sans body.** Headlines and big numbers are a serif
   (Source Serif 4 / Noto Serif TC). Body, tables, labels, buttons are Inter /
   Noto Sans TC. See Section 6.2.
5. **Tabular numerals everywhere numbers stack.** Every figure in a column uses
   `font-variant-numeric: tabular-nums lining-nums`.
6. **One red per screen.** `--bpm-red` (#8E1B1F) is the brand accent **and** the
   negative/loss colour. Used for: the wordmark triangle, one primary CTA, the
   active sidebar marker, and negative deltas. If two unrelated reds appear, one is wrong.
7. **Sentence case.** Buttons and headings are sentence case ("Open report",
   never "Open Report" / "OPEN REPORT"). The only uppercase is the 11px tracked
   "eyebrow" label.
8. **Bilingual, Chinese-leads.** Where both languages appear, Traditional Chinese
   is primary; English is the smaller italic serif subtitle in a muted grey.
9. **Calm motion.** One easing curve, short durations. No bounce, no spring, no
   scale-on-hover. See Section 7.

> ⚠️ **Open color decision:** on **dark** surfaces the brand red `#8E1B1F` loses
> contrast. The design team is selecting a "dark-context" red (leading candidate
> `#C8232C`, "Bain red"). Until locked, use `#8E1B1F` on light surfaces and treat
> the dark-surface red as a single swappable token (`--bpm-red-on-dark`). The
> dashboard is light-surface, so this rarely bites here — but keep it tokenized.

---

## 3. Tech context of the reference (so you can read the files)

- React 18 via CDN + in-browser Babel. Each `.jsx` registers its component on
  `window` (e.g. `window.TopBar = TopBar`) so sibling files can use it. **Do not
  reproduce this pattern** — it exists only because the prototype has no build step.
- Styling is **inline style objects** with names like `topbarStyles`, `sidebarStyles`.
  The CSS custom properties they reference live in `colors_and_type.css`
  (the token source of truth) and `kit.css` (component helper classes).
- `index.html` is the composition: it holds the mock data and the `App()` that
  wires everything together with `useState`.

When in doubt about an exact value, **open the reference in a browser and inspect**,
or read the corresponding `*.jsx` style object — every number below is drawn from there.

---

## 4. App shell & layout

The shell is a CSS grid (see `.app-shell` in `kit.css`):

```
grid-template-columns: 240px 1fr;
grid-template-rows:    64px  1fr  48px;
grid-template-areas:
  "topbar  topbar"
  "sidebar main"
  "footer  footer";
min-height: 100vh;
```

- **Top bar:** fixed `64px` tall, spans full width, `position: sticky; top: 0`.
- **Sidebar:** fixed `240px` wide, scrolls independently (`overflow: auto`).
- **Main:** fills remaining space, `overflow: auto`, internal padding `28px 32px 40px`.
- **Footer:** fixed `48px` tall, spans full width.
- **Drawer** (asset detail): `position: fixed`, off-grid, slides over the right
  edge. `520px` wide. Backdrop dims the whole viewport.

Design width is **1440px**. This is desktop-first capital-allocator software; there
are no mobile breakpoints in the reference. If your app must be responsive, collapse
the sidebar to an icon rail below ~1100px and stack the map/summary band — but that
is net-new and should be confirmed with the design team.

Page gutters: `32px` in the main area (the reference uses 32; the broader system
spec says 64px at ≥1280 — match the reference's 32 for this screen).

---

## 5. Components — exact specs

Each subsection maps to one file in `design_reference/`. Reproduce the **visual
result**; ignore the prototype's implementation mechanics.

### 5.1 TopBar  (`TopBar.jsx`)
- **Container:** height `64px`; background `rgba(245,241,234,0.85)` with
  `backdrop-filter: saturate(180%) blur(12px)`; bottom border `1px solid --rule`;
  `padding: 0 32px`; `position: sticky; top: 0; z-index: 10`; flex row, items centered.
- **Brand lockup (left):** `BPM` in **Inter 800**, `font-size 22px`,
  `letter-spacing -0.04em`, color `--ink`. Immediately to its right a **red
  triangle** mark: a CSS triangle (`border-left/right: 4px transparent;
  border-bottom: 6px solid --bpm-red`), nudged up `translateY(-6px)`, `margin-left: -4px`.
  Then a separator and a `10px / 600 / 0.18em uppercase` muted label
  "Portfolio Intelligence" in `--ink-3`.
- **Nav:** flex row, `margin-left: 48px`. Each item: `13px`, weight 500, color
  `--ink-3`; padding `0 14px`; full-height; `border-bottom: 2px solid transparent`.
  **Active item:** color `--ink`, `border-bottom-color: --ink` (a 2px underline
  flush with the bar's bottom edge). Items: Portfolio / Assets / Scenarios /
  Reports · 報告.
- **Right cluster:** `margin-left: auto`, gap 14px, `13px`, color `--ink-3`:
  - Live tick: a `6px` `--bpm-red` dot + "Live · 2025-06-30 14:02 TPE".
  - `1px × 18px` vertical divider in `--rule`.
  - **Locale toggle button:** "EN / 繁中" — the active language is weight 600 /
    color `--ink`, the inactive is weight 400 / color `--ink-3`, slash in `--ink-4`.
  - **Avatar:** `30px` round, background `--ink`, paper-colored serif initial ("林").
- **Behavior:** clicking nav items sets active section; clicking the locale toggle
  flips the **entire app** between `en` and `tc` (see Section 8, localization).

### 5.2 Sidebar  (`Sidebar.jsx`)
- **Container:** `--bone` background, right border `1px --rule`, flex column,
  `padding: 20px 0 0`, scrolls.
- **Section header:** an **eyebrow** (`11px / 600 / 0.14em / uppercase / --ink-3`)
  with an optional `＋` ghost button (`18px` square, `1px --rule` border, `2px` radius).
- **Portfolio rows:** full-width button, space-between. Left: a `6px` round marker
  dot (transparent unless active) + label. Right: a mono count in `--ink-3`.
  - **Active row:** background `--paper`, `border-left: 2px solid --bpm-red`, the
    marker dot becomes `--bpm-red`, label weight 500. (Inactive rows have a 2px
    transparent left border so text doesn't shift.)
  - Sample items: Asia Office (23), Taiwan Retail (14), Logistics · APAC (9),
    Hospitality (6), Development pipeline (4).
- **Filters section:** same row style, no marker dot. Watch list (7), Changed
  Q-on-Q (11), Below WALT (3).
- **Analyst card (bottom, `margin-top: auto`):** `--paper` bg, `1px --rule` border,
  `12px 14px` padding. Red eyebrow "Your analyst · 您的分析師", a serif name
  ("Audrey Cheung", 18px), then two `12px --ink-3` meta lines.

### 5.3 KPIStrip  (`KPIStrip.jsx`)
- **Container:** `display: grid; grid-template-columns: repeat(4, 1fr)`,
  `1px --rule` border, `--bone` background. Cells divided by `1px --rule`
  right-borders (last cell none).
- **Cell:** `padding: 18px 22px`. Contents:
  - Eyebrow label (`11px/600/0.14em/uppercase/--ink-3`).
  - **Value:** serif (`--font-display`), `40px`, weight 500,
    `letter-spacing -0.022em`, `line-height 1`, `margin-top 8px`,
    `font-variant-numeric: tabular-nums`. A trailing unit (e.g. "bn", "%") is
    `0.5em` and `--ink-3`.
  - **Delta line:** `12px`, `margin-top 8px`. A `▲`/`▼` glyph + value colored
    `--pos` (#1F5C4A) for positive or `--bpm-red` for negative, plus muted meta text.
- The four KPIs: Gross mark `NT$24.8bn ▲+0.42% QoQ`; Cap rate `3.82% ▼−38bps vs
  benchmark`; WALT `4.6 yrs (range 2.1—8.4)`; Exposures `11 changed since last review`.

### 5.4 PortfolioMap  (`PortfolioMap.jsx`)
- A flat card (`1px --rule`, `--bone`). Header row: eyebrow + serif title
  ("Asia book · by mark-to-market") on the left; a small legend on the right
  (red dot = BPM exposure, translucent slate dot = peer avg).
- **Body:** an inline **SVG** (viewBox `0 0 640 360`) on a `--paper` panel. It is a
  **stylised abstraction, not a real map** — a faint 0.5px engineering grid
  (`<pattern>`), two blobby coastline `<path>`s in `--paper-2`, and per-city
  bubbles: a translucent slate "peer" circle behind a solid `--bpm-red` "BPM"
  circle, a leader line, and city label + mono mark figure.
- If your app has a **real mapping library**, you may replace this with real tiles —
  but keep the **bubble encoding** (red = us, slate = peer; area = mark) and the
  desaturated, document-like treatment. Don't introduce saturated Google-Maps color.

### 5.5 AssetTable  (`AssetTable.jsx`)
- **Container:** `1px --rule` border, `--bone` bg. `<table>`,
  `border-collapse: collapse`, `13px` Inter, `tabular-nums`.
- **Header cells:** `11px / 600 / 0.12em / uppercase / --ink-3`, right-aligned
  except the first three (Asset / Sector / Geography are left). Bottom border is
  the **emphasized** rule `1px --rule-2` (#B7B2A6). Header bg `--paper`.
- **Body rows:** cells `padding 11px 14px`, bottom border `1px --graphite-100`.
  - Asset cell (left): the Chinese name in `--font-cjk-sans` 14px/500, with the
    asset id in a `10px --ink-3` meta line under it.
  - Sector / Geography: `--ink-3`.
  - Mark / Cap rate / WALT: right-aligned, `--ink`.
  - **QoQ delta:** `▲ +x.xx%` in `--pos`, `▼ −x.xx%` in `--bpm-red`, weight 500.
  - Status: a **chip** (see 5.8) with a colored status dot.
  - **Row hover:** background → `--ink-05` (rgba(11,11,12,0.05)). **Selected row:**
    background stays `--ink-05`.
  - Whole row is clickable → opens the drawer with that asset.
- **Totals row:** `border-top: 2px solid --ink`, no bottom border, weight 600,
  bg `--paper`. Recomputes mark sum and **mark-weighted** cap-rate & WALT averages.

### 5.6 AssetDetailDrawer  (`AssetDetailDrawer.jsx`)
- **Backdrop:** `position: fixed; inset: 0`, `rgba(11,11,12,0.25)`, fades in over
  `200ms`; click to close.
- **Panel:** `position: fixed; right/top/bottom: 0`, width `520px`,
  `background --paper`, `border-left 1px --rule`, shadow
  `-32px 0 64px -24px rgba(11,11,12,0.30)` plus a 1px lip. Slides in via
  `transform: translateX(100% → 0)` over `200ms` with the system easing. Flex column.
- **Header:** red eyebrow "Asset detail · ID", a `26px` serif-CJK title (the asset
  name), a `12px --ink-3` meta line (sector · geo · address), and a `×` close button.
- **3-up KPI row:** Mark / Cap rate / WALT, each a serif `28px` value with a small
  colored delta line; divided by `1px --rule`.
- **Mark-history chart:** a small inline SVG line chart (this asset in `--bpm-red`,
  sector peer in `--info` #33547A) on `--bone` with a faint grid; a 2-item legend below.
- **Tenants & leases:** an eyebrow then a list; each row is a 3-col grid
  (tenant name in CJK / area · expiry meta / mono rent), separated by `--graphite-100` hairlines.
- **Footer actions (`margin-top: auto`):** primary "Open full report", secondary
  "Export PDF", and a right-aligned tertiary "Close".

### 5.7 Composer  (`Composer.jsx`)
- A flat card (`1px --rule`, `--bone`, `14px 18px`). Header: red eyebrow
  "Ask your analyst · Audrey Cheung" + muted SLA meta.
- **Suggestion chips:** round-pill buttons (`--paper` bg, `1px --rule`, `5px 12px`,
  `12px`) that, when clicked, populate the input.
- **Input row:** a flex row — a text input (`--paper`, `1px --rule`, `2px` radius,
  `10px 14px`), a secondary "+ Attach" button, and a primary "Send" button
  (disabled until the input is non-empty).

### 5.8 Shared atoms (defined in `kit.css`)
- **Buttons** (`.btn` + variant):
  - `.btn-primary` — bg `--bpm-red`, text `--paper`; hover → `--bpm-red-hover`
    (#761519); active → `--bpm-red-press` (#5E1115). No scale change.
  - `.btn-secondary` — transparent, `1px solid --ink` border, text `--ink`;
    hover bg `--ink-05`.
  - `.btn-tertiary` — text only; underline on hover (`text-underline-offset: 3px`).
  - `.btn-icon` — square, `1px --rule` border, transparent.
  - Shared: `13px`, weight 500, `padding 8px 14px`, `border-radius 2px`,
    `transition: background/border 120ms ease`.
- **Status chips** (`.chip`): `11px`/500, `padding 3px 10px`,
  `border-radius 999px`, `1px --rule` border, `--bone` bg, `--ink-2` text, with an
  optional `6px` colored `.dot`. Variants: `.chip-square` (2px radius for tags),
  `.chip-ink` (ink bg / paper text), `.chip-red` (red bg / paper text).
  Status dot colors: leased/held/active → `--pos`; below/review → `--bpm-red`;
  forecast/soft → `--warn` (#B5832A); else → `--info` (#33547A).
- **Rules:** `.rule` = `1px --rule`; `.rule-emph` = `2px --ink`.
- **Delta text:** `.pos` = `--pos`; `.neg` = `--bpm-red`.

---

## 6. Design tokens

The full token set lives in `design_reference/colors_and_type.css` as CSS custom
properties — **port that file (or its values) into your app's token layer first.**
Below is the essential subset.

### 6.1 Color

| Token | Hex | Use |
| --- | --- | --- |
| `--bpm-red` | `#8E1B1F` | Brand accent; one CTA per screen; negative/loss values |
| `--bpm-red-hover` | `#761519` | Primary button hover |
| `--bpm-red-press` | `#5E1115` | Primary button active / oxblood |
| `--bpm-red-tint` | `#F4E2E3` | Faint red tag backgrounds |
| `--bpm-red-on-dark` | *TBD (`#C8232C` proposed)* | Red on ink/dark surfaces — **open decision** |
| `--ink` | `#0B0B0C` | Primary text, dark surfaces, table totals rule |
| `--ink-2` | `#2A2A2D` | Secondary text |
| `--ink-3` | `#5C5C61` | Tertiary text, metadata, muted labels |
| `--ink-4` | `#8A8A8F` | Placeholder, disabled |
| `--ink-05` | `rgba(11,11,12,0.05)` | Row / secondary-button hover |
| `--paper` | `#F5F1EA` | Primary page surface (warm off-white) |
| `--bone` | `#FBF8F2` | Card surface |
| `--paper-2` | `#ECE7DD` | Depressed paper, table zebra, map land |
| `--rule` | `#D8D5CE` | **The hairline** — every visible border |
| `--rule-2` | `#B7B2A6` | Emphasized rule (table header underline) |
| `--pos` | `#1F5C4A` | Positive / above benchmark (forest green) |
| `--warn` | `#B5832A` | Caution / forecast / unverified (brass) |
| `--info` | `#33547A` | Peer / market reference (slate blue) |
| Graphite 50→950 | `#F2F2F3 … #0B0B0C` | 11-step cool-neutral ramp for chrome |

Data-viz series order: `--series-1` red (you/portfolio), `--series-2` slate
(peer), `--series-3` green (benchmark), `--series-4` brass (forecast).

### 6.2 Typography

| Token | Stack |
| --- | --- |
| `--font-display` | `"Source Serif 4", Georgia, serif` — English headlines & big numbers |
| `--font-cjk-display` / `--font-cjk-sans` | Traditional-Chinese display & body — **see open decision below** |
| `--font-sans` | `"Inter", system-ui, sans-serif` — English body, UI, labels, buttons |
| `--font-mono` | `"JetBrains Mono", ui-monospace, …` — ids, ticks, decimal alignment |
| `--font-wordmark` | `"Inter", …` weight **800** — the `BPM` logotype only |

> ⚠️ **Open type decision:** the Chinese face has been A/B'd between **Noto Sans
> TC** (sans) and **Noto Serif TC** (serif). The current `colors_and_type.css`
> ships the **serif** pairing. Whichever is locked, load it as a **web font**
> (Google Fonts) so Mac/Windows/Linux render identically — do **not** rely on a
> system font like Microsoft JhengHei, which is absent on macOS.

**Type scale (px):** 10 · 12 · 14 · 16 · 18 · 22 · 28 · 40 · 56 · 80.
**Weights:** 400 / 500 / 600 / 700 (display 500; wordmark 800).
**Line-height:** 1.0–1.18 display, 1.55 body. **Tracking:** −0.022em display, 0 body,
+0.14em on eyebrow labels. **Eyebrow label** = `11px / 600 / 0.14em / uppercase / --ink-3`.

Load via Google Fonts:
`Inter:wght@400;500;600;700`, `Source Serif 4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700`,
the chosen Noto TC family `@400;500;600;700`, `JetBrains Mono:wght@400;500;600`.

### 6.3 Spacing, radius, elevation
- **Spacing scale (4px base):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- **Radius:** cards/tables `0`; buttons/inputs `2px`; menus/tooltips `4px`; chips `999px`.
- **Borders:** `1px solid --rule` for everything visible; `2px solid --ink` for emphasis.
- **Shadows (only two):**
  - `--shadow-1` (menus / floating): `0 1px 0 --rule, 0 8px 24px -12px rgba(11,11,12,0.15)`
  - `--shadow-2` (modals / drawer): `0 1px 0 --rule, 0 32px 64px -24px rgba(11,11,12,0.30)`
  - No glow, no colored shadows. Cards have **no** shadow.

---

## 7. Interactions & motion

- **Easing:** one curve everywhere — `cubic-bezier(0.22, 0.61, 0.36, 1)` (a calm out-ease).
- **Durations:** hover/color `120ms`; component (menu open, drawer slide) `200ms`;
  route/page fade `360ms`; chart draw-in `400ms` (the longest in the system).
- **Hover:** primary button darkens red; secondary button gains `--ink-05` bg;
  links underline (no color change); table rows go to `--ink-05`. **No scale, no
  shadow pulse.**
- **Press:** `transform: translateY(0.5px)` + one step darker. No shrink.
- **Drawer:** backdrop fades `200ms`; panel `translateX` `200ms` with the system easing.
- **Page transitions:** opacity only, never slide.

---

## 8. State & localization

State needed for this screen (names from the reference `App()`):

| State | Type | Drives |
| --- | --- | --- |
| `locale` | `"en" \| "tc"` | **Every label** in the UI; toggled from the top bar |
| `activeNav` | section id | Top-bar active underline |
| `activePortfolio` | portfolio id | Sidebar active row |
| `selectedId` | asset id \| null | Which asset the drawer shows; selected table row |
| `drawerOpen` | boolean | Drawer open/closed |

- **Localization is pervasive, not decorative.** Almost every component takes a
  `locale` prop and switches strings via a `tr(en, tc)` helper. In your codebase,
  wire this to your existing i18n layer (i18next, FormatJS, etc.) — keys for both
  EN and 繁中. **Numbers and units stay Latin** in both locales
  (`NT$1,284M`, not 新台幣 12.84 億).
- When both languages render together (page header, drawer title), **Chinese is the
  primary line; English is a smaller italic serif subtitle in `--ink-3`.**

---

## 9. Data each component needs (for your real backend)

The reference uses mock arrays; here's the **shape** each component consumes so you
can map to your API:

- **Asset** (table row + drawer): `{ id, name, name_tc, sector, geo, address,
  mark (number, NT$), capRate (number, %), walt (number, yrs), qoq (number, %
  signed), status (string), tenants: [{ name, area, expiry, rent }] }`.
- **KPI**: `{ label, value, unit, deltaSign: "+"|"−", delta, deltaMeta }`.
- **Map bubble**: `{ id, name, name_tc, x, y, r (our mark radius), peerR (peer
  radius), mark (display string) }` — `x/y` are SVG coords if you keep the stylised
  map; with a real map they become lat/lng.
- **Portfolio (sidebar)**: `{ id, label, tc, n (count), mark (display string) }`.

The **totals row** in the table is **computed client-side** (sum of marks;
mark-weighted cap-rate and WALT) — keep that logic, don't expect it from the API.

---

## 10. Assets

- `assets/bpm-wordmark.svg` — primary BPM logotype (Inter 800 + red triangle).
- `assets/bpm-monogram.svg` — square mark for favicon / app icon.
- The triangle next to "BPM" in the top bar is drawn in **CSS** (not an asset) —
  see TopBar spec 5.1. Reuse that technique or the SVG, your call.
- **Icons:** the broader system uses **Lucide** (outline, 1.5px stroke). This
  dashboard reference doesn't lean on many icons, but if you add them
  (filter, search, download, chevrons), use Lucide outline at 1.5px, `currentColor`.
- **Fonts:** none bundled — load Inter, Source Serif 4, the chosen Noto TC family,
  and JetBrains Mono from Google Fonts.

---

## 11. Files in this package

```
design_handoff_portfolio_dashboard/
├── README.md                    ← you are here
├── assets/
│   ├── bpm-wordmark.svg
│   └── bpm-monogram.svg
└── design_reference/
    ├── index.html               ← OPEN THIS in a browser to see the target
    ├── colors_and_type.css      ← TOKEN SOURCE OF TRUTH — port this first
    ├── kit.css                  ← component helper classes (.btn, .chip, .app-shell…)
    ├── TopBar.jsx
    ├── Sidebar.jsx
    ├── KPIStrip.jsx
    ├── AssetTable.jsx
    ├── PortfolioMap.jsx
    ├── AssetDetailDrawer.jsx
    └── Composer.jsx
```

**Suggested order of work:** (1) port tokens from `colors_and_type.css`; (2) build
the app-shell grid; (3) TopBar + Sidebar (the frame); (4) KPIStrip + AssetTable
(the data); (5) PortfolioMap + Composer; (6) AssetDetailDrawer (the one piece with
real motion); (7) wire localization through your i18n layer last.

---

## 12. Open decisions to confirm with the design team before shipping

1. **Dark-context red** — `--bpm-red-on-dark` (leading: `#C8232C`). Doesn't heavily
   affect this light dashboard, but lock it before doing any dark surfaces.
2. **Chinese typeface** — Noto Sans TC vs Noto Serif TC. Load as a web font either way.
3. **Responsive behavior** — the reference is desktop-only (1440). Confirm whether
   mobile/tablet is in scope; if so, the collapse rules in Section 4 are a starting
   proposal, not a spec.
