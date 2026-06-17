// ============================================================================
// BPM Intelligence — seed generator (multi-client, quarter-based)
// Loops over every client folder and emits an idempotent seed.sql:
//   • chen-family  (data/)              periods 2026-Q1 + 2026-Q2
//   • tsai-family  (data/tsai-family/)  periods 2026-Q1 + 2026-Q2
// Asset-level data exists for BOTH quarters; portfolio_data only for the latest
// quarter (2026-Q2). Recodes a legacy month period (2026-05 -> 2026-Q2) in place
// for chen so an existing database upgrades without losing data. Safe to re-run.
// Run:  node supabase/seed/build_seed.mjs
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '..', '..', 'data');

const PERIODS = [{ code: '2026-Q1', label: '2026 Q1' }, { code: '2026-Q2', label: '2026 Q2' }];
const LATEST = '2026-Q2';
const SECTIONS = ['overview', 'ownership-capital', 'financial', 'risk', 'operations', 'documents', 'market'];

const CLIENTS = [
  { slug: 'chen-family', dir: dataDir, legacy: '2026-05' },
  { slug: 'tsai-family', dir: join(dataDir, 'tsai-family'), legacy: null },
];

const c = (s) => '$c$' + String(s ?? '') + '$c$';
const j = (o) => '$j$' + JSON.stringify(o) + '$j$';

let sql = '';
sql += `-- BPM seed — generated ${new Date().toISOString()}\n`;
sql += `-- Multi-client quarter seed (${CLIENTS.map(c => c.slug).join(' + ')}); periods ${PERIODS.map(p => p.code).join(' + ')}. Idempotent.\n\nbegin;\n\n`;
sql += `-- ensure the client config column exists (covers databases created before migration 0004)\n`;
sql += `alter table public.clients add column if not exists config jsonb;\n\n`;

let totalSections = 0;
for (const cl of CLIENTS) {
  const portfolio = JSON.parse(readFileSync(join(cl.dir, 'portfolio.json'), 'utf8'));
  const clientName = portfolio?.meta?.portfolioName || cl.slug;
  const cfg = JSON.parse(readFileSync(join(cl.dir, 'client.json'), 'utf8')).config;
  const assetsDir = join(cl.dir, 'assets');
  const codes = readdirSync(assetsDir).filter((d) => /^(asset|tsai)-\d/.test(d)).sort();

  sql += `-- ===================== ${cl.slug} =====================\n`;
  sql += `insert into public.clients (name, slug, config) values (${c(clientName)}, '${cl.slug}', ${j(cfg)}::jsonb)\n  on conflict (slug) do update set name = excluded.name, config = excluded.config;\n\n`;

  if (cl.legacy) {
    sql += `-- one-time upgrade: rename legacy month period to a quarter code (no-op if absent)\n`;
    sql += `update public.periods set period = '${LATEST}', label = ${c('2026 Q2')}\n` +
           `  where client_id = (select id from public.clients where slug = '${cl.slug}') and period = '${cl.legacy}';\n\n`;
  }

  for (const p of PERIODS) {
    sql += `insert into public.periods (client_id, period, label, published, published_at)\n` +
           `  select id, '${p.code}', ${c(p.label)}, true, now() from public.clients where slug = '${cl.slug}'\n` +
           `  on conflict (client_id, period) do update set label = excluded.label, published = true;\n`;
  }
  sql += `\n`;

  codes.forEach((code, i) => {
    const m = JSON.parse(readFileSync(join(assetsDir, code, 'latest.json'), 'utf8'));
    sql += `insert into public.assets (client_id, code, name, type, location, ownership_meta, status, status_color, sort_order)\n` +
           `  select id, ${c(code)}, ${c(m.assetName)}, ${c(m.assetType)}, ${c(m.location)}, ${c(m.ownershipMeta)}, ${c(m.status)}, ${c(m.statusColor)}, ${i + 1}\n` +
           `  from public.clients where slug = '${cl.slug}'\n` +
           `  on conflict (client_id, code) do update set name = excluded.name, sort_order = excluded.sort_order;\n`;
  });

  sql += `\ninsert into public.portfolio_data (client_id, period_id, data)\n` +
         `  select cc.id, p.id, ${j(portfolio)}::jsonb\n` +
         `  from public.clients cc join public.periods p on p.client_id = cc.id and p.period = '${LATEST}'\n` +
         `  where cc.slug = '${cl.slug}'\n` +
         `  on conflict (client_id, period_id) do update set data = excluded.data, updated_at = now();\n\n`;

  for (const p of PERIODS) {
    for (const code of codes) {
      for (const section of SECTIONS) {
        const f = join(assetsDir, code, p.code, section + '.json');
        if (!existsSync(f)) continue;
        const data = JSON.parse(readFileSync(f, 'utf8'));
        totalSections++;
        sql += `insert into public.asset_section_data (asset_id, period_id, section, data)\n` +
               `  select a.id, pe.id, ${c(section)}, ${j(data)}::jsonb\n` +
               `  from public.assets a join public.periods pe on pe.client_id = a.client_id and pe.period = '${p.code}'\n` +
               `  where a.code = ${c(code)} and a.client_id = (select id from public.clients where slug = '${cl.slug}')\n` +
               `  on conflict (asset_id, period_id, section) do update set data = excluded.data, updated_at = now();\n`;
      }
    }
  }
  sql += `\n`;
}

sql += `commit;\n`;
writeFileSync(join(here, 'seed.sql'), sql);
console.log(`seed.sql written — ${CLIENTS.length} clients, ${totalSections} section blobs, periods ${PERIODS.map(p => p.code).join(' + ')}`);
