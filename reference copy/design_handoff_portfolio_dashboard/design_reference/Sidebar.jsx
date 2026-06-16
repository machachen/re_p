/* Sidebar.jsx — left navigation
   --------------------------------------------------------------- */

function Sidebar({ active, onSelect, locale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);

  const portfolios = [
    { id: "asia-office",  label: "Asia Office",       tc: "亞洲商辦",       n: 23, mark: "NT$24.8bn" },
    { id: "tw-retail",    label: "Taiwan Retail",     tc: "台灣零售",       n: 14, mark: "NT$8.2bn"  },
    { id: "logistics",    label: "Logistics · APAC",  tc: "亞太物流",       n: 9,  mark: "NT$5.6bn"  },
    { id: "hospitality",  label: "Hospitality",       tc: "酒店式服務",     n: 6,  mark: "NT$2.4bn"  },
    { id: "dev-pipeline", label: "Development pipeline", tc: "開發 pipeline", n: 4,  mark: "NT$1.1bn"  },
  ];

  const filters = [
    { id: "watch",   label: "Watch list",     tc: "關注清單", n: 7 },
    { id: "changed", label: "Changed Q-on-Q", tc: "本季異動", n: 11 },
    { id: "below",   label: "Below WALT",     tc: "WALT 偏低", n: 3 },
  ];

  return (
    <aside style={sidebarStyles.aside}>
      <div style={sidebarStyles.section}>
        <div style={sidebarStyles.sectionHead}>
          <span className="eyebrow">{tr("Portfolios", "投資組合")}</span>
          <button style={sidebarStyles.addBtn} aria-label="Add portfolio">＋</button>
        </div>
        <ul style={sidebarStyles.list}>
          {portfolios.map(p => (
            <li key={p.id}>
              <button
                onClick={() => onSelect?.(p.id)}
                style={{
                  ...sidebarStyles.row,
                  ...(active === p.id ? sidebarStyles.rowActive : {}),
                }}
              >
                <span style={sidebarStyles.rowLeft}>
                  <span style={{ ...sidebarStyles.rowMark, background: active === p.id ? "var(--bpm-red)" : "transparent" }}></span>
                  <span style={sidebarStyles.rowLabel}>{locale === "tc" ? p.tc : p.label}</span>
                </span>
                <span style={sidebarStyles.rowMeta}>{p.n}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={sidebarStyles.section}>
        <div style={sidebarStyles.sectionHead}>
          <span className="eyebrow">{tr("Filters", "篩選")}</span>
        </div>
        <ul style={sidebarStyles.list}>
          {filters.map(f => (
            <li key={f.id}>
              <button style={sidebarStyles.row}>
                <span style={sidebarStyles.rowLabel}>{locale === "tc" ? f.tc : f.label}</span>
                <span style={sidebarStyles.rowMeta}>{f.n}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ ...sidebarStyles.section, marginTop: "auto", paddingBottom: 16 }}>
        <div style={sidebarStyles.analyst}>
          <div className="eyebrow eyebrow-red" style={{ marginBottom: 4 }}>
            {tr("Your analyst", "您的分析師")}
          </div>
          <div className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>
            Audrey Cheung
          </div>
          <div className="meta">Director · Asia coverage</div>
          <div className="meta" style={{ marginTop: 6 }}>+852 9123 4561 · TPE / HKG</div>
        </div>
      </div>
    </aside>
  );
}

const sidebarStyles = {
  aside: {
    background: "var(--bone)",
    borderRight: "1px solid var(--rule)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0 0 0",
    height: "100%",
    overflow: "auto",
  },
  section: { padding: "0 16px 18px" },
  sectionHead: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 4px 8px",
  },
  addBtn: {
    background: "transparent", border: "1px solid var(--rule)",
    width: 18, height: 18, borderRadius: 2, fontSize: 13, lineHeight: "13px",
    color: "var(--ink-3)", cursor: "pointer", padding: 0,
  },
  list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 1 },
  row: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%", background: "transparent", border: 0,
    padding: "8px 4px 8px 8px",
    fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink)",
    textAlign: "left", cursor: "pointer",
    borderLeft: "2px solid transparent",
  },
  rowActive: {
    background: "var(--paper)", borderLeftColor: "var(--bpm-red)",
    fontWeight: 500,
  },
  rowLeft: { display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 },
  rowMark: { width: 6, height: 6, borderRadius: 999, display: "inline-block" },
  rowLabel: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  rowMeta: { color: "var(--ink-3)", fontFamily: "var(--font-mono)", fontSize: 11 },
  analyst: {
    background: "var(--paper)", border: "1px solid var(--rule)",
    padding: "12px 14px",
  },
};

window.Sidebar = Sidebar;
