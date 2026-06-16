// ============================================================================
// BPM Intelligence — interface i18n (CHROME ONLY)
//   Report CONTENT/DATA (asset names, narratives, figures from JSON/Supabase)
//   is never translated here — only the interface shell.
//   API:
//     t('key')                      -> translated string for current language
//     bpmI18nAdd(zhObj, enObj)      -> register page-specific keys
//     data-i18n="key"               -> auto-filled textContent on load
//     data-i18n-ph / data-i18n-title-> placeholder / title attributes
//   The 繁中/EN top-bar toggle stores the choice and reloads.
// ============================================================================
(function () {
  var KEY = 'bpm_lang';
  window.BPM_I18N = window.BPM_I18N || { zh: {}, en: {} };

  window.bpmI18nAdd = function (zh, en) {
    Object.assign(window.BPM_I18N.zh, zh || {});
    Object.assign(window.BPM_I18N.en, en || {});
  };
  window.bpmLang = function () { try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'zh'; } catch (e) { return 'zh'; } };
  window.t = function (k) {
    var l = window.bpmLang(), d = window.BPM_I18N;
    if (d[l] && d[l][k] != null) return d[l][k];
    return d.zh[k] != null ? d.zh[k] : k;
  };
  window.bpmSetLang = function (l) { try { localStorage.setItem(KEY, l === 'en' ? 'en' : 'zh'); } catch (e) {} location.reload(); };

  window.bpmApplyI18n = function (root) {
    var r = root || document;
    r.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = window.t(el.getAttribute('data-i18n')); });
    r.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', window.t(el.getAttribute('data-i18n-ph'))); });
    r.querySelectorAll('[data-i18n-title]').forEach(function (el) { el.setAttribute('title', window.t(el.getAttribute('data-i18n-title'))); });
    document.documentElement.setAttribute('lang', window.bpmLang() === 'en' ? 'en' : 'zh-Hant');
    // reflect toggle state — markup: <span>繁中</span><span class="sep">/</span><span>EN</span>
    var btn = document.querySelector('.locale-btn');
    if (btn) {
      var spans = btn.querySelectorAll('span');
      var en = window.bpmLang() === 'en';
      if (spans[0]) spans[0].className = en ? 'off' : 'on';
      if (spans[2]) spans[2].className = en ? 'on' : 'off';
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.locale-btn');
    if (btn) btn.addEventListener('click', function () { window.bpmSetLang(window.bpmLang() === 'en' ? 'zh' : 'en'); });
    window.bpmApplyI18n(document);
  });

  // ── Shared dictionary: shell + common controls (reused on every page) ──────
  window.bpmI18nAdd({
    'nav.portfolio': '組合總覽', 'nav.assets': '資產', 'nav.scenarios': '情境', 'nav.reports': '報告',
    'brand.sub': 'Portfolio Intelligence',
    'side.portfolios': '投資組合 · Portfolios', 'side.assets': '資產 · Assets', 'side.analysis': '分析 · Analysis', 'side.filters': '篩選 · Filters',
    'side.realestate': '不動產組合', 'side.scenarios': '情境分析', 'side.reportsDocs': '報告與文件',
    'side.pending': '待決行動', 'side.changed': '本季異動', 'side.refi': '再融資到期',
    'side.analyst': '您的分析師 · Your analyst',
    'foot.confidential': '機密', 'foot.copyright': '© 2026 BPM Capital Partners',
    'btn.exportPdf': '匯出 PDF', 'btn.committeePack': '開啟委員會資料包', 'btn.attach': '附件', 'btn.send': '送出',
    'common.signout': '登出 · Sign out', 'common.loading': '載入中…', 'common.viewReport': '開啟完整報告', 'common.backDash': '← 返回儀表板',
    'status.complete': '已完成', 'status.inProgress': '進行中', 'status.open': '待處理', 'status.notStarted': '未開始',
    'lvl.high': '高', 'lvl.medium': '中', 'lvl.low': '低',
    'sc.downside': '悲觀', 'sc.base': '基本', 'sc.upside': '樂觀'
  }, {
    'nav.portfolio': 'Portfolio', 'nav.assets': 'Assets', 'nav.scenarios': 'Scenarios', 'nav.reports': 'Reports',
    'brand.sub': 'Portfolio Intelligence',
    'side.portfolios': 'Portfolios', 'side.assets': 'Assets', 'side.analysis': 'Analysis', 'side.filters': 'Filters',
    'side.realestate': 'Real-estate portfolio', 'side.scenarios': 'Scenario analysis', 'side.reportsDocs': 'Reports & documents',
    'side.pending': 'Pending actions', 'side.changed': 'Changed this quarter', 'side.refi': 'Refinancing due',
    'side.analyst': 'Your analyst',
    'foot.confidential': 'Confidential', 'foot.copyright': '© 2026 BPM Capital Partners',
    'btn.exportPdf': 'Export PDF', 'btn.committeePack': 'Open committee pack', 'btn.attach': 'Attach', 'btn.send': 'Send',
    'common.signout': 'Sign out', 'common.loading': 'Loading…', 'common.viewReport': 'Open full report', 'common.backDash': '← Back to dashboard',
    'status.complete': 'Complete', 'status.inProgress': 'In progress', 'status.open': 'Open', 'status.notStarted': 'Not started',
    'lvl.high': 'High', 'lvl.medium': 'Medium', 'lvl.low': 'Low',
    'sc.downside': 'Downside', 'sc.base': 'Base', 'sc.upside': 'Upside'
  });
})();
