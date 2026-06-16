/* CapabilityGrid.jsx — 3 × 2 capability blocks */

function CapabilityGrid({ locale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);

  const items = [
    {
      n: "01",
      head_en: "Mark every quarter, defensibly",
      head_tc: "每季重新估值，且可被論證",
      body_en: "Every lease line, every comparable, every assumption — versioned, sourced, and ready for committee questioning. The numbers are footnoted; the methodology is in plain English and 繁中.",
      body_tc: "每一條租約、每一筆可比交易、每一項假設，皆有版本、有來源，足以面對委員會的詰問。數字附註解，方法論以英文與繁體中文並陳。",
    },
    {
      n: "02",
      head_en: "One book, many holders",
      head_tc: "一本帳，多位持有人",
      body_en: "Roll twenty-three exposures held across six legal vehicles into a single view, then drill down to the SPV, the floor, the tenant, the line item. No re-keying, no spreadsheet reconciliation calls on a Friday evening.",
      body_tc: "二十三檔資產分散於六個法人載體，匯整為單一視圖，向下穿透至 SPV、樓層、租戶、明細。無需重複輸入，亦不再有週五傍晚的試算表對帳會議。",
    },
    {
      n: "03",
      head_en: "Scenario without surprise",
      head_tc: "情境推演無意外",
      body_en: "Stress an assumption — interest, vacancy, FX, cap‑rate — and watch every cash flow re-converge. Compare against the prior quarter's run so the committee sees what changed, not what was always there.",
      body_tc: "對任一假設施壓 ── 利率、空置率、匯率、資本化率 ── 觀察所有現金流如何重新收斂。與上一季結果並列，讓委員會看見「改變了什麼」，而非「一向如此」。",
    },
    {
      n: "04",
      head_en: "Built for Asia first",
      head_tc: "亞洲為先",
      body_en: "Traditional Chinese is not an afterthought. Tabular numerals align across 半形 and 全形 punctuation. Holiday calendars and quarter-ends reflect TPE, HKG, SGP, TYO out of the box.",
      body_tc: "繁體中文並非事後翻譯。表格數字在半形與全形標點之間皆對齊。台北、香港、新加坡、東京的假期日曆與季底原生支援。",
    },
    {
      n: "05",
      head_en: "Your analyst, named",
      head_tc: "您專屬的分析師",
      body_en: "Every BPM client is paired with a named director-grade analyst — typically a former REIT investment professional. They sit inside your workflow, not in a CRM ticket queue.",
      body_tc: "每位 BPM 客戶皆配有一位總監級分析師（多為前 REIT 投資專業人員），並進入您的工作流程中，而非在 CRM 工單系統的另一端。",
    },
    {
      n: "06",
      head_en: "Report-grade output",
      head_tc: "報告級輸出",
      body_en: "Export to a paginated PDF that reads like a fixed-income tear sheet, not a SaaS dashboard. Every committee pack, audit-trail-attached. Branding stays yours.",
      body_tc: "匯出為分頁排版的 PDF，閱讀體驗如同固定收益產品說明書，而非 SaaS 儀表板。每份委員會資料包附審計軌跡。署名為貴方所有。",
    },
  ];

  return (
    <section id="platform" style={capStyles.section}>
      <div style={capStyles.head}>
        <span className="eyebrow eyebrow-red">{tr("Platform · 平台", "平台")}</span>
        <h2 className="serif" style={capStyles.title}>
          {tr("Six things we do, in order of how often you'll use them.", "六項服務，依使用頻率排列。")}
        </h2>
      </div>

      <div style={capStyles.grid}>
        {items.map(it => (
          <div key={it.n} style={capStyles.cell}>
            <div style={capStyles.num}>{it.n}</div>
            <h3 className="serif-tc" style={capStyles.head_tc}>{locale === "tc" ? it.head_tc : it.head_en}</h3>
            <p style={capStyles.body}>{locale === "tc" ? it.body_tc : it.body_en}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const capStyles = {
  section: { padding: "80px 0 96px" },
  head: { marginBottom: 48, display: "flex", flexDirection: "column", gap: 12 },
  title: { fontSize: 44, fontWeight: 500, lineHeight: 1.15, color: "var(--ink)", margin: 0, maxWidth: "18em" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    rowGap: 0, columnGap: 0,
    borderTop: "1px solid var(--rule)",
    borderLeft: "1px solid var(--rule)",
  },
  cell: {
    padding: "32px 32px 36px",
    borderRight: "1px solid var(--rule)",
    borderBottom: "1px solid var(--rule)",
  },
  num: {
    fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--bpm-red)",
    letterSpacing: "0.14em", marginBottom: 18,
  },
  head_tc: { fontSize: 22, fontWeight: 600, lineHeight: 1.35, color: "var(--ink)", margin: 0 },
  body: { marginTop: 12, fontSize: 14, lineHeight: 1.7, color: "var(--ink-2)" },
};

window.CapabilityGrid = CapabilityGrid;
