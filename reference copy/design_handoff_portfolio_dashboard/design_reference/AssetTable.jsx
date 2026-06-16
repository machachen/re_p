/* AssetTable.jsx — sortable financial table with totals row
   --------------------------------------------------------------- */

function AssetTable({ rows, onSelect, selectedId, locale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);

  const totals = rows.reduce(
    (acc, r) => ({
      mark: acc.mark + r.mark,
      capRate: acc.capRate + r.capRate * r.mark,
      walt: acc.walt + r.walt * r.mark,
      weight: acc.weight + r.mark,
    }),
    { mark: 0, capRate: 0, walt: 0, weight: 0 }
  );
  const portfolioCap = totals.weight ? totals.capRate / totals.weight : 0;
  const portfolioWalt = totals.weight ? totals.walt / totals.weight : 0;

  const fmtNT = n =>
    "NT$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div style={tableStyles.wrap}>
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={{ ...tableStyles.th, ...tableStyles.left }}>{tr("Asset", "資產")}</th>
            <th style={{ ...tableStyles.th, ...tableStyles.left }}>{tr("Sector", "類別")}</th>
            <th style={{ ...tableStyles.th, ...tableStyles.left }}>{tr("Geography", "地區")}</th>
            <th style={tableStyles.th}>{tr("Mark", "估值")} (NT$)</th>
            <th style={tableStyles.th}>{tr("Cap rate", "資本化率")}</th>
            <th style={tableStyles.th}>WALT</th>
            <th style={tableStyles.th}>{tr("QoQ", "季變動")}</th>
            <th style={tableStyles.th}>{tr("Status", "狀態")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const isSelected = r.id === selectedId;
            return (
              <tr
                key={r.id}
                onClick={() => onSelect?.(r.id)}
                style={{
                  ...tableStyles.tr,
                  background: isSelected ? "var(--ink-05)" : "transparent",
                }}
              >
                <td style={{ ...tableStyles.td, ...tableStyles.left }}>
                  <div style={tableStyles.assetName}>
                    {locale === "tc" ? r.name_tc : r.name}
                  </div>
                  <div className="meta">{r.id.toUpperCase()}</div>
                </td>
                <td style={{ ...tableStyles.td, ...tableStyles.left, color: "var(--ink-3)" }}>{r.sector}</td>
                <td style={{ ...tableStyles.td, ...tableStyles.left, color: "var(--ink-3)" }}>{r.geo}</td>
                <td style={tableStyles.td}>{fmtNT(r.mark)}</td>
                <td style={tableStyles.td}>{r.capRate.toFixed(2)}%</td>
                <td style={tableStyles.td}>{r.walt.toFixed(1)} yrs</td>
                <td style={{ ...tableStyles.td, color: r.qoq >= 0 ? "var(--pos)" : "var(--bpm-red)", fontWeight: 500 }}>
                  {r.qoq >= 0 ? "▲ +" : "▼ "}
                  {r.qoq.toFixed(2)}%
                </td>
                <td style={tableStyles.td}>
                  <span className={"chip"}>
                    <span className="dot" style={{ background: statusColor(r.status) }}></span>
                    {r.status}
                  </span>
                </td>
              </tr>
            );
          })}
          <tr style={tableStyles.totalRow}>
            <td style={{ ...tableStyles.tdTotal, ...tableStyles.left }}>
              {tr("Total", "合計")} · {rows.length} {tr("assets", "檔")}
            </td>
            <td style={{ ...tableStyles.tdTotal, ...tableStyles.left }}></td>
            <td style={{ ...tableStyles.tdTotal, ...tableStyles.left }}></td>
            <td style={tableStyles.tdTotal}>{fmtNT(totals.mark)}</td>
            <td style={tableStyles.tdTotal}>{portfolioCap.toFixed(2)}%</td>
            <td style={tableStyles.tdTotal}>{portfolioWalt.toFixed(1)} yrs</td>
            <td style={tableStyles.tdTotal}></td>
            <td style={tableStyles.tdTotal}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function statusColor(s) {
  if (/leased|held|tracked|active/i.test(s)) return "var(--pos)";
  if (/below|drawdown|review/i.test(s)) return "var(--bpm-red)";
  if (/forecast|soft|caution/i.test(s)) return "var(--warn)";
  return "var(--info)";
}

const tableStyles = {
  wrap: { border: "1px solid var(--rule)", background: "var(--bone)" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
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
    whiteSpace: "nowrap",
  },
  left: { textAlign: "left" },
  tr: { cursor: "pointer", transition: "background 100ms" },
  td: {
    padding: "11px 14px",
    textAlign: "right",
    borderBottom: "1px solid var(--graphite-100)",
    color: "var(--ink)",
    whiteSpace: "nowrap",
  },
  tdTotal: {
    padding: "13px 14px 11px",
    textAlign: "right",
    borderTop: "2px solid var(--ink)",
    borderBottom: "none",
    fontWeight: 600,
    color: "var(--ink)",
    background: "var(--paper)",
    whiteSpace: "nowrap",
  },
  totalRow: {},
  assetName: {
    fontFamily: "var(--font-cjk-sans)",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--ink)",
  },
};

window.AssetTable = AssetTable;
