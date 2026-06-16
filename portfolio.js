'use strict';

/* ── Page-specific i18n keys (interface chrome only; data stays Chinese) ── */
if (window.bpmI18nAdd) bpmI18nAdd({
  // page header + map + summary
  'pf.headEyebrow': '2026 第二季 · 組合審查',
  'pf.mapEyebrow': '地理曝險 · Geographic exposure',
  'pf.mapTitle': '大台北組合 · 依市值',
  'pf.mapLegendThis': '本組合曝險',
  'pf.mapLegendPeer': '同業均值',
  'pf.summaryEyebrow': '本季摘要 · This quarter in one paragraph',
  'pf.topContributor': '最大正向貢獻 · Top contributor',
  'pf.mostUrgent': '最迫切事項 · Most urgent',
  // holdings
  'pf.holdingsEyebrow': '持有資產 · Holdings',
  'pf.holdingsNote': '點選任一列查看資產明細',
  'pf.thAsset': '資產',
  'pf.thCategory': '類別',
  'pf.thGeography': '地區',
  'pf.thValuation': '估值',
  'pf.lblLtv': 'LTV',
  'pf.thNoi': '年度 NOI',
  'pf.thCapRate': '資本化率',
  'pf.thStatus': '狀態',
  'pf.totalCount': '合計 · {n} 檔',
  // composer
  'pf.askAnalyst': '詢問分析師',
  'pf.askSla': '台北辦公時間內 4 小時回覆 · TPE',
  'pf.composerPh': '輸入問題，或貼上一段備忘錄 …',
  'pf.attachBtn': '＋ 附件',
  'pf.sugg1': '淡水河岸再融資有哪些選項？',
  'pf.sugg2': '哪些資產本季估值變動最大？',
  'pf.sugg3': '林口全聯 2027 租金調漲影響為何？',
  // KPI strip
  'pf.kpiGrossMark': '組合總估值 · Gross mark',
  'pf.kpiBlendedLtv': '加權 LTV · Blended LTV',
  'pf.kpiAnnualNoi': '年度 NOI · Annual NOI',
  'pf.kpiPending': '待決 · Pending',
  'pf.kpiYoy': '年增',
  'pf.kpiLtvDelta': '財務結構穩健',
  'pf.kpiNoiMeta': '可收益兩資產',
  'pf.kpiPendingValue': '再融資',
  'pf.kpiPendingMeta': '淡水河岸到期',
  // sections / card titles
  'pf.secAssetOverview': '個別資產概覽 · Asset overview',
  'pf.secAssetOverviewNote': '點擊資產卡片查看完整報告',
  'pf.secComposition': '組合構成分析 · Composition',
  'pf.cardAllocation': '資產配置（依估值比重）',
  'pf.cardIncome': '年度 NOI 與淨現金流比較',
  'pf.cardIncomeSub': '各資產 NOI（左欄）及稅前淨現金流（右欄）',
  'pf.secComparison': '三資產財務比較 · Comparison',
  'pf.secDebt': '負債與槓桿結構 · Debt & leverage',
  'pf.cardDebtSchedule': '貸款到期時間表 & 明細',
  'pf.cardLtv': '各資產貸款成數（LTV）比較',
  'pf.secHistory': '組合總估值成長軌跡 · Value history',
  'pf.cardHistory': '三資產合計估值 — 歷史趨勢（2019–2026）',
  'pf.cardHistorySub': '堆疊面積圖 · 各色代表各資產估值貢獻',
  'pf.secActions': '待決行動項目 — 全部資產 · Actions',
  'pf.secActionsNote': '依截止日期排序',
  'pf.secRisk': '組合風險概況 · Risk profile',
  'pf.riskHigh': '高度風險',
  'pf.riskMedium': '中度風險',
  'pf.riskLow': '低度風險',
  'pf.cardTopConcern': '最主要風險警示',
  // asset cards (metric labels)
  'pf.acValuation': '估值',
  'pf.acEquity': '淨權益',
  'pf.acNoi': '年度NOI',
  // drawer
  'pf.loadingText': '載入組合資料中…',
  'pf.drawerClose': '關閉',
  'pf.drawerEyebrow': '資產明細',
  'pf.drawerMarketVal': '市場估值',
  'pf.levHigh': '槓桿偏高',
  'pf.levConservative': '保守槓桿',
  'pf.levNoLoan': '無貸款',
  'pf.holdCost': '持有成本',
  'pf.posNoi': '正向 NOI',
  'pf.keyHighlight': '本季重點 · Key highlight',
  'pf.ownStructure': '持有結構',
  'pf.familyEquity': '家族淨權益',
  'pf.loanBalance': '貸款餘額',
  'pf.annualNoi': '年度 NOI',
  'pf.annualNetCf': '年度淨現金流',
  // comparison row labels
  'pf.cmpMetric': '指標',
  'pf.cmpMarketVal': '估計市值',
  'pf.cmpNetEquity': '淨權益',
  'pf.cmpChenPct': '陳氏家族持份',
  'pf.cmpChenEquity': '陳氏家族淨權益',
  'pf.cmpHoldStatus': '持有狀況',
  'pf.cmpKeyItems': '近期重點事項',
  // debt table
  'pf.thLender': '貸款機構',
  'pf.thRate': '利率',
  'pf.thDscr': 'DSCR',
  'pf.thMaturity': '到期日',
  'pf.totalPortfolio': '組合合計',
  'pf.weighted': '加權',
  // actions table
  'pf.thActionItem': '行動項目',
  'pf.thPriority': '優先級',
  'pf.thDeadline': '截止日期',
  'pf.prioHigh': '高優先',
  'pf.prioMedium': '中優先',
  'pf.prioLow': '低優先',
  // charts
  'pf.chartValuation': '估值',
  'pf.chartWeight': '比重',
  'pf.seriesNoi': 'NOI',
  'pf.seriesNetCf': '稅前淨現金流',
  'pf.chartTotal': '合計',
  // misc
  'pf.loadError': '⚠ 資料載入失敗：'
}, {
  // page header + map + summary
  'pf.headEyebrow': 'Q2 2026 · Portfolio review',
  'pf.mapEyebrow': 'Geographic exposure',
  'pf.mapTitle': 'Greater Taipei portfolio · by value',
  'pf.mapLegendThis': 'This portfolio',
  'pf.mapLegendPeer': 'Peer average',
  'pf.summaryEyebrow': 'This quarter in one paragraph',
  'pf.topContributor': 'Top contributor',
  'pf.mostUrgent': 'Most urgent',
  // holdings
  'pf.holdingsEyebrow': 'Holdings',
  'pf.holdingsNote': 'Click any row to view asset details',
  'pf.thAsset': 'Asset',
  'pf.thCategory': 'Category',
  'pf.thGeography': 'Geography',
  'pf.thValuation': 'Valuation',
  'pf.lblLtv': 'LTV',
  'pf.thNoi': 'Annual NOI',
  'pf.thCapRate': 'Cap rate',
  'pf.thStatus': 'Status',
  'pf.totalCount': 'Total · {n} assets',
  // composer
  'pf.askAnalyst': 'Ask your analyst',
  'pf.askSla': 'Reply within 4 hours during Taipei office hours · TPE',
  'pf.composerPh': 'Type a question, or paste a memo …',
  'pf.attachBtn': '＋ Attach',
  'pf.sugg1': 'What are the refinancing options for Tamsui?',
  'pf.sugg2': 'Which assets had the largest valuation change this quarter?',
  'pf.sugg3': 'What is the impact of the 2027 rent increase at Linkou PXMart?',
  // KPI strip
  'pf.kpiGrossMark': 'Gross mark',
  'pf.kpiBlendedLtv': 'Blended LTV',
  'pf.kpiAnnualNoi': 'Annual NOI',
  'pf.kpiPending': 'Pending',
  'pf.kpiYoy': 'YoY',
  'pf.kpiLtvDelta': 'Sound capital structure',
  'pf.kpiNoiMeta': 'Two income-generating assets',
  'pf.kpiPendingValue': 'Refinancing',
  'pf.kpiPendingMeta': 'Tamsui maturity',
  // sections / card titles
  'pf.secAssetOverview': 'Asset overview',
  'pf.secAssetOverviewNote': 'Click an asset card for the full report',
  'pf.secComposition': 'Composition',
  'pf.cardAllocation': 'Allocation (by valuation weight)',
  'pf.cardIncome': 'Annual NOI vs. net cash flow',
  'pf.cardIncomeSub': 'NOI (left bar) and pre-tax net cash flow (right bar) per asset',
  'pf.secComparison': 'Comparison',
  'pf.secDebt': 'Debt & leverage',
  'pf.cardDebtSchedule': 'Loan maturity schedule & detail',
  'pf.cardLtv': 'LTV by asset',
  'pf.secHistory': 'Value history',
  'pf.cardHistory': 'Combined valuation — historical trend (2019–2026)',
  'pf.cardHistorySub': 'Stacked area · each colour is one asset’s contribution',
  'pf.secActions': 'Actions — all assets',
  'pf.secActionsNote': 'Sorted by deadline',
  'pf.secRisk': 'Risk profile',
  'pf.riskHigh': 'High risk',
  'pf.riskMedium': 'Medium risk',
  'pf.riskLow': 'Low risk',
  'pf.cardTopConcern': 'Top risk alert',
  // asset cards (metric labels)
  'pf.acValuation': 'Valuation',
  'pf.acEquity': 'Net equity',
  'pf.acNoi': 'Annual NOI',
  // drawer
  'pf.loadingText': 'Loading portfolio data…',
  'pf.drawerClose': 'Close',
  'pf.drawerEyebrow': 'Asset detail',
  'pf.drawerMarketVal': 'Market valuation',
  'pf.levHigh': 'Elevated leverage',
  'pf.levConservative': 'Conservative leverage',
  'pf.levNoLoan': 'No debt',
  'pf.holdCost': 'Carrying cost',
  'pf.posNoi': 'Positive NOI',
  'pf.keyHighlight': 'Key highlight',
  'pf.ownStructure': 'Ownership structure',
  'pf.familyEquity': 'Family net equity',
  'pf.loanBalance': 'Loan balance',
  'pf.annualNoi': 'Annual NOI',
  'pf.annualNetCf': 'Annual net cash flow',
  // comparison row labels
  'pf.cmpMetric': 'Metric',
  'pf.cmpMarketVal': 'Estimated market value',
  'pf.cmpNetEquity': 'Net equity',
  'pf.cmpChenPct': 'Chen family stake',
  'pf.cmpChenEquity': 'Chen family net equity',
  'pf.cmpHoldStatus': 'Ownership status',
  'pf.cmpKeyItems': 'Recent highlights',
  // debt table
  'pf.thLender': 'Lender',
  'pf.thRate': 'Rate',
  'pf.thDscr': 'DSCR',
  'pf.thMaturity': 'Maturity',
  'pf.totalPortfolio': 'Portfolio total',
  'pf.weighted': 'Blended',
  // actions table
  'pf.thActionItem': 'Action item',
  'pf.thPriority': 'Priority',
  'pf.thDeadline': 'Deadline',
  'pf.prioHigh': 'High priority',
  'pf.prioMedium': 'Medium priority',
  'pf.prioLow': 'Low priority',
  // charts
  'pf.chartValuation': 'Valuation',
  'pf.chartWeight': 'Weight',
  'pf.seriesNoi': 'NOI',
  'pf.seriesNetCf': 'Pre-tax net cash flow',
  'pf.chartTotal': 'Total',
  // misc
  'pf.loadError': '⚠ Failed to load data: '
});

