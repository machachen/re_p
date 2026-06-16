'use strict';
// 情境 Scenarios — portfolio stress (data-driven aggregation + emphasis toggle)
// Sums each asset's analyst-set 悲觀/基本/樂觀 projections to portfolio level.

// ── interface i18n (chrome only — page-specific keys) ──────────────────────
if (window.bpmI18nAdd) bpmI18nAdd({
  'scn.eyebrow': '情境分析 · Scenario analysis',
  'scn.title': '組合壓力測試',
  'scn.sub': '三情境 · 五年展望',
  'scn.emphasis': '情境強調',
  'scn.aggNote': '數字皆由各資產分析師情境彙總（可追溯）',
  'scn.valueChart': '組合五年價值預測',
  'scn.cashChart': '組合五年淨現金流情境',
  'scn.drivers': '主要壓力來源',
  'scn.contrib': '各資產情境貢獻',
  'scn.loading': '載入情境分析…',
  'scn.footNote': '情境為分析師假設彙總，僅供參考，非投資建議',
  'scn.cardValue': '期末組合估值',
  'scn.cardNoi': '期末年度 NOI',
  'scn.cardCash': '期末淨現金流',
  'scn.cardDscr': '預估 DSCR',
  'scn.vsBase': 'vs 基本',
  'scn.topConcern': '最迫切 · Top concern',
  'scn.highRisks': '高風險項目 · High risks',
  'scn.thAsset': '資產',
  'scn.thBaseVal': '基本期末估值',
  'scn.thDownVal': '悲觀期末估值',
  'scn.thDownside': '下檔幅度',
  'scn.viewRisk': '查看風險 ›',
  'scn.loadError': '⚠ 載入失敗：',
  'foot.brandVer': 'BPM Intelligence v4.2'
}, {
  'scn.eyebrow': 'Scenario analysis',
  'scn.title': 'Portfolio stress test',
  'scn.sub': 'Three scenarios · five-year outlook',
  'scn.emphasis': 'Emphasis',
  'scn.aggNote': 'All figures aggregated from each asset analyst’s scenarios (traceable)',
  'scn.valueChart': 'Portfolio five-year value forecast',
  'scn.cashChart': 'Portfolio five-year net cash flow scenarios',
  'scn.drivers': 'Key stress drivers',
  'scn.contrib': 'Scenario contribution by asset',
  'scn.loading': 'Loading scenario analysis…',
  'scn.footNote': 'Scenarios aggregate analyst assumptions; for reference only, not investment advice',
  'scn.cardValue': 'Year-end portfolio valuation',
  'scn.cardNoi': 'Year-end annual NOI',
  'scn.cardCash': 'Year-end net cash flow',
  'scn.cardDscr': 'Projected DSCR',
  'scn.vsBase': 'vs Base',
  'scn.topConcern': 'Top concern',
  'scn.highRisks': 'High risks',
  'scn.thAsset': 'Asset',
  'scn.thBaseVal': 'Base year-end valuation',
  'scn.thDownVal': 'Downside year-end valuation',
  'scn.thDownside': 'Downside',
  'scn.viewRisk': 'View risk ›',
  'scn.loadError': '⚠ Load failed: ',
  'foot.brandVer': 'BPM Intelligence v4.2'
});

const SC = ['Downside', 'Base', 'Upside'];
// Scenario labels come from the shared i18n keys (sc.downside/base/upside).
function scLabel(s) { return window.t ? t('sc.' + s.toLowerCase()) : s; }
const SC_COLOR = { Downside: '#8E1B1F', Base: '#0B0B0C', Upside: '#1F5C4A' };
const BPM = { ink: '#0B0B0C', ink3: '#5C5C61', rule: '#D8D5CE', grid: '#E5E5E7', bone: '#FBF8F2' };
const BPM_FONT = "'Inter','Noto Sans TC',system-ui,sans-serif";

const STATE = { emph: 'Base', bundle: null, agg: null };
const charts = [];

