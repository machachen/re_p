// ============================================================================
// BPM Intelligence — seed generator
// Reads the existing demo JSON (../../data) and emits an idempotent seed.sql
// that loads 陳氏家族信託 as client #1, period 2026-05 (published).
// Run:  node supabase/seed/build_seed.mjs
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '..', '..', 'data');

const SLUG = 'chen-family';
const PERIOD = '2026-05';
const SECTIONS = ['overview', 'ownership-capital', 'financial', 'risk', 'operations', 'documents', 'market'];

const c = (s) => '$c$' + String(s ?? '') + '$c$';            // text literal (dollar-quoted)
const j = (o) => '$j$' + JSON.stringify(o) + '$j$';          // jsonb literal (dollar-quoted)

const portfolio = JSON.parse(readFileSync(join(dataDir, 'portfolio.json'), 'utf8'));
const clientName = portfolio?.meta?.portfolioName || '陳氏家族信託 — 不動產資產組合';
const periodLabel = portfolio?.meta?.periodLabel || '2026年5月';

const assetsDir = join(dataDir, 'assets');
const codes = readdirSync(assetsDir).filter((d) => /^asset-/.test(d)).sort();

let sql = '';
sql += `-- BPM seed — generated ${new Date().toISOString()}\n`;
sql += `-- Idempotent: safe to re-run. Loads client '${SLUG}', period ${PERIOD} (published).\n\nbegin;\n\n`;

sql += `insert into public.clients (name, slug) values (${c(clientName)}, '${SLUG}')\n  on conflict (slug) do nothing;\n\n`;

sql += `insert into public.periods (client_id, period, label, published, published_at)\n` +
       `  select id, '${PERIOD}', ${c(periodLabel)}, true, now() from public.clients where slug = '${SLUG}'\n` +
       `  on conflict (client_id, period) do nothing;\n\n`;

codes.forEach((code, i) => {
  const m = JSON.parse(readFileSync(join(assetsDir, code, 'latest.json'), 'utf8'));
  sql += `insert into public.assets (client_id, code, name, type, location, ownership_meta, status, status_color, sort_order)\n` +
         `  select id, ${c(code)}, ${c(m.assetName)}, ${c(m.assetType)}, ${c(m.location)}, ${c(m.ownershipMeta)}, ${c(m.status)}, ${c(m.statusColor)}, ${i + 1}\n` +
         `  from public.clients where slug = '${SLUG}'\n` +
         `  on conflict (client_id, code) do nothing;\n`;
});

sql += `\ninsert into public.portfolio_data (client_id, period_id, data)\n` +
       `  select c.id, p.id, ${j(portfolio)}::jsonb\n` +
       `  from public.clients c join public.periods p on p.client_id = c.id and p.period = '${PERIOD}'\n` +
       `  where c.slug = '${SLUG}'\n` +
       `  on conflict (client_id, period_id) do update set data = excluded.data, updated_at = now();\n\n`;

let sectionCount = 0;
for (const code of codes) {
  const m = JSON.parse(readFileSync(join(assetsDir, code, 'latest.json'), 'utf8'));
  const per = m.currentPeriod || PERIOD;
  for (const section of SECTIONS) {
    const f = join(assetsDir, code, per, section + '.json');
    if (!existsSync(f)) continue;
    const data = JSON.parse(readFileSync(f, 'utf8'));
    sectionCount++;
    sql += `insert into public.asset_section_data (asset_id, period_id, section, data)\n` +
           `  select a.id, p.id, ${c(section)}, ${j(data)}::jsonb\n` +
           `  from public.assets a join public.periods p on p.client_id = a.client_id and p.period = '${PERIOD}'\n` +
           `  where a.code = ${c(code)} and a.client_id = (select id from public.clients where slug = '${SLUG}')\n` +
           `  on conflict (asset_id, period_id, section) do update set data = excluded.data, updated_at = now();\n`;
  }
}

sql += `\ncommit;\n`;

writeFileSync(join(here, 'seed.sql'), sql);
console.log(`seed.sql written — ${codes.length} assets, ${sectionCount} section blobs, period ${PERIOD}`);
console.log('assets:', codes.join(', '));