const PF_DATA_URL = './data/portfolio.json';
const chartInstances = [];

function initChart(domId) {
  const dom = el(domId);
  if (!dom) return null;
  const chart = echarts.init(dom);
  chartInstances.push(chart);
  return chart;
}
window.addEventListener('resize', () => chartInstances.forEach(c => c.resize()));

/* ── BPM data-viz palette — order: you/portfolio, peer/market, benchmark, forecast, mute ── */
const BPM_SERIES = ['#8E1B1F', '#33547A', '#1F5C4A', '#B5832A', '#8A8A8F'];
const CHART_COLORS = { blue: '#8E1B1F', green: '#1F5C4A', red: '#8E1B1F', amber: '#B5832A', gray: '#8A8A8F' };
const BPM = { ink: '#0B0B0C', ink3: '#5C5C61', rule: '#D8D5CE', grid: '#E5E5E7', paper: '#F5F1EA', bone: '#FBF8F2' };
const BPM_FONT = "'Inter','Noto Sans TC',system-ui,sans-serif";
const BPM_MONO = "'JetBrains Mono',ui-monospace,monospace";

const ECHARTS_BASE = {
  color: BPM_SERIES,
  textStyle: { fontFamily: BPM_FONT, fontSize: 11, color: BPM.ink3 },
  tooltip: {
    backgroundColor: BPM.bone, borderColor: BPM.rule, borderWidth: 1,
    textStyle: { color: BPM.ink, fontFamily: BPM_FONT, fontSize: 12 },
    extraCssText: 'border-radius:2px;box-shadow:0 8px 24px -12px rgba(11,11,12,0.15);'
  }
};
function bpmAxis(extra = {}) {
  return Object.assign({
    axisLine:  { lineStyle: { color: BPM.rule } },
    axisTick:  { show: false },
    axisLabel: { color: BPM.ink3, fontSize: 10, fontFamily: BPM_FONT },
    splitLine: { lineStyle: { color: BPM.grid, type: 'solid' } },
    nameTextStyle: { color: BPM.ink3, fontSize: 10 }
  }, extra);
}

