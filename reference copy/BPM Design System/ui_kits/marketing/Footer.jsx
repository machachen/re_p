/* Footer.jsx — heavy ink footer */

function Footer({ locale, onToggleLocale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);

  return (
    <footer style={footerStyles.section}>
      <div style={footerStyles.inner}>
        <div style={footerStyles.top}>
          <div style={footerStyles.brand}>
            <span style={footerStyles.brandMark}>BPM</span>
            <span style={footerStyles.brandTri}></span>
            <span style={footerStyles.brandSub}>Portfolio Intelligence · 不動產組合智能</span>
          </div>
          <button onClick={onToggleLocale} style={footerStyles.locale}>
            <span style={{ fontWeight: locale === "en" ? 600 : 400, color: locale === "en" ? "var(--paper)" : "rgba(245,241,234,0.5)" }}>EN</span>
            <span style={{ color: "rgba(245,241,234,0.3)", margin: "0 6px" }}>/</span>
            <span style={{ fontWeight: locale === "tc" ? 600 : 400, color: locale === "tc" ? "var(--paper)" : "rgba(245,241,234,0.5)" }}>繁中</span>
          </button>
        </div>

        <hr style={footerStyles.rule}/>

        <div style={footerStyles.cols}>
          <div>
            <div style={footerStyles.colHead}>{tr("Offices", "辦公據點")}</div>
            <ul style={footerStyles.list}>
              <li><strong style={footerStyles.cityName}>Taipei</strong> · 台北 110<br/>Songgao Rd, Xinyi District</li>
              <li><strong style={footerStyles.cityName}>Hong Kong</strong> · 香港<br/>Two IFC, Central</li>
              <li><strong style={footerStyles.cityName}>Singapore</strong> · 新加坡<br/>One Raffles Quay</li>
            </ul>
          </div>
          <div>
            <div style={footerStyles.colHead}>{tr("Platform", "平台")}</div>
            <ul style={footerStyles.list}>
              <li><a href="#" style={footerStyles.link}>{tr("Intelligence", "智能平台")}</a></li>
              <li><a href="#" style={footerStyles.link}>{tr("Scenarios", "情境")}</a></li>
              <li><a href="#" style={footerStyles.link}>{tr("Reports", "報告")}</a></li>
              <li><a href="#" style={footerStyles.link}>{tr("API · Data feed", "API 資料介接")}</a></li>
            </ul>
          </div>
          <div>
            <div style={footerStyles.colHead}>{tr("Firm", "公司")}</div>
            <ul style={footerStyles.list}>
              <li><a href="#" style={footerStyles.link}>{tr("About BPM", "關於 BPM")}</a></li>
              <li><a href="#" style={footerStyles.link}>{tr("Coverage", "服務範圍")}</a></li>
              <li><a href="#" style={footerStyles.link}>{tr("Careers", "職涯")}</a></li>
              <li><a href="#" style={footerStyles.link}>{tr("Press", "媒體")}</a></li>
            </ul>
          </div>
          <div>
            <div style={footerStyles.colHead}>{tr("Legal", "法務")}</div>
            <ul style={footerStyles.list}>
              <li><a href="#" style={footerStyles.link}>{tr("Disclosures", "披露事項")}</a></li>
              <li><a href="#" style={footerStyles.link}>{tr("Privacy", "隱私")}</a></li>
              <li><a href="#" style={footerStyles.link}>{tr("Terms", "使用條款")}</a></li>
            </ul>
          </div>
        </div>

        <hr style={footerStyles.rule}/>

        <div style={footerStyles.bottom}>
          <span>© 2025 BPM Capital Partners Ltd. {tr("All rights reserved.", "保留一切權利。")}</span>
          <span style={{ marginLeft: "auto" }}>
            {tr(
              "BPM Capital Partners is licensed by the FSC (Taiwan), SFC (HK) and MAS (Singapore).",
              "BPM Capital Partners 受 金管會（台灣）、SFC（香港）、MAS（新加坡）監管。"
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}

const footerStyles = {
  section: { background: "var(--ink)", color: "var(--paper)", marginTop: 0 },
  inner: { maxWidth: 1280, margin: "0 auto", padding: "56px 64px 32px" },
  top: { display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 28 },
  brand: { display: "inline-flex", alignItems: "center", gap: 10 },
  brandMark: { fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 30, color: "var(--paper)", letterSpacing: "-0.04em", lineHeight: 1 },
  brandTri: {
    width: 0, height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: "8px solid var(--bpm-red)",
    display: "inline-block",
    marginLeft: -2,
    transform: "translateY(-8px)",
  },
  dot: { width: 4, height: 4, background: "var(--bpm-red)", borderRadius: 999, display: "inline-block" },
  brandSub: { fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,241,234,0.6)" },
  locale: { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--paper)" },
  rule: { height: 1, background: "rgba(245,241,234,0.15)", border: 0, margin: 0 },
  cols: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48, padding: "40px 0" },
  colHead: { fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--bpm-red)", marginBottom: 16 },
  list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "rgba(245,241,234,0.78)", lineHeight: 1.5 },
  cityName: { color: "var(--paper)", fontWeight: 500 },
  link: { color: "rgba(245,241,234,0.78)", textDecoration: "none", border: 0 },
  bottom: { display: "flex", padding: "20px 0 0", fontSize: 12, color: "rgba(245,241,234,0.55)" },
};

window.Footer = Footer;
