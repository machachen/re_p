/* TopBar.jsx — BPM Intelligence sticky top bar
   --------------------------------------------------------------- */

function TopBar({ locale, onToggleLocale, lastUpdated, activeNav, onNav }) {
  const navItems = [
    { id: "portfolio", en: "Portfolio", tc: "組合總覽" },
    { id: "assets",    en: "Assets",    tc: "資產" },
    { id: "scenarios", en: "Scenarios", tc: "情境" },
    { id: "reports",   en: "Reports",   tc: "報告" },
  ];

  return (
    <header className="topbar" style={topbarStyles.bar}>
      <a href="#" style={topbarStyles.brand}>
        <span style={topbarStyles.brandMark}>BPM</span>
        <span style={topbarStyles.brandTri}></span>
        <span style={topbarStyles.brandSub}>Portfolio Intelligence</span>
      </a>

      <nav style={topbarStyles.nav}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNav?.(item.id)}
            style={{
              ...topbarStyles.navItem,
              ...(activeNav === item.id ? topbarStyles.navItemActive : {}),
            }}
          >
            {locale === "tc" ? item.tc : item.en}
          </button>
        ))}
      </nav>

      <div style={topbarStyles.right}>
        <span style={topbarStyles.tick}>
          <span style={topbarStyles.tickDot}></span>
          Live · {lastUpdated}
        </span>
        <span style={topbarStyles.divider}></span>
        <button onClick={onToggleLocale} style={topbarStyles.localeBtn}>
          <span style={{ fontWeight: locale === "en" ? 600 : 400, color: locale === "en" ? "var(--ink)" : "var(--ink-3)" }}>EN</span>
          <span style={topbarStyles.localeSlash}>/</span>
          <span style={{ fontWeight: locale === "tc" ? 600 : 400, color: locale === "tc" ? "var(--ink)" : "var(--ink-3)" }}>繁中</span>
        </button>
        <span style={topbarStyles.avatar}>林</span>
      </div>
    </header>
  );
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
    zIndex: 10,
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    border: 0,
    textDecoration: "none",
    color: "inherit",
  },
  brandMark: {
    fontFamily: "var(--font-sans)",
    fontWeight: 800,
    fontSize: 24,
    letterSpacing: "-0.04em",
    color: "var(--ink)",
    lineHeight: 1,
  },
  brandTri: {
    width: 0, height: 0,
    borderLeft: "4px solid transparent",
    borderRight: "4px solid transparent",
    borderBottom: "6px solid var(--bpm-red)",
    display: "inline-block",
    marginLeft: -4,
    transform: "translateY(-6px)",
  },
  brandSub: {
    fontFamily: "var(--font-sans)",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--ink-3)",
  },
  nav: { marginLeft: 48, display: "flex", gap: 0, height: "100%" },
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
    fontWeight: 500,
  },
  navItemActive: {
    color: "var(--ink)",
    borderBottomColor: "var(--ink)",
  },
  right: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    color: "var(--ink-3)",
  },
  tick: { display: "inline-flex", alignItems: "center", gap: 6 },
  tickDot: { width: 6, height: 6, background: "var(--bpm-red)", borderRadius: 999 },
  divider: { width: 1, height: 18, background: "var(--rule)" },
  localeBtn: {
    background: "transparent",
    border: 0,
    padding: 0,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontFamily: "var(--font-sans)",
    fontSize: 13,
  },
  localeSlash: { color: "var(--ink-4)" },
  avatar: {
    width: 30, height: 30, borderRadius: 999,
    background: "var(--ink)", color: "var(--paper)",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-serif)", fontSize: 13, fontWeight: 500,
  },
};

window.TopBar = TopBar;