/* ── Formatters ─────────────────────────────────────────── */
function fmt(n, decimals = 0) {
  if (n == null) return '—';
  return new Intl.NumberFormat('zh-TW', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}
function fmtNTD(n) {
  if (n == null) return '—';
  return 'NT$' + fmt(Math.abs(n));
}
function fmtCompact(n) {
  if (n == null) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e9) return sign + '$' + (abs / 1e9).toFixed(1) + 'B';
  if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return sign + '$' + Math.round(abs / 1e3) + 'K';
  return sign + '$' + Math.round(abs);
}
function fmtPct(n) { return n == null ? '—' : n.toFixed(1) + '%'; }
function escHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function el(id) { return document.getElementById(id); }

function statusBadgeHtml(s) {
  const clsMap   = { 'Open': 'open', 'In Progress': 'in-progress', 'Complete': 'complete' };
  const labelMap = { 'Open': t('status.open'), 'In Progress': t('status.inProgress'), 'Complete': t('status.complete') };
  return `<span class="status-badge ${clsMap[s] || 'not-started'}">${labelMap[s] || escHtml(s)}</span>`;
}

/* Status dot colour for chips (BPM semantic) */
function statusDotColor(statusColor) {
  if (statusColor === 'green') return 'var(--pos)';
  if (statusColor === 'amber') return 'var(--warn)';
  if (statusColor === 'red')   return 'var(--bpm-red)';
  return 'var(--info)';
}

function showLoading(v) { const o = el('loading-overlay'); if (o) o.style.display = v ? 'flex' : 'none'; }
function showError(msg) {
  const b = el('error-banner');
  if (!b) return;
  b.textContent = t('pf.loadError') + msg;
  b.style.display = 'block';
}

