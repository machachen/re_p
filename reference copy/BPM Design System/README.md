# BPM Design System

> 不動產組合智能 · Real Estate Portfolio Intelligence

BPM provides **real estate portfolio intelligence services to multi‑asset holders** — institutional landlords, family offices, REITs, and sovereign / pension allocators who need to see, measure, and act across a diverse book of buildings.

The product surface (inferred from brief) spans:

1. **BPM Intelligence (Web App)** — A portfolio‑wide analytics workbench. Maps, asset registers, cash‑flow waterfalls, valuation models, exposure heatmaps, scenario stress tests, leasing pipelines.
2. **BPM Marketing Site** — A public site that positions BPM to CFOs, CIOs, and Heads of Real Estate at large holders.
3. **BPM Reports & Decks** — Quarterly investor‑grade documents (PDF + slide deck) co‑signed by analysts; the artefact a board actually reads.

The audience is sophisticated: bilingual capital allocators in Taipei, Hong Kong, Singapore, Tokyo, and increasingly New York / London. The product must read as **institutional‑grade** in both Traditional Chinese and English without code‑switching feeling like a downgrade in either direction.

---

## Sources provided

> ⚠️ **No codebase, Figma file, or asset library was attached for this engagement.** The system below is derived entirely from the verbal brief:
>
> - Brand: **BPM**, real estate portfolio intelligence for multi‑asset holders
> - Primary palette: **dark red + black**
> - Languages: **Traditional Chinese (TW) primary**, English secondary
> - Reference aesthetics: the **intersection of Goldman Sachs, BlackRock, and Bain & Company** — institutional finance × top‑tier consulting
>
> All wordmarks, components, type pairings, and UI layouts in this system are **first‑draft interpretations**. They are designed to be opinionated enough for you to react to. Please attach any of the following on the next pass so we can lock things to reality:
>
> - The official BPM logo / wordmark (SVG preferred)
> - Any existing brand guidelines, even a single deck
> - The production web app codebase or Figma (so the UI kit is a recreation, not an invention)
> - The marketing site URL
> - Sample investor reports or pitch decks
> - Any licensed corporate typeface (e.g. a custom serif or a licensed grotesk)

---

## Brand North Star

> **Read the building. Then read the book.**
>
> 看穿一棟樓，再看穿整本帳。

BPM exists where bricks meet basis points. We sit between the asset manager (who knows the rent roll) and the CIO (who knows the portfolio mandate), and we make sure they are looking at the same numbers, in the same units, at the same time.

Three traits the brand must always carry:

| Trait | What it means in design |
| --- | --- |
| **Sober** | No marketing gloss. No gradients that look like a SaaS launch. The visual budget goes to data, not chrome. |
| **Precise** | Numbers align. Decimals align. Currency symbols align. Tables are typeset, not "designed." |
| **Resident** | We are in Asia first. Traditional Chinese is not an afterthought; it sets the rhythm of the page. |

---

## Index of this folder

> A short guide to where things live. Read in order if you are new.

| Path | What's in it |
| --- | --- |
| `README.md` | This file — brand context, content rules, visual rules, iconography |
| `colors_and_type.css` | All design tokens as CSS custom properties (colors, type, spacing, radii, shadows) |
| `SKILL.md` | Agent‑Skill descriptor so this folder can be used as a Claude Skill |
| `fonts/` | Web font files referenced by `colors_and_type.css` (Noto Serif TC, Noto Sans TC, Source Serif 4, Inter, JetBrains Mono) |
| `assets/` | Logos, wordmarks, marks, sample imagery, icon references |
| `preview/` | One small HTML card per design‑system concept — surfaced as cards in the Design System tab |
| `ui_kits/web_app/` | High‑fidelity recreation of the BPM Intelligence web app (dashboard, asset detail, portfolio map) |
| `ui_kits/marketing/` | Marketing site components (hero, capability grid, footer) |
| `slides/` | 16:9 slide templates — title, section, comparison, big number, data table, full‑bleed quote |

A more detailed file index lives at the bottom of this README.

---

## CONTENT FUNDAMENTALS

How BPM speaks, in both languages.

### Tone
- **Analyst, not evangelist.** We sound like a senior associate writing a memo to a managing director, not a startup writing a blog post.
- **Cool, not cold.** Restraint is the point, but we are not a regulator. Allow one well‑placed dry observation per page.
- **Confident through specificity.** "Cap‑rate compression of 38 bps across the Greater Taipei retail book in Q2" beats "real estate has been volatile lately."

