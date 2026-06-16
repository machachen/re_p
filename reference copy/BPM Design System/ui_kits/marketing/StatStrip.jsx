/* StatStrip.jsx — big-figure stat band on ink */

function StatStrip({ locale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);
  const items = [
    { v: "US$184", u: "bn", label: tr("under intelligence", "智能涵蓋資產") },
    { v: "47",      u: "",   label: tr("multi-asset holders", "多元資產持有人") },
    { v: "12",      u: "",   label: tr("cities, Asia-Pacific", "城市，亞太區") },
    { v: "4.2",     u: "yrs", label: tr("median client tenure", "客戶平均合作年資") },
  ];

  return (
    <section style={statStyles.section}>
      <div style={statStyles.grid}>
        {items.map((it, i) => (
          <div
            key={it.label}
            style={{
              ...statStyles.cell,
              borderRight: i < items.length - 1 ? "1px solid rgba(245,241,234,0.12)" : "none",
            }}
          >
            <div style={statStyles.val}>
              {it.v}
              {it.u && <span style={statStyles.unit}>{it.u}</span>}
            </div>
            <div style={statStyles.label}>{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const statStyles = {
  section: {
    background: "var(--ink)", color: "var(--paper)",
    marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)",
    padding: "0",
  },
  grid: {
    maxWidth: 1280, margin: "0 auto",
    padding: "56px 64px",
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
  },
  cell: { padding: "0 32px" },
  val: {
    fontFamily: "var(--font-serif)", fontSize: 80, fontWeight: 500, lineHeight: 1,
    letterSpacing: "-0.03em", color: "var(--paper)",
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
    display: "flex", alignItems: "baseline", gap: 4,
  },
  unit: { fontSize: 28, color: "rgba(245,241,234,0.6)", fontWeight: 400 },
  label: {
    marginTop: 12, fontFamily: "var(--font-serif)", fontStyle: "italic",
    fontSize: 15, color: "rgba(245,241,234,0.72)", letterSpacing: 0,
  },
};

window.StatStrip = StatStrip;
