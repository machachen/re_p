/* Hero.jsx — bilingual marketing hero
   Restraint: one image-less serif statement, two CTAs, hairline dateline. */

function Hero({ locale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);

  return (
    <section style={heroStyles.section}>
      <hr className="rule-red"/>
      <div style={heroStyles.dateline}>
        <span className="eyebrow eyebrow-red">{tr("Q2 2025 brief · 第二季簡報", "2025 第二季簡報")}</span>
        <span style={heroStyles.datelineMeta}>
          <span>{tr("Released 14 Jul · Taipei", "發布 7 月 14 日 · 台北")}</span>
          <span style={heroStyles.dot}></span>
          <span>{tr("Confidential to invited holders", "限受邀持有人")}</span>
        </span>
      </div>

      <div style={heroStyles.grid}>
        <div>
          <h1 className="serif-tc" style={heroStyles.headlineTc}>
            看穿一棟樓，<br/>再看穿整本帳。
          </h1>
          <h2 className="serif" style={heroStyles.headlineEn}>
            <em>Read the building.</em> Then read the book.
          </h2>
          <p style={heroStyles.para}>
            {tr(
              "BPM is the portfolio intelligence platform for multi-asset real estate holders. We model every lease line, re-mark every quarter, and put one defensible number in front of your investment committee.",
              "BPM 是為多元資產持有人打造的不動產組合智能平台。我們建模每一條租約、每季重新估值、為您的投資委員會提供一個可被論證的數字。"
            )}
          </p>
          <div style={heroStyles.cta}>
            <button className="btn btn-primary">{tr("Request access", "申請使用")}</button>
            <button className="btn btn-tertiary">{tr("Read the Q2 brief →", "閱讀第二季簡報 →")}</button>
          </div>
        </div>

        <div style={heroStyles.aside}>
          <div style={heroStyles.asideCard}>
            <div className="eyebrow">{tr("Live coverage · 即時涵蓋", "即時涵蓋")}</div>
            <div style={heroStyles.bigNum}>
              US$ <span style={heroStyles.bigNumStrong}>184</span>
              <span style={heroStyles.unit}>bn</span>
            </div>
            <div style={heroStyles.asideMeta}>
              {tr("under intelligence · 47 holders · 12 cities", "智能涵蓋資產 · 47 位持有人 · 12 座城市")}
            </div>
            <hr className="rule" style={{ margin: "18px 0 14px" }}/>
            <div style={heroStyles.miniGrid}>
              <div>
                <div className="eyebrow">{tr("Sectors", "類別")}</div>
                <div style={heroStyles.miniVal}>Office · Retail · Logistics · Hospitality</div>
              </div>
              <div>
                <div className="eyebrow">{tr("Coverage", "服務範圍")}</div>
                <div style={heroStyles.miniVal}>TPE · HKG · SGP · TYO · SEL · SYD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="rule" style={{ marginTop: 64 }}/>
    </section>
  );
}

const heroStyles = {
  section: { paddingTop: 32, paddingBottom: 0 },
  dateline: {
    display: "flex", alignItems: "baseline", justifyContent: "space-between",
    padding: "12px 0 32px",
    fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-3)",
  },
  datelineMeta: { display: "inline-flex", alignItems: "center", gap: 10 },
  dot: { width: 2, height: 2, borderRadius: 999, background: "var(--ink-4)", display: "inline-block" },
  grid: { display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 80, alignItems: "start", padding: "16px 0 32px" },
  headlineTc: {
    fontSize: 84, fontWeight: 600, lineHeight: 1.06, color: "var(--ink)",
    margin: 0, letterSpacing: "0.005em",
  },
  headlineEn: {
    fontSize: 36, fontWeight: 400, lineHeight: 1.18, color: "var(--ink-2)",
    margin: "18px 0 0", letterSpacing: "-0.018em",
  },
  para: {
    marginTop: 24, fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)",
    maxWidth: "36em",
  },
  cta: { marginTop: 28, display: "flex", gap: 12, alignItems: "center" },
  aside: { marginTop: 12 },
  asideCard: {
    background: "var(--bone)", border: "1px solid var(--rule)",
    padding: "22px 26px",
  },
  bigNum: {
    fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--ink-3)",
    marginTop: 10, lineHeight: 1, letterSpacing: "-0.01em",
    display: "flex", alignItems: "baseline", gap: 6,
  },
  bigNumStrong: {
    color: "var(--ink)", fontSize: 80, fontWeight: 500, fontFeatureSettings: '"tnum" 1, "lnum" 1',
  },
  unit: { color: "var(--ink-3)", fontSize: 28 },
  asideMeta: { fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-3)", fontSize: 15, marginTop: 8 },
  miniGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  miniVal: { fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-2)", marginTop: 6, lineHeight: 1.5 },
};

window.Hero = Hero;
