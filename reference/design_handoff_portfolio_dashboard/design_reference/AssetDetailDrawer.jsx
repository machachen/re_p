/* AssetDetailDrawer.jsx — right-side drawer with asset detail
   --------------------------------------------------------------- */

function AssetDetailDrawer({ asset, open, onClose, locale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);
  if (!asset) return <DrawerShell open={false} />;

  const fmt = n => "NT$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const deltaColor = asset.qoq >= 0 ? "var(--pos)" : "var(--bpm-red)";

  return (
    <React.Fragment>
      <div className={"drawer-backdrop" + (open ? " open" : "")} onClick={onClose}></div>
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        <header style={drawerStyles.head}>
          <div>
            <div className="eyebrow eyebrow-red">{tr("Asset detail", "資產明細")} · {asset.id.toUpperCase()}</div>
            <div className="serif-tc" style={drawerStyles.title}>{locale === "tc" ? asset.name_tc : asset.name}</div>
            <div className="meta" style={{ marginTop: 4 }}>{asset.sector} · {asset.geo} · {asset.address}</div>
          </div>
          <button onClick={onClose} style={drawerStyles.closeBtn} aria-label="Close">×</button>
        </header>

        <div style={drawerStyles.kpiRow}>
          <Kpi label={tr("Mark", "估值")} value={fmt(asset.mark)} delta={`${asset.qoq >= 0 ? "▲ +" : "▼ "}${asset.qoq.toFixed(2)}% QoQ`} color={deltaColor} />
          <Kpi label={tr("Cap rate", "資本化率")} value={asset.capRate.toFixed(2) + "%"} delta={tr(`vs benchmark ${asset.capRate < 4 ? "−" : "+"}38 bps`, "對標差 38 bps")} color={asset.capRate < 4 ? "var(--bpm-red)" : "var(--pos)"} />
          <Kpi label="WALT" value={asset.walt.toFixed(1) + " yrs"} delta={tr("3 leases re-pricing in 2026", "三筆 2026 重訂")} color="var(--ink-3)" />
        </div>

        <section style={drawerStyles.section}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{tr("Quarterly mark history", "歷季估值")}</div>
          <svg viewBox="0 0 480 120" style={{ width: "100%", display: "block", background: "var(--bone)", border: "1px solid var(--rule)" }}>
            <defs>
              <pattern id="drawer-grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V20" fill="none" stroke="#D8D5CE" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="480" height="120" fill="url(#drawer-grid)" opacity="0.6"/>
            <polyline
              fill="none" stroke="var(--bpm-red)" strokeWidth="1.8"
              points="0,80 60,72 120,68 180,60 240,58 300,52 360,46 420,38 480,32"
            />
            <polyline
              fill="none" stroke="var(--info)" strokeWidth="1.2"
              points="0,88 60,82 120,78 180,74 240,70 300,68 360,64 420,60 480,58"
            />
            <line x1="0" y1="118" x2="480" y2="118" stroke="var(--ink)" strokeWidth="1"/>
          </svg>
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-3)" }}>
            <span><span style={{ display: "inline-block", width: 10, height: 2, background: "var(--bpm-red)", verticalAlign: "middle", marginRight: 6 }}></span>{tr("This asset", "本資產")}</span>
            <span><span style={{ display: "inline-block", width: 10, height: 2, background: "var(--info)", verticalAlign: "middle", marginRight: 6 }}></span>{tr("Sector peer", "同業類別")}</span>
          </div>
        </section>

        <section style={drawerStyles.section}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{tr("Tenants & leases", "租戶與租約")}</div>
          <ul style={drawerStyles.tenantList}>
            {asset.tenants.map(t => (
              <li key={t.name} style={drawerStyles.tenantRow}>
                <span style={drawerStyles.tenantName}>{t.name}</span>
                <span style={drawerStyles.tenantMeta}>{t.area} · {t.expiry}</span>
                <span className="mono" style={{ color: "var(--ink)", fontSize: 13 }}>{t.rent}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ ...drawerStyles.section, marginTop: "auto" }}>
          <div style={drawerStyles.actions}>
            <button className="btn btn-primary">{tr("Open full report", "開啟完整報告")}</button>
            <button className="btn btn-secondary">{tr("Export PDF", "匯出 PDF")}</button>
            <button className="btn btn-tertiary" style={{ marginLeft: "auto" }} onClick={onClose}>{tr("Close", "關閉")}</button>
          </div>
        </section>
      </aside>
    </React.Fragment>
  );
}

function Kpi({ label, value, delta, color }) {
  return (
    <div style={drawerStyles.kpi}>
      <div className="eyebrow">{label}</div>
      <div style={drawerStyles.kpiValue}>{value}</div>
      <div style={{ ...drawerStyles.kpiDelta, color: color || "var(--ink-3)" }}>{delta}</div>
    </div>
  );
}

function DrawerShell({ open }) {
  return (
    <React.Fragment>
      <div className={"drawer-backdrop" + (open ? " open" : "")}></div>
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open}></aside>
    </React.Fragment>
  );
}

const drawerStyles = {
  head: {
    padding: "20px 24px 18px",
    borderBottom: "1px solid var(--rule)",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  title: { fontSize: 26, fontWeight: 600, marginTop: 6, lineHeight: 1.2, letterSpacing: "0.01em" },
  closeBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: 0,
    fontSize: 24,
    color: "var(--ink-3)",
    lineHeight: 1,
    cursor: "pointer",
    padding: 0,
    width: 28, height: 28,
  },
  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    borderBottom: "1px solid var(--rule)",
  },
  kpi: { padding: "16px 20px", borderRight: "1px solid var(--rule)" },
  kpiValue: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    fontWeight: 500,
    letterSpacing: "-0.018em",
    marginTop: 6,
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
    lineHeight: 1,
  },
  kpiDelta: { fontFamily: "var(--font-sans)", fontSize: 12, marginTop: 6 },
  section: { padding: "20px 24px", borderBottom: "1px solid var(--rule)" },
  tenantList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 0 },
  tenantRow: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr auto",
    gap: 10,
    padding: "10px 0",
    borderBottom: "1px solid var(--graphite-100)",
    alignItems: "baseline",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
  },
  tenantName: { fontFamily: "var(--font-cjk-sans)", color: "var(--ink)", fontWeight: 500 },
  tenantMeta: { color: "var(--ink-3)", fontSize: 12 },
  actions: { display: "flex", gap: 8, alignItems: "center" },
};

window.AssetDetailDrawer = AssetDetailDrawer;
