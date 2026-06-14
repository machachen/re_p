/**
 * 資產智能 — 主應用程式
 *
 * 資料流：latest.json → manifest.json → 各區塊 JSON 檔案
 * 圖表：Apache ECharts（從 CDN 載入，見 index.html）
 *
 * 連接 WordPress/ACF：將 BASE_URL 替換為您的 ACF REST 端點，例如：
 *   const BASE_URL = 'https://yoursite.com/wp-json/acf/v3/asset-data/';
 * 並將 REST 回應對應至此處使用的相同 JSON 格式。
 */

'use strict';

/* ── Configuration ───────────────────────────────────────── */
const BASE_URL = './data/assets/';
const ASSET_ID = new URLSearchParams(window.location.search).get('id') || 'asset-001';

/* ── Global state ────────────────────────────────────────── */
const state = {
  latest: null,
  manifest: null,
  data: {}          // section id → parsed JSON
};

/* ── Chart registry — all instances resize together ─────── */
const chartInstances = [];
function initChart(domId) {
  const dom = el(domId);
  if (!dom) return null;
  const chart = echarts.init(dom);
  chartInstances.push(chart);
  return chart;
}
window.addEventListener('resize', () => chartInstances.forEach(c => c.resize()));

/* ── ECharts base theme (BPM palette) ────────────────────── */
/* BPM data-viz palette — order: you/portfolio, peer/market, benchmark, forecast, mute */
const BPM_SERIES = ['#8E1B1F', '#33547A', '#1F5C4A', '#B5832A', '#8A8A8F'];
const CHART_COLORS = { blue: '#8E1B1F', green: '#1F5C4A', red: '#8E1B1F', amber: '#B5832A', gray: '#8A8A8F' };
const BPM = { ink:'#0B0B0C', ink3:'#5C5C61', rule:'#D8D5CE', grid:'#E5E5E7', paper:'#F5F1EA', bone:'#FBF8F2' };
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

/* ── Utility helpers ─────────────────────────────────────── */
function fmt(n, decimals = 0) {
  if (n == null) return '—';
  return new Intl.NumberFormat('zh-TW', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}
function fmtNTD(n) {
  if (n == null) return '—';
  return 'NT$' + fmt(Math.abs(n));
}
function fmtNTDSign(n) {
  if (n == null) return '—';
  const s = fmtNTD(n);
  return n < 0 ? `(${s})` : s;
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
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function el(id) { return document.getElementById(id); }

function statusBadgeHtml(s) {
  const clsMap = {
    'Complete': 'complete', 'In Progress': 'in-progress', 'Not Started': 'not-started',
    'Proposed': 'proposed', 'Open': 'open', 'Monitoring': 'monitoring',
    'Active': 'active', 'Renewal Due': 'renewal-due', 'Current': 'active',
    'Under Consideration': 'proposed'
  };
  const labelMap = {
    'Complete': '已完成', 'In Progress': '進行中', 'Not Started': '未開始',
    'Proposed': '提案中', 'Open': '待處理', 'Monitoring': '監控中',
    'Active': '有效', 'Renewal Due': '待續約', 'Current': '有效',
    'Under Consideration': '考量中'
  };
  const cls = clsMap[s] || 'not-started';
  const label = labelMap[s] || escHtml(s);
  return `<span class="status-badge ${cls}">${label}</span>`;
}

function riskLevelHtml(level) {
  const labels = { 'High': '高', 'Medium': '中', 'Low': '低' };
  const label = labels[level] || level;
  return `<span class="risk-badge ${level.toLowerCase()}">${label}</span>`;
}

/* ── Data loading ────────────────────────────────────────── */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.json();
}

async function loadData() {
  showLoading(true);
  try {
    if (window.requireAuth) { const s = await window.requireAuth(); if (!s) return; }
    const res = await bpmLoadAsset(ASSET_ID);
    state.latest = res.latest;
    state.manifest = res.manifest;
    state.data = res.data;
    renderAll();
  } catch (err) {
    console.error(err);
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

function showLoading(v) { el('loading-overlay').style.display = v ? 'flex' : 'none'; }
function showError(msg)  { const b = el('error-banner'); b.textContent = '⚠ 資料載入失敗：' + msg; b.style.display = 'block'; }

/* ── Render orchestrator ─────────────────────────────────── */
function renderAll() {
  renderNav();
  renderAssetHeader();
  renderOverview();
  renderOwnership();
  renderFinancial();
  renderRisk();
  renderOperations();
  renderDocuments();
  renderMarket();
}

/* ── Navigation ──────────────────────────────────────────── */
function renderNav() {
  const m = state.manifest;
  const updated = new Date(m.lastUpdated).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
  const updatedEl = el('nav-updated-date');
  if (updatedEl) updatedEl.textContent = updated;
  const periodSelect = el('nav-period-select');
  if (periodSelect) periodSelect.value = m.period;
  const periodDisplay = el('nav-period-display');
  if (periodDisplay) periodDisplay.textContent = m.period;
  // Mark the matching asset row active in the sidebar
  document.querySelectorAll('.side-row[data-asset]').forEach(row => {
    row.classList.toggle('active', row.getAttribute('data-asset') === ASSET_ID);
  });
}

/* ── Asset Header ────────────────────────────────────────── */
function renderAssetHeader() {
  const l = state.latest;
  const ov  = state.data['overview'];
  const fin = state.data['financial'];

  el('asset-name').textContent = l.assetName;
  el('asset-type-badge').textContent = l.assetType;
  el('asset-location-meta').textContent = l.location;
  el('asset-ownership-meta').textContent = state.latest?.ownershipMeta ?? '';
  el('asset-period-badge').textContent = state.manifest.periodLabel;

  const bcName = el('bc-asset-name');
  if (bcName) bcName.textContent = l.assetName;

  const pill = el('asset-status-pill');
  const cls = l.statusColor === 'amber' ? 'hold' : l.statusColor === 'green' ? 'active' : 'vacant';
  pill.className = `status-pill ${cls}`;
  pill.textContent = l.status;

  if (fin?.valuation) {
    el('hdr-value').textContent = fmtCompact(fin.valuation.currentEstimatedValue);
  }
  if (ov?.basicInfo) {
    el('hdr-gba').textContent = fmt(Math.round(ov.basicInfo.totalGSF * 0.0929)) + ' m²';
  }
}

/* ── Tab switching ───────────────────────────────────────── */
function initTabs() {
  const tabNames = {
    'panel-overview':    '總覽',
    'panel-ownership':   '持有人與資本',
    'panel-financial':   '財務與估值',
    'panel-risk':        '風險分析',
    'panel-operations':  '營運管理',
    'panel-documents':   '文件',
    'panel-market':      '市場'
  };
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      el(btn.dataset.panel).classList.add('active');
      const bcTab = el('bc-current-tab');
      if (bcTab) bcTab.textContent = tabNames[btn.dataset.panel] || btn.textContent.trim();
      // Charts in previously-hidden panels were 0×0 at init; resize now that panel is visible
      requestAnimationFrame(() => chartInstances.forEach(c => c.resize()));
    });
  });
}

