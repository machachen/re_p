// ============================================================================
// BPM Intelligence — interface labels (ZH-only)
//   The UI renders in Traditional Chinese. There is no language switch.
//   Bilingual labels you see (e.g. 投資組合 · Portfolios, 您的分析師 · Your analyst)
//   are intentionally baked into the ZH strings themselves.
//   API kept stable so existing data-i18n / t() / bpmI18nAdd(zh[, en]) calls keep
//   working — any English dictionary passed as a 2nd argument is simply ignored.
// ============================================================================
(function () {
  window.BPM_I18N = window.BPM_I18N || { zh: {} };

  window.bpmI18nAdd = function (zh) { Object.assign(window.BPM_I18N.zh, zh || {}); };
  window.bpmLang = function () { return 'zh'; };
  window.t = function (k) { var z = window.BPM_I18N.zh; return z[k] != null ? z[k] : k; };
  window.bpmSetLang = function () {};  // no-op (kept for compatibility)

  window.bpmApplyI18n = function (root) {
    var r = root || document;
    r.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = window.t(el.getAttribute('data-i18n')); });
    r.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', window.t(el.getAttribute('data-i18n-ph'))); });
    r.querySelectorAll('[data-i18n-title]').forEach(function (el) { el.setAttribute('title', window.t(el.getAttribute('data-i18n-title'))); });
    document.documentElement.setAttribute('lang', 'zh-Hant');
  };

  document.addEventListener('DOMContentLoaded', function () { window.bpmApplyI18n(document); });

  // ── Shared dictionary: shell + common controls (ZH; bilingual where intended) ──
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
  });
})();
