'use strict';

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

const CHART_COLORS = {
  blue: '#1a6ef5', green: '#1e8a4c', red: '#c0392b', amber: '#e67e22', gray: '#8a97a8'
};
const ECHARTS_BASE = {
  textStyle: { fontFamily: "'Inter','Microsoft JhengHei','PingFang TC','Noto Sans TC',sans-serif", fontSize: 11 },
  color: ['#1a6ef5', '#1e8a4c', '#e67e22', '#c0392b', '#8a97a8']
};

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
  const labelMap = { 'Open': '待處理', 'In Progress': '進行中', 'Complete': '已完成' };
  return `<span class="status-badge ${clsMap[s] || 'not-started'}">${labelMap[s] || escHtml(s)}</span>`;
}

function showLoading(v) { el('loading-overlay').style.display = v ? 'flex' : 'none'; }
function showError(msg) {
  const b = el('error-banner');
  b.textContent = '⚠ 資料載入失敗：' + msg;
  b.style.display = 'block';
}

async function loadData() {
  showLoading(true);
  try {
    const d = await fetch(PF_DATA_URL).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
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
  renderHeader(d);
  renderKeyFigures(d);
  renderSummary(d);
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
  const updated = new Date(d.meta.lastUpdated).toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  el('nav-updated-date').textContent = updated;
  el('nav-period-display').textContent = d.meta.periodLabel;
  el('pf-period-badge').textContent   = d.meta.periodLabel;
}

/* ── Portfolio Header ───────────────────────────────────── */
function renderHeader(d) {
  const t = d.totals;
  el('pf-hdr-aum').textContent    = fmtCompact(t.totalAUM);
  el('pf-hdr-equity').textContent = fmtCompact(t.chenFamilyEquity);
  el('pf-hdr-ltv').textContent    = fmtPct(t.blendedLTV);
  el('pf-asset-count').textContent = d.meta.assetCount + '個資產';
}

/* ── Key Figures Strip ─────────────────────────────────── */
function renderKeyFigures(d) {
  el('pf-key-figures').innerHTML = d.keyFigures.map(kf => `
    <div class="kf-item">
      <div class="kf-label">${escHtml(kf.label)}</div>
      <div class="kf-value">${escHtml(kf.value)}</div>
      <div class="kf-sub">
        <span>${escHtml(kf.subLabel)}</span>
        ${kf.trend ? `<span class="kf-trend ${kf.trend}">${escHtml(kf.trendValue)}</span>` : ''}
      </div>
    </div>`).join('');
}

/* ── Executive Summary ─────────────────────────────────── */
function renderSummary(d) {
  el('pf-narrative').textContent    = d.summary.narrative;
  el('pf-keymessage').textContent   = d.summary.keyMessage;
}

/* ── Asset Cards ───────────────────────────────────────── */
function renderAssetCards(d) {
  const urgencyColor = u => ({ high: 'var(--red)', medium: 'var(--amber)', low: 'var(--green)' }[u] || 'var(--border)');

  el('pf-asset-cards').innerHTML = d.assetCards.map(a => {
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
          <div class="pf-ac-metric-label">估值</div>
          <div class="pf-ac-metric-value">${fmtCompact(a.value)}</div>
        </div>
        <div class="pf-ac-metric">
          <div class="pf-ac-metric-label">淨權益</div>
          <div class="pf-ac-metric-value">${fmtCompact(a.equity)}</div>
        </div>
        <div class="pf-ac-metric">
          <div class="pf-ac-metric-label">LTV</div>
          <div class="pf-ac-metric-value">${fmtPct(a.ltv)}</div>
        </div>
        <div class="pf-ac-metric">
          <div class="pf-ac-metric-label">年度NOI</div>
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
      trigger: 'item',
      formatter: p => `${p.name}<br>估值：${fmtCompact(p.value)}<br>比重：${p.percent.toFixed(1)}%`
    },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '44%'],
      data: a.labels.map((label, i) => ({ name: label, value: a.values[i], itemStyle: { color: a.colors[i] } })),
      label: { fontSize: 11, formatter: '{b}\n{d}%' },
      itemStyle: { borderWidth: 2, borderColor: '#fff' }
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
      trigger: 'axis',
      formatter: p => `${p[0].axisValue}<br>${p.map(s => `${s.marker}${s.seriesName}: ${fmtCompact(s.value)}`).join('<br>')}`
    },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    grid: { top: 16, bottom: 44, left: 80, right: 20 },
    xAxis: { type: 'category', data: ib.labels, axisLabel: { fontSize: 10, interval: 0 } },
    yAxis: { type: 'value', axisLabel: { formatter: v => fmtCompact(v), fontSize: 10 } },
    series: [
      {
        name: 'NOI',
        type: 'bar',
        data: ib.noi.map((v, i) => ({ value: v, itemStyle: { color: ib.colors[i] } })),
        label: { show: true, position: 'top', formatter: p => fmtCompact(p.value), fontSize: 9, color: '#556272' }
      },
      {
        name: '稅前淨現金流',
        type: 'bar',
        data: ib.netCF.map((v, i) => ({ value: v, itemStyle: { color: ib.colors[i], opacity: 0.5 } })),
        label: { show: true, position: 'top', formatter: p => fmtCompact(p.value), fontSize: 9, color: '#556272' }
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
    ['估計市值',         c => fmtCompact(c.value)],
    ['貸款餘額',         c => c.debt > 0 ? fmtCompact(c.debt) : '<span class="text-muted">無貸款</span>'],
    ['淨權益',           c => fmtCompact(c.equity)],
    ['陳氏家族持份',     c => fmtPct(c.chenPct)],
    ['陳氏家族淨權益',   c => fmtCompact(c.chenEquity)],
    ['LTV',              c => fmtPct(c.ltv)],
    ['年度NOI',          c => signCompact(c.noi)],
    ['年度淨現金流',     c => signCompact(c.netCF)],
    ['資本化率',         c => c.capRate != null ? fmtPct(c.capRate) : '<span class="text-muted">N/A</span>'],
    ['持有狀況',         c => escHtml(c.ownershipSummary)],
    ['近期重點事項',     c => `<span style="font-size:12px;color:var(--text-secondary)">${escHtml(c.keyHighlight)}</span>`]
  ];

  el('pf-comparison-table').innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th style="min-width:140px">指標</th>
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
          <th>資產</th><th>貸款機構</th>
          <th class="num">貸款餘額</th>
          <th>利率</th><th>LTV</th><th>DSCR</th>
          <th>到期日</th><th>狀態</th>
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
          <td class="font-bold">組合合計</td>
          <td></td>
          <td class="num font-bold">${fmtNTD(d.totals.totalDebt)}</td>
          <td></td>
          <td class="font-bold">${fmtPct(d.totals.blendedLTV)} <span class="text-muted text-xs">加權</span></td>
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
  const colors = d.allocation.colors;

  chart.setOption({
    ...ECHARTS_BASE,
    tooltip: { trigger: 'axis', formatter: p => `${p[0].name}<br>LTV：${p[0].value.toFixed(1)}%` },
    grid: { top: 20, bottom: 30, left: 96, right: 64 },
    xAxis: {
      type: 'value', min: 0, max: 65,
      axisLabel: { formatter: v => v + '%', fontSize: 10 },
      splitLine: { lineStyle: { type: 'dashed' } }
    },
    yAxis: { type: 'category', data: cards.map(c => c.shortName), axisLabel: { fontSize: 11 } },
    series: [{
      type: 'bar',
      barMaxWidth: 28,
      data: cards.map((c, i) => ({ value: c.ltv, itemStyle: { color: colors[i], borderRadius: [0, 4, 4, 0] } })),
      label: {
        show: true, position: 'right',
        formatter: p => p.value.toFixed(1) + '%',
        fontSize: 11, fontWeight: 700, color: '#556272'
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
    'asset-001': { name: '港景住商', color: '#1a6ef5' },
    'asset-002': { name: '林口全聯', color: '#1e8a4c' },
    'asset-003': { name: '大安仁愛苑', color: '#e67e22' }
  };

  const series = Object.entries(h.assets).map(([id, values]) => {
    const m = assetMeta[id] || { name: id, color: '#8a97a8' };
    return {
      name: m.name,
      type: 'line',
      stack: 'total',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: values,
      itemStyle: { color: m.color },
      lineStyle: { width: 2, color: m.color },
      areaStyle: { opacity: 0.45, color: m.color }
    };
  });

  chart.setOption({
    ...ECHARTS_BASE,
    tooltip: {
      trigger: 'axis',
      formatter: p => {
        const total = p.reduce((s, item) => s + (item.value || 0), 0);
        return `${p[0].axisValue}<br>` +
          p.map(item => `${item.marker}${item.seriesName}: ${fmtCompact(item.value)}`).join('<br>') +
          `<br><b>合計：${fmtCompact(total)}</b>`;
      }
    },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    grid: { top: 20, bottom: 50, left: 90, right: 20 },
    xAxis: { type: 'category', data: h.labels, axisLabel: { fontSize: 11 } },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: v => '$' + (v / 1e6).toFixed(0) + 'M', fontSize: 10 }
    },
    series
  });
}

/* ── Actions Table ─────────────────────────────────────── */
function renderActionsTable(d) {
  const priorityCls   = p => ({ 'High': 'high', 'Medium': 'medium', 'Low': 'low' }[p] || 'low');
  const priorityLabel = p => ({ 'High': '高優先', 'Medium': '中優先', 'Low': '低優先' }[p] || p);
  const assetColor    = id => ({ 'asset-001': '#1a6ef5', 'asset-002': '#1e8a4c', 'asset-003': '#e67e22' }[id] || '#8a97a8');

  el('pf-actions-table').innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>資產</th><th>行動項目</th>
          <th>優先級</th><th>截止日期</th><th>狀態</th>
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
  el('pf-risk-high').textContent   = rs.highCount;
  el('pf-risk-medium').textContent = rs.mediumCount;
  el('pf-risk-low').textContent    = rs.lowCount;
  el('pf-risk-concern').textContent = rs.topConcern;
}

/* ── Boot ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', loadData);
