/* PortfolioMap.jsx — stylised SVG of Asia with bubble overlays
   --------------------------------------------------------------- */

function PortfolioMap({ bubbles, locale }) {
  const tr = (en, tc) => (locale === "tc" ? tc : en);

  // Very abstract, hand-positioned silhouettes of major Asia coastlines.
  // Not a real map. The point is the geographic mental model + bubble exposure.
  return (
    <div style={mapStyles.card}>
      <div style={mapStyles.head}>
        <div>
          <div className="eyebrow">{tr("Geographic exposure", "地理曝險")}</div>
          <div className="serif" style={{ fontSize: 22, marginTop: 4 }}>
            {tr("Asia book · by mark-to-market", "亞洲組合 · 依市值")}
          </div>
        </div>
        <div style={mapStyles.legend}>
          <span style={mapStyles.legendItem}>
            <span style={{ ...mapStyles.bubble, background: "var(--bpm-red)" }}></span>
            {tr("BPM exposure", "BPM 曝險")}
          </span>
          <span style={mapStyles.legendItem}>
            <span style={{ ...mapStyles.bubble, background: "var(--info)", opacity: 0.6 }}></span>
            {tr("Peer (avg)", "同業均值")}
          </span>
        </div>
      </div>

      <div style={mapStyles.map}>
        <svg viewBox="0 0 640 360" style={{ width: "100%", height: "100%", display: "block" }}>
          <defs>
            <pattern id="bpm-grid" width="32" height="20" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V20" fill="none" stroke="#D8D5CE" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="640" height="360" fill="url(#bpm-grid)" opacity="0.6" />

          {/* Abstract coastline — pure decoration */}
          <path
            d="M60 220 Q90 180, 150 170 T 250 150 Q 290 130, 330 140 L 380 130 Q 420 120, 470 145 Q 510 165, 540 200 L 560 230 Q 540 260, 510 270 L 460 280 Q 410 290, 360 280 L 300 290 Q 240 300, 180 285 L 130 270 Q 90 255, 70 240 Z"
            fill="var(--paper-2)"
            stroke="var(--ink-5)"
            strokeWidth="0.75"
          />
          <path
            d="M450 60 Q 490 70, 520 90 L 540 110 Q 530 130, 510 135 Q 480 130, 470 110 Z"
            fill="var(--paper-2)"
            stroke="var(--ink-5)"
            strokeWidth="0.75"
          />

          {/* City labels + bubbles */}
          {bubbles.map(b => (
            <g key={b.id}>
              {/* peer bubble */}
              <circle
                cx={b.x}
                cy={b.y}
                r={b.peerR}
                fill="#33547A"
                opacity={0.18}
                stroke="#33547A"
                strokeWidth="0.75"
              />
              {/* BPM bubble */}
              <circle
                cx={b.x}
                cy={b.y}
                r={b.r}
                fill="#8E1B1F"
                opacity={0.85}
              />
              <circle cx={b.x} cy={b.y} r={2} fill="#0B0B0C" />
              <line x1={b.x} y1={b.y} x2={b.x + 14} y2={b.y - 16} stroke="#0B0B0C" strokeWidth="0.75" />
              <text
                x={b.x + 16}
                y={b.y - 16}
                fontFamily="Inter, sans-serif"
                fontSize="11"
                fontWeight="600"
                fill="#0B0B0C"
              >
                {locale === "tc" ? b.name_tc : b.name}
              </text>
              <text
                x={b.x + 16}
                y={b.y - 4}
                fontFamily="JetBrains Mono, monospace"
                fontSize="10"
                fill="#5C5C61"
              >
                {b.mark}
              </text>
            </g>
          ))}

          <line x1="0" y1="358" x2="640" y2="358" stroke="#0B0B0C" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

const mapStyles = {
  card: { border: "1px solid var(--rule)", background: "var(--bone)" },
  head: {
    padding: "16px 20px",
    borderBottom: "1px solid var(--rule)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  },
  legend: { display: "flex", gap: 14, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-3)" },
  legendItem: { display: "inline-flex", alignItems: "center", gap: 6 },
  bubble: { width: 10, height: 10, borderRadius: 999, display: "inline-block" },
  map: { padding: 8, background: "var(--paper)" },
};

window.PortfolioMap = PortfolioMap;
