// ============================================================================
// BPM Intelligence — seed generator (quarter-based)
// Reads the demo JSON (../../data) and emits an idempotent seed.sql that loads
// 陳氏家族信託 with quarter periods 2026-Q1 + 2026-Q2 (both published).
// Asset-level data exists for BOTH quarters; portfolio_data only for the latest
// quarter (2026-Q2) — the portfolio dashboard has no quarter switcher yet.
// It also recodes a legacy month period (2026-05 -> 2026-Q2) in place, so an
// existing database upgrades without losing its data. Safe to re-run.
// Run:  node supabase/seed/build_seed.mjs
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '..', '..', 'data');

const SLUG = 'chen-family';
const PERIODS = [                          // oldest -> newest
  { code: '2026-Q1', label: '2026 Q1' },
  { code: '2026-Q2', label: '2026 Q2' },
];
const LATEST = '2026-Q2';                   // portfolio_data attaches here only
const LEGACY = '2026-05';                   // old month period to recode in place
const SECTIONS = ['overview', 'ownership-capital', 'financial', 'risk', 'operations', 'documents', 'market'];

const c = (s) => '$c$' + String(s ?? '') + '$c$';            // text literal (dollar-quoted)
const j = (o) => '$j$' + JSON.stringify(o) + '$j$';          // jsonb literal (dollar-quoted)

const portfolio = JSON.parse(readFileSync(join(dataDir, 'portfolio.json'), 'utf8'));
const clientName = portfolio?.meta?.portfolioName || '陳氏家族信託 — 不動產資產組合';
const clientCfg = JSON.parse(readFileSync(join(dataDir, 'client.json'), 'utf8')).config;

const assetsDir = join(dataDir, 'assets');
const codes = readdirSync(assetsDir).filter((d) => /^asset-/.test(d)).sort();

let sql = '';
sql += `-- BPM seed — generated ${new Date().toISOString()}\n`;
sql += `-- Idempotent quarter seed: client '${SLUG}', periods ${PERIODS.map(p => p.code).join(' + ')} (published).\n\nbegin;\n\n`;

// ensure the client config column exists (covers databases created before migration 0004)
sql += `alter table public.clients add column if not exists config jsonb;\n\n`;

// client (with UI config)
sql += `insert into public.clients (name, slug, config) values (${c(clientName)}, '${SLUG}', ${j(clientCfg)}::jsonb)\n  on conflict (slug) do update set name = excluded.name, config = excluded.config;\n\n`;

// recode any legacy month period to the quarter code (keeps its existing data)
sql += `-- one-time upgrade: rename the legacy month period to a quarter code (no-op if absent)\n`;
sql += `update public.periods set period = '${LATEST}', label = ${c('2026 Q2')}\n` +
       `  where client_id = (select id from public.clients where slug = '${SLUG}') and period = '${LEGACY}';\n\n`;

// periods
for (const p of PERIODS) {
  sql += `insert into public.periods (client_id, period, label, published, published_at)\n` +
         `  select id, '${p.code}', ${c(p.label)}, true, now() from public.clients where slug = '${SLUG}'\n` +
         `  on conflict (client_id, period) do update set label = excluded.label, published = true;\n`;
}
sql += `\n`;

// assets (client-level; period-independent)
codes.forEach((code, i) => {
  const m = JSON.parse(readFileSync(join(assetsDir, code, 'latest.json'), 'utf8'));
  sql += `insert into public.assets (client_id, code, name, type, location, ownership_meta, status, status_color, sort_order)\n` +
         `  select id, ${c(code)}, ${c(m.assetName)}, ${c(m.assetType)}, ${c(m.location)}, ${c(m.ownershipMeta)}, ${c(m.status)}, ${c(m.statusColor)}, ${i + 1}\n` +
         `  from public.clients where slug = '${SLUG}'\n` +
         `  on conflict (client_id, code) do update set name = excluded.name, sort_order = excluded.sort_order;\n`;
});

// portfolio_data — latest quarter only
sql += `\ninsert into public.portfolio_data (client_id, period_id, data)\n` +
       `  select c.id, p.id, ${j(portfolio)}::jsonb\n` +
       `  from public.clients c join public.periods p on p.client_id = c.id and p.period = '${LATEST}'\n` +
       `  where c.slug = '${SLUG}'\n` +
       `  on conflict (client_id, period_id) do update set data = excluded.data, updated_at = now();\n\n`;

// asset_section_data — every quarter
let sectionCount = 0;
for (const p of PERIODS) {
  for (const code of codes) {
    for (const section of SECTIONS) {
      const f = join(assetsDir, code, p.code, section + '.json');
      if (!existsSync(f)) continue;
      const data = JSON.parse(readFileSync(f, 'utf8'));
      sectionCount++;
      sql += `insert into public.asset_section_data (asset_id, period_id, section, data)\n` +
             `  select a.id, pe.id, ${c(section)}, ${j(data)}::jsonb\n` +
             `  from public.assets a join public.periods pe on pe.client_id = a.client_id and pe.period = '${p.code}'\n` +
             `  where a.code = ${c(code)} and a.client_id = (select id from public.clients where slug = '${SLUG}')\n` +
             `  on conflict (asset_id, period_id, section) do update set data = excluded.data, updated_at = now();\n`;
    }
  }
}

sql += `\ncommit;\n`;

writeFileSync(join(here, 'seed.sql'), sql);
console.log(`seed.sql written — ${codes.length} assets x ${PERIODS.length} quarters, ${sectionCount} section blobs`);
console.log('periods:', PERIODS.map(p => p.code).join(', '), '| portfolio_data:', LATEST);
