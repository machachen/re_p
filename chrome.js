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
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderChrome().catch(function (e) { console.error('chrome render failed', e); });
  });
})();
