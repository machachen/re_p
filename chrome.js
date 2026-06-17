'use strict';
// ============================================================================
// BPM Intelligence — shared chrome (sidebar / topbar / footer) from the DB.
//   Fills the sidebar asset list + count, the analyst card, the avatar, the
//   topbar period and the breadcrumb client name so none of it is hardcoded.
//   Interface-only i18n still applies to labels; DB content is shown as stored,
//   except the analyst title/contact which the client asked to follow the
//   language toggle (so those are stored bilingually and picked by language).
//   Resilient: any failure leaves the page's static fallback in place.
// ============================================================================
(function () {
  function el(id) { return document.getElementById(id); }
  function escHtml(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function escAttr(s) { return escHtml(s).replace(/"/g, '&quot;'); }
  function setText(id, v) { var e = el(id); if (e && v != null && v !== '') e.textContent = v; }
  function pickLang(obj, lang) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;            // single bilingual string
    if (obj[lang] != null) return obj[lang];
    return obj.zh != null ? obj.zh : (obj.en != null ? obj.en : '');
  }

  async function renderChrome() {
    if (!window.bpmLoadChrome) return;
    var lang = window.bpmLang ? window.bpmLang() : 'zh';
    var res = await window.bpmLoadChrome();
    var assets = res.assets || [];
    var cfg = res.config || {};
    var period = res.period || {};

    // ── Topbar: period + avatar ──────────────────────────────
    setText('nav-period-display', period.period);
    setText('nav-avatar', cfg.avatarInitial);

    // ── Sidebar: portfolio count + asset list (fully DB-driven) ─
    setText('side-portfolio-count', String(assets.length));
    var list = el('side-asset-list');
    if (list) {
      var activeId = new URLSearchParams(location.search).get('id');
      list.innerHTML = assets.map(function (a) {
        var active = a.code === activeId ? ' active' : '';
        return '<li><a class="side-row' + active + '" href="index.html?id=' + encodeURIComponent(a.code) + '" data-asset="' + escAttr(a.code) + '">' +
               '<span class="left"><span class="side-mark"></span><span class="side-label">' + escHtml(a.name) + '</span></span>' +
               '<span class="side-meta">›</span></a></li>';
      }).join('');
    }

    // ── Sidebar: analyst card (name bilingual; title/contact by language) ─
    var an = cfg.analyst || {};
    setText('analyst-name', an.name);
    setText('analyst-title', pickLang(an.title, lang));
    setText('analyst-contact', pickLang(an.contact, lang));
    setText('composer-analyst-name', an.name); // portfolio composer (optional)

    // ── Breadcrumb / print header client name ────────────────
    var dn = cfg.displayName || (res.client && res.client.name) || '';
    setText('bc-root', dn);
    setText('print-client-name', dn);

    // ── Admin view-as bar (admins only; clients never see it) ─
    try { if (window.bpmIsAdmin && await window.bpmIsAdmin()) await renderAdminBar(res.client); } catch (e) {}
  }

  async function renderAdminBar(current) {
    if (document.getElementById('admin-bar')) return;
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    var clients = [];
    try { clients = await window.bpmListAllClients(); } catch (e) { return; }
    var opts = clients.map(function (c) {
      var nm = (c.config && c.config.displayName) || c.name;
      var sel = (current && c.id === current.id) ? ' selected' : '';
      return '<option value="' + escAttr(c.id) + '"' + sel + '>' + escHtml(nm) + '</option>';
    }).join('');
    var box = document.createElement('div');
    box.id = 'admin-bar';
    box.className = 'admin-side';
    box.innerHTML = '<div class="admin-side-tag">管理者檢視</div>'
      + '<select id="admin-bar-switch" class="admin-side-select" aria-label="client">' + opts + '</select>'
      + '<a class="admin-side-back" href="admin.html">← 返回控制台</a>';
    sidebar.insertBefore(box, sidebar.firstChild);
    var s = document.getElementById('admin-bar-switch');
    if (s) s.addEventListener('change', function () { if (s.value) { window.bpmSetActiveClient(s.value); location.reload(); } });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderChrome().catch(function (e) { console.error('chrome render failed', e); });
  });
})();
