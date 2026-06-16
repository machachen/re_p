/* KPIStrip.jsx — four-up KPI band
   --------------------------------------------------------------- */

function KPIStrip({ items }) {
  return (
    <div style={kpiStyles.strip}>
      {items.map((it, i) => (
        <div
          key={it.label}
          style={{
            ...kpiStyles.cell,
            borderRight: i < items.length - 1 ? "1px solid var(--rule)" : "none",
          }}
        >
          <div className="eyebrow">{it.label}</div>
          <div style={kpiStyles.value}>
            {it.value}
            {it.unit && <span style={kpiStyles.unit}>{it.unit}</span>}
          </div>
          <div style={kpiStyles.delta}>
            {it.deltaSign && (
              <span style={{ color: it.deltaSign === "+" ? "var(--pos)" : "var(--bpm-red)", fontWeight: 500 }}>
                {it.deltaSign === "+" ? "▲" : "▼"} {it.delta}
              </span>
            )}
            {it.deltaMeta && <span style={kpiStyles.deltaMeta}>{it.deltaMeta}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

const kpiStyles = {
  strip: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    border: "1px solid var(--rule)",
    background: "var(--bone)",
  },
  cell: { padding: "18px 22px" },
  value: {
    fontFamily: "var(--font-display)",
    fontSize: 40,
    fontWeight: 500,
    letterSpacing: "-0.022em",
    lineHeight: 1,
    marginTop: 8,
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
  },
  unit: { fontSize: "0.5em", color: "var(--ink-3)", marginLeft: 2 },
  delta: {
    marginTop: 8,
    fontFamily: "var(--font-sans)",
    fontSize: 12,
    display: "flex",
    gap: 8,
    alignItems: "baseline",
  },
  deltaMeta: { color: "var(--ink-3)" },
};

window.KPIStrip = KPIStrip;
