/* @ds-bundle: {"format":3,"namespace":"BPMDesignSystem_390812","components":[],"sourceHashes":{"case_studies/chen_family/deck-stage.js":"0c125b8b1e23","ui_kits/marketing/CapabilityGrid.jsx":"24c5ca99ac45","ui_kits/marketing/Coverage.jsx":"263e362c4f45","ui_kits/marketing/Footer.jsx":"1515d79166f2","ui_kits/marketing/Hero.jsx":"f96d540ddab0","ui_kits/marketing/NavBar.jsx":"3711f1105da2","ui_kits/marketing/StatStrip.jsx":"839aa092361b","ui_kits/web_app/AssetDetailDrawer.jsx":"55b2086770bd","ui_kits/web_app/AssetTable.jsx":"ad5df4cbce5b","ui_kits/web_app/Composer.jsx":"b3562c5d538a","ui_kits/web_app/KPIStrip.jsx":"075f8004d172","ui_kits/web_app/PortfolioMap.jsx":"af3099cf8a0f","ui_kits/web_app/Sidebar.jsx":"7eaae29b880e","ui_kits/web_app/TopBar.jsx":"e514b33cdf15"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BPMDesignSystem_390812 = window.BPMDesignSystem_390812 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// case_studies/chen_family/deck-stage.js
try { (() => {
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *      On touch devices, tapping the left/right half of the stage goes
 *      prev/next — taps on links, buttons and other interactive slide
 *      content are left alone.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *  (g) thumbnail rail — resizable left-hand column of per-slide thumbnails
 *      (static clones). Click to navigate; ↑/↓ with a thumbnail focused to
 *      step between slides; drag to reorder; right-click for
 *      Skip / Move up / Move down / Delete (opens a Cancel/Delete confirm
 *      dialog). Drag the rail's right edge to resize; width persists to
 *      localStorage. Skipped slides carry `data-deck-skip`, are dimmed in
 *      the rail, omitted from prev/next navigation, and hidden at print.
 *      The rail is suppressed in presenting mode, in the host's Preview
 *      mode (ViewerMode='none'), on `noscale`, on narrow viewports
 *      (≤640px), and via the `no-rail` attribute. Rail mutations dispatch
 *      a `deckchange`
 *      CustomEvent on the element: detail = {action, from, to, slide}.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <style>deck-stage:not(:defined){visibility:hidden}</style>
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *   <script src="deck-stage.js"></script>
 *
 * The :not(:defined) rule prevents a flash of the first slide at its
 * authored styles before this script runs and attaches the shadow root.
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const FINE_POINTER_MQ = matchMedia('(hover: hover) and (pointer: fine)');
  const NARROW_MQ = matchMedia('(max-width: 640px)');
  // Slide-authored controls that should keep a tap instead of it navigating.
  const INTERACTIVE_SEL = 'a[href], button, input, select, textarea, summary, label, video[controls], audio[controls], [role="button"], [onclick], [tabindex]:not([tabindex^="-"]), [contenteditable]:not([contenteditable="false" i])';
  const pad2 = n => String(n).padStart(2, '0');

  // Label precedence: data-label → data-screen-label (number stripped) → first heading → "Slide".
  const getSlideLabel = el => {
    const explicit = el.getAttribute('data-label');
    if (explicit) return explicit;
    const existing = el.getAttribute('data-screen-label');
    if (existing) return existing.replace(/^\s*\d+\s*/, '').trim() || existing;
    const h = el.querySelector('h1, h2, h3, [data-title]');
    const t = h && (h.textContent || '').trim().slice(0, 40);
    if (t) return t;
    return 'Slide';
  };
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }
    /* connectedCallback holds this until document.fonts.ready (capped 2s) so
     * the first visible paint has the deck's real typography + final rail
     * layout. opacity (not visibility) so the active slide can't un-hide
     * itself via the ::slotted([data-deck-active]) visibility:visible rule.
     * Only the stage/rail hide — the black :host background stays, so the
     * iframe doesn't flash the page's default white. */
    :host([data-fonts-pending]) .stage,
    :host([data-fonts-pending]) .rail { opacity: 0; pointer-events: none; }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Thumbnail rail ──────────────────────────────────────────────────
       Fixed column on the left; each thumbnail is a static deep-clone of
       the light-DOM slide scaled into a 16:9 (or design-aspect) frame. The
       stage re-fits around it (see _fit); hidden during present / noscale
       / print so capture geometry and fullscreen output are unchanged. */
    .rail {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--deck-rail-w, 188px);
      background: #141414;
      border-right: 1px solid rgba(255,255,255,0.08);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 2147482500;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.18) transparent;
    }
    .rail::-webkit-scrollbar { width: 8px; }
    .rail::-webkit-scrollbar-track { background: transparent; margin: 2px; }
    .rail::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.18);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    .rail::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.28);
      border: 2px solid transparent;
      background-clip: content-box;
    }
    :host([no-rail]) .rail,
    :host([noscale]) .rail { display: none; }
    .rail[data-presenting] { display: none; }
    @media (max-width: 640px) {
      .rail, .rail-resize { display: none; }
    }
    /* User-driven show/hide (the TweaksPanel toggle) slides instead of
       popping. Transitions are gated on :host([data-rail-anim]) — set only
       for the 200ms around the toggle — so window-resize and rail-width
       drag (which also call _fit) don't lag behind the cursor. */
    .rail[data-user-hidden] { transform: translateX(-100%); }
    :host([data-rail-anim]) .rail { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .stage { transition: left 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .canvas { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    /* transition shorthand replaces rather than merges — repeat the base
       .overlay opacity/transform/filter transitions so visibility changes
       during the 200ms toggle window still fade instead of popping. */
    :host([data-rail-anim]) .overlay {
      transition: margin-left 200ms cubic-bezier(.3,.7,.4,1),
                  opacity 260ms ease,
                  transform 260ms cubic-bezier(.2,.8,.2,1),
                  filter 260ms ease;
    }

    .thumb {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .thumb .num {
      width: 16px;
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 500;
      text-align: right;
      color: rgba(255,255,255,0.55);
      padding-top: 2px;
      font-variant-numeric: tabular-nums;
    }
    .thumb .frame {
      position: relative;
      flex: 1;
      min-width: 0;
      aspect-ratio: var(--deck-aspect);
      background: #fff;
      border-radius: 4px;
      outline: 2px solid transparent;
      outline-offset: 0;
      overflow: hidden;
      transition: outline-color 120ms ease;
    }
    .thumb:hover .frame { outline-color: rgba(255,255,255,0.25); }
    .thumb { outline: none; }
    .thumb:focus-visible .frame { outline-color: rgba(255,255,255,0.5); }
    .thumb[data-current] .num { color: #fff; }
    .thumb[data-current] .frame { outline-color: #D97757; }
    .thumb[data-dragging] { opacity: 0.35; }
    .thumb::before {
      content: '';
      position: absolute;
      left: 24px;
      right: 0;
      height: 3px;
      border-radius: 2px;
      background: #D97757;
      opacity: 0;
      pointer-events: none;
    }
    .thumb[data-drop="before"]::before { top: -8px; opacity: 1; }
    .thumb[data-drop="after"]::before { bottom: -8px; opacity: 1; }
    .thumb[data-skip] .frame { opacity: 0.35; }
    .thumb[data-skip] .frame::after {
      content: 'Skipped';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.45);
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .ctxmenu {
      position: fixed;
      min-width: 150px;
      padding: 4px;
      background: #242424;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 7px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      z-index: 2147483100;
      display: none;
      font-size: 12px;
    }
    .ctxmenu[data-open] { display: block; }
    .ctxmenu button {
      display: block;
      width: 100%;
      appearance: none;
      border: 0;
      background: transparent;
      color: #e8e8e8;
      font: inherit;
      text-align: left;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .ctxmenu button:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
    .ctxmenu button:disabled { opacity: 0.35; cursor: default; }
    .ctxmenu hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 4px 2px;
    }

    .rail-resize {
      position: fixed;
      left: calc(var(--deck-rail-w, 188px) - 3px);
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: col-resize;
      z-index: 2147482600;
      touch-action: none;
    }
    .rail-resize:hover,
    .rail-resize[data-dragging] { background: rgba(255,255,255,0.12); }
    :host([no-rail]) .rail-resize,
    :host([noscale]) .rail-resize,
    .rail[data-presenting] + .rail-resize,
    .rail[data-user-hidden] + .rail-resize { display: none; }

    /* Delete-confirm popup — matches the SPA's ConfirmDialog layout
       (title + message body, depressed footer with Cancel / Delete). */
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 2147483200;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .confirm-backdrop[data-open] { display: flex; }
    .confirm {
      width: 320px;
      max-width: calc(100vw - 32px);
      background: #2a2a2a;
      color: #e8e8e8;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: inherit;
      animation: deck-confirm-in 0.18s ease;
    }
    @keyframes deck-confirm-in {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .confirm .body { padding: 20px 20px 16px; }
    .confirm .title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .confirm .msg { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.65); }
    .confirm .footer {
      padding: 14px 20px;
      background: #1f1f1f;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .confirm button {
      appearance: none;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
    }
    .confirm .cancel {
      background: transparent;
      border: 0;
      color: rgba(255,255,255,0.8);
    }
    .confirm .cancel:hover { background: rgba(255,255,255,0.08); }
    .confirm .danger {
      background: #c96442;
      border: 1px solid rgba(0,0,0,0.15);
      color: #fff;
      box-shadow: 0 1px 3px rgba(166,50,68,0.3), 0 2px 6px rgba(166,50,68,0.18);
    }
    .confirm .danger:hover { background: #b5563a; }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      /* :last-child alone isn't enough once data-deck-skip hides the
         trailing slide(s) — the last *visible* slide still carries
         break-after:page and prints a blank sheet. _markLastVisible()
         maintains data-deck-last-visible on the last non-skipped slide. */
      ::slotted(*:last-child),
      ::slotted([data-deck-last-visible]) {
        break-after: auto;
        page-break-after: auto;
      }
      ::slotted([data-deck-skip]) { display: none !important; }
      .overlay, .rail, .rail-resize, .ctxmenu, .confirm-backdrop { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale', 'no-rail'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._menuIndex = -1;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTap = this._onTap.bind(this);
      this._onMessage = this._onMessage.bind(this);
      // Capture-phase close so a click anywhere dismisses the menu, but
      // ignore clicks that land inside the menu itself — otherwise the
      // capture handler runs before the menu's own (bubble) handler and
      // clears _menuIndex out from under it.
      this._onDocClick = e => {
        if (this._menu && e.composedPath && e.composedPath().includes(this._menu)) return;
        this._closeMenu();
      };
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      // Presenter-view popup loads deckUrl?_snthumb=...#N for its prev/cur/
      // next thumbnails — the rail has no business rendering inside those
      // (wrong scale, and it offsets the stage so the thumb shows a gutter).
      if (/[?&]_snthumb=/.test(location.search)) this.setAttribute('no-rail', '');
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      window.addEventListener('message', this._onMessage);
      window.addEventListener('click', this._onDocClick, true);
      this.addEventListener('click', this._onTap);
      // Initial collection + layout happens via slotchange, which fires on mount.
      this._enableRail();
      // Hold the stage hidden until webfonts are ready so the first visible
      // paint has the deck's real typography — the :not(:defined) guard in
      // the page HTML only covers custom-element upgrade, not font load.
      // Capped so a 404'd font URL can't blank the deck indefinitely.
      this.setAttribute('data-fonts-pending', '');
      const reveal = () => this.removeAttribute('data-fonts-pending');
      // rAF first: fonts.ready is a pre-resolved promise until layout has
      // resolved the slotted text's font-family and pushed a FontFace into
      // 'loading'. Reading it here in connectedCallback (parse-time) would
      // settle the race in a microtask before any font fetch starts.
      requestAnimationFrame(() => {
        Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2000))]).then(reveal, reveal);
      });
    }
    _enableRail() {
      // Idempotent — older host builds still post __omelette_rail_enabled.
      // no-rail guard keeps the observers/stylesheet walk off the cheap path
      // for presenter-popup thumbnail iframes (up to 9 per view).
      if (this._railEnabled || this.hasAttribute('no-rail')) return;
      this._railEnabled = true;
      // Per-viewer preference — restored alongside rail width. Default on;
      // only a stored '0' (from the TweaksPanel toggle) hides it.
      this._railVisible = true;
      try {
        if (localStorage.getItem('deck-stage.railVisible') === '0') this._railVisible = false;
      } catch (e) {}
      // Live thumbnail updates: watch the light-DOM slides for content
      // edits and re-clone just the affected thumb(s), debounced. Ignore
      // the data-deck-* / data-screen-label / data-om-validate attributes
      // this component itself writes so nav and skip don't trigger
      // spurious refreshes.
      const OWN_ATTRS = /^data-(deck-|screen-label$|om-validate$)/;
      this._liveDirty = new Set();
      this._liveObserver = new MutationObserver(records => {
        for (const r of records) {
          if (r.type === 'attributes' && OWN_ATTRS.test(r.attributeName || '')) continue;
          let n = r.target;
          while (n && n.parentElement !== this) n = n.parentElement;
          if (n && this._slideSet && this._slideSet.has(n)) this._liveDirty.add(n);
        }
        if (this._liveDirty.size && !this._liveTimer) {
          this._liveTimer = setTimeout(() => {
            this._liveTimer = null;
            this._liveDirty.forEach(s => this._refreshThumb(s));
            this._liveDirty.clear();
          }, 200);
        }
      });
      this._liveObserver.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      // Lazy thumbnail materialization — clone the slide only when its
      // frame scrolls into (or near) the rail viewport. rootMargin gives
      // ~4 thumbs of pre-load so fast scrolling doesn't flash blanks.
      this._railObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.target.__deckThumb) {
            this._materialize(e.target.__deckThumb);
          }
        });
      }, {
        root: this._rail,
        rootMargin: '400px 0px'
      });
      // Tweaks typically change CSS vars / attrs OUTSIDE <deck-stage>
      // (on <html>, <body>, a wrapper div, or a <style> tag), which
      // _liveObserver can't see. Re-snapshot author CSS (constructable
      // sheet is shared by reference, so one replaceSync updates every
      // thumb shadow root) and re-sync each thumb host's attrs + custom
      // properties. In-slide DOM mutations are _liveObserver's job.
      // Debounced so slider drags don't thrash.
      this._onTweakChange = () => {
        clearTimeout(this._tweakTimer);
        this._tweakTimer = setTimeout(() => {
          this._snapshotAuthorCss();
          // One getComputedStyle for the whole batch — each
          // getPropertyValue read below reuses the same computed style
          // as long as nothing invalidates layout between thumbs.
          const cs = getComputedStyle(this);
          (this._thumbs || []).forEach(t => {
            if (t.host) this._syncThumbHostAttrs(t.host, cs);
          });
        }, 120);
      };
      window.addEventListener('tweakchange', this._onTweakChange);
      this._snapshotAuthorCss();
      // Build the rail now that it's enabled — slotchange already fired,
      // so _renderRail's early-return skipped the initial build.
      this._syncRailHidden();
      this._renderRail();
      this._fit();
    }

    /** Snapshot document stylesheets into a constructable sheet that each
     *  thumbnail's nested shadow root adopts — so author CSS styles the
     *  cloned slide content without touching this component's chrome.
     *  Cross-origin sheets throw on .cssRules — skip them. Re-callable:
     *  the existing constructable sheet is reused via replaceSync so every
     *  already-adopted shadow root picks up the fresh CSS without re-adopt. */
    _snapshotAuthorCss() {
      // :root in an adopted sheet inside a shadow root matches nothing
      // (only the document root qualifies), so author rules like
      // `:root[data-voice="modern"] .serif` never reach the clones.
      // Rewrite :root → :host and mirror <html>'s data-*/class/lang onto
      // each thumb host (see _syncThumbHostAttrs) so the same selectors
      // match inside the thumbnail's shadow tree.
      const authorCss = Array.from(document.styleSheets).map(sh => {
        try {
          return Array.from(sh.cssRules).map(r => r.cssText).join('\n');
        } catch (e) {
          return '';
        }
      }).join('\n')
      // The shadow host is featureless outside the functional :host(...)
      // form, so any compound on :root — [attr], .class, #id, :pseudo —
      // must become :host(<compound>) not :host<compound>. Same for the
      // html type selector (Tailwind class-strategy dark mode emits
      // html.dark; Pico uses html[data-theme]), which has nothing to
      // match inside the thumb's shadow tree.
      .replace(/:root((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)/g, ':host($1)').replace(/:root\b/g, ':host').replace(/(^|[\s,>~+(}])html((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)(?![-\w])/g, '$1:host($2)').replace(/(^|[\s,>~+(}])html(?![-\w])/g, '$1:host');
      // Every custom property the author references. _syncThumbHostAttrs
      // mirrors each one's *computed* value at <deck-stage> onto the
      // thumb host so the live value wins over the :host default above
      // regardless of which ancestor the tweak wrote to (<html>, <body>,
      // a wrapper div, or the deck-stage element itself all inherit
      // down to getComputedStyle(this)).
      this._authorVars = new Set(authorCss.match(/--[\w-]+/g) || []);
      try {
        if (!this._adoptedSheet) this._adoptedSheet = new CSSStyleSheet();
        this._adoptedSheet.replaceSync(authorCss);
      } catch (e) {
        this._adoptedSheet = null;
        this._authorCss = authorCss;
      }
    }
    _syncThumbHostAttrs(host, cs) {
      const de = document.documentElement;
      // setAttribute overwrites but can't delete — an attr removed from
      // <html> (toggleAttribute off, classList emptied) would linger on
      // the host and :host([data-*]) / :host(.foo) rules would keep
      // matching. Remove stale mirrored attrs first; iterate backward
      // because removeAttribute mutates the live NamedNodeMap.
      for (let i = host.attributes.length - 1; i >= 0; i--) {
        const n = host.attributes[i].name;
        if ((n.startsWith('data-') || n === 'class' || n === 'lang') && !de.hasAttribute(n)) {
          host.removeAttribute(n);
        }
      }
      for (const a of de.attributes) {
        if (a.name.startsWith('data-') || a.name === 'class' || a.name === 'lang') {
          host.setAttribute(a.name, a.value);
        }
      }
      // The :root→:host rewrite in _snapshotAuthorCss pins each custom
      // property to its stylesheet default on the thumb host, shadowing
      // the live value that would otherwise inherit. Tweaks can write the
      // live value on any ancestor — <html>, <body>, a wrapper div, the
      // deck-stage element — so read it as the *computed* value at
      // <deck-stage> (which sees the whole inheritance chain) rather than
      // trying to guess which element the author wrote to. Inline on the
      // host beats the :host{} rule. remove-stale covers vars dropped
      // from the stylesheet between snapshots.
      const vars = this._authorVars || new Set();
      for (let i = host.style.length - 1; i >= 0; i--) {
        const p = host.style[i];
        if (p.startsWith('--') && !vars.has(p)) host.style.removeProperty(p);
      }
      const live = cs || getComputedStyle(this);
      vars.forEach(p => {
        const v = live.getPropertyValue(p);
        if (v) host.style.setProperty(p, v.trim());else host.style.removeProperty(p);
      });
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('message', this._onMessage);
      window.removeEventListener('click', this._onDocClick, true);
      this.removeEventListener('click', this._onTap);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
      if (this._liveTimer) clearTimeout(this._liveTimer);
      if (this._tweakTimer) clearTimeout(this._tweakTimer);
      if (this._railAnimTimer) clearTimeout(this._railAnimTimer);
      if (this._scaleRaf) cancelAnimationFrame(this._scaleRaf);
      if (this._liveObserver) this._liveObserver.disconnect();
      if (this._railObserver) this._railObserver.disconnect();
      if (this._onTweakChange) window.removeEventListener('tweakchange', this._onTweakChange);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        if (this._rail) {
          this._rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
        }
        this._fit();
        this._scaleThumbs();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-omelette-chrome', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._advance(-1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._advance(1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));

      // Thumbnail rail + context menu. Thumbnails are populated in
      // _renderRail() after _collectSlides().
      const rail = document.createElement('div');
      rail.className = 'rail export-hidden';
      rail.setAttribute('data-omelette-chrome', '');
      rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
      // Edge auto-scroll while dragging a thumb near the rail's top/bottom
      // so off-screen drop targets are reachable. Native dragover fires
      // continuously while the pointer is stationary, so a per-event nudge
      // (ramped by edge proximity) is enough — no rAF loop needed.
      rail.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        const r = rail.getBoundingClientRect();
        const EDGE = 40;
        const dt = e.clientY - r.top;
        const db = r.bottom - e.clientY;
        if (dt < EDGE) rail.scrollTop -= Math.ceil((EDGE - dt) / 3);else if (db < EDGE) rail.scrollTop += Math.ceil((EDGE - db) / 3);
      });
      const menu = document.createElement('div');
      menu.className = 'ctxmenu export-hidden';
      menu.setAttribute('data-omelette-chrome', '');
      menu.innerHTML = `
        <button type="button" data-act="skip">Skip slide</button>
        <button type="button" data-act="up">Move up</button>
        <button type="button" data-act="down">Move down</button>
        <hr>
        <button type="button" data-act="delete">Delete slide</button>
      `;
      menu.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        const i = this._menuIndex;
        this._closeMenu();
        if (act === 'skip') this._toggleSkip(i);else if (act === 'up') this._moveSlide(i, i - 1);else if (act === 'down') this._moveSlide(i, i + 1);else if (act === 'delete') this._openConfirm(i);
      });
      menu.addEventListener('contextmenu', e => e.preventDefault());

      // Rail resize handle — drag to set --deck-rail-w, persisted to
      // localStorage so the width survives reloads.
      const resize = document.createElement('div');
      resize.className = 'rail-resize export-hidden';
      resize.setAttribute('data-omelette-chrome', '');
      resize.addEventListener('pointerdown', e => {
        e.preventDefault();
        resize.setPointerCapture(e.pointerId);
        resize.setAttribute('data-dragging', '');
        const move = ev => this._setRailWidth(ev.clientX);
        const up = () => {
          resize.removeEventListener('pointermove', move);
          resize.removeEventListener('pointerup', up);
          resize.removeEventListener('pointercancel', up);
          resize.removeAttribute('data-dragging');
          try {
            localStorage.setItem('deck-stage.railWidth', String(this._railPx));
          } catch (err) {}
        };
        resize.addEventListener('pointermove', move);
        resize.addEventListener('pointerup', up);
        resize.addEventListener('pointercancel', up);
      });

      // Delete-confirm dialog — mirrors the SPA's ConfirmDialog layout.
      const confirm = document.createElement('div');
      confirm.className = 'confirm-backdrop export-hidden';
      confirm.setAttribute('data-omelette-chrome', '');
      confirm.innerHTML = `
        <div class="confirm" role="dialog" aria-modal="true">
          <div class="body">
            <div class="title">Delete slide?</div>
            <div class="msg">This slide will be removed from the deck.</div>
          </div>
          <div class="footer">
            <button type="button" class="cancel">Cancel</button>
            <button type="button" class="danger">Delete</button>
          </div>
        </div>
      `;
      confirm.addEventListener('click', e => {
        if (e.target === confirm) this._closeConfirm();
      });
      confirm.querySelector('.cancel').addEventListener('click', () => this._closeConfirm());
      confirm.querySelector('.danger').addEventListener('click', () => {
        const i = this._confirmIndex;
        this._closeConfirm();
        this._deleteSlide(i);
      });
      this._root.append(style, rail, resize, stage, overlay, menu, confirm);
      this._canvas = canvas;
      this._stage = stage;
      this._slot = slot;
      this._overlay = overlay;
      this._rail = rail;
      this._resize = resize;
      this._menu = menu;
      this._confirm = confirm;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');

      // Restore persisted rail width.
      let rw = 188;
      try {
        const s = localStorage.getItem('deck-stage.railWidth');
        if (s) rw = parseInt(s, 10) || rw;
      } catch (err) {}
      this._setRailWidth(rw);
      this._syncRailHidden();
    }
    _setRailWidth(px) {
      const w = Math.max(120, Math.min(360, Math.round(px)));
      this._railPx = w;
      this.style.setProperty('--deck-rail-w', w + 'px');
      this._fit();
      // _scaleThumbs forces a sync layout (frame.offsetWidth) then writes
      // N transforms. During a resize drag this runs per-pointermove;
      // coalesce to one per frame.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    }
    _onSlotChange() {
      // Rail mutations (delete/move) already reconcile synchronously and
      // emit slidechange with reason 'api'; skip the async slotchange that
      // would otherwise re-broadcast with reason 'init'.
      if (this._squelchSlotChange) {
        this._squelchSlotChange = false;
        return;
      }
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slideSet = new Set(this._slides);
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        slide.setAttribute('data-screen-label', `${pad2(n)} ${getSlideLabel(slide)}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
      this._markLastVisible();
      this._renderRail();
    }

    /** Tag the last non-skipped slide so print CSS can drop its
     *  break-after (see the @media print comment above — :last-child
     *  alone matches a hidden skipped slide). */
    _markLastVisible() {
      let last = null;
      this._slides.forEach(s => {
        s.removeAttribute('data-deck-last-visible');
        if (!s.hasAttribute('data-deck-skip')) last = s;
      });
      if (last) last.setAttribute('data-deck-last-visible', '');
    }
    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) {
        this._notes = [];
        return;
      }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      // Follow-scroll on every navigation (init deep-link, keyboard, click,
      // tap, external goTo) — the only time we *don't* want the rail to
      // track current is after a rail-internal mutation, where _renderRail
      // has already restored the user's scroll position and yanking back to
      // current would undo it.
      this._syncRail(reason !== 'mutation');
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr,
            deckTotal: this._slides.length,
            deckSkipped: this._skippedIndices()
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      // Host posts __omelette_presenting while in fullscreen/tab presentation
      // mode — suppress the nav footer entirely (both hover and slide-change
      // flash) so the audience sees clean slides.
      if (!this._overlay || this._presenting) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _railWidth() {
      // State-based, no offsetWidth: the first _fit() can run before the
      // rail has had layout on some load paths, and a 0 there paints the
      // slide full-width for one frame before the post-slotchange _fit()
      // corrects it.
      if (!this._railEnabled || !this._railVisible || this.hasAttribute('no-rail') || this.hasAttribute('noscale') || this._presenting || this._previewMode || NARROW_MQ.matches) return 0;
      return this._railPx || 0;
    }
    _fit() {
      if (!this._canvas) return;
      const stage = this._canvas.parentElement;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        if (stage) stage.style.left = '0';
        if (this._overlay) this._overlay.style.marginLeft = '0';
        return;
      }
      const rw = this._railWidth();
      if (stage) stage.style.left = rw + 'px';
      // Overlay is centred on the viewport via left:50% + translate(-50%);
      // marginLeft shifts the centre by rw/2 so it lands in the middle of
      // the [rw, innerWidth] stage region.
      if (this._overlay) this._overlay.style.marginLeft = rw / 2 + 'px';
      const vw = window.innerWidth - rw;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
      // Crossing the narrow-viewport breakpoint reveals the rail — rerun the
      // thumbnail scale the same way _setRailWidth does.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onMessage(e) {
      const d = e.data;
      if (d && typeof d.__omelette_presenting === 'boolean') {
        this._presenting = d.__omelette_presenting;
        if (this._presenting && this._overlay) {
          this._overlay.removeAttribute('data-visible');
          if (this._hideTimer) clearTimeout(this._hideTimer);
        }
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Host's Preview segment (ViewerMode='none'): the rail's drag-reorder /
      // right-click skip-delete affordances are editing chrome, so hide it
      // while the user is just looking at the deck. Same hard-hide path as
      // presenting; independent of the user's _railVisible preference so
      // returning to Edit restores whatever they had.
      if (d && typeof d.__omelette_preview_mode === 'boolean') {
        if (d.__omelette_preview_mode === this._previewMode) return;
        this._previewMode = d.__omelette_preview_mode;
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Per-viewer show/hide, driven by the TweaksPanel's auto-injected
      // "Thumbnail rail" toggle (or any author script). Independent of
      // whether the Tweaks panel itself is open — closing the panel
      // doesn't change rail visibility. Persists alongside rail width.
      if (d && d.type === '__deck_rail_visible' && typeof d.on === 'boolean') {
        if (d.on === this._railVisible) return;
        this._railVisible = d.on;
        try {
          localStorage.setItem('deck-stage.railVisible', d.on ? '1' : '0');
        } catch (e) {}
        // Arm the transition, commit it, then flip state — otherwise the
        // browser coalesces both writes and nothing animates on show.
        this.setAttribute('data-rail-anim', '');
        void (this._rail && this._rail.offsetHeight);
        this._syncRailHidden();
        this._fit();
        this._scaleThumbs();
        clearTimeout(this._railAnimTimer);
        this._railAnimTimer = setTimeout(() => this.removeAttribute('data-rail-anim'), 220);
      }
      if (d && d.type === '__omelette_rail_enabled') this._enableRail();
    }
    _syncRailHidden() {
      if (!this._rail) return;
      // data-presenting is the hard hide (display:none) for flag-off,
      // presentation mode, and the host's Preview segment — instant, no
      // transition. data-user-hidden is the soft hide (translateX(-100%))
      // for the viewer's rail toggle, so show/hide slides under
      // :host([data-rail-anim]).
      const hard = !this._railEnabled || this._presenting || this._previewMode;
      if (hard) this._rail.setAttribute('data-presenting', '');else this._rail.removeAttribute('data-presenting');
      if (!this._railVisible) this._rail.setAttribute('data-user-hidden', '');else this._rail.removeAttribute('data-user-hidden');
      // translateX hide leaves thumbs (tabIndex=0) in the tab order —
      // inert keeps them unfocusable while the rail is off-screen.
      this._rail.inert = hard || !this._railVisible;
    }
    _onTap(e) {
      // Touch-only — keyboard + the overlay toolbar cover nav on desktop.
      if (FINE_POINTER_MQ.matches) return;
      // Only taps that land on the stage (slide content or letterbox); the
      // overlay / rail / menus are siblings with their own click handlers.
      const path = e.composedPath();
      if (!this._stage || !path.includes(this._stage)) return;
      // Let interactive slide content keep the tap. composedPath (not
      // e.target.closest) so we see through open shadow roots — a <button>
      // inside a slide-authored custom element retargets e.target to the
      // host but still appears in the composed path.
      if (e.defaultPrevented) return;
      for (const n of path) {
        if (n === this._stage) break;
        if (n.matches && n.matches(INTERACTIVE_SEL)) return;
      }
      e.preventDefault();
      const rw = this._railWidth();
      const mid = rw + (window.innerWidth - rw) / 2;
      this._advance(e.clientX < mid ? -1 : 1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      // Confirm dialog swallows nav keys while open; Escape cancels. Enter
      // is left to the focused button's native activation so Tab→Cancel
      // →Enter activates Cancel, not the window-level confirm path.
      if (this._confirm && this._confirm.hasAttribute('data-open')) {
        if (e.key === 'Escape') {
          this._closeConfirm();
          e.preventDefault();
        }
        return;
      }
      if (e.key === 'Escape' && this._menu && this._menu.hasAttribute('data-open')) {
        this._closeMenu();
        e.preventDefault();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._advance(1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._advance(-1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    /** Step forward/back skipping any slide marked data-deck-skip. Falls
     *  back to _go's clamp-at-ends behaviour (flash overlay) when there's
     *  nothing further in that direction. */
    _advance(dir, reason) {
      if (!this._slides.length) return;
      let i = this._index + dir;
      while (i >= 0 && i < this._slides.length && this._slides[i].hasAttribute('data-deck-skip')) {
        i += dir;
      }
      if (i < 0 || i >= this._slides.length) {
        this._flashOverlay();
        return;
      }
      this._go(i, reason);
    }

    // ── Thumbnail rail ────────────────────────────────────────────────────
    //
    // Thumbs are keyed by slide element and reused across _renderRail()
    // calls, so a reorder/delete is an O(changed) DOM shuffle instead of an
    // O(N) teardown-and-re-clone. Each thumb starts as a lightweight shell
    // (num + empty frame); the clone is materialized lazily by an
    // IntersectionObserver when the frame scrolls into (or near) view, so
    // only visible-ish slides pay the clone + image-decode cost.

    _renderRail() {
      if (!this._rail || !this._railEnabled) {
        this._thumbs = [];
        return;
      }
      // FLIP: record each *materialized* thumb's top before the reconcile.
      // Off-screen (non-materialized) thumbs don't need the animation and
      // skipping their getBoundingClientRect saves a forced layout per
      // off-screen thumb on large decks.
      const prevTops = new Map();
      (this._thumbs || []).forEach(({
        thumb,
        slide,
        host
      }) => {
        if (host) prevTops.set(slide, thumb.getBoundingClientRect().top);
      });
      const st = this._rail.scrollTop;

      // Reconcile: reuse thumbs that already exist for a slide, create
      // shells for new slides, drop thumbs for removed slides.
      const bySlide = new Map();
      (this._thumbs || []).forEach(t => bySlide.set(t.slide, t));
      const next = [];
      this._slides.forEach(slide => {
        let t = bySlide.get(slide);
        if (t) bySlide.delete(slide);else t = this._makeThumb(slide);
        next.push(t);
      });
      // Orphans — slides removed since last render.
      bySlide.forEach(t => {
        if (this._railObserver) this._railObserver.unobserve(t.frame);
        t.thumb.remove();
      });
      // Put thumbs into document order to match _slides. insertBefore on
      // an already-correctly-placed node is a no-op, so this is cheap
      // when nothing moved.
      next.forEach((t, i) => {
        const want = t.thumb;
        const at = this._rail.children[i];
        if (at !== want) this._rail.insertBefore(want, at || null);
        t.i = i;
        t.num.textContent = String(i + 1);
        if (t.slide.hasAttribute('data-deck-skip')) t.thumb.setAttribute('data-skip', '');else t.thumb.removeAttribute('data-skip');
      });
      this._thumbs = next;
      this._rail.scrollTop = st;
      if (prevTops.size) {
        const moved = [];
        this._thumbs.forEach(({
          thumb,
          slide
        }) => {
          const old = prevTops.get(slide);
          if (old == null) return;
          const dy = old - thumb.getBoundingClientRect().top;
          if (Math.abs(dy) < 1) return;
          thumb.style.transition = 'none';
          thumb.style.transform = `translateY(${dy}px)`;
          moved.push(thumb);
        });
        if (moved.length) {
          // Commit the inverted positions before flipping the transition
          // on — otherwise the browser coalesces both style writes and
          // nothing animates.
          void this._rail.offsetHeight;
          moved.forEach(t => {
            t.style.transition = 'transform 180ms cubic-bezier(.2,.7,.3,1)';
            t.style.transform = '';
          });
          setTimeout(() => moved.forEach(t => {
            t.style.transition = '';
          }), 220);
        }
      }
      requestAnimationFrame(() => this._scaleThumbs());
      this._syncRail(false);
    }

    /** Create a lightweight thumb shell for one slide. The clone is
     *  materialized later by the IntersectionObserver. Event handlers
     *  look up the thumb's *current* index (via _thumbs.indexOf) so the
     *  same element can be reused across reorders. */
    _makeThumb(slide) {
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      thumb.tabIndex = 0;
      const num = document.createElement('div');
      num.className = 'num';
      const frame = document.createElement('div');
      frame.className = 'frame';
      thumb.append(num, frame);
      const entry = {
        thumb,
        num,
        frame,
        slide,
        clone: null,
        host: null,
        i: -1
      };
      // entry.i is refreshed on every _renderRail reconcile pass, so
      // handlers read the thumb's current position without an O(N) scan.
      const idx = () => entry.i;
      thumb.addEventListener('click', () => this._go(idx(), 'click'));
      // ↑/↓ step through the rail when a thumb has focus. _go clamps at the
      // ends and _applyIndex→_syncRail scrolls the new current thumb into
      // view; we move focus to it (preventScroll — _syncRail already
      // scrolled) so a held key walks the whole list. stopPropagation keeps
      // this out of the window-level _onKey nav handler.
      thumb.addEventListener('keydown', e => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        this._go(idx() + (e.key === 'ArrowDown' ? 1 : -1), 'keyboard');
        const cur = this._thumbs && this._thumbs[this._index];
        if (cur) cur.thumb.focus({
          preventScroll: true
        });
      });
      thumb.addEventListener('contextmenu', e => {
        e.preventDefault();
        this._openMenu(idx(), e.clientX, e.clientY);
      });
      thumb.draggable = true;
      thumb.addEventListener('dragstart', e => {
        this._dragFrom = idx();
        thumb.setAttribute('data-dragging', '');
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', String(this._dragFrom));
        } catch (err) {}
      });
      thumb.addEventListener('dragend', () => {
        thumb.removeAttribute('data-dragging');
        this._clearDrop();
        this._dragFrom = null;
      });
      thumb.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const r = thumb.getBoundingClientRect();
        this._setDrop(idx(), e.clientY < r.top + r.height / 2 ? 'before' : 'after');
      });
      thumb.addEventListener('drop', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        const i = idx();
        const r = thumb.getBoundingClientRect();
        let to = e.clientY >= r.top + r.height / 2 ? i + 1 : i;
        if (this._dragFrom < to) to--;
        const from = this._dragFrom;
        this._clearDrop();
        this._dragFrom = null;
        if (to !== from) this._moveSlide(from, to);
      });
      if (this._railObserver) this._railObserver.observe(frame);
      frame.__deckThumb = entry;
      return entry;
    }

    /** Lazily build the clone for a thumb that has scrolled into view. */
    _materialize(entry) {
      if (entry.host) return;
      const dw = this.designWidth,
        dh = this.designHeight;
      let clone = entry.slide.cloneNode(true);
      clone.removeAttribute('id');
      clone.removeAttribute('data-deck-active');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      // Neuter heavy media; replace <video> with its poster so the box
      // keeps a visual. <iframe>/<audio> become empty placeholders.
      clone.querySelectorAll('iframe, audio, object, embed').forEach(el => {
        el.removeAttribute('src');
        el.removeAttribute('srcdoc');
        el.removeAttribute('data');
        el.innerHTML = '';
      });
      clone.querySelectorAll('video').forEach(el => {
        if (!el.poster) {
          el.removeAttribute('src');
          el.innerHTML = '';
          return;
        }
        const img = document.createElement('img');
        img.src = el.poster;
        img.alt = '';
        img.style.cssText = el.style.cssText + ';object-fit:cover;width:100%;height:100%;';
        img.className = el.className;
        el.replaceWith(img);
      });
      // Images: defer decode and let the browser pick the smallest
      // srcset candidate for the ~140px thumb. Same-URL clones reuse the
      // slide's decoded bitmap (URL-keyed cache), so the remaining cost
      // is paint/composite — lazy+async keeps that off the main thread.
      clone.querySelectorAll('img').forEach(el => {
        el.loading = 'lazy';
        el.decoding = 'async';
        if (el.srcset) el.sizes = (this._railPx || 188) + 'px';
      });
      // Custom elements inside the slide would have their
      // connectedCallback fire when the clone is appended. Replace them
      // with inert boxes so a component-heavy deck doesn't run N copies
      // of each component's mount logic in the rail. Children are
      // preserved so layout-wrapper elements (<my-column><h2>…</h2>)
      // still show their authored content; the querySelectorAll NodeList
      // is static, so nested custom elements in the moved subtree are
      // still visited on later iterations.
      const neuter = el => {
        const box = document.createElement('div');
        box.style.cssText = (el.getAttribute('style') || '') + ';background:rgba(0,0,0,0.06);border:1px dashed rgba(0,0,0,0.15);';
        box.className = el.className;
        // Preserve theming/i18n hooks so [data-*] / :lang() / [dir]
        // descendant selectors still match the neutered root.
        for (const a of el.attributes) {
          const n = a.name;
          if (n.startsWith('data-') || n.startsWith('aria-') || n === 'lang' || n === 'dir' || n === 'role' || n === 'title') {
            box.setAttribute(n, a.value);
          }
        }
        while (el.firstChild) box.appendChild(el.firstChild);
        return box;
      };
      // querySelectorAll('*') returns descendants only — a custom-element
      // slide root (<my-slide>…</my-slide>) would slip through and upgrade
      // on append. Swap the root first.
      if (clone.tagName.includes('-')) clone = neuter(clone);
      clone.querySelectorAll('*').forEach(el => {
        if (el.tagName.includes('-')) el.replaceWith(neuter(el));
      });
      clone.style.cssText += ';position:absolute;top:0;left:0;transform-origin:0 0;' + 'pointer-events:none;width:' + dw + 'px;height:' + dh + 'px;' + 'box-sizing:border-box;overflow:hidden;visibility:visible;opacity:1;';
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;inset:0;';
      this._syncThumbHostAttrs(host);
      const sr = host.attachShadow({
        mode: 'open'
      });
      if (this._adoptedSheet) sr.adoptedStyleSheets = [this._adoptedSheet];else {
        const st = document.createElement('style');
        st.textContent = this._authorCss || '';
        sr.appendChild(st);
      }
      sr.appendChild(clone);
      entry.frame.appendChild(host);
      entry.host = host;
      entry.clone = clone;
      if (this._thumbScale) clone.style.transform = 'scale(' + this._thumbScale + ')';
      // Once materialized the IO callback is a no-op early-return —
      // unobserve so scroll doesn't keep firing it.
      if (this._railObserver) this._railObserver.unobserve(entry.frame);
    }

    /** Re-clone a single thumb (live-update path). No-op if the thumb
     *  hasn't been materialized yet — it'll pick up current content when
     *  it scrolls into view. */
    _refreshThumb(slide) {
      const entry = (this._thumbs || []).find(t => t.slide === slide);
      if (!entry || !entry.host) return;
      entry.host.remove();
      entry.host = entry.clone = null;
      this._materialize(entry);
    }
    _scaleThumbs() {
      if (!this._thumbs || !this._thumbs.length) return;
      // Every frame is the same width; if it reads 0 the rail is
      // display:none (noscale / no-rail / presenting / print) — leave the
      // clones as-is and re-run when the rail is revealed.
      const fw = this._thumbs[0].frame.offsetWidth;
      if (!fw) return;
      this._thumbScale = fw / this.designWidth;
      this._thumbs.forEach(({
        clone
      }) => {
        if (clone) clone.style.transform = 'scale(' + this._thumbScale + ')';
      });
    }
    _setDrop(i, where) {
      // dragover fires at pointer-event rate; touch only the previous
      // and new target rather than sweeping all N thumbs.
      const t = this._thumbs && this._thumbs[i];
      if (this._dropOn && this._dropOn !== t) {
        this._dropOn.thumb.removeAttribute('data-drop');
      }
      if (t) t.thumb.setAttribute('data-drop', where);
      this._dropOn = t || null;
    }
    _clearDrop() {
      if (this._dropOn) this._dropOn.thumb.removeAttribute('data-drop');
      this._dropOn = null;
    }
    _syncRail(follow) {
      if (!this._thumbs) return;
      this._thumbs.forEach(({
        thumb
      }, i) => {
        if (i === this._index) {
          thumb.setAttribute('data-current', '');
          if (follow && typeof thumb.scrollIntoView === 'function') {
            thumb.scrollIntoView({
              block: 'nearest'
            });
          }
        } else {
          thumb.removeAttribute('data-current');
        }
      });
    }
    _openMenu(i, x, y) {
      if (!this._menu) return;
      this._menuIndex = i;
      const slide = this._slides[i];
      const skip = slide && slide.hasAttribute('data-deck-skip');
      this._menu.querySelector('[data-act="skip"]').textContent = skip ? 'Unskip slide' : 'Skip slide';
      this._menu.querySelector('[data-act="up"]').disabled = i <= 0;
      this._menu.querySelector('[data-act="down"]').disabled = i >= this._slides.length - 1;
      this._menu.querySelector('[data-act="delete"]').disabled = this._slides.length <= 1;
      // Place, then clamp to viewport after it's measurable.
      this._menu.style.left = x + 'px';
      this._menu.style.top = y + 'px';
      this._menu.setAttribute('data-open', '');
      const r = this._menu.getBoundingClientRect();
      const nx = Math.min(x, window.innerWidth - r.width - 4);
      const ny = Math.min(y, window.innerHeight - r.height - 4);
      this._menu.style.left = Math.max(4, nx) + 'px';
      this._menu.style.top = Math.max(4, ny) + 'px';
    }
    _closeMenu() {
      if (this._menu) this._menu.removeAttribute('data-open');
      this._menuIndex = -1;
    }
    _openConfirm(i) {
      if (!this._confirm) return;
      this._confirmIndex = i;
      this._confirm.querySelector('.title').textContent = 'Delete slide ' + (i + 1) + '?';
      this._confirm.setAttribute('data-open', '');
      const btn = this._confirm.querySelector('.danger');
      if (btn && btn.focus) btn.focus();
    }
    _closeConfirm() {
      if (this._confirm) this._confirm.removeAttribute('data-open');
      this._confirmIndex = -1;
    }
    _emitDeckChange(detail) {
      this.dispatchEvent(new CustomEvent('deckchange', {
        detail,
        bubbles: true,
        composed: true
      }));
    }
    _deleteSlide(i) {
      const slide = this._slides[i];
      if (!slide || this._slides.length <= 1) return;
      const wasCurrent = i === this._index;
      if (i < this._index || wasCurrent && i === this._slides.length - 1) this._index--;
      this._squelchSlotChange = true;
      slide.remove();
      this._emitDeckChange({
        action: 'delete',
        from: i,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason: 'mutation'
      });
    }
    _toggleSkip(i) {
      const slide = this._slides[i];
      if (!slide) return;
      const on = !slide.hasAttribute('data-deck-skip');
      if (on) slide.setAttribute('data-deck-skip', '');else slide.removeAttribute('data-deck-skip');
      if (this._thumbs && this._thumbs[i]) {
        if (on) this._thumbs[i].thumb.setAttribute('data-skip', '');else this._thumbs[i].thumb.removeAttribute('data-skip');
      }
      this._markLastVisible();
      this._emitDeckChange({
        action: on ? 'skip' : 'unskip',
        from: i,
        slide
      });
      // Re-broadcast so the presenter popup's prev/next thumbnails re-pick
      // the nearest non-skipped slide without waiting for a nav event.
      try {
        window.postMessage({
          slideIndexChanged: this._index,
          deckTotal: this._slides.length,
          deckSkipped: this._skippedIndices()
        }, '*');
      } catch (e) {}
    }
    _skippedIndices() {
      const out = [];
      for (let i = 0; i < this._slides.length; i++) {
        if (this._slides[i].hasAttribute('data-deck-skip')) out.push(i);
      }
      return out;
    }
    _moveSlide(i, j) {
      if (j < 0 || j >= this._slides.length || j === i) return;
      const slide = this._slides[i];
      const ref = j < i ? this._slides[j] : this._slides[j].nextSibling;
      // Track the active slide across the reorder so the same content
      // stays on screen.
      const cur = this._index;
      if (cur === i) this._index = j;else if (i < cur && j >= cur) this._index = cur - 1;else if (i > cur && j <= cur) this._index = cur + 1;
      this._squelchSlotChange = true;
      this.insertBefore(slide, ref);
      this._emitDeckChange({
        action: 'move',
        from: i,
        to: j,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'mutation'
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._advance(1, 'api');
    }
    prev() {
      this._advance(-1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "case_studies/chen_family/deck-stage.js", error: String((e && e.message) || e) }); }

// ui_kits/marketing/CapabilityGrid.jsx
try { (() => {
/* CapabilityGrid.jsx — 3 × 2 capability blocks */

function CapabilityGrid({
  locale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  const items = [{
    n: "01",
    head_en: "Mark every quarter, defensibly",
    head_tc: "每季重新估值，且可被論證",
    body_en: "Every lease line, every comparable, every assumption — versioned, sourced, and ready for committee questioning. The numbers are footnoted; the methodology is in plain English and 繁中.",
    body_tc: "每一條租約、每一筆可比交易、每一項假設，皆有版本、有來源，足以面對委員會的詰問。數字附註解，方法論以英文與繁體中文並陳。"
  }, {
    n: "02",
    head_en: "One book, many holders",
    head_tc: "一本帳，多位持有人",
    body_en: "Roll twenty-three exposures held across six legal vehicles into a single view, then drill down to the SPV, the floor, the tenant, the line item. No re-keying, no spreadsheet reconciliation calls on a Friday evening.",
    body_tc: "二十三檔資產分散於六個法人載體，匯整為單一視圖，向下穿透至 SPV、樓層、租戶、明細。無需重複輸入，亦不再有週五傍晚的試算表對帳會議。"
  }, {
    n: "03",
    head_en: "Scenario without surprise",
    head_tc: "情境推演無意外",
    body_en: "Stress an assumption — interest, vacancy, FX, cap‑rate — and watch every cash flow re-converge. Compare against the prior quarter's run so the committee sees what changed, not what was always there.",
    body_tc: "對任一假設施壓 ── 利率、空置率、匯率、資本化率 ── 觀察所有現金流如何重新收斂。與上一季結果並列，讓委員會看見「改變了什麼」，而非「一向如此」。"
  }, {
    n: "04",
    head_en: "Built for Asia first",
    head_tc: "亞洲為先",
    body_en: "Traditional Chinese is not an afterthought. Tabular numerals align across 半形 and 全形 punctuation. Holiday calendars and quarter-ends reflect TPE, HKG, SGP, TYO out of the box.",
    body_tc: "繁體中文並非事後翻譯。表格數字在半形與全形標點之間皆對齊。台北、香港、新加坡、東京的假期日曆與季底原生支援。"
  }, {
    n: "05",
    head_en: "Your analyst, named",
    head_tc: "您專屬的分析師",
    body_en: "Every BPM client is paired with a named director-grade analyst — typically a former REIT investment professional. They sit inside your workflow, not in a CRM ticket queue.",
    body_tc: "每位 BPM 客戶皆配有一位總監級分析師（多為前 REIT 投資專業人員），並進入您的工作流程中，而非在 CRM 工單系統的另一端。"
  }, {
    n: "06",
    head_en: "Report-grade output",
    head_tc: "報告級輸出",
    body_en: "Export to a paginated PDF that reads like a fixed-income tear sheet, not a SaaS dashboard. Every committee pack, audit-trail-attached. Branding stays yours.",
    body_tc: "匯出為分頁排版的 PDF，閱讀體驗如同固定收益產品說明書，而非 SaaS 儀表板。每份委員會資料包附審計軌跡。署名為貴方所有。"
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "platform",
    style: capStyles.section
  }, /*#__PURE__*/React.createElement("div", {
    style: capStyles.head
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow-red"
  }, tr("Platform · 平台", "平台")), /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: capStyles.title
  }, tr("Six things we do, in order of how often you'll use them.", "六項服務，依使用頻率排列。"))), /*#__PURE__*/React.createElement("div", {
    style: capStyles.grid
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.n,
    style: capStyles.cell
  }, /*#__PURE__*/React.createElement("div", {
    style: capStyles.num
  }, it.n), /*#__PURE__*/React.createElement("h3", {
    className: "serif-tc",
    style: capStyles.head_tc
  }, locale === "tc" ? it.head_tc : it.head_en), /*#__PURE__*/React.createElement("p", {
    style: capStyles.body
  }, locale === "tc" ? it.body_tc : it.body_en)))));
}
const capStyles = {
  section: {
    padding: "80px 0 96px"
  },
  head: {
    marginBottom: 48,
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  title: {
    fontSize: 44,
    fontWeight: 500,
    lineHeight: 1.15,
    color: "var(--ink)",
    margin: 0,
    maxWidth: "18em"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    rowGap: 0,
    columnGap: 0,
    borderTop: "1px solid var(--rule)",
    borderLeft: "1px solid var(--rule)"
  },
  cell: {
    padding: "32px 32px 36px",
    borderRight: "1px solid var(--rule)",
    borderBottom: "1px solid var(--rule)"
  },
  num: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "var(--bpm-red)",
    letterSpacing: "0.14em",
    marginBottom: 18
  },
  head_tc: {
    fontSize: 22,
    fontWeight: 600,
    lineHeight: 1.35,
    color: "var(--ink)",
    margin: 0
  },
  body: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 1.7,
    color: "var(--ink-2)"
  }
};
window.CapabilityGrid = CapabilityGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/CapabilityGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Coverage.jsx
try { (() => {
/* Coverage.jsx — geographies left, sectors right */

function Coverage({
  locale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  const geos = [{
    code: "TPE",
    en: "Taipei",
    tc: "台北",
    primary: true,
    share: "31%",
    note: tr("Office, retail, logistics", "商辦、零售、物流")
  }, {
    code: "HKG",
    en: "Hong Kong",
    tc: "香港",
    primary: true,
    share: "22%",
    note: tr("Office, hospitality", "商辦、酒店式服務")
  }, {
    code: "SGP",
    en: "Singapore",
    tc: "新加坡",
    primary: true,
    share: "18%",
    note: tr("Office", "商辦")
  }, {
    code: "TYO",
    en: "Tokyo",
    tc: "東京",
    primary: false,
    share: "10%",
    note: tr("Office, hospitality", "商辦、酒店式服務")
  }, {
    code: "SEL",
    en: "Seoul",
    tc: "首爾",
    primary: false,
    share: "7%",
    note: tr("Logistics", "物流")
  }, {
    code: "SYD",
    en: "Sydney",
    tc: "雪梨",
    primary: false,
    share: "5%",
    note: tr("Logistics", "物流")
  }, {
    code: "KHH",
    en: "Kaohsiung",
    tc: "高雄",
    primary: false,
    share: "4%",
    note: tr("Hospitality", "酒店式服務")
  }, {
    code: "OSA",
    en: "Osaka",
    tc: "大阪",
    primary: false,
    share: "3%",
    note: tr("Hospitality", "酒店式服務")
  }];
  const sectors = [{
    en: "Office",
    tc: "商辦",
    share: "54%",
    v: "US$ 99bn"
  }, {
    en: "Retail",
    tc: "零售",
    share: "22%",
    v: "US$ 40bn"
  }, {
    en: "Logistics",
    tc: "物流",
    share: "14%",
    v: "US$ 26bn"
  }, {
    en: "Hospitality",
    tc: "酒店式服務",
    share: "8%",
    v: "US$ 15bn"
  }, {
    en: "Development",
    tc: "開發 pipeline",
    share: "2%",
    v: "US$ 4bn"
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "coverage",
    style: covStyles.section
  }, /*#__PURE__*/React.createElement("div", {
    style: covStyles.head
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow-red"
  }, tr("Coverage · 服務範圍", "服務範圍")), /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: covStyles.title
  }, tr("Where we sit, what we cover.", "我們的所在，與我們的涵蓋。"))), /*#__PURE__*/React.createElement("div", {
    style: covStyles.grid
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: covStyles.colHead
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, tr("By city", "依城市")), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, tr("Share of book", "佔比"))), /*#__PURE__*/React.createElement("ul", {
    style: covStyles.list
  }, geos.map(g => /*#__PURE__*/React.createElement("li", {
    key: g.code,
    style: covStyles.row
  }, /*#__PURE__*/React.createElement("span", {
    style: covStyles.geoLeft
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...covStyles.code,
      color: g.primary ? "var(--bpm-red)" : "var(--ink-3)"
    }
  }, g.code), /*#__PURE__*/React.createElement("span", {
    style: covStyles.geoName
  }, locale === "tc" ? g.tc : g.en), /*#__PURE__*/React.createElement("span", {
    style: covStyles.geoNote
  }, g.note)), /*#__PURE__*/React.createElement("span", {
    style: covStyles.share
  }, g.share))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: covStyles.colHead
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, tr("By sector", "依類別")), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, tr("Mark", "市值"))), /*#__PURE__*/React.createElement("ul", {
    style: covStyles.list
  }, sectors.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.en,
    style: covStyles.row
  }, /*#__PURE__*/React.createElement("span", {
    style: covStyles.geoLeft
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...covStyles.code,
      color: "var(--ink-3)"
    }
  }, s.share.padStart(3, " ")), /*#__PURE__*/React.createElement("span", {
    style: covStyles.geoName
  }, locale === "tc" ? s.tc : s.en)), /*#__PURE__*/React.createElement("span", {
    style: covStyles.share
  }, s.v)))), /*#__PURE__*/React.createElement("div", {
    style: covStyles.note
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, tr("Not covered", "尚未涵蓋")), /*#__PURE__*/React.createElement("p", {
    style: covStyles.noteBody
  }, tr("Residential strata, single-family rental, ground leases under 5 years, agricultural land. If your book includes these, ask — we will tell you honestly when we cannot help.", "分戶式住宅、單戶出租、低於五年之地上權、農業用地。若貴方持有此類資產，歡迎來信 ── 我們會誠實告知無法服務的範疇。"))))));
}
const covStyles = {
  section: {
    padding: "96px 0"
  },
  head: {
    marginBottom: 48
  },
  title: {
    fontSize: 44,
    fontWeight: 500,
    lineHeight: 1.15,
    margin: "12px 0 0",
    maxWidth: "20em"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 80
  },
  colHead: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 0 8px",
    borderBottom: "1px solid var(--ink)"
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "14px 0",
    borderBottom: "1px solid var(--rule)",
    fontFamily: "var(--font-sans)",
    fontSize: 15
  },
  geoLeft: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: 16
  },
  code: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.12em",
    minWidth: 36
  },
  geoName: {
    fontFamily: "var(--font-cjk-display)",
    fontSize: 20,
    fontWeight: 600,
    color: "var(--ink)",
    letterSpacing: "0.01em"
  },
  geoNote: {
    fontFamily: "var(--font-serif)",
    fontStyle: "italic",
    color: "var(--ink-3)",
    fontSize: 14
  },
  share: {
    fontFamily: "var(--font-sans)",
    fontFeatureSettings: '"tnum" 1',
    fontSize: 14,
    color: "var(--ink)"
  },
  note: {
    marginTop: 32,
    padding: "20px 22px",
    background: "var(--bone)",
    border: "1px solid var(--rule)"
  },
  noteBody: {
    margin: "8px 0 0",
    fontFamily: "var(--font-serif)",
    fontStyle: "italic",
    color: "var(--ink-2)",
    fontSize: 15,
    lineHeight: 1.55
  }
};
window.Coverage = Coverage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Coverage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Footer.jsx
try { (() => {
/* Footer.jsx — heavy ink footer */

function Footer({
  locale,
  onToggleLocale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  return /*#__PURE__*/React.createElement("footer", {
    style: footerStyles.section
  }, /*#__PURE__*/React.createElement("div", {
    style: footerStyles.inner
  }, /*#__PURE__*/React.createElement("div", {
    style: footerStyles.top
  }, /*#__PURE__*/React.createElement("div", {
    style: footerStyles.brand
  }, /*#__PURE__*/React.createElement("span", {
    style: footerStyles.brandMark
  }, "BPM"), /*#__PURE__*/React.createElement("span", {
    style: footerStyles.brandTri
  }), /*#__PURE__*/React.createElement("span", {
    style: footerStyles.brandSub
  }, "Portfolio Intelligence \xB7 \u4E0D\u52D5\u7522\u7D44\u5408\u667A\u80FD")), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleLocale,
    style: footerStyles.locale
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: locale === "en" ? 600 : 400,
      color: locale === "en" ? "var(--paper)" : "rgba(245,241,234,0.5)"
    }
  }, "EN"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(245,241,234,0.3)",
      margin: "0 6px"
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: locale === "tc" ? 600 : 400,
      color: locale === "tc" ? "var(--paper)" : "rgba(245,241,234,0.5)"
    }
  }, "\u7E41\u4E2D"))), /*#__PURE__*/React.createElement("hr", {
    style: footerStyles.rule
  }), /*#__PURE__*/React.createElement("div", {
    style: footerStyles.cols
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: footerStyles.colHead
  }, tr("Offices", "辦公據點")), /*#__PURE__*/React.createElement("ul", {
    style: footerStyles.list
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", {
    style: footerStyles.cityName
  }, "Taipei"), " \xB7 \u53F0\u5317 110", /*#__PURE__*/React.createElement("br", null), "Songgao Rd, Xinyi District"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", {
    style: footerStyles.cityName
  }, "Hong Kong"), " \xB7 \u9999\u6E2F", /*#__PURE__*/React.createElement("br", null), "Two IFC, Central"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", {
    style: footerStyles.cityName
  }, "Singapore"), " \xB7 \u65B0\u52A0\u5761", /*#__PURE__*/React.createElement("br", null), "One Raffles Quay"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: footerStyles.colHead
  }, tr("Platform", "平台")), /*#__PURE__*/React.createElement("ul", {
    style: footerStyles.list
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("Intelligence", "智能平台"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("Scenarios", "情境"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("Reports", "報告"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("API · Data feed", "API 資料介接"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: footerStyles.colHead
  }, tr("Firm", "公司")), /*#__PURE__*/React.createElement("ul", {
    style: footerStyles.list
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("About BPM", "關於 BPM"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("Coverage", "服務範圍"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("Careers", "職涯"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("Press", "媒體"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: footerStyles.colHead
  }, tr("Legal", "法務")), /*#__PURE__*/React.createElement("ul", {
    style: footerStyles.list
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("Disclosures", "披露事項"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("Privacy", "隱私"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerStyles.link
  }, tr("Terms", "使用條款")))))), /*#__PURE__*/React.createElement("hr", {
    style: footerStyles.rule
  }), /*#__PURE__*/React.createElement("div", {
    style: footerStyles.bottom
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2025 BPM Capital Partners Ltd. ", tr("All rights reserved.", "保留一切權利。")), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, tr("BPM Capital Partners is licensed by the FSC (Taiwan), SFC (HK) and MAS (Singapore).", "BPM Capital Partners 受 金管會（台灣）、SFC（香港）、MAS（新加坡）監管。")))));
}
const footerStyles = {
  section: {
    background: "var(--ink)",
    color: "var(--paper)",
    marginTop: 0
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "56px 64px 32px"
  },
  top: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingBottom: 28
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10
  },
  brandMark: {
    fontFamily: "var(--font-sans)",
    fontWeight: 800,
    fontSize: 30,
    color: "var(--paper)",
    letterSpacing: "-0.04em",
    lineHeight: 1
  },
  brandTri: {
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: "8px solid var(--bpm-red)",
    display: "inline-block",
    marginLeft: -2,
    transform: "translateY(-8px)"
  },
  dot: {
    width: 4,
    height: 4,
    background: "var(--bpm-red)",
    borderRadius: 999,
    display: "inline-block"
  },
  brandSub: {
    fontFamily: "var(--font-sans)",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(245,241,234,0.6)"
  },
  locale: {
    background: "transparent",
    border: 0,
    padding: 0,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    color: "var(--paper)"
  },
  rule: {
    height: 1,
    background: "rgba(245,241,234,0.15)",
    border: 0,
    margin: 0
  },
  cols: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
    gap: 48,
    padding: "40px 0"
  },
  colHead: {
    fontFamily: "var(--font-sans)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--bpm-red)",
    marginBottom: 16
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    fontSize: 13,
    color: "rgba(245,241,234,0.78)",
    lineHeight: 1.5
  },
  cityName: {
    color: "var(--paper)",
    fontWeight: 500
  },
  link: {
    color: "rgba(245,241,234,0.78)",
    textDecoration: "none",
    border: 0
  },
  bottom: {
    display: "flex",
    padding: "20px 0 0",
    fontSize: 12,
    color: "rgba(245,241,234,0.55)"
  }
};
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Hero.jsx
try { (() => {
/* Hero.jsx — bilingual marketing hero
   Restraint: one image-less serif statement, two CTAs, hairline dateline. */

function Hero({
  locale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  return /*#__PURE__*/React.createElement("section", {
    style: heroStyles.section
  }, /*#__PURE__*/React.createElement("hr", {
    className: "rule-red"
  }), /*#__PURE__*/React.createElement("div", {
    style: heroStyles.dateline
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow-red"
  }, tr("Q2 2025 brief · 第二季簡報", "2025 第二季簡報")), /*#__PURE__*/React.createElement("span", {
    style: heroStyles.datelineMeta
  }, /*#__PURE__*/React.createElement("span", null, tr("Released 14 Jul · Taipei", "發布 7 月 14 日 · 台北")), /*#__PURE__*/React.createElement("span", {
    style: heroStyles.dot
  }), /*#__PURE__*/React.createElement("span", null, tr("Confidential to invited holders", "限受邀持有人")))), /*#__PURE__*/React.createElement("div", {
    style: heroStyles.grid
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "serif-tc",
    style: heroStyles.headlineTc
  }, "\u770B\u7A7F\u4E00\u68DF\u6A13\uFF0C", /*#__PURE__*/React.createElement("br", null), "\u518D\u770B\u7A7F\u6574\u672C\u5E33\u3002"), /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: heroStyles.headlineEn
  }, /*#__PURE__*/React.createElement("em", null, "Read the building."), " Then read the book."), /*#__PURE__*/React.createElement("p", {
    style: heroStyles.para
  }, tr("BPM is the portfolio intelligence platform for multi-asset real estate holders. We model every lease line, re-mark every quarter, and put one defensible number in front of your investment committee.", "BPM 是為多元資產持有人打造的不動產組合智能平台。我們建模每一條租約、每季重新估值、為您的投資委員會提供一個可被論證的數字。")), /*#__PURE__*/React.createElement("div", {
    style: heroStyles.cta
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, tr("Request access", "申請使用")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-tertiary"
  }, tr("Read the Q2 brief →", "閱讀第二季簡報 →")))), /*#__PURE__*/React.createElement("div", {
    style: heroStyles.aside
  }, /*#__PURE__*/React.createElement("div", {
    style: heroStyles.asideCard
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, tr("Live coverage · 即時涵蓋", "即時涵蓋")), /*#__PURE__*/React.createElement("div", {
    style: heroStyles.bigNum
  }, "US$ ", /*#__PURE__*/React.createElement("span", {
    style: heroStyles.bigNumStrong
  }, "184"), /*#__PURE__*/React.createElement("span", {
    style: heroStyles.unit
  }, "bn")), /*#__PURE__*/React.createElement("div", {
    style: heroStyles.asideMeta
  }, tr("under intelligence · 47 holders · 12 cities", "智能涵蓋資產 · 47 位持有人 · 12 座城市")), /*#__PURE__*/React.createElement("hr", {
    className: "rule",
    style: {
      margin: "18px 0 14px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: heroStyles.miniGrid
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, tr("Sectors", "類別")), /*#__PURE__*/React.createElement("div", {
    style: heroStyles.miniVal
  }, "Office \xB7 Retail \xB7 Logistics \xB7 Hospitality")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, tr("Coverage", "服務範圍")), /*#__PURE__*/React.createElement("div", {
    style: heroStyles.miniVal
  }, "TPE \xB7 HKG \xB7 SGP \xB7 TYO \xB7 SEL \xB7 SYD")))))), /*#__PURE__*/React.createElement("hr", {
    className: "rule",
    style: {
      marginTop: 64
    }
  }));
}
const heroStyles = {
  section: {
    paddingTop: 32,
    paddingBottom: 0
  },
  dateline: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    padding: "12px 0 32px",
    fontFamily: "var(--font-sans)",
    fontSize: 12,
    color: "var(--ink-3)"
  },
  datelineMeta: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 999,
    background: "var(--ink-4)",
    display: "inline-block"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.35fr 1fr",
    gap: 80,
    alignItems: "start",
    padding: "16px 0 32px"
  },
  headlineTc: {
    fontSize: 84,
    fontWeight: 600,
    lineHeight: 1.06,
    color: "var(--ink)",
    margin: 0,
    letterSpacing: "0.005em"
  },
  headlineEn: {
    fontSize: 36,
    fontWeight: 400,
    lineHeight: 1.18,
    color: "var(--ink-2)",
    margin: "18px 0 0",
    letterSpacing: "-0.018em"
  },
  para: {
    marginTop: 24,
    fontSize: 18,
    lineHeight: 1.6,
    color: "var(--ink-2)",
    maxWidth: "36em"
  },
  cta: {
    marginTop: 28,
    display: "flex",
    gap: 12,
    alignItems: "center"
  },
  aside: {
    marginTop: 12
  },
  asideCard: {
    background: "var(--bone)",
    border: "1px solid var(--rule)",
    padding: "22px 26px"
  },
  bigNum: {
    fontFamily: "var(--font-serif)",
    fontSize: 22,
    color: "var(--ink-3)",
    marginTop: 10,
    lineHeight: 1,
    letterSpacing: "-0.01em",
    display: "flex",
    alignItems: "baseline",
    gap: 6
  },
  bigNumStrong: {
    color: "var(--ink)",
    fontSize: 80,
    fontWeight: 500,
    fontFeatureSettings: '"tnum" 1, "lnum" 1'
  },
  unit: {
    color: "var(--ink-3)",
    fontSize: 28
  },
  asideMeta: {
    fontFamily: "var(--font-serif)",
    fontStyle: "italic",
    color: "var(--ink-3)",
    fontSize: 15,
    marginTop: 8
  },
  miniGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14
  },
  miniVal: {
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    color: "var(--ink-2)",
    marginTop: 6,
    lineHeight: 1.5
  }
};
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/NavBar.jsx
try { (() => {
/* NavBar.jsx — marketing site sticky top bar */

function NavBar({
  locale,
  onToggleLocale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  const items = [{
    label: tr("Platform", "平台"),
    href: "#platform"
  }, {
    label: tr("Coverage", "服務範圍"),
    href: "#coverage"
  }, {
    label: tr("Insights", "洞察"),
    href: "#insights"
  }, {
    label: tr("Firm", "公司"),
    href: "#firm"
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: navStyles.bar
  }, /*#__PURE__*/React.createElement("div", {
    style: navStyles.inner
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    style: navStyles.brand
  }, /*#__PURE__*/React.createElement("span", {
    style: navStyles.brandMark
  }, "BPM"), /*#__PURE__*/React.createElement("span", {
    style: navStyles.brandTri
  }), /*#__PURE__*/React.createElement("span", {
    style: navStyles.brandSub
  }, "Portfolio Intelligence")), /*#__PURE__*/React.createElement("nav", {
    style: navStyles.nav
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.label,
    href: it.href,
    style: navStyles.link
  }, it.label))), /*#__PURE__*/React.createElement("div", {
    style: navStyles.right
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggleLocale,
    style: navStyles.locale
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: locale === "en" ? 600 : 400,
      color: locale === "en" ? "var(--ink)" : "var(--ink-3)"
    }
  }, "EN"), /*#__PURE__*/React.createElement("span", {
    style: navStyles.slash
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: locale === "tc" ? 600 : 400,
      color: locale === "tc" ? "var(--ink)" : "var(--ink-3)"
    }
  }, "\u7E41\u4E2D")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, tr("Sign in", "登入")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, tr("Request access", "申請使用")))));
}
const navStyles = {
  bar: {
    background: "rgba(245,241,234,0.85)",
    backdropFilter: "saturate(180%) blur(12px)",
    WebkitBackdropFilter: "saturate(180%) blur(12px)",
    borderBottom: "1px solid var(--rule)",
    position: "sticky",
    top: 0,
    zIndex: 10
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 64px",
    height: 72,
    display: "flex",
    alignItems: "center",
    gap: 32
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    border: 0,
    textDecoration: "none"
  },
  brandMark: {
    fontFamily: "var(--font-sans)",
    fontWeight: 800,
    fontSize: 26,
    color: "var(--ink)",
    letterSpacing: "-0.04em",
    lineHeight: 1
  },
  brandTri: {
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: "8px solid var(--bpm-red)",
    display: "inline-block",
    marginLeft: -3,
    transform: "translateY(-8px)"
  },
  brandSub: {
    fontFamily: "var(--font-sans)",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--ink-3)"
  },
  nav: {
    marginLeft: 32,
    display: "flex",
    gap: 28
  },
  link: {
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    color: "var(--ink-2)",
    border: 0,
    textDecoration: "none"
  },
  right: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 12
  },
  locale: {
    background: "transparent",
    border: 0,
    padding: 0,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    marginRight: 6
  },
  slash: {
    color: "var(--ink-4)"
  }
};
window.NavBar = NavBar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/StatStrip.jsx
try { (() => {
/* StatStrip.jsx — big-figure stat band on ink */

function StatStrip({
  locale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  const items = [{
    v: "US$184",
    u: "bn",
    label: tr("under intelligence", "智能涵蓋資產")
  }, {
    v: "47",
    u: "",
    label: tr("multi-asset holders", "多元資產持有人")
  }, {
    v: "12",
    u: "",
    label: tr("cities, Asia-Pacific", "城市，亞太區")
  }, {
    v: "4.2",
    u: "yrs",
    label: tr("median client tenure", "客戶平均合作年資")
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: statStyles.section
  }, /*#__PURE__*/React.createElement("div", {
    style: statStyles.grid
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    style: {
      ...statStyles.cell,
      borderRight: i < items.length - 1 ? "1px solid rgba(245,241,234,0.12)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: statStyles.val
  }, it.v, it.u && /*#__PURE__*/React.createElement("span", {
    style: statStyles.unit
  }, it.u)), /*#__PURE__*/React.createElement("div", {
    style: statStyles.label
  }, it.label)))));
}
const statStyles = {
  section: {
    background: "var(--ink)",
    color: "var(--paper)",
    marginLeft: "calc(50% - 50vw)",
    marginRight: "calc(50% - 50vw)",
    padding: "0"
  },
  grid: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "56px 64px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)"
  },
  cell: {
    padding: "0 32px"
  },
  val: {
    fontFamily: "var(--font-serif)",
    fontSize: 80,
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: "-0.03em",
    color: "var(--paper)",
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
    display: "flex",
    alignItems: "baseline",
    gap: 4
  },
  unit: {
    fontSize: 28,
    color: "rgba(245,241,234,0.6)",
    fontWeight: 400
  },
  label: {
    marginTop: 12,
    fontFamily: "var(--font-serif)",
    fontStyle: "italic",
    fontSize: 15,
    color: "rgba(245,241,234,0.72)",
    letterSpacing: 0
  }
};
window.StatStrip = StatStrip;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/StatStrip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/AssetDetailDrawer.jsx
try { (() => {
/* AssetDetailDrawer.jsx — right-side drawer with asset detail
   --------------------------------------------------------------- */

function AssetDetailDrawer({
  asset,
  open,
  onClose,
  locale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  if (!asset) return /*#__PURE__*/React.createElement(DrawerShell, {
    open: false
  });
  const fmt = n => "NT$" + n.toLocaleString("en-US", {
    maximumFractionDigits: 0
  });
  const deltaColor = asset.qoq >= 0 ? "var(--pos)" : "var(--bpm-red)";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "drawer-backdrop" + (open ? " open" : ""),
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "drawer" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("header", {
    style: drawerStyles.head
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-red"
  }, tr("Asset detail", "資產明細"), " \xB7 ", asset.id.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    className: "serif-tc",
    style: drawerStyles.title
  }, locale === "tc" ? asset.name_tc : asset.name), /*#__PURE__*/React.createElement("div", {
    className: "meta",
    style: {
      marginTop: 4
    }
  }, asset.sector, " \xB7 ", asset.geo, " \xB7 ", asset.address)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: drawerStyles.closeBtn,
    "aria-label": "Close"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: drawerStyles.kpiRow
  }, /*#__PURE__*/React.createElement(Kpi, {
    label: tr("Mark", "估值"),
    value: fmt(asset.mark),
    delta: `${asset.qoq >= 0 ? "▲ +" : "▼ "}${asset.qoq.toFixed(2)}% QoQ`,
    color: deltaColor
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: tr("Cap rate", "資本化率"),
    value: asset.capRate.toFixed(2) + "%",
    delta: tr(`vs benchmark ${asset.capRate < 4 ? "−" : "+"}38 bps`, "對標差 38 bps"),
    color: asset.capRate < 4 ? "var(--bpm-red)" : "var(--pos)"
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "WALT",
    value: asset.walt.toFixed(1) + " yrs",
    delta: tr("3 leases re-pricing in 2026", "三筆 2026 重訂"),
    color: "var(--ink-3)"
  })), /*#__PURE__*/React.createElement("section", {
    style: drawerStyles.section
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, tr("Quarterly mark history", "歷季估值")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 480 120",
    style: {
      width: "100%",
      display: "block",
      background: "var(--bone)",
      border: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "drawer-grid",
    width: "40",
    height: "20",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M40 0H0V20",
    fill: "none",
    stroke: "#D8D5CE",
    strokeWidth: "0.5"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "480",
    height: "120",
    fill: "url(#drawer-grid)",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("polyline", {
    fill: "none",
    stroke: "var(--bpm-red)",
    strokeWidth: "1.8",
    points: "0,80 60,72 120,68 180,60 240,58 300,52 360,46 420,38 480,32"
  }), /*#__PURE__*/React.createElement("polyline", {
    fill: "none",
    stroke: "var(--info)",
    strokeWidth: "1.2",
    points: "0,88 60,82 120,78 180,74 240,70 300,68 360,64 420,60 480,58"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "118",
    x2: "480",
    y2: "118",
    stroke: "var(--ink)",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginTop: 8,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--ink-3)"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 10,
      height: 2,
      background: "var(--bpm-red)",
      verticalAlign: "middle",
      marginRight: 6
    }
  }), tr("This asset", "本資產")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 10,
      height: 2,
      background: "var(--info)",
      verticalAlign: "middle",
      marginRight: 6
    }
  }), tr("Sector peer", "同業類別")))), /*#__PURE__*/React.createElement("section", {
    style: drawerStyles.section
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, tr("Tenants & leases", "租戶與租約")), /*#__PURE__*/React.createElement("ul", {
    style: drawerStyles.tenantList
  }, asset.tenants.map(t => /*#__PURE__*/React.createElement("li", {
    key: t.name,
    style: drawerStyles.tenantRow
  }, /*#__PURE__*/React.createElement("span", {
    style: drawerStyles.tenantName
  }, t.name), /*#__PURE__*/React.createElement("span", {
    style: drawerStyles.tenantMeta
  }, t.area, " \xB7 ", t.expiry), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--ink)",
      fontSize: 13
    }
  }, t.rent))))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...drawerStyles.section,
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: drawerStyles.actions
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, tr("Open full report", "開啟完整報告")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, tr("Export PDF", "匯出 PDF")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-tertiary",
    style: {
      marginLeft: "auto"
    },
    onClick: onClose
  }, tr("Close", "關閉"))))));
}
function Kpi({
  label,
  value,
  delta,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: drawerStyles.kpi
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, label), /*#__PURE__*/React.createElement("div", {
    style: drawerStyles.kpiValue
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      ...drawerStyles.kpiDelta,
      color: color || "var(--ink-3)"
    }
  }, delta));
}
function DrawerShell({
  open
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "drawer-backdrop" + (open ? " open" : "")
  }), /*#__PURE__*/React.createElement("aside", {
    className: "drawer" + (open ? " open" : ""),
    "aria-hidden": !open
  }));
}
const drawerStyles = {
  head: {
    padding: "20px 24px 18px",
    borderBottom: "1px solid var(--rule)",
    display: "flex",
    alignItems: "flex-start",
    gap: 12
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    marginTop: 6,
    lineHeight: 1.2,
    letterSpacing: "0.01em"
  },
  closeBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: 0,
    fontSize: 24,
    color: "var(--ink-3)",
    lineHeight: 1,
    cursor: "pointer",
    padding: 0,
    width: 28,
    height: 28
  },
  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    borderBottom: "1px solid var(--rule)"
  },
  kpi: {
    padding: "16px 20px",
    borderRight: "1px solid var(--rule)"
  },
  kpiValue: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    fontWeight: 500,
    letterSpacing: "-0.018em",
    marginTop: 6,
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
    lineHeight: 1
  },
  kpiDelta: {
    fontFamily: "var(--font-sans)",
    fontSize: 12,
    marginTop: 6
  },
  section: {
    padding: "20px 24px",
    borderBottom: "1px solid var(--rule)"
  },
  tenantList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 0
  },
  tenantRow: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr auto",
    gap: 10,
    padding: "10px 0",
    borderBottom: "1px solid var(--graphite-100)",
    alignItems: "baseline",
    fontFamily: "var(--font-sans)",
    fontSize: 13
  },
  tenantName: {
    fontFamily: "var(--font-cjk-sans)",
    color: "var(--ink)",
    fontWeight: 500
  },
  tenantMeta: {
    color: "var(--ink-3)",
    fontSize: 12
  },
  actions: {
    display: "flex",
    gap: 8,
    alignItems: "center"
  }
};
window.AssetDetailDrawer = AssetDetailDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/AssetDetailDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/AssetTable.jsx
try { (() => {
/* AssetTable.jsx — sortable financial table with totals row
   --------------------------------------------------------------- */

function AssetTable({
  rows,
  onSelect,
  selectedId,
  locale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  const totals = rows.reduce((acc, r) => ({
    mark: acc.mark + r.mark,
    capRate: acc.capRate + r.capRate * r.mark,
    walt: acc.walt + r.walt * r.mark,
    weight: acc.weight + r.mark
  }), {
    mark: 0,
    capRate: 0,
    walt: 0,
    weight: 0
  });
  const portfolioCap = totals.weight ? totals.capRate / totals.weight : 0;
  const portfolioWalt = totals.weight ? totals.walt / totals.weight : 0;
  const fmtNT = n => "NT$" + n.toLocaleString("en-US", {
    maximumFractionDigits: 0
  });
  return /*#__PURE__*/React.createElement("div", {
    style: tableStyles.wrap
  }, /*#__PURE__*/React.createElement("table", {
    style: tableStyles.table
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...tableStyles.th,
      ...tableStyles.left
    }
  }, tr("Asset", "資產")), /*#__PURE__*/React.createElement("th", {
    style: {
      ...tableStyles.th,
      ...tableStyles.left
    }
  }, tr("Sector", "類別")), /*#__PURE__*/React.createElement("th", {
    style: {
      ...tableStyles.th,
      ...tableStyles.left
    }
  }, tr("Geography", "地區")), /*#__PURE__*/React.createElement("th", {
    style: tableStyles.th
  }, tr("Mark", "估值"), " (NT$)"), /*#__PURE__*/React.createElement("th", {
    style: tableStyles.th
  }, tr("Cap rate", "資本化率")), /*#__PURE__*/React.createElement("th", {
    style: tableStyles.th
  }, "WALT"), /*#__PURE__*/React.createElement("th", {
    style: tableStyles.th
  }, tr("QoQ", "季變動")), /*#__PURE__*/React.createElement("th", {
    style: tableStyles.th
  }, tr("Status", "狀態")))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => {
    const isSelected = r.id === selectedId;
    return /*#__PURE__*/React.createElement("tr", {
      key: r.id,
      onClick: () => onSelect?.(r.id),
      style: {
        ...tableStyles.tr,
        background: isSelected ? "var(--ink-05)" : "transparent"
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        ...tableStyles.td,
        ...tableStyles.left
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: tableStyles.assetName
    }, locale === "tc" ? r.name_tc : r.name), /*#__PURE__*/React.createElement("div", {
      className: "meta"
    }, r.id.toUpperCase())), /*#__PURE__*/React.createElement("td", {
      style: {
        ...tableStyles.td,
        ...tableStyles.left,
        color: "var(--ink-3)"
      }
    }, r.sector), /*#__PURE__*/React.createElement("td", {
      style: {
        ...tableStyles.td,
        ...tableStyles.left,
        color: "var(--ink-3)"
      }
    }, r.geo), /*#__PURE__*/React.createElement("td", {
      style: tableStyles.td
    }, fmtNT(r.mark)), /*#__PURE__*/React.createElement("td", {
      style: tableStyles.td
    }, r.capRate.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
      style: tableStyles.td
    }, r.walt.toFixed(1), " yrs"), /*#__PURE__*/React.createElement("td", {
      style: {
        ...tableStyles.td,
        color: r.qoq >= 0 ? "var(--pos)" : "var(--bpm-red)",
        fontWeight: 500
      }
    }, r.qoq >= 0 ? "▲ +" : "▼ ", r.qoq.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
      style: tableStyles.td
    }, /*#__PURE__*/React.createElement("span", {
      className: "chip"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dot",
      style: {
        background: statusColor(r.status)
      }
    }), r.status)));
  }), /*#__PURE__*/React.createElement("tr", {
    style: tableStyles.totalRow
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...tableStyles.tdTotal,
      ...tableStyles.left
    }
  }, tr("Total", "合計"), " \xB7 ", rows.length, " ", tr("assets", "檔")), /*#__PURE__*/React.createElement("td", {
    style: {
      ...tableStyles.tdTotal,
      ...tableStyles.left
    }
  }), /*#__PURE__*/React.createElement("td", {
    style: {
      ...tableStyles.tdTotal,
      ...tableStyles.left
    }
  }), /*#__PURE__*/React.createElement("td", {
    style: tableStyles.tdTotal
  }, fmtNT(totals.mark)), /*#__PURE__*/React.createElement("td", {
    style: tableStyles.tdTotal
  }, portfolioCap.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
    style: tableStyles.tdTotal
  }, portfolioWalt.toFixed(1), " yrs"), /*#__PURE__*/React.createElement("td", {
    style: tableStyles.tdTotal
  }), /*#__PURE__*/React.createElement("td", {
    style: tableStyles.tdTotal
  })))));
}
function statusColor(s) {
  if (/leased|held|tracked|active/i.test(s)) return "var(--pos)";
  if (/below|drawdown|review/i.test(s)) return "var(--bpm-red)";
  if (/forecast|soft|caution/i.test(s)) return "var(--warn)";
  return "var(--info)";
}
const tableStyles = {
  wrap: {
    border: "1px solid var(--rule)",
    background: "var(--bone)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    fontFeatureSettings: '"tnum" 1, "lnum" 1'
  },
  th: {
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--ink-3)",
    textAlign: "right",
    padding: "12px 14px",
    borderBottom: "1px solid var(--rule-2)",
    background: "var(--paper)",
    whiteSpace: "nowrap"
  },
  left: {
    textAlign: "left"
  },
  tr: {
    cursor: "pointer",
    transition: "background 100ms"
  },
  td: {
    padding: "11px 14px",
    textAlign: "right",
    borderBottom: "1px solid var(--graphite-100)",
    color: "var(--ink)",
    whiteSpace: "nowrap"
  },
  tdTotal: {
    padding: "13px 14px 11px",
    textAlign: "right",
    borderTop: "2px solid var(--ink)",
    borderBottom: "none",
    fontWeight: 600,
    color: "var(--ink)",
    background: "var(--paper)",
    whiteSpace: "nowrap"
  },
  totalRow: {},
  assetName: {
    fontFamily: "var(--font-cjk-sans)",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--ink)"
  }
};
window.AssetTable = AssetTable;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/AssetTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/Composer.jsx
try { (() => {
/* Composer.jsx — bottom dock "ask your analyst" composer
   --------------------------------------------------------------- */

function Composer({
  locale,
  onSubmit
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  const [value, setValue] = React.useState("");
  const suggestions = locale === "tc" ? ["哪些資產 QoQ 變動 > 1%？", "重新整理零售類別的對標", "本季新增的 11 筆異動"] : ["Which assets moved > 1% QoQ?", "Refresh retail-sector benchmark", "Eleven exposures changed this quarter"];
  return /*#__PURE__*/React.createElement("div", {
    style: composerStyles.shell
  }, /*#__PURE__*/React.createElement("div", {
    style: composerStyles.head
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow-red"
  }, tr("Ask your analyst", "詢問分析師"), " \xB7 Audrey Cheung"), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, tr("Replies within 4 business hours · TPE", "台北辦公時間內 4 小時回覆"))), /*#__PURE__*/React.createElement("div", {
    style: composerStyles.suggestions
  }, suggestions.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    style: composerStyles.sugg,
    onClick: () => setValue(s)
  }, s))), /*#__PURE__*/React.createElement("form", {
    style: composerStyles.row,
    onSubmit: e => {
      e.preventDefault();
      if (value.trim()) onSubmit?.(value);
      setValue("");
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => setValue(e.target.value),
    placeholder: tr("Type a question, or paste a memo to extract …", "輸入問題，或貼上一段備忘錄 …"),
    style: composerStyles.input
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    style: composerStyles.attachBtn
  }, "+ ", tr("Attach", "附件")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    disabled: !value.trim()
  }, tr("Send", "送出"))));
}
const composerStyles = {
  shell: {
    border: "1px solid var(--rule)",
    background: "var(--bone)",
    padding: "14px 18px"
  },
  head: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8
  },
  suggestions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10
  },
  sugg: {
    background: "var(--paper)",
    border: "1px solid var(--rule)",
    borderRadius: 999,
    padding: "5px 12px",
    fontSize: 12,
    color: "var(--ink-2)",
    cursor: "pointer",
    fontFamily: "var(--font-sans)"
  },
  row: {
    display: "flex",
    gap: 8,
    alignItems: "stretch"
  },
  input: {
    flex: 1,
    background: "var(--paper)",
    border: "1px solid var(--rule)",
    borderRadius: 2,
    padding: "10px 14px",
    fontSize: 14,
    color: "var(--ink)",
    fontFamily: "var(--font-sans)"
  },
  attachBtn: {
    padding: "8px 12px"
  }
};
window.Composer = Composer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/Composer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/KPIStrip.jsx
try { (() => {
/* KPIStrip.jsx — four-up KPI band
   --------------------------------------------------------------- */

function KPIStrip({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: kpiStyles.strip
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    style: {
      ...kpiStyles.cell,
      borderRight: i < items.length - 1 ? "1px solid var(--rule)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, it.label), /*#__PURE__*/React.createElement("div", {
    style: kpiStyles.value
  }, it.value, it.unit && /*#__PURE__*/React.createElement("span", {
    style: kpiStyles.unit
  }, it.unit)), /*#__PURE__*/React.createElement("div", {
    style: kpiStyles.delta
  }, it.deltaSign && /*#__PURE__*/React.createElement("span", {
    style: {
      color: it.deltaSign === "+" ? "var(--pos)" : "var(--bpm-red)",
      fontWeight: 500
    }
  }, it.deltaSign === "+" ? "▲" : "▼", " ", it.delta), it.deltaMeta && /*#__PURE__*/React.createElement("span", {
    style: kpiStyles.deltaMeta
  }, it.deltaMeta)))));
}
const kpiStyles = {
  strip: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    border: "1px solid var(--rule)",
    background: "var(--bone)"
  },
  cell: {
    padding: "18px 22px"
  },
  value: {
    fontFamily: "var(--font-display)",
    fontSize: 40,
    fontWeight: 500,
    letterSpacing: "-0.022em",
    lineHeight: 1,
    marginTop: 8,
    fontFeatureSettings: '"tnum" 1, "lnum" 1'
  },
  unit: {
    fontSize: "0.5em",
    color: "var(--ink-3)",
    marginLeft: 2
  },
  delta: {
    marginTop: 8,
    fontFamily: "var(--font-sans)",
    fontSize: 12,
    display: "flex",
    gap: 8,
    alignItems: "baseline"
  },
  deltaMeta: {
    color: "var(--ink-3)"
  }
};
window.KPIStrip = KPIStrip;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/KPIStrip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/PortfolioMap.jsx
try { (() => {
/* PortfolioMap.jsx — stylised SVG of Asia with bubble overlays
   --------------------------------------------------------------- */

function PortfolioMap({
  bubbles,
  locale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;

  // Very abstract, hand-positioned silhouettes of major Asia coastlines.
  // Not a real map. The point is the geographic mental model + bubble exposure.
  return /*#__PURE__*/React.createElement("div", {
    style: mapStyles.card
  }, /*#__PURE__*/React.createElement("div", {
    style: mapStyles.head
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, tr("Geographic exposure", "地理曝險")), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 22,
      marginTop: 4
    }
  }, tr("Asia book · by mark-to-market", "亞洲組合 · 依市值"))), /*#__PURE__*/React.createElement("div", {
    style: mapStyles.legend
  }, /*#__PURE__*/React.createElement("span", {
    style: mapStyles.legendItem
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...mapStyles.bubble,
      background: "var(--bpm-red)"
    }
  }), tr("BPM exposure", "BPM 曝險")), /*#__PURE__*/React.createElement("span", {
    style: mapStyles.legendItem
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...mapStyles.bubble,
      background: "var(--info)",
      opacity: 0.6
    }
  }), tr("Peer (avg)", "同業均值")))), /*#__PURE__*/React.createElement("div", {
    style: mapStyles.map
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 640 360",
    style: {
      width: "100%",
      height: "100%",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "bpm-grid",
    width: "32",
    height: "20",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M32 0H0V20",
    fill: "none",
    stroke: "#D8D5CE",
    strokeWidth: "0.5"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "640",
    height: "360",
    fill: "url(#bpm-grid)",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M60 220 Q90 180, 150 170 T 250 150 Q 290 130, 330 140 L 380 130 Q 420 120, 470 145 Q 510 165, 540 200 L 560 230 Q 540 260, 510 270 L 460 280 Q 410 290, 360 280 L 300 290 Q 240 300, 180 285 L 130 270 Q 90 255, 70 240 Z",
    fill: "var(--paper-2)",
    stroke: "var(--ink-5)",
    strokeWidth: "0.75"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M450 60 Q 490 70, 520 90 L 540 110 Q 530 130, 510 135 Q 480 130, 470 110 Z",
    fill: "var(--paper-2)",
    stroke: "var(--ink-5)",
    strokeWidth: "0.75"
  }), bubbles.map(b => /*#__PURE__*/React.createElement("g", {
    key: b.id
  }, /*#__PURE__*/React.createElement("circle", {
    cx: b.x,
    cy: b.y,
    r: b.peerR,
    fill: "#33547A",
    opacity: 0.18,
    stroke: "#33547A",
    strokeWidth: "0.75"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: b.x,
    cy: b.y,
    r: b.r,
    fill: "#8E1B1F",
    opacity: 0.85
  }), /*#__PURE__*/React.createElement("circle", {
    cx: b.x,
    cy: b.y,
    r: 2,
    fill: "#0B0B0C"
  }), /*#__PURE__*/React.createElement("line", {
    x1: b.x,
    y1: b.y,
    x2: b.x + 14,
    y2: b.y - 16,
    stroke: "#0B0B0C",
    strokeWidth: "0.75"
  }), /*#__PURE__*/React.createElement("text", {
    x: b.x + 16,
    y: b.y - 16,
    fontFamily: "Inter, sans-serif",
    fontSize: "11",
    fontWeight: "600",
    fill: "#0B0B0C"
  }, locale === "tc" ? b.name_tc : b.name), /*#__PURE__*/React.createElement("text", {
    x: b.x + 16,
    y: b.y - 4,
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "10",
    fill: "#5C5C61"
  }, b.mark))), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "358",
    x2: "640",
    y2: "358",
    stroke: "#0B0B0C",
    strokeWidth: "1"
  }))));
}
const mapStyles = {
  card: {
    border: "1px solid var(--rule)",
    background: "var(--bone)"
  },
  head: {
    padding: "16px 20px",
    borderBottom: "1px solid var(--rule)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16
  },
  legend: {
    display: "flex",
    gap: 14,
    fontFamily: "var(--font-sans)",
    fontSize: 12,
    color: "var(--ink-3)"
  },
  legendItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6
  },
  bubble: {
    width: 10,
    height: 10,
    borderRadius: 999,
    display: "inline-block"
  },
  map: {
    padding: 8,
    background: "var(--paper)"
  }
};
window.PortfolioMap = PortfolioMap;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/PortfolioMap.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/Sidebar.jsx
try { (() => {
/* Sidebar.jsx — left navigation
   --------------------------------------------------------------- */

function Sidebar({
  active,
  onSelect,
  locale
}) {
  const tr = (en, tc) => locale === "tc" ? tc : en;
  const portfolios = [{
    id: "asia-office",
    label: "Asia Office",
    tc: "亞洲商辦",
    n: 23,
    mark: "NT$24.8bn"
  }, {
    id: "tw-retail",
    label: "Taiwan Retail",
    tc: "台灣零售",
    n: 14,
    mark: "NT$8.2bn"
  }, {
    id: "logistics",
    label: "Logistics · APAC",
    tc: "亞太物流",
    n: 9,
    mark: "NT$5.6bn"
  }, {
    id: "hospitality",
    label: "Hospitality",
    tc: "酒店式服務",
    n: 6,
    mark: "NT$2.4bn"
  }, {
    id: "dev-pipeline",
    label: "Development pipeline",
    tc: "開發 pipeline",
    n: 4,
    mark: "NT$1.1bn"
  }];
  const filters = [{
    id: "watch",
    label: "Watch list",
    tc: "關注清單",
    n: 7
  }, {
    id: "changed",
    label: "Changed Q-on-Q",
    tc: "本季異動",
    n: 11
  }, {
    id: "below",
    label: "Below WALT",
    tc: "WALT 偏低",
    n: 3
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: sidebarStyles.aside
  }, /*#__PURE__*/React.createElement("div", {
    style: sidebarStyles.section
  }, /*#__PURE__*/React.createElement("div", {
    style: sidebarStyles.sectionHead
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, tr("Portfolios", "投資組合")), /*#__PURE__*/React.createElement("button", {
    style: sidebarStyles.addBtn,
    "aria-label": "Add portfolio"
  }, "\uFF0B")), /*#__PURE__*/React.createElement("ul", {
    style: sidebarStyles.list
  }, portfolios.map(p => /*#__PURE__*/React.createElement("li", {
    key: p.id
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onSelect?.(p.id),
    style: {
      ...sidebarStyles.row,
      ...(active === p.id ? sidebarStyles.rowActive : {})
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: sidebarStyles.rowLeft
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...sidebarStyles.rowMark,
      background: active === p.id ? "var(--bpm-red)" : "transparent"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: sidebarStyles.rowLabel
  }, locale === "tc" ? p.tc : p.label)), /*#__PURE__*/React.createElement("span", {
    style: sidebarStyles.rowMeta
  }, p.n)))))), /*#__PURE__*/React.createElement("div", {
    style: sidebarStyles.section
  }, /*#__PURE__*/React.createElement("div", {
    style: sidebarStyles.sectionHead
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, tr("Filters", "篩選"))), /*#__PURE__*/React.createElement("ul", {
    style: sidebarStyles.list
  }, filters.map(f => /*#__PURE__*/React.createElement("li", {
    key: f.id
  }, /*#__PURE__*/React.createElement("button", {
    style: sidebarStyles.row
  }, /*#__PURE__*/React.createElement("span", {
    style: sidebarStyles.rowLabel
  }, locale === "tc" ? f.tc : f.label), /*#__PURE__*/React.createElement("span", {
    style: sidebarStyles.rowMeta
  }, f.n)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sidebarStyles.section,
      marginTop: "auto",
      paddingBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: sidebarStyles.analyst
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-red",
    style: {
      marginBottom: 4
    }
  }, tr("Your analyst", "您的分析師")), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 18,
      color: "var(--ink)"
    }
  }, "Audrey Cheung"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, "Director \xB7 Asia coverage"), /*#__PURE__*/React.createElement("div", {
    className: "meta",
    style: {
      marginTop: 6
    }
  }, "+852 9123 4561 \xB7 TPE / HKG"))));
}
const sidebarStyles = {
  aside: {
    background: "var(--bone)",
    borderRight: "1px solid var(--rule)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0 0 0",
    height: "100%",
    overflow: "auto"
  },
  section: {
    padding: "0 16px 18px"
  },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 4px 8px"
  },
  addBtn: {
    background: "transparent",
    border: "1px solid var(--rule)",
    width: 18,
    height: 18,
    borderRadius: 2,
    fontSize: 13,
    lineHeight: "13px",
    color: "var(--ink-3)",
    cursor: "pointer",
    padding: 0
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 1
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    background: "transparent",
    border: 0,
    padding: "8px 4px 8px 8px",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    color: "var(--ink)",
    textAlign: "left",
    cursor: "pointer",
    borderLeft: "2px solid transparent"
  },
  rowActive: {
    background: "var(--paper)",
    borderLeftColor: "var(--bpm-red)",
    fontWeight: 500
  },
  rowLeft: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0
  },
  rowMark: {
    width: 6,
    height: 6,
    borderRadius: 999,
    display: "inline-block"
  },
  rowLabel: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  rowMeta: {
    color: "var(--ink-3)",
    fontFamily: "var(--font-mono)",
    fontSize: 11
  },
  analyst: {
    background: "var(--paper)",
    border: "1px solid var(--rule)",
    padding: "12px 14px"
  }
};
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/TopBar.jsx
try { (() => {
/* TopBar.jsx — BPM Intelligence sticky top bar
   --------------------------------------------------------------- */

function TopBar({
  locale,
  onToggleLocale,
  lastUpdated,
  activeNav,
  onNav
}) {
  const navItems = [{
    id: "portfolio",
    en: "Portfolio",
    tc: "組合總覽"
  }, {
    id: "assets",
    en: "Assets",
    tc: "資產"
  }, {
    id: "scenarios",
    en: "Scenarios",
    tc: "情境"
  }, {
    id: "reports",
    en: "Reports",
    tc: "報告"
  }];
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar",
    style: topbarStyles.bar
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: topbarStyles.brand
  }, /*#__PURE__*/React.createElement("span", {
    style: topbarStyles.brandMark
  }, "BPM"), /*#__PURE__*/React.createElement("span", {
    style: topbarStyles.brandTri
  }), /*#__PURE__*/React.createElement("span", {
    style: topbarStyles.brandSub
  }, "Portfolio Intelligence")), /*#__PURE__*/React.createElement("nav", {
    style: topbarStyles.nav
  }, navItems.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.id,
    onClick: () => onNav?.(item.id),
    style: {
      ...topbarStyles.navItem,
      ...(activeNav === item.id ? topbarStyles.navItemActive : {})
    }
  }, locale === "tc" ? item.tc : item.en))), /*#__PURE__*/React.createElement("div", {
    style: topbarStyles.right
  }, /*#__PURE__*/React.createElement("span", {
    style: topbarStyles.tick
  }, /*#__PURE__*/React.createElement("span", {
    style: topbarStyles.tickDot
  }), "Live \xB7 ", lastUpdated), /*#__PURE__*/React.createElement("span", {
    style: topbarStyles.divider
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleLocale,
    style: topbarStyles.localeBtn
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: locale === "en" ? 600 : 400,
      color: locale === "en" ? "var(--ink)" : "var(--ink-3)"
    }
  }, "EN"), /*#__PURE__*/React.createElement("span", {
    style: topbarStyles.localeSlash
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: locale === "tc" ? 600 : 400,
      color: locale === "tc" ? "var(--ink)" : "var(--ink-3)"
    }
  }, "\u7E41\u4E2D")), /*#__PURE__*/React.createElement("span", {
    style: topbarStyles.avatar
  }, "\u6797")));
}
const topbarStyles = {
  bar: {
    height: 64,
    background: "rgba(245,241,234,0.85)",
    backdropFilter: "saturate(180%) blur(12px)",
    WebkitBackdropFilter: "saturate(180%) blur(12px)",
    borderBottom: "1px solid var(--rule)",
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    position: "sticky",
    top: 0,
    zIndex: 10
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    border: 0,
    textDecoration: "none",
    color: "inherit"
  },
  brandMark: {
    fontFamily: "var(--font-sans)",
    fontWeight: 800,
    fontSize: 24,
    letterSpacing: "-0.04em",
    color: "var(--ink)",
    lineHeight: 1
  },
  brandTri: {
    width: 0,
    height: 0,
    borderLeft: "4px solid transparent",
    borderRight: "4px solid transparent",
    borderBottom: "6px solid var(--bpm-red)",
    display: "inline-block",
    marginLeft: -4,
    transform: "translateY(-6px)"
  },
  brandSub: {
    fontFamily: "var(--font-sans)",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--ink-3)"
  },
  nav: {
    marginLeft: 48,
    display: "flex",
    gap: 0,
    height: "100%"
  },
  navItem: {
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    color: "var(--ink-3)",
    background: "transparent",
    border: 0,
    padding: "0 14px",
    height: "100%",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    fontWeight: 500
  },
  navItemActive: {
    color: "var(--ink)",
    borderBottomColor: "var(--ink)"
  },
  right: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    color: "var(--ink-3)"
  },
  tick: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6
  },
  tickDot: {
    width: 6,
    height: 6,
    background: "var(--bpm-red)",
    borderRadius: 999
  },
  divider: {
    width: 1,
    height: 18,
    background: "var(--rule)"
  },
  localeBtn: {
    background: "transparent",
    border: 0,
    padding: 0,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontFamily: "var(--font-sans)",
    fontSize: 13
  },
  localeSlash: {
    color: "var(--ink-4)"
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    background: "var(--ink)",
    color: "var(--paper)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-serif)",
    fontSize: 13,
    fontWeight: 500
  }
};
window.TopBar = TopBar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/TopBar.jsx", error: String((e && e.message) || e) }); }

})();