### Voice
- Address the reader as **"you"** (English) / **"您"** (Traditional Chinese) in product and marketing. Reserve **"we" / "我們"** for first‑person institutional statements ("we believe", "我們認為").
- Never use "users", "folks", "team", "guys". The reader is a *principal*, an *allocator*, an *asset manager*.
- Numbers are the protagonist. A sentence with a number in it should put the number where the eye lands first.

### Casing
- **English headlines**: Sentence case. Never Title Case Like This. Never ALL CAPS for headlines.
- **Eyebrow labels / metric labels**: small caps via OpenType `font-feature-settings: 'smcp'`, or a 11px tracked uppercase as a fallback. Tracking +120 to +140.
- **Buttons**: Sentence case ("Open report", not "Open Report" and not "OPEN REPORT").
- **Traditional Chinese**: never apply uppercase rules. Use weight (500 → 700) to create emphasis, never letter‑spacing > +25.

### Punctuation
- Use **en dashes** for ranges ("Q1–Q3 2025"), **em dashes** for parenthetical asides — sparingly.
- Currency before number: **NT$1,284M**, **US$42.1bn**, **HK$9.7M**.
- Always include the unit. Never write a naked "1,284" in a headline.

### Emoji
- **Never** in product. Never in marketing. Never in decks.
- Permitted in: internal Slack, an external thank‑you note.

### Worked examples

| Bad | Better |
| --- | --- |
| "Awesome insights into your real estate! 🚀" | "Eleven exposures changed materially since your last review." |
| "Our AI helps you make smarter decisions." | "We model every lease line. You get one number you can defend in committee." |
| "Click here to learn more" | "Open the Q2 review" |
| "讓我們一起，打造更智能的房地產投資！" | "二十三檔資產的估值假設，本季已更新。" |
| "SUBSCRIBE NOW" | "Request access" / 「申請使用」 |

### Bilingual handling
- When a heading appears in both languages, **Traditional Chinese leads, English follows** on a second line at 70% of the type size, in the neutral grey (`--ink-3`).
- Numbers and units stay in Latin script in both languages: 「**NT$1,284M**」, not 「新台幣 12.84 億元」, unless legal copy requires it.
- Punctuation follows the language of the surrounding clause: full‑width 「」 for Chinese quotes, "curly" for English.

---

## VISUAL FOUNDATIONS

### Palette

The system is **black, oxblood red, and warm paper** — with a small, disciplined set of data‑viz accents.

- **Ink** (`#0B0B0C`) — primary text, primary surfaces in dark mode, chart axes.
- **BPM Red** (`#8E1B1F`) — the single brand accent. Used for the wordmark, for one CTA per screen, for the top hairline of investor reports, and for **negative** values in financial tables (loss / drawdown / variance below benchmark). Red as "the house identity" *and* as "below the line" is intentional — it is consistent with Bain's house red and with how Asia reads red on financial statements (red = loss).
- **Oxblood** (`#5E1115`) — darker red for hovers, pressed states, deck section dividers.
- **Paper** (`#F5F1EA`) — warm off‑white background. The product and reports are read as documents, not screens.
- **Graphite scale** — 10 cool‑neutral steps from `#F2F2F3` to `#0B0B0C`, used for hairlines, table zebra, secondary text, chrome.
- **Data accents** — `#1F5C4A` (forest, used for **positive** values and benchmarks), `#B5832A` (brass, used for forecast / "soft" data), `#33547A` (slate blue, used for peer / market comparison series). These three plus BPM Red give a 4‑series chart palette that never looks like a children's toy.

Full hex values live in `colors_and_type.css`. The system rule: **one red per screen.** If two reds appear, one of them is wrong.

### Typography

| Role | English | Traditional Chinese |
| --- | --- | --- |
| Wordmark (logo only) | **Inter** — weight 800, tracking −0.04 em | — (Latin only in the mark) |
| Display (headlines, deck titles, report covers, big numbers) | **Source Serif 4** — weight 500, tracking −0.02 em | **Microsoft JhengHei UI** — weight 600 |
| UI body (running prose, tables, buttons, labels) | **Inter** — weight 400 / 500 / 600 | **Microsoft JhengHei UI** — weight 400 / 500 / 600 |
| Mono (tickers, code, decimal alignment) | **JetBrains Mono** | — (use Latin mono) |

The wordmark is intentionally the only place a heavy geometric sans appears at large size. Everywhere else, English headlines are a quiet serif; Chinese headlines are Microsoft JhengHei UI, the system face on every Windows machine the audience sits in front of.

Numerals use **tabular figures** (`font-variant-numeric: tabular-nums`) everywhere they appear in a column. Display numerals are serif (Source Serif 4 at 500), tightly tracked (−0.02 em).