/* ============================================================
   OVERVIEW TAB
   ============================================================ */
function renderOverview() {
  const d = state.data['overview'];

  /* Summary */
  el('ov-summary-narrative').textContent = d.summary.narrative;
  el('ov-summary-keymessage').textContent = d.summary.keyMessage;

  /* Basic Info */
  const bi = d.basicInfo;
  el('ov-basic-info').innerHTML = `
    <table class="info-table">
      <tr><td class="info-label">資產名稱</td><td class="info-value">${escHtml(bi.assetName)}</td></tr>
      <tr><td class="info-label">資產類型</td><td class="info-value">${escHtml(bi.assetType)}</td></tr>
      <tr><td class="info-label">地址</td><td class="info-value">${escHtml(bi.location)}</td></tr>
      <tr><td class="info-label">次市場</td><td class="info-value">${escHtml(bi.submarket)}</td></tr>
      <tr><td class="info-label">建設年份 / 取得年份</td><td class="info-value">${bi.yearBuilt} / ${bi.yearAcquired}</td></tr>
      <tr><td class="info-label">總戶數</td><td class="info-value">${bi.totalUnits}（${bi.residentialUnits} 住宅 + ${bi.commercialUnits} 商業）</td></tr>
      <tr><td class="info-label">總建築面積</td><td class="info-value">${fmt(Math.round(bi.totalGSF * 0.0929))} m²</td></tr>
      <tr><td class="info-label">目前狀態</td><td class="info-value">${escHtml(bi.currentStatus)}</td></tr>
      <tr><td class="info-label">報告期間</td><td class="info-value">${escHtml(bi.reportingPeriod)}</td></tr>
      <tr><td class="info-label">持有結構</td><td class="info-value">${escHtml(bi.ownershipSummary)}</td></tr>
    </table>`;

  /* Key Figures Strip */
  el('ov-key-figures').innerHTML = d.keyFigures.map(kf => `
    <div class="kf-item">
      <div class="kf-label">${escHtml(kf.label)}</div>
      <div class="kf-value">${escHtml(kf.value)}</div>
      <div class="kf-sub">
        <span>${escHtml(kf.subLabel)}</span>
        ${kf.trend ? `<span class="kf-trend ${kf.trend}">${escHtml(kf.trendValue)}</span>` : ''}
      </div>
    </div>`).join('');

  /* KPI Cards */
  el('ov-kpi-cards').innerHTML = d.kpiCards.map(k => `
    <div class="kpi-card">
      <div class="kpi-label">${escHtml(k.title)}</div>
      <div class="kpi-value">${escHtml(k.value)}</div>
      <div class="kpi-period">${escHtml(k.period)}</div>
      <div class="kpi-trend ${k.trendDir}">${escHtml(k.trend)}</div>
      <div class="kpi-chart" id="kpi-chart-${k.id}"></div>
    </div>`).join('');

  /* Defer init to rAF so grid layout is computed and clientWidth is available */
  requestAnimationFrame(() => d.kpiCards.forEach(k => renderKpiChart(k)));

  /* Actions */
  el('ov-actions').innerHTML = d.actions.map(a => `
    <div class="card action-card ${a.priority.toLowerCase()} mb-12">
      <div class="action-header">
        <div class="action-title">${escHtml(a.title)}</div>
        <span class="priority-badge ${a.priority.toLowerCase()}">${priorityLabel(a.priority)}</span>
        ${statusBadgeHtml(a.status)}
      </div>
      <div class="action-body">${escHtml(a.recommendation)}</div>
      <div class="action-meta">
        <div class="action-meta-item"><strong>待決事項：</strong> ${escHtml(a.decisionNeeded)}</div>
        <div class="action-meta-item"><strong>負責人：</strong> ${escHtml(a.owner)}</div>
        <div class="action-meta-item"><strong>截止日期：</strong> ${escHtml(a.deadline)}</div>
      </div>
    </div>`).join('');

  /* Linked Documents */
  el('ov-linked-docs').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>文件</th><th>類別</th><th>日期</th><th>類型</th>
      </tr></thead>
      <tbody>${d.linkedDocuments.map(doc => `
        <tr>
          <td><a href="#" class="doc-link">${escHtml(doc.name)}</a></td>
          <td><span class="doc-category-badge">${escHtml(doc.category)}</span></td>
          <td class="text-muted">${escHtml(doc.date)}</td>
          <td><span class="doc-type-badge">${escHtml(doc.type)}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Top Risks */
  el('ov-top-risks').innerHTML = d.topRisks.map(r => `
    <div class="row-between mb-8" style="border-bottom:1px solid var(--border);padding-bottom:8px;">
      <div>
        ${riskLevelHtml(r.level)}
        <span style="font-size:13px;font-weight:600;margin-left:8px;">${escHtml(r.title)}</span>
      </div>
    </div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">${escHtml(r.impact)}</div>
  `).join('');

  /* Market Snapshot */
  const ms = d.marketSnapshot;
  el('ov-market-snapshot').innerHTML = `
    <table class="info-table">
      <tr><td class="info-label">次市場</td><td class="info-value">${escHtml(ms.submarket)}</td></tr>
      <tr><td class="info-label">中位數租金/m²</td><td class="info-value">${escHtml(ms.medianRentPM2)}</td></tr>
      <tr><td class="info-label">空置率</td><td class="info-value">${escHtml(ms.vacancyRate)}</td></tr>
      <tr><td class="info-label">年租金成長</td><td class="info-value">${escHtml(ms.yoyRentGrowth)}</td></tr>
      <tr><td class="info-label">資產 vs. 市場</td><td class="info-value">${escHtml(ms.assetVsMarket)}</td></tr>
      <tr><td class="info-label">資本化率基準</td><td class="info-value">${escHtml(ms.capRateBenchmark)}</td></tr>
    </table>`;
}

function priorityLabel(p) {
  const map = { 'High': '高優先', 'Medium': '中優先', 'Low': '低優先' };
  return map[p] || p;
}

function renderKpiChart(kpi) {
  const chart = initChart(`kpi-chart-${kpi.id}`);
  if (!chart) return;
  const cd = kpi.chartData;
  const isLine = kpi.chartType === 'line';
  chart.setOption({
    ...ECHARTS_BASE,
    grid: { top: 4, bottom: 20, left: 0, right: 0, containLabel: false },
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', confine: true },
    xAxis: bpmAxis({ type: 'category', data: cd.labels, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 9, color: BPM.ink3, fontFamily: BPM_FONT }, splitLine: { show: false } }),
    yAxis: { type: 'value', show: false },
    series: [{
      type: isLine ? 'line' : 'bar',
      data: cd.values,
      smooth: true,
      symbol: 'none',
      itemStyle: { color: CHART_COLORS.red, borderRadius: 0 },
      lineStyle: { width: 2 },
      areaStyle: isLine ? { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(142,27,31,0.2)' }, { offset: 1, color: 'rgba(142,27,31,0)' }] } } : null
    }]
  });
}

/* ============================================================
   OWNERSHIP & CAPITAL STRUCTURE TAB
   ============================================================ */
function renderOwnership() {
  const d = state.data['ownership-capital'];

  /* Entity info */
  el('ow-entity-info').innerHTML = `
    <table class="info-table">
      <tr><td class="info-label">實體名稱</td><td class="info-value">${escHtml(d.entity.name)}</td></tr>
      <tr><td class="info-label">實體類型</td><td class="info-value">${escHtml(d.entity.type)}</td></tr>
      <tr><td class="info-label">登記地</td><td class="info-value">${escHtml(d.entity.registered)}</td></tr>
      <tr><td class="info-label">稅務性質</td><td class="info-value">${escHtml(d.entity.taxElection)}</td></tr>
      <tr><td class="info-label">成立日期</td><td class="info-value">${escHtml(d.entity.formed)}</td></tr>
    </table>`;

  /* Ownership table */
  el('ow-owners-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>持有人</th><th>類型</th><th>角色</th>
        <th class="num">持股比例</th>
        <th class="num">出資金額</th>
        <th class="num">目前權益價值</th>
        <th>起始日</th>
      </tr></thead>
      <tbody>${d.owners.map(o => `
        <tr>
          <td class="font-bold">${escHtml(o.name)}</td>
          <td class="text-secondary">${escHtml(o.type)}</td>
          <td>${escHtml(o.role)}</td>
          <td class="num font-bold">${fmtPct(o.ownershipPct)}</td>
          <td class="num">${fmtNTD(o.equityContributed)}</td>
          <td class="num font-bold">${fmtNTD(o.currentEquityValue)}</td>
          <td class="text-muted">${escHtml(o.since)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Ownership donut chart */
  const ownershipChart = initChart('ow-donut-chart');
  ownershipChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'item', formatter: '{b}: {d}%' },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['40%', '68%'], center: ['50%', '45%'],
      data: d.owners.map((o, i) => ({ name: o.name, value: o.ownershipPct, itemStyle: { color: BPM_SERIES[i % BPM_SERIES.length] } })),
      label: { fontSize: 11, color: BPM.ink3, formatter: '{b}\n{d}%' },
      itemStyle: { borderWidth: 2, borderColor: '#FBF8F2' }
    }]
  });

  /* Equity contributions */
  el('ow-contributions-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>日期</th><th>出資人</th><th>類型</th>
        <th class="num">金額</th><th>備註</th>
      </tr></thead>
      <tbody>${d.capitalContributions.map(c => `
        <tr>
          <td class="text-muted">${escHtml(c.date)}</td>
          <td>${escHtml(c.contributor)}</td>
          <td><span class="doc-category-badge">${escHtml(c.type)}</span></td>
          <td class="num">${fmtNTD(c.amount)}</td>
          <td class="text-secondary">${escHtml(c.note)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Capital Stack */
  const cs = d.capitalStack;
  const debtPct = cs.seniorDebtPct;
  const eqPct   = cs.equityPct;
  el('ow-capital-stack').innerHTML = `
    <div class="capital-stack-bar">
      <div class="cs-segment cs-debt"  style="width:${debtPct}%">負債 ${debtPct.toFixed(1)}%</div>
      <div class="cs-segment cs-equity"style="width:${eqPct}%">權益 ${eqPct.toFixed(1)}%</div>
    </div>
    <div class="cs-legend mb-12">
      <div class="cs-legend-item"><div class="cs-legend-dot" style="background:var(--red)"></div>優先貸款 — ${fmtNTD(cs.seniorDebt)}</div>
      <div class="cs-legend-item"><div class="cs-legend-dot" style="background:var(--info)"></div>淨權益 — ${fmtNTD(cs.netEquity)}</div>
    </div>`;

  /* Capital stack waterfall chart */
  const stackChart = initChart('ow-stack-chart');
  stackChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', confine: true, formatter: (p) => p.map(s => `${s.seriesName}: ${fmtCompact(s.value)}`).join('<br>') },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 10, bottom: 40, left: 80, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: ['優先貸款', '出資金額', '累計保留盈餘', '淨權益'], splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => '$' + (v/1e6).toFixed(0) + 'M' } }),
    series: [{
      name: '金額', type: 'bar', barWidth: '50%',
      data: [cs.seniorDebt, cs.equityContributed, cs.accumulatedRetainedEarnings, cs.netEquity],
      itemStyle: { color: (params) => [BPM_SERIES[0], BPM_SERIES[1], BPM_SERIES[2], BPM_SERIES[3]][params.dataIndex], borderRadius: 0 },
      label: { show: true, position: 'top', color: BPM.ink3, formatter: p => '$' + (p.value/1e6).toFixed(0) + 'M', fontSize: 10 }
    }]
  });

  /* Debt table */
  el('ow-debt-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>貸款機構</th><th>類型</th><th>貸款餘額</th>
        <th>利率</th><th>到期日</th><th>DSCR</th><th>LTV</th><th>狀態</th>
      </tr></thead>
      <tbody>${d.debtSummary.map(loan => `
        <tr>
          <td class="font-bold">${escHtml(loan.lender)}</td>
          <td class="text-secondary">${escHtml(loan.type)}</td>
          <td class="num">${fmtNTD(loan.currentBalance)}</td>
          <td>${escHtml(loan.interestRate)} <span class="text-muted">${escHtml(loan.rateType)}</span></td>
          <td>${escHtml(loan.maturityDate)}</td>
          <td class="num font-bold">${escHtml(loan.dscr)}</td>
          <td class="num">${escHtml(loan.ltv)}</td>
          <td>${statusBadgeHtml(loan.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Net equity */
  el('ow-net-equity').innerHTML = `
    <div class="grid-4">
      <div class="card val-card">
        <div class="val-label">資產價值</div>
        <div class="val-value">${fmtNTD(cs.assetValue)}</div>
        <div class="val-sub">估算，2026年5月</div>
      </div>
      <div class="card val-card">
        <div class="val-label">優先貸款</div>
        <div class="val-value" style="color:var(--red)">${fmtNTD(cs.seniorDebt)}</div>
        <div class="val-sub">${fmtPct(cs.seniorDebtPct)} 貸款成數</div>
      </div>
      <div class="card val-card">
        <div class="val-label">淨權益</div>
        <div class="val-value" style="color:var(--green)">${fmtNTD(cs.netEquity)}</div>
        <div class="val-sub">${fmtPct(cs.equityPct)} 占資產價值</div>
      </div>
      <div class="card val-card">
        <div class="val-label">出資金額</div>
        <div class="val-value">${fmtNTD(cs.equityContributed)}</div>
        <div class="val-sub">總投入資本</div>
      </div>
    </div>`;

  /* Guarantee */
  el('ow-guarantee').innerHTML = d.guaranteesObligations.map(g => `
    <div class="guarantee-card mb-12">
      <div class="guarantee-title">有效保證 / 義務</div>
      <table class="info-table">
        <tr><td class="info-label">類型</td><td class="info-value">${escHtml(g.type)}</td></tr>
        <tr><td class="info-label">保證人</td><td class="info-value">${escHtml(g.obligor)}</td></tr>
        <tr><td class="info-label">受益人</td><td class="info-value">${escHtml(g.beneficiary)}</td></tr>
        <tr><td class="info-label">金額</td><td class="info-value">${fmtNTD(g.amount)}</td></tr>
        <tr><td class="info-label">到期日</td><td class="info-value">${escHtml(g.expiryDate)}</td></tr>
        <tr><td class="info-label">說明</td><td class="info-value">${escHtml(g.description)}</td></tr>
      </table>
    </div>`).join('');
}

/* ============================================================
   FINANCIAL STATEMENT & VALUATION TAB
   ============================================================ */
function renderFinancial() {
  const d = state.data['financial'];

  /* Income Statement */
  const typeMap = {
    income:    '',
    deduction: 'neg',
    expense:   'neg',
    subtotal:  'row-subtotal',
    noi:       'row-noi',
    total:     'row-total'
  };
  el('fin-income-statement').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>項目</th>
        <th class="num">實際（TTM）</th>
        <th class="num">預算</th>
        <th class="num">去年同期</th>
        <th class="num">差異</th>
      </tr></thead>
      <tbody>${d.incomeStatement.rows.map(row => {
        const rowClass = typeMap[row.type] || '';
        const indentClass = row.indent > 0 ? 'indent' : '';
        const actual = row.actual;
        const budget = row.budget;
        const variance = actual - budget;
        const isNeg = actual < 0;
        const varClass = variance >= 0 ? 'pos' : 'neg';
        return `<tr class="${rowClass}">
          <td class="${indentClass}">${escHtml(row.label)}</td>
          <td class="num ${isNeg ? 'neg' : ''}">${fmtNTDSign(actual)}</td>
          <td class="num text-muted">${fmtNTDSign(budget)}</td>
          <td class="num text-muted">${fmtNTDSign(row.priorYear)}</td>
          <td class="num ${varClass}">${variance >= 0 ? '+' : ''}${fmtNTDSign(variance)}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>`;

  /* Valuation cards */
  const v = d.valuation;
  el('fin-valuation-cards').innerHTML = `
    <div class="grid-4 mb-16">
      <div class="card val-card">
        <div class="val-label">取得價格</div>
        <div class="val-value">${fmtNTD(v.purchasePrice)}</div>
        <div class="val-sub">${escHtml(v.purchaseDate)}</div>
      </div>
      <div class="card val-card">
        <div class="val-label">最近鑑價</div>
        <div class="val-value">${fmtNTD(v.lastAppraisalValue)}</div>
        <div class="val-sub">${escHtml(v.lastAppraisalDate)}</div>
      </div>
      <div class="card val-card">
        <div class="val-label">目前估計價值</div>
        <div class="val-value">${fmtNTD(v.currentEstimatedValue)}</div>
        <div class="val-sub">${escHtml(v.impliedCapRate)} 資本化率</div>
      </div>
      <div class="card val-card">
        <div class="val-label">增值幅度</div>
        <div class="val-value val-delta pos">+${fmtNTD(v.valueChange)}</div>
        <div class="val-sub">+${fmtPct(v.valueChangePct)} 自取得以來</div>
      </div>
    </div>
    <div class="grid-2 mb-16">
      <div class="card val-card">
        <div class="val-label">每m²均價</div>
        <div class="val-value">NT$${fmt(v.valuePM2)}</div>
        <div class="val-sub">綜合 NT$/m²</div>
      </div>
      <div class="card val-card">
        <div class="val-label">業主淨權益</div>
        <div class="val-value" style="color:var(--green)">${fmtNTD(v.netEquity)}</div>
        <div class="val-sub">扣除優先貸款後</div>
      </div>
    </div>`;

  /* Valuation history chart */
  const vhChart = initChart('fin-valuation-chart');
  vhChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: p => `${p[0].axisValue}<br>估值：${fmtCompact(p[0].value)}` },
    grid: { top: 10, bottom: 30, left: 90, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: v.history.map(h => h.date.substr(0,7)), splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: val => '$' + (val/1e6).toFixed(0)+'M' } }),
    series: [{
      type: 'line', data: v.history.map(h => h.value),
      smooth: true, symbol: 'circle', symbolSize: 6,
      itemStyle: { color: CHART_COLORS.red },
      lineStyle: { width: 2.5 },
      areaStyle: { color: { type:'linear', x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:'rgba(142,27,31,0.18)'},{offset:1,color:'rgba(142,27,31,0)'}] } },
      markPoint: { data: [{ type: 'max', name: '最高' }], symbolSize: 36, label: { color: '#FBF8F2', fontSize: 10 } }
    }]
  });

  /* Projection chart */
  const proj = d.projections;
  const projChart = initChart('fin-projection-chart');
  projChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: (p) => `${p[0].axisValue}<br>${p.map(s=>`${s.seriesName}: ${fmtCompact(s.value)}`).join('<br>')}` },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 10, bottom: 40, left: 90, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: proj.years, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 }, splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => '$' + (v/1e6).toFixed(0)+'M' } }),
    series: [
      { name: '悲觀', type: 'line', data: proj.value.Downside, smooth: true, symbol: 'none', lineStyle: { color: '#8E1B1F', type: 'dashed', width: 1.5 }, itemStyle: { color: '#8E1B1F' } },
      { name: '基本', type: 'line', data: proj.value.Base,     smooth: true, symbol: 'none', lineStyle: { color: '#0B0B0C', width: 2.5 }, itemStyle: { color: '#0B0B0C' } },
      { name: '樂觀', type: 'line', data: proj.value.Upside,   smooth: true, symbol: 'none', lineStyle: { color: '#1F5C4A', type: 'dashed', width: 1.5 }, itemStyle: { color: '#1F5C4A' } }
    ]
  });

  /* Capex table */
  el('fin-capex-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>計畫名稱</th><th>年份</th>
        <th class="num">預算</th><th class="num">實際 / 已支出</th><th class="num">剩餘</th>
        <th>狀態</th><th>備註</th>
      </tr></thead>
      <tbody>${d.capex.map(c => `
        <tr>
          <td class="font-bold">${escHtml(c.project)}</td>
          <td class="text-muted">${c.year}</td>
          <td class="num">${fmtNTD(c.budgeted)}</td>
          <td class="num">${c.actual > 0 ? fmtNTD(c.actual) : '<span class="text-muted">—</span>'}</td>
          <td class="num">${c.budgeted - c.actual > 0 ? fmtNTD(c.budgeted - c.actual) : '<span class="text-muted">—</span>'}</td>
          <td>${statusBadgeHtml(c.status)}</td>
          <td class="text-secondary">${escHtml(c.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ============================================================
   RISK & SCENARIO ANALYSIS TAB
   ============================================================ */
function renderRisk() {
  const d = state.data['risk'];

  /* Summary cards */
  el('risk-summary-cards').innerHTML = `
    <div class="grid-4">
      <div class="card val-card">
        <div class="val-label">整體風險</div>
        <div class="val-value" style="color:var(--amber)">${escHtml(d.summary.overallRiskLevel)}</div>
        <div class="val-sub">截至 ${escHtml(d.summary.lastReviewed)}</div>
      </div>
      <div class="card val-card">
        <div class="val-label" style="color:var(--red)">高風險</div>
        <div class="val-value" style="color:var(--red)">${d.summary.highRisks}</div>
        <div class="val-sub">待處理高風險項目</div>
      </div>
      <div class="card val-card">
        <div class="val-label" style="color:var(--amber)">中風險</div>
        <div class="val-value" style="color:var(--amber)">${d.summary.mediumRisks}</div>
        <div class="val-sub">待處理中風險項目</div>
      </div>
      <div class="card val-card">
        <div class="val-label" style="color:var(--green)">低風險</div>
        <div class="val-value" style="color:var(--green)">${d.summary.lowRisks}</div>
        <div class="val-sub">待處理低風險項目</div>
      </div>
    </div>`;

  /* Risk register */
  el('risk-register-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>代碼</th><th>類別</th><th>風險事項</th>
        <th class="num">機率</th><th class="num">影響</th><th class="num">評分</th>
        <th>等級</th><th>負責人</th><th>狀態</th>
      </tr></thead>
      <tbody>${d.register.map(r => `
        <tr>
          <td class="text-muted font-mono">${r.id}</td>
          <td><span class="doc-category-badge">${escHtml(r.category)}</span></td>
          <td>
            <div class="font-bold">${escHtml(r.title)}</div>
            <div class="text-secondary text-sm">${escHtml(r.description)}</div>
          </td>
          <td class="num">${r.probability}</td>
          <td class="num">${r.impact}</td>
          <td class="num font-bold">${r.riskScore}</td>
          <td>${riskLevelHtml(r.level)}</td>
          <td class="text-secondary">${escHtml(r.owner)}</td>
          <td>${statusBadgeHtml(r.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Risk matrix chart */
  renderRiskMatrix(d.register);

  /* Scenario cards */
  el('risk-scenarios').innerHTML = d.scenarios.map(s => `
    <div class="scenario-card">
      <div class="scenario-title">${escHtml(s.name)}</div>
      ${s.scenarioCashFlow != null ? `
        <div class="scenario-stat"><span class="s-label">基本現金流</span><span class="s-val">${fmtNTD(s.baseCashFlow)}</span></div>
        <div class="scenario-stat"><span class="s-label">情境現金流</span><span class="s-val" style="color:var(--red)">${fmtNTD(s.scenarioCashFlow)}</span></div>
        <div class="scenario-stat"><span class="s-label">變動</span><span class="s-val neg">${fmtNTDSign(s.cashFlowDelta)}/年</span></div>
        ${s.newDSCR ? `<div class="scenario-stat"><span class="s-label">新 DSCR</span><span class="s-val">${s.newDSCR}</span></div>` : ''}
      ` : `
        <div class="scenario-stat"><span class="s-label">基本資產價值</span><span class="s-val">${fmtNTD(s.baseValue)}</span></div>
        <div class="scenario-stat"><span class="s-label">情境資產價值</span><span class="s-val" style="color:var(--red)">${fmtNTD(s.scenarioValue)}</span></div>
        <div class="scenario-stat"><span class="s-label">情境 LTV</span><span class="s-val">${fmtPct(s.scenarioLTV)}</span></div>
      `}
      <div class="scenario-verdict">${escHtml(s.verdict)}</div>
    </div>`).join('');

  /* Scenario cash flow chart */
  const sc = d.scenarioChart;
  const scenChart = initChart('risk-scenario-chart');
  scenChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: p => `${p[0].axisValue}<br>${p.map(s=>`${s.seriesName}: ${fmtCompact(s.value)}`).join('<br>')}` },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 10, bottom: 40, left: 90, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: sc.labels, splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => fmtCompact(v) } }),
    series: [
      { name: '悲觀', type: 'line', data: sc.cashFlow.Downside, smooth: true, symbol: 'none', lineStyle: { color: '#8E1B1F', type: 'dashed', width: 1.5 }, itemStyle: { color: '#8E1B1F' } },
      { name: '基本', type: 'line', data: sc.cashFlow.Base,     smooth: true, symbol: 'none', lineStyle: { color: '#0B0B0C', width: 2.5 }, itemStyle: { color: '#0B0B0C' } },
      { name: '樂觀', type: 'line', data: sc.cashFlow.Upside,   smooth: true, symbol: 'none', lineStyle: { color: '#1F5C4A', type: 'dashed', width: 1.5 }, itemStyle: { color: '#1F5C4A' } }
    ]
  });

  /* Mitigation plan */
  el('risk-mitigation-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>風險代碼</th><th>緩解行動</th><th>負責人</th><th>截止日期</th><th>狀態</th>
      </tr></thead>
      <tbody>${d.mitigationPlan.map(m => `
        <tr>
          <td class="text-muted font-mono">${m.riskId}</td>
          <td>${escHtml(m.action)}</td>
          <td class="text-secondary">${escHtml(m.owner)}</td>
          <td class="text-muted">${escHtml(m.deadline)}</td>
          <td>${statusBadgeHtml(m.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function renderRiskMatrix(register) {
  /* ECharts scatter plot as probability/impact matrix */
  const chart = initChart('risk-matrix-chart');
  const colorMap = { High: '#8E1B1F', Medium: '#B5832A', Low: '#1F5C4A' };
  const levelLabel = { High: '高', Medium: '中', Low: '低' };
  chart.setOption({
    ...ECHARTS_BASE,
    tooltip: {
      ...ECHARTS_BASE.tooltip,
      trigger: 'item',
      formatter: p => {
        const r = register.find(x => x.id === p.data[2]);
        return r ? `<b>${r.id} — ${r.title}</b><br>發生機率：${r.probability} / 影響程度：${r.impact}<br>等級：${levelLabel[r.level] || r.level}` : '';
      }
    },
    xAxis: bpmAxis({ type: 'value', name: '影響程度', min: 0, max: 6, nameLocation: 'middle', nameGap: 25 }),
    yAxis: bpmAxis({ type: 'value', name: '發生機率', min: 0, max: 6, nameLocation: 'middle', nameGap: 30 }),
    grid: { top: 20, bottom: 50, left: 60, right: 20 },
    series: [{
      type: 'scatter',
      symbolSize: 32,
      data: register.map(r => [r.impact, r.probability, r.id]),
      itemStyle: { color: p => colorMap[register.find(x => x.id === p.data[2])?.level] || CHART_COLORS.gray, opacity: 0.85 },
      label: { show: true, formatter: p => p.data[2], fontSize: 9, fontWeight: 700, color: '#FBF8F2' }
    }]
  });
}

/* ============================================================
   OPERATIONS & SUPPLIERS TAB
   ============================================================ */
function renderOperations() {
  const d = state.data['operations'];

  /* Priority matrix quadrants */
  const quadrantMap = { 'Do First': 'q1', 'Schedule': 'q2', 'Delegate': 'q4', 'Eliminate': 'q3' };
  const quadrantLabels = {
    q1: { label: '立即處理（緊急 + 重要）',     el: 'pm-q1' },
    q2: { label: '排程規劃（重要，不緊急）',      el: 'pm-q2' },
    q3: { label: '委外處理（緊急，較不重要）',    el: 'pm-q3' },
    q4: { label: '委外 / 取消',                  el: 'pm-q4' }
  };

  const qItems = { q1: [], q2: [], q3: [], q4: [] };
  d.priorityMatrix.items.forEach(item => {
    const q = quadrantMap[item.quadrant] || 'q4';
    qItems[q].push(item);
  });

  Object.entries(quadrantLabels).forEach(([q, meta]) => {
    el(meta.el).innerHTML = `
      <div class="pm-quadrant-label">${meta.label}</div>
      ${qItems[q].map(item => `
        <div class="pm-item">
          <div class="pm-item-title">${escHtml(item.title)}</div>
          <div class="pm-item-meta">${escHtml(item.owner)} · ${escHtml(item.deadline)} · ${statusBadgeHtml(item.status)}</div>
        </div>`).join('')}`;
  });

  /* Capex projects table */
  el('ops-capex-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>計畫名稱</th><th class="num">預算</th><th class="num">已支出</th>
        <th>進度</th><th>承包商</th><th>預計完工</th><th>狀態</th>
      </tr></thead>
      <tbody>${d.capexProjects.map(c => `
        <tr>
          <td>
            <div class="font-bold">${escHtml(c.project)}</div>
            <div class="text-secondary text-sm">${escHtml(c.expectedROI)}</div>
          </td>
          <td class="num">${fmtNTD(c.budgeted)}</td>
          <td class="num">${c.spent > 0 ? fmtNTD(c.spent) : '<span class="text-muted">—</span>'}</td>
          <td style="min-width:120px">
            <div class="progress-bar-wrap">
              <div class="progress-bar"><div class="progress-bar-fill" style="width:${c.pctComplete}%"></div></div>
              <span class="progress-label">${c.pctComplete}%</span>
            </div>
          </td>
          <td class="text-secondary">${escHtml(c.contractor)}</td>
          <td class="text-muted">${escHtml(c.estCompletion)}</td>
          <td>${statusBadgeHtml(c.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* OpEx recurring */
  el('ops-opex-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>類別</th><th>廠商</th><th class="num">年度費用</th>
        <th>頻率</th><th>合約到期</th><th>狀態</th><th>備註</th>
      </tr></thead>
      <tbody>${d.opexRecurring.map(o => `
        <tr>
          <td><span class="doc-category-badge">${escHtml(o.category)}</span></td>
          <td>${escHtml(o.vendor)}</td>
          <td class="num">${fmtNTD(o.annualCost)}</td>
          <td class="text-secondary">${escHtml(o.frequency)}</td>
          <td class="text-muted">${escHtml(o.contractExpiry)}</td>
          <td>${statusBadgeHtml(o.status || 'Active')}</td>
          <td class="text-secondary">${escHtml(o.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Suppliers */
  el('ops-suppliers-table').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>廠商</th><th>類別</th><th>聯絡人</th>
        <th>合約期間</th><th>SLA / 保固</th><th>狀態</th><th>備註</th>
      </tr></thead>
      <tbody>${d.suppliers.map(s => `
        <tr>
          <td class="font-bold">${escHtml(s.name)}</td>
          <td><span class="doc-category-badge">${escHtml(s.category)}</span></td>
          <td class="text-secondary text-sm">${escHtml(s.contact)}</td>
          <td class="text-muted">${escHtml(s.contractPeriod)}</td>
          <td class="text-secondary">${escHtml(s.warrantyOrSLA)}</td>
          <td>${statusBadgeHtml(s.status)}</td>
          <td class="text-secondary">${escHtml(s.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Service history */
  el('ops-service-history').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>日期</th><th>廠商</th><th>作業說明</th>
        <th>類別</th><th class="num">費用</th><th>狀態</th>
      </tr></thead>
      <tbody>${d.serviceHistory.map(s => `
        <tr>
          <td class="text-muted">${escHtml(s.date)}</td>
          <td>${escHtml(s.vendor)}</td>
          <td>${escHtml(s.description)}</td>
          <td><span class="doc-category-badge">${escHtml(s.category)}</span></td>
          <td class="num">${fmtNTD(s.cost)}</td>
          <td>${statusBadgeHtml(s.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ============================================================
   DOCUMENTS TAB
   ============================================================ */
function renderDocuments() {
  const d = state.data['documents'];
  let activeFilter = 'All';

  /* Important docs */
  el('docs-important').innerHTML = `
    <table class="data-table">
      <thead><tr><th>文件名稱</th><th>類別</th><th>日期</th><th>類型</th><th>備註</th></tr></thead>
      <tbody>${d.importantDocuments.map(doc => `
        <tr>
          <td><a href="${doc.url || '#'}" class="doc-link">${escHtml(doc.name)}</a></td>
          <td><span class="doc-category-badge">${escHtml(doc.category)}</span></td>
          <td class="text-muted">${escHtml(doc.date)}</td>
          <td><span class="doc-type-badge">${escHtml(doc.type)}</span></td>
          <td class="text-secondary">${escHtml(doc.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Category filter buttons */
  const categories = ['All', ...new Set(d.library.map(doc => doc.category))];
  const catLabel = (c) => c === 'All' ? '全部' : c;
  el('docs-filter-bar').innerHTML = categories.map(cat => `
    <button class="doc-filter-btn ${cat === 'All' ? 'active' : ''}" data-cat="${escHtml(cat)}">${escHtml(catLabel(cat))}</button>`
  ).join('');

  function renderDocTable(filter) {
    const rows = filter === 'All' ? d.library : d.library.filter(doc => doc.category === filter);
    el('docs-library-table').innerHTML = `
      <table class="data-table">
        <thead><tr>
          <th>編號</th><th>文件名稱</th><th>類別</th>
          <th>日期</th><th>來源</th><th>相關區塊</th><th>類型</th><th>備註</th>
        </tr></thead>
        <tbody>${rows.map(doc => `
          <tr>
            <td class="text-muted font-mono">${escHtml(doc.id)}</td>
            <td><a href="${doc.url || '#'}" class="doc-link">${escHtml(doc.name)}</a></td>
            <td><span class="doc-category-badge">${escHtml(doc.category)}</span></td>
            <td class="text-muted">${escHtml(doc.date)}</td>
            <td class="text-secondary">${escHtml(doc.source)}</td>
            <td class="text-secondary">${escHtml(doc.relatedSection)}</td>
            <td><span class="doc-type-badge">${escHtml(doc.type)}</span></td>
            <td class="text-secondary">${escHtml(doc.notes)}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  renderDocTable('All');

  el('docs-filter-bar').addEventListener('click', e => {
    const btn = e.target.closest('.doc-filter-btn');
    if (!btn) return;
    activeFilter = btn.dataset.cat;
    document.querySelectorAll('.doc-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderDocTable(activeFilter);
  });
}

/* ============================================================
   MARKET TAB
   ============================================================ */
function renderMarket() {
  const d = state.data['market'];

  /* Narrative */
  el('mkt-narrative').innerHTML = `
    <p class="market-narrative">${escHtml(d.summary.narrative)}</p>
    <ul class="market-theme-list">${d.summary.keyThemes.map(t => `<li>${escHtml(t)}</li>`).join('')}</ul>`;

  /* Asset competitiveness */
  el('mkt-competitiveness').innerHTML = `
    <div class="grid-2">
      <div>
        <div class="section-title mb-8" style="color:var(--green)">優勢</div>
        <ul class="market-theme-list">${d.assetCompetitiveness.strengths.map(s => `<li>${escHtml(s)}</li>`).join('')}</ul>
        <div class="section-title mb-8 mb-12" style="margin-top:14px;color:var(--blue)">機會</div>
        <ul class="market-theme-list">${d.assetCompetitiveness.opportunities.map(s => `<li>${escHtml(s)}</li>`).join('')}</ul>
      </div>
      <div>
        <div class="section-title mb-8" style="color:var(--amber)">劣勢</div>
        <ul class="market-theme-list">${d.assetCompetitiveness.weaknesses.map(s => `<li>${escHtml(s)}</li>`).join('')}</ul>
        <div class="section-title mb-8" style="margin-top:14px;color:var(--red)">威脅</div>
        <ul class="market-theme-list">${d.assetCompetitiveness.threats.map(s => `<li>${escHtml(s)}</li>`).join('')}</ul>
      </div>
    </div>`;

  /* Comparable sales */
  el('mkt-comp-sales').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>地址</th><th>類型</th><th class="num">戶數</th>
        <th>建設年</th><th>成交日</th>
        <th class="num">成交價</th><th class="num">每戶單價</th><th class="num">每m²單價</th>
        <th class="num">資本化率</th><th class="num">入住率</th><th>備註</th>
      </tr></thead>
      <tbody>${d.comparables.map(c => `
        <tr>
          <td>${escHtml(c.address)}</td>
          <td class="text-secondary">${escHtml(c.type)}</td>
          <td class="num">${c.units}</td>
          <td class="text-muted">${c.yearBuilt}</td>
          <td class="text-muted">${escHtml(c.soldDate)}</td>
          <td class="num">${fmtNTD(c.salePrice)}</td>
          <td class="num">${fmtNTD(c.pricePerUnit)}</td>
          <td class="num">NT$${fmt(c.pricePM2)}</td>
          <td class="num">${escHtml(c.capRate)}</td>
          <td class="num">${escHtml(c.occupancy)}</td>
          <td class="text-secondary">${escHtml(c.notes)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  /* Rent comparables */
  el('mkt-comp-rents').innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>地址</th><th>戶型</th><th class="num">面積(m²)</th>
        <th class="num">開價租金</th><th class="num">租金/m²</th>
        <th class="num">入住率</th><th>設施</th>
      </tr></thead>
      <tbody>${d.rentComparables.map(r => {
        const isSubject = r.address.includes('本案');
        return `<tr ${isSubject ? 'style="background:var(--bpm-red-tint);font-weight:600;"' : ''}>
          <td>${escHtml(r.address)} ${isSubject ? '<span class="comp-badge">本案</span>' : ''}</td>
          <td>${escHtml(r.unitType)}</td>
          <td class="num">${r.areaM2}</td>
          <td class="num">NT$${fmt(r.askingRent)}/月</td>
          <td class="num">NT$${fmt(r.rentPM2)}/m²</td>
          <td class="num">${escHtml(r.occupancy)}</td>
          <td class="text-secondary">${escHtml(r.amenities)}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>`;

  /* Cap rate trend chart */
  const crChart = initChart('mkt-caprate-chart');
  const crt = d.capRateTrend;
  crChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: p => `${p[0].axisValue}<br>資本化率：${p[0].value}%` },
    grid: { top: 10, bottom: 30, left: 44, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: crt.labels, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 9, rotate: 30 }, splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', name: '', min: 2.0, max: 3.5, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => v.toFixed(1)+'%' } }),
    series: [{
      type: 'line', data: crt.values, smooth: true, symbol: 'none',
      lineStyle: { color: CHART_COLORS.red, width: 2 },
      itemStyle: { color: CHART_COLORS.red },
      areaStyle: { color: { type:'linear', x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:'rgba(142,27,31,0.15)'},{offset:1,color:'rgba(142,27,31,0)'}] } }
    }]
  });

  /* Vacancy trend chart */
  const vcChart = initChart('mkt-vacancy-chart');
  const vt = d.vacancyTrend;
  vcChart.setOption({
    ...ECHARTS_BASE,
    tooltip: { ...ECHARTS_BASE.tooltip, trigger: 'axis', formatter: p => `${p[0].axisValue}<br>${p.map(s=>`${s.seriesName}: ${s.value}%`).join('<br>')}` },
    legend: { bottom: 0, textStyle: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 11 } },
    grid: { top: 10, bottom: 40, left: 44, right: 20 },
    xAxis: bpmAxis({ type: 'category', data: vt.labels, axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 9, rotate: 30 }, splitLine: { show: false } }),
    yAxis: bpmAxis({ type: 'value', axisLabel: { color: BPM.ink3, fontFamily: BPM_FONT, fontSize: 10, formatter: v => v+'%' } }),
    series: [
      { name: '次市場', type: 'line', data: vt.submarket, smooth: true, symbol: 'none', lineStyle: { color: '#8A8A8F', width: 2 }, itemStyle: { color: '#8A8A8F' } },
      { name: '港景', type: 'line', data: vt.asset, smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#8E1B1F', width: 2 }, itemStyle: { color: '#8E1B1F' } }
    ]
  });

  /* Market risks and opportunities */
  el('mkt-risks').innerHTML = d.marketRisks.map(r => `
    <div class="row-between mb-8" style="border-bottom:1px solid var(--border);padding-bottom:8px;">
      ${riskLevelHtml(r.level)}
      <span style="font-size:13px;font-weight:600;flex:1;margin-left:8px;">${escHtml(r.title)}</span>
    </div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">${escHtml(r.description)}</div>
  `).join('');

  el('mkt-opportunities').innerHTML = d.marketOpportunities.map(o => `
    <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border);">
      <div style="font-size:13px;font-weight:700;color:var(--green);margin-bottom:3px;">${escHtml(o.title)}</div>
      <div style="font-size:12px;color:var(--text-secondary);">${escHtml(o.description)}</div>
    </div>`).join('');

  /* Implication */
  el('mkt-implication').innerHTML = `
    <div class="implication-card">
      <div class="implication-title">${escHtml(d.marketImplication.title)}</div>
      <div class="implication-body">${escHtml(d.marketImplication.body)}</div>
    </div>`;
}

/* ── Boot ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadData();
});