function el(id) { return document.getElementById(id); }
function showLoading(v) { const o = el('loading-overlay'); if (o) o.style.display = v ? 'flex' : 'none'; }
function showError(m) { const b = el('error-banner'); if (b) { b.textContent = (window.t ? t('scn.loadError') : '⚠ 載入失敗：') + m; b.style.display = 'block'; } }
function escHtml(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function fmtC(n) {
  if (n == null || isNaN(n)) return '—';
  const a = Math.abs(n), s = n < 0 ? '-' : '';
  if (a >= 1e9) return s + '$' + (a / 1e9).toFixed(1) + 'B';
  if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(1) + 'M';
  if (a >= 1e3) return s + '$' + Math.round(a / 1e3) + 'K';
  return s + '$' + Math.round(a);
}
function last(arr) { return (arr && arr.length) ? arr[arr.length - 1] : null; }

function sumSeries(assets, pick) {
  const out = { Downside: [], Base: [], Upside: [] };
  assets.forEach(a => {
    const o = pick(a);
    if (!o) return;
    SC.forEach(s => { (o[s] || []).forEach((v, i) => { out[s][i] = (out[s][i] || 0) + (v || 0); }); });
  });
  return out;
}

async function init() {
  showLoading(true);
  try {
    const s = window.requireAuth ? await window.requireAuth() : null;
    if (!s) return;
    const b = await window.bpmLoadScenarioBundle();
    STATE.bundle = b;

    let years = ['2026', '2027', '2028', '2029', '2030'];
    const fa = b.assets.find(a => a.financial && a.financial.projections && a.financial.projections.years);
    if (fa) years = fa.financial.projections.years;

    STATE.agg = {
      years,
      value: sumSeries(b.assets, a => a.financial && a.financial.projections && a.financial.projections.value),
      noi: sumSeries(b.assets, a => a.financial && a.financial.projections && a.financial.projections.noi),
      cash: sumSeries(b.assets, a => a.risk && a.risk.scenarioChart && a.risk.scenarioChart.cashFlow)
    };

    const per = el('sc-period'); if (per) per.textContent = b.period.label || b.period.period;
    renderCards();
    renderCharts();
    renderDrivers();
    renderContrib();
    wireToggle();
  } catch (e) {
    console.error(e); showError(e.message);
  } finally { showLoading(false); }
}

function setEmph(s) {
  if (!SC.includes(s)) return;
  STATE.emph = s;
  document.querySelectorAll('#sc-toggle button').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-sc') === s));
  renderCards();
  renderCharts();
}

function wireToggle() {
  document.querySelectorAll('#sc-toggle button').forEach(btn => btn.addEventListener('click', () => setEmph(btn.getAttribute('data-sc'))));
}

function renderCards() {
  const host = el('sc-cards'); if (!host) return;
  const ag = STATE.agg;
  const debtSvc = (STATE.bundle.portfolio.totals || {}).annualDebtService || null;
  const baseV = last(ag.value.Base), baseN = last(ag.noi.Base), baseC = last(ag.cash.Base);
  const delta = d => d == null ? '' : `<div style="color:${d >= 0 ? 'var(--pos)' : 'var(--bpm-red)'};font-size:11px;margin-top:2px;">${d >= 0 ? '▲ +' : '▼ '}${fmtC(Math.abs(d))} ${t('scn.vsBase')}</div>`;

  host.innerHTML = SC.map(s => {
    const v = last(ag.value[s]), n = last(ag.noi[s]), c = last(ag.cash[s]);
    const dscr = (debtSvc && n != null) ? (n / debtSvc) : null;
    const sel = s === STATE.emph;
    const cell = (label, val, d) => `<div><div class="kf-label">${label}</div><div class="val-value" style="font-size:19px;">${val}</div>${delta(d)}</div>`;
    return `<div class="card sc-card${sel ? ' sel' : ''}" data-sc="${s}" style="cursor:pointer;">
      <div class="eyebrow" style="color:${SC_COLOR[s]};">${scLabel(s)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
        ${cell(t('scn.cardValue'), fmtC(v), s === 'Base' ? null : v - baseV)}
        ${cell(t('scn.cardNoi'), fmtC(n), s === 'Base' ? null : n - baseN)}
        ${cell(t('scn.cardCash'), fmtC(c), s === 'Base' ? null : c - baseC)}
        ${cell(t('scn.cardDscr'), dscr != null ? dscr.toFixed(2) + 'x' : '—', null)}
      </div>
    </div>`;
  }).join('');
  host.querySelectorAll('.sc-card').forEach(c => c.addEventListener('click', () => setEmph(c.getAttribute('data-sc'))));
}

function buildOpt(data) {
  const series = SC.map(s => {
    const emph = s === STATE.emph;
    return {
      name: scLabel(s), type: 'line', data: data[s], smooth: true, symbol: 'none',
      lineStyle: { color: SC_COLOR[s], width: emph ? 3 : 1.5, type: emph ? 'solid' : 'dashed', opacity: emph ? 1 : 0.45 },
      itemStyle: { color: SC_COLOR[s] }, z: emph ? 5 : 1
    };
  });
  return {
    color: [SC_COLOR.Downside, SC_COLOR.Base, SC_COLOR.Upside],
    textStyle: { fontFamily: BPM_FONT, fontSize: 11, color: BPM.ink3 },
    tooltip: {
      trigger: 'axis', backgroundColor: BPM.bone, borderColor: BPM.rule, borderWidth: 1,
      textStyle: { color: BPM.ink, fontFamily: BPM_FONT, fontSize: 12 },
      formatter: p => p[0].axisValue + '<br>' + p.map(x => `${x.marker}${x.seriesName}: ${fmtC(x.value)}`).join('<br>')
    },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 16, bottom: 40, left: 56, right: 18, containLabel: true },
    xAxis: { type: 'category', data: STATE.agg.years, axisLine: { lineStyle: { color: BPM.rule } }, axisTick: { show: false }, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10 } },
    yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => fmtC(v) }, splitLine: { lineStyle: { color: BPM.grid } } },
    series
  };
}

