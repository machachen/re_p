# Asset Intelligence — Static Prototype

A clean, professional, executive-grade asset reporting dashboard for private asset owners, family offices, and residential/mixed-use property holders.

## Running Locally

You **must** serve this over HTTP (not `file://`) because it uses `fetch()` to load JSON files.

### Option 1 — Python (no install)
```bash
cd re_portfolio
python3 -m http.server 8080
# Open: http://localhost:8080
```

### Option 2 — Node.js (`npx`)
```bash
cd re_portfolio
npx serve .
# Open the URL shown in the terminal
```

### Option 3 — VS Code Live Server
Install the "Live Server" extension, right-click `index.html` → **Open with Live Server**.

---

## File Structure

```
re_portfolio/
├── index.html                          # Single-page shell; all tab panels
├── styles.css                          # All styles (enterprise SaaS aesthetic)
├── app.js                              # Data loading + tab logic + ECharts
├── README.md                           # This file
└── data/
    └── assets/
        └── asset-001/
            ├── latest.json             # Points to current reporting period
            └── 2026-05/
                ├── manifest.json       # Lists all section files for the period
                ├── overview.json       # Overview tab data
                ├── ownership-capital.json
                ├── financial.json
                ├── risk.json
                ├── operations.json
                ├── documents.json
                └── market.json
```

---

## Data Loading Flow

```
latest.json → manifest.json → [all section JSON files in parallel]
```

1. `latest.json` identifies the asset and current period
2. `manifest.json` lists all section files for that period
3. All section files are fetched in parallel with `Promise.all`
4. Rendering is triggered once all data is loaded

---

## Charts (Apache ECharts)

| Tab | Chart | Type |
|-----|-------|------|
| Overview | 4 × KPI mini-charts (NOI, DSCR, Cash Flow, LTV) | Bar / Line |
| Ownership | Ownership donut | Pie |
| Ownership | Capital stack waterfall | Bar |
| Financial | Valuation history | Line area |
| Financial | 5-year value projection (3 scenarios) | Multi-line |
| Risk | Probability/Impact matrix | Scatter |
| Risk | 3-scenario cash flow projection | Multi-line |
| Market | Cap rate trend | Line area |
| Market | Vacancy trend (submarket vs asset) | Multi-line |

**Total: 11 ECharts instances** across 7 tabs.

---

## Connecting to WordPress / Elementor / ACF

The data source is currently a set of local JSON files. To connect to a WordPress backend:

### 1. Replace the base URL in `app.js`

```js
// Current (local files):
const BASE_URL = './data/assets/';

// WordPress / ACF REST endpoint:
const BASE_URL = 'https://your-site.com/wp-json/asset-intelligence/v1/assets/';
```

### 2. Map your ACF REST response to the same JSON shape

Each section JSON file has a defined shape. Your ACF endpoint should return JSON matching that shape. You can use ACF's built-in REST API (`/wp-json/acf/v3/posts/<id>`) or write a custom `register_rest_route()` endpoint in a plugin.

### 3. Handle CORS

If your WordPress site is on a different domain, add this to `wp-config.php` or a plugin:
```php
header('Access-Control-Allow-Origin: *');
```

Or use a proxy/same-domain deployment.

### 4. Multi-asset support

`latest.json` controls which asset and period are loaded. You can make this dynamic by reading a `?asset=asset-002&period=2026-05` URL query parameter in `app.js` and constructing the fetch URL accordingly.

---

## Key Design Decisions

- **No build step.** Plain HTML/CSS/JS — deploy anywhere static files are served.
- **No auth.** Add reverse-proxy auth (Cloudflare Access, Nginx basic auth) if needed.
- **Data-driven.** All content comes from JSON; HTML is structural only.
- **ECharts** for charts — MIT license, no API key required, excellent financial chart support.
- **Responsive-first** with a desktop-optimized layout (dense financial data is best read on a wide screen).

---

## Mock Asset

**Harbor View Residential Asset** — 412 Harbor View Place, Seattle, WA 98101  
12-unit residential/mixed-use · Status: Hold & Improve · Reporting Period: May 2026  
All data is fictional and for demonstration purposes only.
