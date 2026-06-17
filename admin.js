'use strict';
// BPM Intelligence — advisor console (admin only). Lists every client household
// with firm-level KPIs; "enter portfolio" pins the active client (RLS already
// lets admins read every client) and opens the normal client portal.

if (window.bpmI18nAdd) bpmI18nAdd({
  'adm.loading': '載入客戶資料…',
  'adm.brandSub': '管理控制台',
  'adm.eyebrow': '管理控制台 · Advisor console',
  'adm.title': '客戶總覽',
  'adm.sub': '所有受管客戶家族 · All client households under management',
  'adm.clients': '客戶家族 · Client households',
  'adm.clientsNote': '點擊「進入組合」以管理者身分檢視該客戶',
  'adm.kpiAum': '受管總額 · AUM',
  'adm.kpiClients': '客戶家族',
  'adm.kpiAssets': '資產總數',
  'adm.kpiLatest': '最新報告期',
  'adm.open': '進入組合 →',
  'adm.stAum': 'AUM', 'adm.stAssets': '資產', 'adm.stLtv': 'LTV', 'adm.stPeriod': '期間',
  'adm.noData': '尚無資料', 'adm.loadError': '⚠ 載入失敗：'
}, {
  'adm.loading': 'Loading clients…',
  'adm.brandSub': 'Advisor Console',
  'adm.eyebrow': 'Advisor console',
  'adm.title': 'Clients overview',
  'adm.sub': 'All client households under management',
  'adm.clients': 'Client households',
  'adm.clientsNote': 'Click “Enter portfolio” to view a client as admin',
  'adm.kpiAum': 'AUM',
  'adm.kpiClients': 'Client households',
  'adm.kpiAssets': 'Total assets',
  'adm.kpiLatest': 'Latest period',
  'adm.open': 'Enter portfolio →',
  'adm.stAum': 'AUM', 'adm.stAssets': 'Assets', 'adm.stLtv': 'LTV', 'adm.stPeriod': 'Period',
  'adm.noData': 'No data yet', 'adm.loadError': '⚠ Load failed: '
});

function el(id) { return document.getElementById(id); }
function escHtml(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function showLoading(v) { const o = el('loading-overlay'); if (o) o.style.display = v ? 'flex' : 'none'; }
function showError(m) { const b = el('error-banner'); if (b) { b.textContent = (window.t ? t('adm.loadError') : '⚠ ') + m; b.style.display = 'block'; } }
function fmtCompact(n) {
  if (n == null || isNaN(n)) return '—';
  const a = Math.abs(n);
  if (a >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (a >= 1e6) return '$' + (n / 1e6).toFixed(0) + 'M';
  if (a >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + n;
}
function clientName(r) { return (r.client.config && r.client.config.displayName) || (r.meta && r.meta.portfolioName) || r.client.name; }
function avatar(r) { const c = r.client.config || {}; return c.avatarInitial || (clientName(r) || '·').slice(0, 1); }

async function init() {
  showLoading(true);
  try {
    const s = window.requireAuth ? await window.requireAuth() : null;
    if (!s) return;
    if (!(await window.bpmIsAdmin())) { window.location.replace('portfolio.html'); return; }
    const roster = await window.bpmAdminRoster();
    renderKpis(roster);
    renderRoster(roster);
  } catch (e) { console.error(e); showError(e.message); }
  finally { showLoading(false); }
}

function renderKpis(roster) {
  const totAum = roster.reduce((s, r) => s + ((r.totals && r.totals.totalAUM) || 0), 0);
  const totAssets = roster.reduce((s, r) => s + (r.assetCount || 0), 0);
  const latest = roster.map(r => r.period && r.period.label).filter(Boolean).sort().slice(-1)[0] || '—';
  const cells = [
    { label: t('adm.kpiAum'), value: fmtCompact(totAum) },
    { label: t('adm.kpiClients'), value: String(roster.length) },
    { label: t('adm.kpiAssets'), value: String(totAssets) },
    { label: t('adm.kpiLatest'), value: latest },
  ];
  const host = el('adm-kpi');
  if (host) host.innerHTML = cells.map(c => `
    <div class="kpi-cell"><div class="eyebrow">${escHtml(c.label)}</div>
      <div class="kpi-num">${escHtml(c.value)}</div></div>`).join('');
}

function renderRoster(roster) {
  const host = el('adm-roster');
  if (!host) return;
  if (!roster.length) { host.innerHTML = `<div class="card"><div class="meta">${t('adm.noData')}</div></div>`; return; }
  const st = (label, val) => `<div><div class="meta">${escHtml(label)}</div><div class="mono admin-stat-num">${escHtml(val)}</div></div>`;
  host.innerHTML = roster.map(r => {
    const tt = r.totals || {};
    const aum = fmtCompact(tt.totalAUM);
    const ltv = tt.blendedLTV != null ? tt.blendedLTV + '%' : '—';
    const period = (r.period && r.period.label) || t('adm.noData');
    return `<div class="card admin-client-card">
      <div class="admin-client-head">
        <div><div class="eyebrow">${escHtml(r.client.slug)}</div>
          <div class="admin-client-name">${escHtml(clientName(r))}</div></div>
        <span class="admin-client-avatar">${escHtml(avatar(r))}</span>
      </div>
      <div class="admin-client-stats">
        ${st(t('adm.stAum'), aum)}${st(t('adm.stAssets'), String(r.assetCount))}
        ${st(t('adm.stLtv'), ltv)}${st(t('adm.stPeriod'), period)}
      </div>
      <button class="btn btn-primary admin-enter" data-client="${escHtml(r.client.id)}">${t('adm.open')}</button>
    </div>`;
  }).join('');
  host.querySelectorAll('.admin-enter').forEach(b => b.addEventListener('click', () => {
    window.bpmSetActiveClient(b.getAttribute('data-client'));
    window.location.href = 'portfolio.html';
  }));
}

document.addEventListener('DOMContentLoaded', init);