function renderCharts() {
  charts.forEach(c => c.dispose()); charts.length = 0;
  [['sc-value-chart', STATE.agg.value], ['sc-cash-chart', STATE.agg.cash]].forEach(([id, data]) => {
    const dom = el(id); if (!dom) return;
    const ch = echarts.init(dom); ch.setOption(buildOpt(data)); charts.push(ch);
  });
}

function renderDrivers() {
  const host = el('sc-drivers'); if (!host) return;
  const rs = STATE.bundle.portfolio.riskSummary || {};
  let highs = [];
  STATE.bundle.assets.forEach(a => {
    const reg = (a.risk && a.risk.register) || [];
    reg.forEach(r => { if ((r.level || '').toLowerCase() === 'high' || r.level === '高') highs.push({ title: r.title, asset: a.name, score: r.riskScore || 0 }); });
  });
  highs.sort((x, y) => y.score - x.score); highs = highs.slice(0, 4);

  host.innerHTML = `
    <div style="background:var(--neg-tint);border:1px solid var(--rule);border-left:2px solid var(--bpm-red);padding:12px 14px;margin-bottom:14px;">
      <div class="eyebrow eyebrow-red" style="margin-bottom:4px;">${t('scn.topConcern')}</div>
      <div style="font-family:var(--font-cjk);font-size:13.5px;line-height:1.75;color:var(--ink-2);">${escHtml(rs.topConcern || '—')}</div>
    </div>
    ${highs.length ? '<div class="eyebrow" style="margin-bottom:6px;">' + t('scn.highRisks') + '</div>' + highs.map(h =>
      `<div class="row-between" style="border-bottom:1px solid var(--rule);padding:9px 0;gap:10px;">
        <span style="font-size:13px;color:var(--ink);flex:1;">${escHtml(h.title)}</span>
        <span style="display:inline-flex;gap:8px;align-items:center;white-space:nowrap;"><span class="meta">${escHtml(h.asset)}</span><span class="risk-badge high">${t('lvl.high')}</span></span>
      </div>`).join('') : ''}`;
}

function renderContrib() {
  const host = el('sc-contrib'); if (!host) return;
  const rows = STATE.bundle.assets.map(a => {
    const p = a.financial && a.financial.projections && a.financial.projections.value;
    if (!p) return null;
    const base = last(p.Base), down = last(p.Downside);
    const d = base ? ((down - base) / base * 100) : 0;
    return { name: a.name, code: a.code, base, down, d };
  }).filter(Boolean);

  host.innerHTML = `
    <table class="data-table">
      <thead><tr><th>${t('scn.thAsset')}</th><th class="num">${t('scn.thBaseVal')}</th><th class="num">${t('scn.thDownVal')}</th><th class="num">${t('scn.thDownside')}</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `<tr>
          <td class="cell-asset">${escHtml(r.name)}</td>
          <td class="num">${fmtC(r.base)}</td>
          <td class="num">${fmtC(r.down)}</td>
          <td class="num neg">${r.d.toFixed(1)}%</td>
          <td style="text-align:right;"><a class="doc-link" href="index.html?id=${escHtml(r.code)}">${t('scn.viewRisk')}</a></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

window.addEventListener('resize', () => charts.forEach(c => c.resize()));
document.addEventListener('DOMContentLoaded', init);
