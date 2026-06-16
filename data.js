// BPM Intelligence — data-access layer (Supabase)
// Returns the SAME shapes the renderers already expect, so portfolio.js / app.js
// barely change. Requires window.sb (auth.js) to be loaded first.
// RLS does the security: a user only ever gets their client's published data.

async function bpmCurrentClient() {
  const { data, error } = await window.sb
    .from('clients').select('id,name,slug')
    .order('created_at', { ascending: true }).limit(1);
  if (error) throw new Error('讀取客戶失敗：' + error.message);
  if (!data || !data.length) throw new Error('沒有可存取的客戶資料（請確認帳號權限）');
  return data[0];
}

async function bpmLatestPeriod(clientId) {
  const { data, error } = await window.sb
    .from('periods').select('id,period,label,published_at,created_at')
    .eq('client_id', clientId).eq('published', true)
    .order('period', { ascending: false }).limit(1);
  if (error) throw new Error('讀取報告期間失敗：' + error.message);
  if (!data || !data.length) throw new Error('尚無已發布的報告期間');
  return data[0];
}

// Portfolio dashboard — returns the portfolio.json-shaped object.
async function bpmLoadPortfolio() {
  const client = await bpmCurrentClient();
  const period = await bpmLatestPeriod(client.id);
  const { data, error } = await window.sb
    .from('portfolio_data').select('data')
    .eq('client_id', client.id).eq('period_id', period.id).maybeSingle();
  if (error) throw new Error('讀取組合資料失敗：' + error.message);
  if (!data) throw new Error('找不到組合資料');
  return data.data;
}

// Asset detail — returns { latest, manifest, data } matching the old file flow.
async function bpmLoadAsset(code) {
  const client = await bpmCurrentClient();
  const period = await bpmLatestPeriod(client.id);

  const { data: asset, error: aerr } = await window.sb
    .from('assets').select('*')
    .eq('client_id', client.id).eq('code', code).maybeSingle();
  if (aerr) throw new Error('讀取資產失敗：' + aerr.message);
  if (!asset) throw new Error('找不到資產：' + code);

  const { data: rows, error: serr } = await window.sb
    .from('asset_section_data').select('section,data')
    .eq('asset_id', asset.id).eq('period_id', period.id);
  if (serr) throw new Error('讀取資產明細失敗：' + serr.message);

  const sections = {};
  (rows || []).forEach(r => { sections[r.section] = r.data; });

  return {
    latest: {
      assetName: asset.name, assetType: asset.type, location: asset.location,
      ownershipMeta: asset.ownership_meta, status: asset.status,
      statusColor: asset.status_color, currentPeriod: period.period
    },
    manifest: {
      period: period.period, periodLabel: period.label,
      lastUpdated: period.published_at || period.created_at
    },
    data: sections
  };
}

// ── Reports + Scenarios ────────────────────────────────────────────────────
async function bpmListPublishedPeriods(clientId) {
  const { data, error } = await window.sb.from('periods')
    .select('id,period,label,published_at').eq('client_id', clientId).eq('published', true)
    .order('period', { ascending: false });
  if (error) throw new Error('讀取報告期間失敗：' + error.message);
  return data || [];
}
async function bpmListClientDocuments(clientId) {
  const { data, error } = await window.sb.from('documents')
    .select('id,title,category,doc_type,size_bytes,storage_path,asset_id,created_at')
    .eq('client_id', clientId).order('created_at', { ascending: false });
  if (error) throw new Error('讀取文件失敗：' + error.message);
  return data || [];
}
async function bpmSignedDocUrl(path) {
  const { data, error } = await window.sb.storage.from('documents').createSignedUrl(path, 120);
  if (error) { console.error(error); return null; }
  return data.signedUrl;
}
// Loads everything the Scenarios page aggregates: all assets' financial + risk
// sections for the latest published period, plus the portfolio blob.
async function bpmLoadScenarioBundle() {
  const client = await bpmCurrentClient();
  const period = await bpmLatestPeriod(client.id);
  const [assetsRes, secRes, pfRes] = await Promise.all([
    window.sb.from('assets').select('id,code,name,sort_order').eq('client_id', client.id).order('sort_order', { ascending: true }),
    window.sb.from('asset_section_data').select('asset_id,section,data').eq('period_id', period.id).in('section', ['financial', 'risk']),
    window.sb.from('portfolio_data').select('data').eq('client_id', client.id).eq('period_id', period.id).maybeSingle()
  ]);
  if (assetsRes.error) throw new Error('讀取資產失敗：' + assetsRes.error.message);
  if (secRes.error) throw new Error('讀取資產明細失敗：' + secRes.error.message);
  const byAsset = {};
  (assetsRes.data || []).forEach(a => { byAsset[a.id] = { id: a.id, code: a.code, name: a.name, financial: null, risk: null }; });
  (secRes.data || []).forEach(r => { if (byAsset[r.asset_id]) byAsset[r.asset_id][r.section] = r.data; });
  return { client, period, assets: Object.values(byAsset), portfolio: (pfRes.data && pfRes.data.data) || {} };
}

// Shared chrome (sidebar/topbar/footer) — light queries on the existing schema.
// Client config (analyst / avatar / display name) is fetched separately and
// softly: a missing `config` column (migration 0004 not yet run) must never
// break the asset list, period, or the rest of the page.
async function bpmLoadChrome() {
  const client = await bpmCurrentClient();
  const period = await bpmLatestPeriod(client.id);
  const { data: assets, error } = await window.sb
    .from('assets').select('code,name,sort_order')
    .eq('client_id', client.id).order('sort_order', { ascending: true });
  if (error) throw new Error('讀取資產清單失敗：' + error.message);
  let config = {};
  try {
    const { data } = await window.sb.from('clients').select('config').eq('id', client.id).maybeSingle();
    if (data && data.config) config = data.config;
  } catch (e) { /* config column may not exist yet — degrade gracefully */ }
  return { client, period, assets: assets || [], config };
}

window.bpmCurrentClient = bpmCurrentClient;
window.bpmLoadPortfolio = bpmLoadPortfolio;
window.bpmLoadAsset = bpmLoadAsset;
window.bpmListPublishedPeriods = bpmListPublishedPeriods;
window.bpmListClientDocuments = bpmListClientDocuments;
window.bpmSignedDocUrl = bpmSignedDocUrl;
window.bpmLoadScenarioBundle = bpmLoadScenarioBundle;
window.bpmLoadChrome = bpmLoadChrome;
