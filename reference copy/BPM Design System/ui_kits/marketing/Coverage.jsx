/* Coverage.jsx — geographies left, sectors right */

function Coverage({ locale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);

  const geos = [
    { code: "TPE", en: "Taipei",    tc: "台北",   primary: true,  share: "31%", note: tr("Office, retail, logistics", "商辦、零售、物流") },
    { code: "HKG", en: "Hong Kong", tc: "香港",   primary: true,  share: "22%", note: tr("Office, hospitality",       "商辦、酒店式服務") },
    { code: "SGP", en: "Singapore", tc: "新加坡", primary: true,  share: "18%", note: tr("Office",                    "商辦") },
    { code: "TYO", en: "Tokyo",     tc: "東京",   primary: false, share: "10%", note: tr("Office, hospitality",       "商辦、酒店式服務") },
    { code: "SEL", en: "Seoul",     tc: "首爾",   primary: false, share: "7%",  note: tr("Logistics",                 "物流") },
    { code: "SYD", en: "Sydney",    tc: "雪梨",   primary: false, share: "5%",  note: tr("Logistics",                 "物流") },
    { code: "KHH", en: "Kaohsiung", tc: "高雄",   primary: false, share: "4%",  note: tr("Hospitality",               "酒店式服務") },
    { code: "OSA", en: "Osaka",     tc: "大阪",   primary: false, share: "3%",  note: tr("Hospitality",               "酒店式服務") },
  ];

  const sectors = [
    { en: "Office",      tc: "商辦",         share: "54%", v: "US$ 99bn" },
    { en: "Retail",      tc: "零售",         share: "22%", v: "US$ 40bn" },
    { en: "Logistics",   tc: "物流",         share: "14%", v: "US$ 26bn" },
    { en: "Hospitality", tc: "酒店式服務",   share: "8%",  v: "US$ 15bn" },
    { en: "Development", tc: "開發 pipeline", share: "2%",  v: "US$ 4bn"  },
  ];

  return (
    <section id="coverage" style={covStyles.section}>
      <div style={covStyles.head}>
        <span className="eyebrow eyebrow-red">{tr("Coverage · 服務範圍", "服務範圍")}</span>
        <h2 className="serif" style={covStyles.title}>
          {tr("Where we sit, what we cover.", "我們的所在，與我們的涵蓋。")}
        </h2>
      </div>

      <div style={covStyles.grid}>
        <div>
          <div style={covStyles.colHead}>
            <span className="eyebrow">{tr("By city", "依城市")}</span>
            <span className="eyebrow">{tr("Share of book", "佔比")}</span>
          </div>
          <ul style={covStyles.list}>
            {geos.map(g => (
              <li key={g.code} style={covStyles.row}>
                <span style={covStyles.geoLeft}>
                  <span style={{ ...covStyles.code, color: g.primary ? "var(--bpm-red)" : "var(--ink-3)" }}>{g.code}</span>
                  <span style={covStyles.geoName}>{locale === "tc" ? g.tc : g.en}</span>
                  <span style={covStyles.geoNote}>{g.note}</span>
                </span>
                <span style={covStyles.share}>{g.share}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div style={covStyles.colHead}>
            <span className="eyebrow">{tr("By sector", "依類別")}</span>
            <span className="eyebrow">{tr("Mark", "市值")}</span>
          </div>
          <ul style={covStyles.list}>
            {sectors.map(s => (
              <li key={s.en} style={covStyles.row}>
                <span style={covStyles.geoLeft}>
                  <span style={{ ...covStyles.code, color: "var(--ink-3)" }}>{s.share.padStart(3, " ")}</span>
                  <span style={covStyles.geoName}>{locale === "tc" ? s.tc : s.en}</span>
                </span>
                <span style={covStyles.share}>{s.v}</span>
              </li>
            ))}
          </ul>

          <div style={covStyles.note}>
            <div className="eyebrow">{tr("Not covered", "尚未涵蓋")}</div>
            <p style={covStyles.noteBody}>
              {tr(
                "Residential strata, single-family rental, ground leases under 5 years, agricultural land. If your book includes these, ask — we will tell you honestly when we cannot help.",
                "分戶式住宅、單戶出租、低於五年之地上權、農業用地。若貴方持有此類資產，歡迎來信 ── 我們會誠實告知無法服務的範疇。"
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const covStyles = {
  section: { padding: "96px 0" },
  head: { marginBottom: 48 },
  title: { fontSize: 44, fontWeight: 500, lineHeight: 1.15, margin: "12px 0 0", maxWidth: "20em" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 },
  colHead: { display: "flex", justifyContent: "space-between", padding: "0 0 8px", borderBottom: "1px solid var(--ink)" },
  list: { listStyle: "none", margin: 0, padding: 0 },
  row: {
    display: "flex", justifyContent: "space-between", alignItems: "baseline",
    padding: "14px 0", borderBottom: "1px solid var(--rule)",
    fontFamily: "var(--font-sans)", fontSize: 15,
  },
  geoLeft: { display: "inline-flex", alignItems: "baseline", gap: 16 },
  code: {
    fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em",
    minWidth: 36,
  },
  geoName: { fontFamily: "var(--font-cjk-display)", fontSize: 20, fontWeight: 600, color: "var(--ink)", letterSpacing: "0.01em" },
  geoNote: { fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-3)", fontSize: 14 },
  share: { fontFamily: "var(--font-sans)", fontFeatureSettings: '"tnum" 1', fontSize: 14, color: "var(--ink)" },
  note: { marginTop: 32, padding: "20px 22px", background: "var(--bone)", border: "1px solid var(--rule)" },
  noteBody: { margin: "8px 0 0", fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-2)", fontSize: 15, lineHeight: 1.55 },
};

window.Coverage = Coverage;
