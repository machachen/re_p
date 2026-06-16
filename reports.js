'use strict';
// 報告 Reports — published-period list + downloadable documents (read-only).

function el(id) { return document.getElementById(id); }
function showLoading(v) { const o = el('loading-overlay'); if (o) o.style.display = v ? 'flex' : 'none'; }
function showError(m) { const b = el('error-banner'); if (b) { b.textContent = '⚠ 載入失敗：' + m; b.style.display = 'block'; } }
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
  if (!rows.length) { host.innerHTML = '<div style="padding:20px;color:var(--ink-3);font-size:13px;">尚無已發布的報告期間。</div>'; return; }
  host.innerHTML = `
    <table class="data-table">
      <thead><tr><th>期間</th><th>標籤</th><th>發布日期</th><th style="text-align:right;">動作</th></tr></thead>
      <tbody>
        ${rows.map((r, i) => `<tr>
          <td class="mono">${escHtml(r.period)}</td>
          <td>${escHtml(r.label || '—')}</td>
          <td class="text-muted">${fmtDate(r.published_at)}</td>
          <td style="text-align:right;">${i === 0
            ? '<a class="doc-link" href="portfolio.html">查看本期儀表板 ›</a>'
            : '<span class="meta">歷史報告</span>'}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

async function renderDocs(rows) {
  const host = el('rp-docs'); if (!host) return;
  if (!rows.length) {
    host.innerHTML = '<div style="padding:20px;color:var(--ink-3);font-size:13px;">尚無文件。文件上傳後會顯示於此。</div>';
    return;
  }
  host.innerHTML = `
    <table class="data-table">
      <thead><tr><th>標題</th><th>分類</th><th>類型</th><th class="num">大小</th><th>日期</th><th style="text-align:right;">動作</th></tr></thead>
      <tbody>
        ${rows.map(d => `<tr>
          <td>${escHtml(d.title)}</td>
          <td>${escHtml(d.category || '—')}</td>
          <td><span class="doc-type-badge">${escHtml(d.doc_type || '檔案')}</span></td>
          <td class="num">${fmtSize(d.size_bytes)}</td>
          <td class="text-muted">${fmtDate(d.created_at)}</td>
          <td style="text-align:right;"><button class="btn btn-tertiary" data-path="${escHtml(d.storage_path)}" type="button">下載</button></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  host.querySelectorAll('button[data-path]').forEach(b => b.addEventListener('click', async () => {
    const url = await window.bpmSignedDocUrl(b.getAttribute('data-path'));
    if (url) window.open(url, '_blank'); else showError('產生下載連結失敗');
  }));
}

document.addEventListener('DOMContentLoaded', init);
