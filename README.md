# BPM Intelligence — Portfolio Dashboard

> 不動產組合智能 · Real Estate Portfolio Intelligence

A clean, institutional-grade asset reporting dashboard for private asset owners and
family offices, built to the **BPM design system** (warm paper, flat hairline cards,
one oxblood red, serif numerals, sentence case, bilingual TC/EN).

Mock client: **陳氏家族信託 — 不動產資產組合** (three Greater-Taipei assets). All data is
fictional and for demonstration only.

## Running locally

Serve over HTTP (not `file://`) — the pages use `fetch()` to load JSON.

```bash
python3 -m http.server 8080
# open http://localhost:8080/login.html   (passcode: atlas2026)
```

`login.html → portfolio.html → index.html?id=asset-001`

## Live

Published via **GitHub Pages** from `main`. A push to `main` redeploys the site.

## Structure

```
.
├── login.html        # Passcode gate (sessionStorage), BPM styling
├── portfolio.html    # Portfolio dashboard — app-shell, KPI strip, exposure map,
│   + portfolio.js    #   holdings table → detail drawer, composer, + full analysis sections
├── index.html        # Single-asset detail — 7 tabs, 11 ECharts
│   + app.js          #   (overview, ownership, financial, risk, ops, documents, market)
├── styles.css        # The BPM design system (tokens + every component)
├── assets/           # BPM wordmark / monogram SVGs
├── data/             # Fictional portfolio + per-asset JSON (May 2026 period)
│   ├── portfolio.json
│   └── assets/asset-00{1,2,3}/…
└── reference/        # Design source of truth
    ├── BPM Design System/                 # tokens, UI kits, slides, previews
    └── design_handoff_portfolio_dashboard/ # the dashboard handoff spec
```

## Design system

`styles.css` is the single source of truth for the look. Tokens, type, and component
specs derive from `reference/BPM Design System/colors_and_type.css` and the dashboard
handoff in `reference/design_handoff_portfolio_dashboard/`.

Key rules: flat 1px hairline cards (no shadow, ~0 radius) on warm paper (`#F5F1EA`);
one red (`#8E1B1F`) for brand accent **and** negative values; Source Serif 4 for Latin
display/numbers + Noto Sans TC for Chinese body; tabular numerals; sentence case;
ECharts recolored to the BPM 4-series palette (red / slate / forest / brass).

## Data flow

`latest.json → manifest.json → [section JSON files in parallel]`, then render. To wire a
real backend, point the fetch base URL at your API and return JSON of the same shape.
