/* Composer.jsx — bottom dock "ask your analyst" composer
   --------------------------------------------------------------- */

function Composer({ locale, onSubmit }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);
  const [value, setValue] = React.useState("");

  const suggestions = locale === "tc"
    ? ["哪些資產 QoQ 變動 > 1%？", "重新整理零售類別的對標", "本季新增的 11 筆異動"]
    : ["Which assets moved > 1% QoQ?", "Refresh retail-sector benchmark", "Eleven exposures changed this quarter"];

  return (
    <div style={composerStyles.shell}>
      <div style={composerStyles.head}>
        <span className="eyebrow eyebrow-red">{tr("Ask your analyst", "詢問分析師")} · Audrey Cheung</span>
        <span className="meta">{tr("Replies within 4 business hours · TPE", "台北辦公時間內 4 小時回覆")}</span>
      </div>
      <div style={composerStyles.suggestions}>
        {suggestions.map(s => (
          <button key={s} style={composerStyles.sugg} onClick={() => setValue(s)}>
            {s}
          </button>
        ))}
      </div>
      <form
        style={composerStyles.row}
        onSubmit={e => {
          e.preventDefault();
          if (value.trim()) onSubmit?.(value);
          setValue("");
        }}
      >
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={tr("Type a question, or paste a memo to extract …", "輸入問題，或貼上一段備忘錄 …")}
          style={composerStyles.input}
        />
        <button type="button" className="btn btn-secondary" style={composerStyles.attachBtn}>
          + {tr("Attach", "附件")}
        </button>
        <button type="submit" className="btn btn-primary" disabled={!value.trim()}>
          {tr("Send", "送出")}
        </button>
      </form>
    </div>
  );
}

const composerStyles = {
  shell: {
    border: "1px solid var(--rule)",
    background: "var(--bone)",
    padding: "14px 18px",
  },
  head: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  suggestions: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  sugg: {
    background: "var(--paper)",
    border: "1px solid var(--rule)",
    borderRadius: 999,
    padding: "5px 12px",
    fontSize: 12,
    color: "var(--ink-2)",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  row: { display: "flex", gap: 8, alignItems: "stretch" },
  input: {
    flex: 1,
    background: "var(--paper)",
    border: "1px solid var(--rule)",
    borderRadius: 2,
    padding: "10px 14px",
    fontSize: 14,
    color: "var(--ink)",
    fontFamily: "var(--font-sans)",
  },
  attachBtn: { padding: "8px 12px" },
};

window.Composer = Composer;
