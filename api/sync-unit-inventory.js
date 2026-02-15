/**
 * Syncs unit inventory XML feed into Supabase unit_inventory table.
 * Use for FOM PRINT's dedicated Supabase (or next-gen project).
 * Call via Vercel Cron: GET /api/sync-unit-inventory (add CRON_SECRET to headers).
 */
const { XMLParser } = require('fast-xml-parser');
const { createClient } = require('@supabase/supabase-js');

const DEFAULT_FEED_URL = 'https://www.flatoutmotorcycles.com/unitinventory_univ.xml';
const TABLE = process.env.UNIT_INVENTORY_TABLE || 'unit_inventory';

function buildSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase configuration missing');
  return createClient(url, key);
}

function normalizeArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function toNumber(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toInt(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function toTimestamp(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function sanitizeDescription(v) {
  if (!v) return null;
  const raw = String(v)
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/\s*br\s*>/gi, '\n');
  return raw.replace(/<[^>]+>/g, '').split('\n').map((l) => l.trim()).filter(Boolean).join('<br>');
}

function normalizeImages(node) {
  const urls = normalizeArray(node?.imageurl).filter(Boolean);
  return urls.length ? urls : [];
}

function normalizeAttributes(node) {
  const raw = normalizeArray(node?.attribute);
  const attrs = raw
    .map((a) => ({ name: a?.name || null, value: a?.value || null }))
    .filter((a) => a.name || a.value);
  return attrs.length ? attrs : [];
}

function normalizeItem(item) {
  return {
    id: item.id || null,
    title: item.title || null,
    link: item.link || null,
    description: sanitizeDescription(item.description),
    price: toNumber(item.price),
    price_type: item.price_type || null,
    stocknumber: item.stocknumber || null,
    vin: item.vin || null,
    manufacturer: item.manufacturer || null,
    year: toInt(item.year),
    color: item.color || null,
    model_type: item.model_type || null,
    model_typestyle: item.model_typestyle || null,
    model_name: item.model_name || null,
    trim_name: item.trim_name || null,
    trim_color: item.trim_color || null,
    condition: item.condition || null,
    usage: item.usage || null,
    location: item.location || null,
    updated: toTimestamp(item.updated),
    metric_type: item.metric_type || null,
    metric_value: toNumber(item.metric_value),
    images: normalizeImages(item.images),
    attributes: normalizeAttributes(item.attributes),
  };
}

function normalizeFeedData(parsed) {
  const feed = parsed?.feed || {};
  const items = normalizeArray(feed.item).map(normalizeItem);
  return { items };
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: require CRON_SECRET when set (Vercel Cron sends it)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const feedUrl = req.query?.feedUrl || req.body?.feedUrl || DEFAULT_FEED_URL;
    const response = await fetch(feedUrl);
    if (!response.ok) throw new Error(`Feed failed: ${response.status}`);
    const xml = await response.text();

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', trimValues: true });
    const parsed = parser.parse(xml);
    const { items } = normalizeFeedData(parsed);
    const validItems = items.filter((i) => i.id);

    if (!validItems.length) {
      return res.status(400).json({ error: 'No valid inventory items' });
    }

    const supabase = buildSupabaseClient();
    const batchSize = 100;
    let synced = 0;
    const nowIso = new Date().toISOString();

    for (const batch of chunkArray(validItems, batchSize)) {
      const batchWithTimestamp = batch.map((item) => ({ ...item, updated_at: nowIso }));
      const { error } = await supabase.from(TABLE).upsert(batchWithTimestamp, { onConflict: 'id', ignoreDuplicates: false });
      if (error) return res.status(500).json({ error: error.message });
      synced += batch.length;
    }

    return res.status(200).json({ success: true, feedUrl, items: synced, skipped: items.length - validItems.length });
  } catch (err) {
    console.error('Sync error:', err);
    return res.status(500).json({ error: 'Sync failed', message: err.message });
  }
};