async function loadData() {
  showLoading(true);
  try {
    if (window.requireAuth) { const s = await window.requireAuth(); if (!s) return; }
    const d = await bpmLoadPortfolio();
    renderAll(d);
  } catch (err) {
    console.error(err);
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

function renderAll(d) {
  renderNav(d);
  renderPageHead(d);
  renderKpiStrip(d);
  renderMap(d);
  renderSummary(d);
  renderHoldings(d);
  renderComposer(d);
  renderAssetCards(d);
  renderAllocationChart(d);
  renderIncomeChart(d);
  renderComparisonTable(d);
  renderDebtTable(d);
  renderLTVChart(d);
  renderHistoryChart(d);
  renderActionsTable(d);
  renderRiskSummary(d);
}

/* ── Navigation ─────────────────────────────────────────── */
function renderNav(d) {
  const np = el('nav-period-display');
  if (np) np.textContent = d.meta.periodLabel;
}

/* ── Page header ────────────────────────────────────────── */
function renderPageHead(d) {
  const name = el('pf-name');
  if (name) name.textContent = t('side.realestate');
  const sub = el('pf-sub');
  if (sub) sub.textContent = 'Chen Family Trust · ' + d.meta.assetCount + ' assets · re-marked May 2026';
}

/* ── KPI strip (handoff 4-up band) ──────────────────────── */
function renderKpiStrip(d) {
  const host = el('pf-kpi-strip');
  if (!host) return;
  const tot = d.totals;

  // refinancing maturity from debt matrix (high-urgency loan)
  const refi = (d.debtMatrix || []).find(r => r.urgency === 'high');
  const refiDate = refi ? refi.maturity : '2026-10-01';

  const cells = [
    {
      label: t('pf.kpiGrossMark'),
      value: fmtCompact(tot.totalAUM),
      deltaSign: '▲', deltaCls: 'pos',
      delta: '+' + tot.yoyAUMGrowth.toFixed(1) + '%',
      deltaMeta: t('pf.kpiYoy')
    },
    {
      label: t('pf.kpiBlendedLtv'),
      value: tot.blendedLTV.toFixed(1), unit: '%',
      deltaSign: '▲', deltaCls: 'pos',
      delta: t('pf.kpiLtvDelta'),
      deltaMeta: t('pf.levConservative')
    },
    {
      label: t('pf.kpiAnnualNoi'),
      value: fmtCompact(tot.incomeGeneratingNOI),
      deltaSign: '▲', deltaCls: 'pos',
      delta: '+2.4%',
      deltaMeta: t('pf.kpiNoiMeta')
    },
    {
      label: t('pf.kpiPending'),
      value: t('pf.kpiPendingValue'),
      deltaSign: '▼', deltaCls: 'neg',
      delta: refiDate,
      deltaMeta: t('pf.kpiPendingMeta')
    }
  ];

  host.innerHTML = cells.map(c => `
    <div class="kpi-cell">
      <div class="eyebrow">${escHtml(c.label)}</div>
      <div class="kpi-num">${escHtml(c.value)}${c.unit ? `<span class="unit">${escHtml(c.unit)}</span>` : ''}</div>
      <div class="kpi-delta">
        <span class="${c.deltaCls}">${c.deltaSign} ${escHtml(c.delta)}</span>
        <span class="deltameta">${escHtml(c.deltaMeta)}</span>
      </div>
    </div>`).join('');
}

/* ── Exposure map (stylised SVG of Greater Taipei) ──────── */
function renderMap(d) {
  const host = el('pf-map-body');
  if (!host) return;

  // Hand-positioned bubbles for the three assets across Greater Taipei.
  // x/y are SVG coords; r scaled by asset value; peerR a translucent slate peer.
  const meta = {
    'asset-001': { label: '淡水河岸', city: '淡水', x: 250, y: 120 },
    'asset-002': { label: '林口全聯', city: '林口', x: 170, y: 215 },
    'asset-003': { label: '大安仁愛苑', city: '大安', x: 405, y: 230 }
  };

  const cards = d.assetCards || [];
  const maxVal = Math.max(...cards.map(a => a.value), 1);
  const bubbles = cards.map(a => {
    const m = meta[a.id] || { label: a.shortName, city: '', x: 320, y: 180 };
    const r = 14 + 26 * Math.sqrt(a.value / maxVal); // area-ish scaling
    return { ...m, r, peerR: r + 9, mark: fmtCompact(a.value) };
  });

  const bubbleSvg = bubbles.map(b => `
    <g>
      <circle cx="${b.x}" cy="${b.y}" r="${b.peerR.toFixed(1)}" fill="#33547A" opacity="0.18" stroke="#33547A" stroke-width="0.75" />
      <circle cx="${b.x}" cy="${b.y}" r="${b.r.toFixed(1)}" fill="#8E1B1F" opacity="0.85" />
      <circle cx="${b.x}" cy="${b.y}" r="2" fill="#0B0B0C" />
      <line x1="${b.x}" y1="${b.y}" x2="${b.x + 14}" y2="${b.y - 16}" stroke="#0B0B0C" stroke-width="0.75" />
      <text x="${b.x + 16}" y="${b.y - 16}" font-family="${BPM_FONT}" font-size="11" font-weight="600" fill="#0B0B0C">${escHtml(b.label)} · ${escHtml(b.city)}</text>
      <text x="${b.x + 16}" y="${b.y - 4}" font-family="${BPM_MONO}" font-size="10" fill="#5C5C61">${escHtml(b.mark)}</text>
    </g>`).join('');

  host.innerHTML = `
    <svg viewBox="0 0 640 360" style="width:100%;height:100%;display:block;">
      <defs>
        <pattern id="bpm-grid" width="32" height="20" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V20" fill="none" stroke="#D8D5CE" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="640" height="360" fill="url(#bpm-grid)" opacity="0.6" />

      <!-- Stylised Greater Taipei basin + coastline (pure decoration) -->
      <path
        d="M120 70 Q 200 60, 270 90 Q 320 110, 330 160 Q 340 215, 410 250 Q 470 280, 500 250 L 540 270 Q 520 310, 460 320 L 360 320 Q 270 320, 200 290 Q 130 260, 110 200 Q 95 140, 120 70 Z"
        fill="var(--paper-2)" stroke="var(--ink-5)" stroke-width="0.75" />
      <!-- Tamsui river thread to the coast -->
      <path d="M250 120 Q 200 150, 170 200 Q 150 240, 130 270"
        fill="none" stroke="var(--ink-5)" stroke-width="0.75" opacity="0.7" />

      ${bubbleSvg}

      <line x1="0" y1="358" x2="640" y2="358" stroke="#0B0B0C" stroke-width="1" />
    </svg>`;
}

/* ── Summary band (narrative + top contributor / urgent) ── */
function renderSummary(d) {
  const narr = el('pf-narrative');
  if (narr) narr.textContent = d.summary.narrative;

  // Top contributor = highest-value asset; urgent = highest-value-growth / refi
  const cards = d.assetCards || [];
  const top = cards.slice().sort((a, b) => b.value - a.value)[0];
  if (top) {
    const tc = el('pf-top-contributor');
    if (tc) tc.textContent = top.name;
    const tcm = el('pf-top-contributor-meta');
    if (tcm) tcm.textContent = (top.location.includes('林口') ? '林口' : top.location.includes('淡水') ? '淡水' : '大安') + ' · ' + fmtCompact(top.value);
  }

  const urgent = cards.find(a => a.urgency === 'high') || cards[0];
  if (urgent) {
    const u = el('pf-top-urgent');
    if (u) u.textContent = urgent.name;
    const um = el('pf-top-urgent-meta');
    if (um) um.textContent = urgent.keyHighlight;
  }
}

/* ── Holdings table (clickable rows → drawer) ───────────── */
function renderHoldings(d) {
  const host = el('pf-holdings-table');
  if (!host) return;
  const cards = d.assetCards || [];

  const sectorMap = {
    '住宅／商業混合': '住商混合',
    '商業零售（NNN長約）': '商業零售',
    '高級住宅（自用）': '高級住宅'
  };
  const geoOf = loc => loc.includes('林口') ? '林口' : loc.includes('淡水') ? '淡水' : loc.includes('大安') ? '大安' : '雙北';

  const signCompact = v => {
    if (v == null) return '<span class="empty-dash">—</span>';
    const display = v < 0 ? `(${fmtCompact(Math.abs(v))})` : fmtCompact(v);
    return `<span class="${v < 0 ? 'neg' : ''}">${display}</span>`;
  };

  // totals
  const sumValue = cards.reduce((s, c) => s + c.value, 0);
  const sumNOI   = cards.reduce((s, c) => s + (c.noi || 0), 0);
  const blendedLTV = d.totals ? d.totals.blendedLTV : 0;

  const rows = cards.map(c => `
    <tr class="clickable-row" data-asset-id="${escHtml(c.id)}">
      <td>
        <div class="cell-asset">${escHtml(c.name)}</div>
        <div class="cell-meta">${escHtml(c.id.toUpperCase())} · ${escHtml(c.location)}</div>
      </td>
      <td>${escHtml(sectorMap[c.type] || c.type)}</td>
      <td>${escHtml(geoOf(c.location))}</td>
      <td class="num">${fmtCompact(c.value)}</td>
      <td class="num">${fmtPct(c.ltv)}</td>
      <td class="num">${signCompact(c.noi)}</td>
      <td class="num">${c.capRate != null ? fmtPct(c.capRate) : '<span class="empty-dash">N/A</span>'}</td>
      <td>
        <span class="chip"><span class="dot" style="background:${statusDotColor(c.statusColor)}"></span>${escHtml(c.status)}</span>
      </td>
    </tr>`).join('');

  host.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>${t('pf.thAsset')}</th><th>${t('pf.thCategory')}</th><th>${t('pf.thGeography')}</th>
          <th class="num">${t('pf.thValuation')}</th><th class="num">${t('pf.lblLtv')}</th>
          <th class="num">${t('pf.thNoi')}</th><th class="num">${t('pf.thCapRate')}</th><th>${t('pf.thStatus')}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="row-total">
          <td>${t('pf.totalCount').replace('{n}', cards.length)}</td>
          <td></td><td></td>
          <td class="num">${fmtCompact(sumValue)}</td>
          <td class="num">${fmtPct(blendedLTV)}</td>
          <td class="num">${signCompact(sumNOI)}</td>
          <td></td><td></td>
        </tr>
      </tbody>
    </table>`;

  // wire row clicks → drawer
  host.querySelectorAll('.clickable-row').forEach(tr => {
    tr.addEventListener('click', () => {
      const id = tr.getAttribute('data-asset-id');
      const asset = cards.find(a => a.id === id);
      if (asset) openDrawer(asset);
    });
  });

  wireDrawerControls();
}

/* ── Drawer ─────────────────────────────────────────────── */
function openDrawer(asset) {
  const drawer = el('pf-drawer');
  const backdrop = el('pf-drawer-backdrop');
  if (!drawer || !backdrop) return;

  const eb = el('pf-drawer-eyebrow');
  if (eb) eb.textContent = t('pf.drawerEyebrow') + ' · ' + asset.id.toUpperCase();
  const ti = el('pf-drawer-title');
  if (ti) ti.textContent = asset.name;
  const me = el('pf-drawer-meta');
  if (me) me.textContent = asset.type + ' · ' + asset.location + ' · ' + asset.ownershipSummary;

  // 3-up KPIs
  const kpis = el('pf-drawer-kpis');
  if (kpis) {
    const noiCls = (asset.noi || 0) < 0 ? 'neg' : 'pos';
    const noiLine = (asset.noi || 0) < 0 ? t('pf.holdCost') : t('pf.posNoi');
    kpis.innerHTML = `
      <div class="drawer-kpi">
        <div class="eyebrow">${t('pf.thValuation')}</div>
        <div class="v">${fmtCompact(asset.value)}</div>
        <div class="d" style="color:var(--ink-3);">${t('pf.drawerMarketVal')}</div>
      </div>
      <div class="drawer-kpi">
        <div class="eyebrow">${t('pf.lblLtv')}</div>
        <div class="v">${fmtPct(asset.ltv)}</div>
        <div class="d" style="color:${asset.ltv > 40 ? 'var(--warn)' : 'var(--pos)'};">${asset.ltv > 40 ? t('pf.levHigh') : asset.ltv > 0 ? t('pf.levConservative') : t('pf.levNoLoan')}</div>
      </div>
      <div class="drawer-kpi">
        <div class="eyebrow">${t('pf.thCapRate')}</div>
        <div class="v">${asset.capRate != null ? fmtPct(asset.capRate) : '—'}</div>
        <div class="d ${noiCls}" style="color:${noiCls === 'neg' ? 'var(--bpm-red)' : 'var(--pos)'};">${noiLine}</div>
      </div>`;
  }

  // detail section: key highlight + ownership + figures
  const det = el('pf-drawer-detail');
  if (det) {
    const noiCls = (asset.noi || 0) < 0 ? 'neg' : 'pos';
    det.innerHTML = `
      <div class="eyebrow" style="margin-bottom:10px;">${t('pf.keyHighlight')}</div>
      <div class="summary-keymessage" style="margin-bottom:16px;">${escHtml(asset.keyHighlight)}</div>
      <table class="info-table">
        <tr><td class="info-label">${t('pf.ownStructure')}</td><td class="info-value">${escHtml(asset.ownershipSummary)}</td></tr>
        <tr><td class="info-label">${t('pf.familyEquity')}</td><td class="info-value">${fmtCompact(asset.chenEquity)}</td></tr>
        <tr><td class="info-label">${t('pf.loanBalance')}</td><td class="info-value">${asset.debt > 0 ? fmtCompact(asset.debt) : t('pf.levNoLoan')}</td></tr>
        <tr><td class="info-label">${t('pf.annualNoi')}</td><td class="info-value ${noiCls}">${(asset.noi || 0) < 0 ? '(' + fmtCompact(Math.abs(asset.noi)) + ')' : fmtCompact(asset.noi)}</td></tr>
        <tr><td class="info-label">${t('pf.annualNetCf')}</td><td class="info-value ${(asset.netCF || 0) < 0 ? 'neg' : ''}">${(asset.netCF || 0) < 0 ? '(' + fmtCompact(Math.abs(asset.netCF)) + ')' : fmtCompact(asset.netCF)}</td></tr>
      </table>`;
  }

  const rpt = el('pf-drawer-report');
  if (rpt) rpt.setAttribute('href', 'index.html?id=' + asset.id);

  backdrop.classList.add('open');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  const drawer = el('pf-drawer');
  const backdrop = el('pf-drawer-backdrop');
  if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  if (backdrop) backdrop.classList.remove('open');
}

let drawerWired = false;
function wireDrawerControls() {
  if (drawerWired) return;
  drawerWired = true;
  const backdrop = el('pf-drawer-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  const c1 = el('pf-drawer-close');
  if (c1) c1.addEventListener('click', closeDrawer);
  const c2 = el('pf-drawer-close2');
  if (c2) c2.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

/* ── Composer ───────────────────────────────────────────── */
function renderComposer(d) {
  const sugHost = el('pf-composer-suggestions');
  const input = el('pf-composer-input');
  const send = el('pf-composer-send');
  const form = el('pf-composer-form');

  const suggestions = [
    t('pf.sugg1'),
    t('pf.sugg2'),
    t('pf.sugg3')
  ];

  if (sugHost) {
    sugHost.innerHTML = suggestions.map(s => `<button type="button" class="composer-sugg">${escHtml(s)}</button>`).join('');
    sugHost.querySelectorAll('.composer-sugg').forEach(btn => {
      btn.addEventListener('click', () => {
        if (input) { input.value = btn.textContent; input.dispatchEvent(new Event('input')); input.focus(); }
      });
    });
  }

  if (input && send) {
    input.addEventListener('input', () => { send.disabled = input.value.trim() === ''; });
  }
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (input && input.value.trim()) {
        console.log('ask:', input.value);
        input.value = '';
        if (send) send.disabled = true;
      }
    });
  }
}

/* ── Asset Cards ───────────────────────────────────────── */
function renderAssetCards(d) {
  const host = el('pf-asset-cards');
  if (!host) return;
  const urgencyColor = u => ({ high: 'var(--bpm-red)', medium: 'var(--warn)', low: 'var(--pos)' }[u] || 'var(--rule)');

  host.innerHTML = d.assetCards.map(a => {
    const statusCls = a.statusColor === 'amber' ? 'hold' : a.statusColor === 'green' ? 'active' : 'vacant';
    const noiCls    = a.noi >= 0 ? 'pos' : 'neg';
    const noiFmt    = a.noi < 0 ? `(${fmtCompact(Math.abs(a.noi))})` : fmtCompact(a.noi);
    return `
    <a href="${escHtml(a.href)}" class="pf-asset-card">
      <div class="pf-ac-header">
        <div class="pf-ac-icon">
          <svg viewBox="0 0 24 24"><path d="M1 11l11-9 11 9v11H15v-7H9v7H1V11zm2 0v9h4v-7h8v7h4v-9L12 4 3 11z"/></svg>
        </div>
        <div class="pf-ac-title-block">
          <div class="pf-ac-name">${escHtml(a.name)}</div>
          <div class="pf-ac-type">${escHtml(a.type)}</div>
          <div class="pf-ac-loc">${escHtml(a.location)}</div>
        </div>
        <span class="status-pill ${statusCls}">${escHtml(a.status)}</span>
      </div>
      <div class="pf-ac-metrics">
        <div class="pf-ac-metric">
          <div class="pf-ac-metric-label">${t('pf.acValuation')}</div>
          <div class="pf-ac-metric-value">${fmtCompact(a.value)}</div>
        </div>
        <div class="pf-ac-metric">
          <div class="pf-ac-metric-label">${t('pf.acEquity')}</div>
          <div class="pf-ac-metric-value">${fmtCompact(a.equity)}</div>
        </div>
        <div class="pf-ac-metric">
          <div class="pf-ac-metric-label">${t('pf.lblLtv')}</div>
          <div class="pf-ac-metric-value">${fmtPct(a.ltv)}</div>
        </div>
        <div class="pf-ac-metric">
          <div class="pf-ac-metric-label">${t('pf.acNoi')}</div>
          <div class="pf-ac-metric-value ${noiCls}">${noiFmt}</div>
        </div>
      </div>
      <div class="pf-ac-ownership">${escHtml(a.ownershipSummary)}</div>
      <div class="pf-ac-highlight" style="border-left-color:${urgencyColor(a.urgency)}">
        ${escHtml(a.keyHighlight)}
      </div>
    </a>`;
  }).join('');
}

/* ── Allocation Donut ──────────────────────────────────── */
function renderAllocationChart(d) {
  const chart = initChart('pf-allocation-chart');
  if (!chart) return;
  const a = d.allocation;
  chart.setOption({
    ...ECHARTS_BASE,
    tooltip: {
      ...ECHARTS_BASE.tooltip,
      trigger: 'item',
      formatter: p => `${p.name}<br>${t('pf.chartValuation')}：${fmtCompact(p.value)}<br>${t('pf.chartWeight')}：${p.percent.toFixed(1)}%`
    },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '44%'],
      data: a.labels.map((label, i) => ({ name: label, value: a.values[i], itemStyle: { color: BPM_SERIES[i] } })),
      label: { fontSize: 11, formatter: '{b}\n{d}%', color: BPM.ink3 },
      itemStyle: { borderWidth: 2, borderColor: '#FBF8F2' }
    }]
  });
}

/* ── Income Comparison Bar ─────────────────────────────── */
function renderIncomeChart(d) {
  const chart = initChart('pf-income-chart');
  if (!chart) return;
  const ib = d.incomeBreakdown;
  chart.setOption({
    ...ECHARTS_BASE,
    tooltip: {
      ...ECHARTS_BASE.tooltip,
      trigger: 'axis',
      formatter: p => `${p[0].axisValue}<br>${p.map(s => `${s.marker}${s.seriesName}: ${fmtCompact(s.value)}`).join('<br>')}`
    },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 16, bottom: 44, left: 80, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: ib.labels, axisLabel: { color: BPM.ink3, fontSize: 10, interval: 0, fontFamily: BPM_FONT } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, formatter: v => fmtCompact(v), fontSize: 10, fontFamily: BPM_FONT } }),
    series: [
      {
        name: t('pf.seriesNoi'),
        type: 'bar',
        data: ib.noi.map((v, i) => ({ value: v, itemStyle: { color: BPM_SERIES[i], borderRadius: 0 } })),
        label: { show: true, position: 'top', formatter: p => fmtCompact(p.value), fontSize: 9, color: '#5C5C61' }
      },
      {
        name: t('pf.seriesNetCf'),
        type: 'bar',
        data: ib.netCF.map((v, i) => ({ value: v, itemStyle: { color: BPM_SERIES[i], opacity: 0.5, borderRadius: 0 } })),
        label: { show: true, position: 'top', formatter: p => fmtCompact(p.value), fontSize: 9, color: '#5C5C61' }
      }
    ]
  });
}

/* ── Financial Comparison Table ────────────────────────── */
function renderComparisonTable(d) {
  const cards = d.assetCards;

  const signCompact = v => {
    if (v == null) return '—';
    const display = v < 0 ? `(${fmtCompact(Math.abs(v))})` : fmtCompact(v);
    return `<span class="${v < 0 ? 'neg' : 'pos'}">${display}</span>`;
  };

  const rows = [
    [t('pf.cmpMarketVal'),   c => fmtCompact(c.value)],
    [t('pf.loanBalance'),    c => c.debt > 0 ? fmtCompact(c.debt) : `<span class="text-muted">${t('pf.levNoLoan')}</span>`],
    [t('pf.cmpNetEquity'),   c => fmtCompact(c.equity)],
    [t('pf.cmpChenPct'),     c => fmtPct(c.chenPct)],
    [t('pf.cmpChenEquity'),  c => fmtCompact(c.chenEquity)],
    [t('pf.lblLtv'),         c => fmtPct(c.ltv)],
    [t('pf.annualNoi'),      c => signCompact(c.noi)],
    [t('pf.annualNetCf'),    c => signCompact(c.netCF)],
    [t('pf.thCapRate'),      c => c.capRate != null ? fmtPct(c.capRate) : '<span class="text-muted">N/A</span>'],
    [t('pf.cmpHoldStatus'),  c => escHtml(c.ownershipSummary)],
    [t('pf.cmpKeyItems'),    c => `<span style="font-size:12px;color:var(--ink-2)">${escHtml(c.keyHighlight)}</span>`]
  ];

  el('pf-comparison-table').innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th style="min-width:140px">${t('pf.cmpMetric')}</th>
          ${cards.map(c => `<th class="num">${escHtml(c.shortName)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map(([label, fn]) => `
          <tr>
            <td class="font-bold text-secondary">${label}</td>
            ${cards.map(c => `<td class="num">${fn(c)}</td>`).join('')}
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ── Debt Table ─────────────────────────────────────────── */
function renderDebtTable(d) {
  const urgencyBadge = (u, label) => {
    if (u === 'none') return `<span class="text-muted">${escHtml(label)}</span>`;
    return `<span class="risk-badge ${u}">${escHtml(label)}</span>`;
  };

  el('pf-debt-table').innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>${t('pf.thAsset')}</th><th>${t('pf.thLender')}</th>
          <th class="num">${t('pf.loanBalance')}</th>
          <th>${t('pf.thRate')}</th><th>${t('pf.lblLtv')}</th><th>${t('pf.thDscr')}</th>
          <th>${t('pf.thMaturity')}</th><th>${t('pf.thStatus')}</th>
        </tr>
      </thead>
      <tbody>
        ${d.debtMatrix.map(row => `
          <tr>
            <td class="font-bold">${escHtml(row.asset)}</td>
            <td>${row.lender !== '—' ? escHtml(row.lender) : '<span class="text-muted">—</span>'}</td>
            <td class="num">${row.balance > 0 ? fmtNTD(row.balance) : '<span class="text-muted">—</span>'}</td>
            <td>${escHtml(row.rate)}</td>
            <td>${escHtml(row.ltv)}</td>
            <td>${escHtml(row.dscr)}</td>
            <td class="${row.urgency === 'high' ? 'font-bold' : 'text-muted'}">${escHtml(row.maturity)}</td>
            <td>${urgencyBadge(row.urgency, row.urgencyLabel)}</td>
          </tr>`).join('')}
        <tr class="row-total">
          <td class="font-bold">${t('pf.totalPortfolio')}</td>
          <td></td>
          <td class="num font-bold">${fmtNTD(d.totals.totalDebt)}</td>
          <td></td>
          <td class="font-bold">${fmtPct(d.totals.blendedLTV)} <span class="text-muted text-xs">${t('pf.weighted')}</span></td>
          <td></td><td></td><td></td>
        </tr>
      </tbody>
    </table>`;
}

/* ── LTV Bar Chart ─────────────────────────────────────── */
function renderLTVChart(d) {
  const chart = initChart('pf-ltv-chart');
  if (!chart) return;
  const cards  = d.assetCards;

  chart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: p => `${p[0].name}<br>${t('pf.lblLtv')}：${p[0].value.toFixed(1)}%` },
    grid: { top: 20, bottom: 30, left: 96, right: 64 },
    xAxis: bpmAxis({
      type: 'value', min: 0, max: 65,
      axisLabel: { color: BPM.ink3, formatter: v => v + '%', fontSize: 10, fontFamily: BPM_FONT }
    }),
    yAxis: bpmAxis({ type: 'category', data: cards.map(c => c.shortName), axisLabel: { color: BPM.ink3, fontSize: 11, fontFamily: BPM_FONT } }),
    series: [{
      type: 'bar',
      barMaxWidth: 28,
      data: cards.map((c, i) => ({ value: c.ltv, itemStyle: { color: BPM_SERIES[i], borderRadius: 0 } })),
      label: {
        show: true, position: 'right',
        formatter: p => p.value.toFixed(1) + '%',
        fontSize: 11, fontWeight: 700, color: '#5C5C61'
      }
    }]
  });
}

/* ── Portfolio Value History (Stacked Area) ─────────────── */
function renderHistoryChart(d) {
  const chart = initChart('pf-history-chart');
  if (!chart) return;
  const h = d.portfolioHistory;

  const assetMeta = {
    'asset-001': { name: '淡水河岸' },
    'asset-002': { name: '林口全聯' },
    'asset-003': { name: '大安仁愛苑' }
  };

  const series = Object.entries(h.assets).map(([id, values], i) => {
    const m = assetMeta[id] || { name: id };
    const color = BPM_SERIES[i] || BPM_SERIES[BPM_SERIES.length - 1];
    // red-led area gradient for the primary asset; flat tint for others
    return {
      name: m.name,
      type: 'line',
      stack: 'total',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: values,
      itemStyle: { color },
      lineStyle: { width: 2, color },
      areaStyle: color === '#8E1B1F'
        ? { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(142,27,31,0.45)' },
            { offset: 1, color: 'rgba(142,27,31,0.08)' }
          ]) }
        : { opacity: 0.45, color }
    };
  });

  chart.setOption({
    ...ECHARTS_BASE,
    tooltip: {
      ...ECHARTS_BASE.tooltip,
      trigger: 'axis',
      formatter: p => {
        const total = p.reduce((s, item) => s + (item.value || 0), 0);
        return `${p[0].axisValue}<br>` +
          p.map(item => `${item.marker}${item.seriesName}: ${fmtCompact(item.value)}`).join('<br>') +
          `<br><b>${t('pf.chartTotal')}：${fmtCompact(total)}</b>`;
      }
    },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 20, bottom: 50, left: 90, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: h.labels, axisLabel: { color: BPM.ink3, fontSize: 11, fontFamily: BPM_FONT } }),
    yAxis: bpmAxis({
      type: 'value',
      axisLabel: { color: BPM.ink3, formatter: v => '$' + (v / 1e6).toFixed(0) + 'M', fontSize: 10, fontFamily: BPM_FONT }
    }),
    series
  });
}