A nine‑step type scale lives in `colors_and_type.css` (10/12/14/16/18/22/28/40/56/80px). Line‑height is 0.98–1.18 for display, 1.55 for body. Letter‑spacing is −0.022 em on display, 0 on body, +0.14 em on small‑caps labels.

### Spacing & rhythm

A **4 px base grid** with a 12‑column page grid at 1440. The scale is `4 8 12 16 24 32 48 64 96 128`. Reports and decks use a stricter 8 px sub‑grid.

Every page has a **1 px hairline** at top and bottom of the content well in `--rule` (`#D8D5CE`). The hairline is the most repeated visual element in the system; treat it as part of the logo.

### Backgrounds

- **Paper** in light mode, **Ink** in dark mode. No gradient backgrounds anywhere.
- The only acceptable background "texture" is a **0.5 px hairline grid** at 24 px spacing in `--rule`, used behind data‑heavy screens at 30% opacity. It evokes engineering paper. Don't use it on marketing pages.
- Full‑bleed photography is permitted only on report covers and one marketing hero. Imagery is **architectural, daylight, desaturated**: building exteriors, lobbies, the floor of an exchange. Never people smiling at laptops.

### Cards & containers

- Cards are **flat**: 1 px border in `--rule`, 0 radius, no shadow. The hairline border is the card.
- A "raised" card (used sparingly, e.g. for a modal or a focused KPI) gets `box-shadow: 0 1px 0 var(--rule), 0 12px 32px -16px rgba(11,11,12,0.18)` — a one‑pixel lip plus a soft ground shadow.
- Corner radius is **2 px** for inputs and buttons, **0 px** for cards, tables, and report blocks. Pills (status chips) are the only fully‑rounded element.

### Borders & rules

- 1 px solid `--rule` for everything visible.
- 2 px solid `--ink` for emphasis (table totals row, chart axes, report cover top‑rule).
- Dashed lines forbidden. Dotted lines reserved for chart forecast continuation.

### Shadows

Two shadows only:
- `--shadow-1` — focus / floating menus: `0 1px 0 var(--rule), 0 8px 24px -12px rgba(11,11,12,0.15)`
- `--shadow-2` — modals: `0 1px 0 var(--rule), 0 32px 64px -24px rgba(11,11,12,0.30)`

No glow shadows. No coloured shadows. No inner shadows except for the pressed state of a button.

### Hover & press

- **Hover (button, primary)**: background goes from `--bpm-red` to `--oxblood`; no scale change.
- **Hover (button, secondary)**: background goes from transparent to `--ink-05`; border darkens one step.
- **Hover (link)**: underline appears (`text-decoration: underline; text-underline-offset: 3px`). No colour change.
- **Hover (row in a table)**: row background goes to `--ink-03`. No outlines.
- **Press**: 60 ms ease‑out, `transform: translateY(0.5px)` and the background darkens one more step. No scale shrink, no shadow pulse.

### Motion

- All easing is `cubic-bezier(0.22, 0.61, 0.36, 1)` (a calm out‑ease). No bounces. No springs.
- Durations: 120 ms for hover state, 200 ms for component transitions, 360 ms for route / panel transitions. Nothing longer.
- Page transitions are **opacity only**, no slide. Charts may draw in over 400 ms; this is the longest animation in the system.

### Transparency & blur

- Use sparingly. Permitted on: the sticky top bar over a scrolled page (`backdrop-filter: saturate(180%) blur(12px)`, background `rgba(245,241,234,0.78)` in light, `rgba(11,11,12,0.78)` in dark).
- Never blur a hero image to "create depth." If an image needs to be quieter, desaturate it, don't blur it.

### Imagery treatment

- Photography: **desaturate −25%, contrast +6%, slight warm shift**. The look is "architectural editorial," not "magazine glamour."
- No coloured overlays on photography. If text must sit on an image, place text in a paper‑coloured block to the side, not on top.

### Layout rules

- Page gutters: **64 px** at desktop ≥1280, **32 px** at tablet, **20 px** at mobile.
- Maximum reading column: **72ch** (~ 680 px) for English prose; **34em** for Traditional Chinese prose.
- The sticky header is **64 px** tall. Footers in the app are **48 px**.
- Data tables fill their container; never centre a data table inside a wide page.

### "Don'ts" (high‑signal)

- ❌ No purple/blue gradients.
- ❌ No emoji.
- ❌ No drop‑shadow on text, ever.
- ❌ No rounded‑corner cards with a coloured left border.
- ❌ No hand‑drawn illustration.
- ❌ No mascot.
- ❌ No green CTA. CTAs are red, neutral, or text.

