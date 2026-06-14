# BPM Intelligence · Web App UI kit

A high-fidelity recreation of the BPM Intelligence portfolio dashboard. The kit is for **design exploration**, not production — components are styled correctly, but interactions are mocked (no real data, no real router).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entry — composes the full dashboard at the dashboard view. Click an asset row to open the detail drawer. |
| `TopBar.jsx` | Sticky 64 px top bar — wordmark, primary nav, live tick, locale toggle, avatar |
| `Sidebar.jsx` | 240 px collapsible left nav — portfolios, sectors, geographies |
| `KPIStrip.jsx` | Four-up KPI band — gross mark, cap rate, WALT, exposures changed |
| `PortfolioMap.jsx` | Heatmap-style geographic exposure card (SVG, no real map tiles) |
| `AssetTable.jsx` | Sortable financial table with totals row |
| `AssetDetailDrawer.jsx` | Right-side drawer that opens when an asset is clicked |
| `Composer.jsx` | Bottom-docked "ask analyst" composer — bilingual placeholder |

## What is intentionally missing

- Real map tiles (`PortfolioMap` shows a stylised SVG of Greater Asia)
- Real authentication / multi-user state
- Persistent storage (drawer state is React state only)
- Settings, billing, admin
- Mobile breakpoints (the brief is desktop-first capital allocator software)

## How to view

Open `index.html` directly. All scripts load from CDN; no build step.