/* ── Actions Table ─────────────────────────────────────── */
function renderActionsTable(d) {
  const priorityCls   = p => ({ 'High': 'high', 'Medium': 'medium', 'Low': 'low' }[p] || 'low');
  const priorityLabel = p => ({ 'High': t('pf.prioHigh'), 'Medium': t('pf.prioMedium'), 'Low': t('pf.prioLow') }[p] || p);
  const assetColor    = id => ({ 'asset-001': '#8E1B1F', 'asset-002': '#33547A', 'asset-003': '#1F5C4A' }[id] || '#8A8A8F');

  el('pf-actions-table').innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>${t('pf.thAsset')}</th><th>${t('pf.thActionItem')}</th>
          <th>${t('pf.thPriority')}</th><th>${t('pf.thDeadline')}</th><th>${t('pf.thStatus')}</th>
        </tr>
      </thead>
      <tbody>
        ${d.actions.map(a => `
          <tr>
            <td>
              <span class="pf-asset-tag" style="background:${assetColor(a.assetId)}">
                ${escHtml(a.assetName)}
              </span>
            </td>
            <td class="font-bold">${escHtml(a.title)}</td>
            <td><span class="priority-badge ${priorityCls(a.priority)}">${priorityLabel(a.priority)}</span></td>
            <td class="text-muted">${escHtml(a.deadline)}</td>
            <td>${statusBadgeHtml(a.status)}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ── Risk Summary ──────────────────────────────────────── */
function renderRiskSummary(d) {
  const rs = d.riskSummary;
  const h = el('pf-risk-high');   if (h) h.textContent = rs.highCount;
  const m = el('pf-risk-medium'); if (m) m.textContent = rs.mediumCount;
  const l = el('pf-risk-low');    if (l) l.textContent = rs.lowCount;
  const c = el('pf-risk-concern'); if (c) c.textContent = rs.topConcern;
}

/* ── Boot ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', loadData);