---

## ICONOGRAPHY

BPM uses **Lucide icons** as its working icon set (1.5 px stroke, 24×24 grid, square caps). Lucide was chosen because it has the lowest "personality" of the major open sets — it reads as a tool, not a brand — and because its line weight matches our 1 px hairline aesthetic.

- **Default stroke**: 1.5 px on 24 px grid. At 16 px sizes we use 1.25 px stroke (Lucide's smaller preset).
- **Filled variants are forbidden.** All icons are outline. The only exception is a **filled red dot** used as a live‑data indicator.
- **Colour**: icons inherit `currentColor`. Red icons are only acceptable for the live‑data indicator and for the brand mark.
- **Sizing**: 16 / 20 / 24 / 32 px. The 24 px is canonical.

### Why not a custom set?
- A custom icon set is a large undertaking. The brief did not include one. We use Lucide today and recommend commissioning a 30‑icon house set later (real‑estate‑specific glyphs: floor plate, cap rate, NOI bridge, WALT clock, lease ladder, dry powder).

### Asset inventory

- `assets/bpm-wordmark.svg` — primary wordmark, bold sans, ink on transparent
- `assets/bpm-wordmark-red.svg` — bilingual wordmark with red triangle mark and 繁中 + EN tag
- `assets/bpm-monogram.svg` — square BPM monogram on ink, for favicon / app icon
- `assets/bpm-monogram-stamp.svg` — circular red stamp variant for report covers
- `preview/iconography.html` — a sample of Lucide icons in BPM treatment

### Unicode allowances
- `·` (U+00B7) — separator in the wordmark and between bilingual metadata
- `—` (U+2014) — em dash in prose
- `–` (U+2013) — en dash in numeric ranges
- `「」『』` — full‑width quotes in Chinese
- `▲ ▼` (U+25B2 / U+25BC) — gain / loss triangles in dense tables (Lucide arrows are used at ≥16 px; the triangles are used at 10–12 px where stroke icons fall apart)

### Substitutions flagged
- **Microsoft JhengHei UI** is a Windows system font; macOS / Linux machines will fall back to PingFang TC / Heiti TC / Noto Sans TC (loaded from Google Fonts). For pixel-perfect screenshots, take them on Windows.
- **Source Serif 4** is the working English display face. If you have a licensed serif (Tiempos, Publico, GT Sectra register), point me at it and I'll re-hang the type scale.
- **Inter** stands in for a future licensed grotesk for body / wordmark. Same swap path.

---

## Detailed file index

```
README.md                       ← you are here
SKILL.md                        ← Agent-Skill descriptor
colors_and_type.css             ← all tokens
assets/
  bpm-wordmark.svg              ← primary, ink, bold sans (BCG-style)
  bpm-wordmark-red.svg          ← bilingual, with red triangle mark + 不動產組合智能
  bpm-monogram.svg              ← 96 × 96 square mark on ink
  bpm-monogram-stamp.svg        ← circular red stamp for report covers
preview/
  color-brand.html · color-neutrals.html · color-semantic.html · color-data.html
  type-display.html · type-body.html · type-scale.html · type-numerals.html
  spacing-scale.html · radius-shadow.html · rule-hairline.html · motion.html
  button-primary.html · form-input.html · chip-status.html · card-kpi.html
  table-financial.html · top-bar.html
  logo-lockups.html · iconography.html · voice-samples.html
ui_kits/
  web_app/
    index.html                  ← clickable portfolio dashboard
    kit.css · README.md
    TopBar.jsx · Sidebar.jsx · KPIStrip.jsx
    AssetTable.jsx · PortfolioMap.jsx · AssetDetailDrawer.jsx · Composer.jsx
  marketing/
    index.html                  ← marketing homepage
    kit.css · README.md
    NavBar.jsx · Hero.jsx · CapabilityGrid.jsx · StatStrip.jsx · Coverage.jsx · Footer.jsx
slides/
  index.html                    ← 16:9 deck index, links each slide
  deck.css
  TitleSlide.html · AgendaSlide.html · SectionDivider.html
  BigNumberSlide.html · ComparisonSlide.html · DataTableSlide.html
  QuoteSlide.html · ClosingSlide.html
```

> No local font files are shipped. `colors_and_type.css` imports Inter, Noto Sans TC, and JetBrains Mono from Google Fonts as a fallback. Drop a licensed face into `fonts/<family>/` and the `@font-face` declarations near the bottom of `colors_and_type.css` will pick them up before falling back to Google.
