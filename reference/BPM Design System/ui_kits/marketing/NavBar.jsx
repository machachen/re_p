/* NavBar.jsx — marketing site sticky top bar */

function NavBar({ locale, onToggleLocale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);
  const items = [
    { label: tr("Platform", "平台"), href: "#platform" },
    { label: tr("Coverage", "服務範圍"), href: "#coverage" },
    { label: tr("Insights", "洞察"), href: "#insights" },
    { label: tr("Firm", "公司"), href: "#firm" },
  ];

  return (
    <header style={navStyles.bar}>
      <div style={navStyles.inner}>
        <a href="#top" style={navStyles.brand}>
          <span style={navStyles.brandMark}>BPM</span>
          <span style={navStyles.brandTri}></span>
          <span style={navStyles.brandSub}>Portfolio Intelligence</span>
        </a>

        <nav style={navStyles.nav}>
          {items.map(it => (
            <a key={it.label} href={it.href} style={navStyles.link}>{it.label}</a>
          ))}
        </nav>

        <div style={navStyles.right}>
          <button onClick={onToggleLocale} style={navStyles.locale}>
            <span style={{ fontWeight: locale === "en" ? 600 : 400, color: locale === "en" ? "var(--ink)" : "var(--ink-3)" }}>EN</span>
            <span style={navStyles.slash}>/</span>
            <span style={{ fontWeight: locale === "tc" ? 600 : 400, color: locale === "tc" ? "var(--ink)" : "var(--ink-3)" }}>繁中</span>
          </button>
          <button className="btn btn-secondary">{tr("Sign in", "登入")}</button>
          <button className="btn btn-primary">{tr("Request access", "申請使用")}</button>
        </div>
      </div>
    </header>
  );
}

const navStyles = {
  bar: {
    background: "rgba(245,241,234,0.85)",
    backdropFilter: "saturate(180%) blur(12px)",
    WebkitBackdropFilter: "saturate(180%) blur(12px)",
    borderBottom: "1px solid var(--rule)",
    position: "sticky", top: 0, zIndex: 10,
  },
  inner: {
    maxWidth: 1280, margin: "0 auto",
    padding: "0 64px",
    height: 72,
    display: "flex", alignItems: "center", gap: 32,
  },
  brand: { display: "inline-flex", alignItems: "center", gap: 10, border: 0, textDecoration: "none" },
  brandMark: { fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 26, color: "var(--ink)", letterSpacing: "-0.04em", lineHeight: 1 },
  brandTri: {
    width: 0, height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: "8px solid var(--bpm-red)",
    display: "inline-block",
    marginLeft: -3,
    transform: "translateY(-8px)",
  },
  brandSub: { fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" },
  nav: { marginLeft: 32, display: "flex", gap: 28 },
  link: { fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-2)", border: 0, textDecoration: "none" },
  right: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 },
  locale: { background: "transparent", border: 0, padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans)", fontSize: 13, marginRight: 6 },
  slash: { color: "var(--ink-4)" },
};

window.NavBar = NavBar;
