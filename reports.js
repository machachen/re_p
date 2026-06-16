'use strict';
// 報告 Reports — published-period list + downloadable documents (read-only).

// ── interface i18n (chrome only — page-specific keys) ──────────────────────
if (window.bpmI18nAdd) bpmI18nAdd({
  'rp.eyebrow': '報告 · Reports',
  'rp.title': '報告與文件',
  'rp.sub': 'Reporting periods & documents',
  'rp.periodsTitle': '報告期間 · Reporting periods',
  'rp.periodsNote': '已發布之每月報告',
  'rp.docsTitle': '文件庫 · Documents',
  'rp.docsNote': '安全儲存，僅授權使用者可下載',
  'rp.loading': '載入報告與文件…',
  'rp.thPeriod': '期間',
  'rp.thLabel': '標籤',
  'rp.thPublished': '發布日期',
  'rp.thAction': '動作',
  'rp.viewDash': '查看本期儀表板 ›',
  'rp.historical': '歷史報告',
  'rp.thTitle': '標題',
  'rp.thCategory': '分類',
  'rp.thType': '類型',
  'rp.thSize': '大小',
  'rp.thDate': '日期',
  'rp.fileType': '檔案',
  'rp.download': '下載',
  'rp.emptyPeriods': '尚無已發布的報告期間。',
  'rp.emptyDocs': '尚無文件。文件上傳後會顯示於此。',
  'rp.dlError': '產生下載連結失敗',
  'rp.loadError': '⚠ 載入失敗：',
  'foot.brandVer': 'BPM Intelligence v4.2'
}, {
  'rp.eyebrow': 'Reports',
  'rp.title': 'Reports & documents',
  'rp.sub': 'Reporting periods & documents',
  'rp.periodsTitle': 'Reporting periods',
  'rp.periodsNote': 'Published monthly reports',
  'rp.docsTitle': 'Documents',
  'rp.docsNote': 'Securely stored; downloadable by authorized users only',
  'rp.loading': 'Loading reports & documents…',
  'rp.thPeriod': 'Period',
  'rp.thLabel': 'Label',
  'rp.thPublished': 'Published',
  'rp.thAction': 'Action',
  'rp.viewDash': 'View this period’s dashboard ›',
  'rp.historical': 'Historical report',
  'rp.thTitle': 'Title',
  'rp.thCategory': 'Category',
  'rp.thType': 'Type',
  'rp.thSize': 'Size',
  'rp.thDate': 'Date',
  'rp.fileType': 'File',
  'rp.download': 'Download',
  'rp.emptyPeriods': 'No published reporting periods yet.',
  'rp.emptyDocs': 'No documents yet. Uploaded documents will appear here.',
  'rp.dlError': 'Failed to generate download link',
  'rp.loadError': '⚠ Load failed: ',
  'foot.brandVer': 'BPM Intelligence v4.2'
});

function el(id) { return document.getElementById(id); }
function showLoading(v) { const o = el('loading-overlay'); if (o) o.style.display = v ? 'flex' : 'none'; }
function showError(m) { const b = el('error-banner'); if (b) { b.textContent = (window.t ? t('rp.loadError') : '⚠ 載入失敗：') + m; b.style.display = 'block'; } }
function escHtml(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function fmtSize(b) {
  if (b == null) return '—';
  if (b >= 1048576) return (b / 1048576).toFixed(1) + ' MB';
  if (b >= 1024) return Math.round(b / 1024) + ' KB';
  return b + ' B';
}
function fmtDate(t) { return t ? new Date(t).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'; }

async function init() {
  showLoading(true);
  try {
    const s = window.requireAuth ? await window.requireAuth() : null;
    if (!s) return;
    const client = await window.bpmCurrentClient();
    const [periods, docs] = await Promise.all([
      window.bpmListPublishedPeriods(client.id),
      window.bpmListClientDocuments(client.id)
    ]);
    renderPeriods(periods);
    renderDocs(docs);
  } catch (e) { console.error(e); showError(e.message); }
  finally { showLoading(false); }
}

function renderPeriods(rows) {
  const host = el('rp-periods'); if (!host) return;
  if (!rows.length) { host.innerHTML = '<div style="padding:20px;color:var(--ink-3);font-size:13px;">' + t('rp.emptyPeriods') + '</div>'; return; }
  host.innerHTML = `
    <table class="data-table">
      <thead><tr><th>${t('rp.thPeriod')}</th><th>${t('rp.thLabel')}</th><th>${t('rp.thPublished')}</th><th style="text-align:right;">${t('rp.thAction')}</th></tr></thead>
      <tbody>
        ${rows.map((r, i) => `<tr>
          <td class="mono">${escHtml(r.period)}</td>
          <td>${escHtml(r.label || '—')}</td>
          <td class="text-muted">${fmtDate(r.published_at)}</td>
          <td style="text-align:right;">${i === 0
            ? '<a class="doc-link" href="portfolio.html">' + t('rp.viewDash') + '</a>'
            : '<span class="meta">' + t('rp.historical') + '</span>'}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

async function renderDocs(rows) {
  const host = el('rp-docs'); if (!host) return;
  if (!rows.length) {
    host.innerHTML = '<div style="padding:20px;color:var(--ink-3);font-size:13px;">' + t('rp.emptyDocs') + '</div>';
    return;
  }
  host.innerHTML = `
    <table class="data-table">
      <thead><tr><th>${t('rp.thTitle')}</th><th>${t('rp.thCategory')}</th><th>${t('rp.thType')}</th><th class="num">${t('rp.thSize')}</th><th>${t('rp.thDate')}</th><th style="text-align:right;">${t('rp.thAction')}</th></tr></thead>
      <tbody>
        ${rows.map(d => `<tr>
          <td>${escHtml(d.title)}</td>
          <td>${escHtml(d.category || '—')}</td>
          <td><span class="doc-type-badge">${escHtml(d.doc_type || t('rp.fileType'))}</span></td>
          <td class="num">${fmtSize(d.size_bytes)}</td>
          <td class="text-muted">${fmtDate(d.created_at)}</td>
          <td style="text-align:right;"><button class="btn btn-tertiary" data-path="${escHtml(d.storage_path)}" type="button">${t('rp.download')}</button></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  host.querySelectorAll('button[data-path]').forEach(b => b.addEventListener('click', async () => {
    const url = await window.bpmSignedDocUrl(b.getAttribute('data-path'));
    if (url) window.open(url, '_blank'); else showError(t('rp.dlError'));
  }));
}

document.addEventListener('DOMContentLoaded', init);
