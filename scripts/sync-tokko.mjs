#!/usr/bin/env node
/**
 * Sync Tokko Broker -> src/data/tokko-cache.json + split files
 * Usa TOKKO_API_KEY de .env o env var.
 * Mantiene cache aunque API falle (no rompe build).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) {
        const k = m[1];
        let v = m[2].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        if (!process.env[k]) process.env[k] = v;
      }
    }
  }
}
loadEnv();

const API_KEY = process.env.TOKKO_API_KEY;
const LANG = process.env.TOKKO_LANG || "es_ar";
if (!API_KEY) {
  console.error("❌ TOKKO_API_KEY no definida. Define en .env o env var.");
  process.exit(1);
}

const API_BASE = "https://www.tokkobroker.com/api/v1";

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${txt.slice(0, 500)}`);
  }
  return res.json();
}

async function fetchAllProperties() {
  const limit = 50;
  let offset = 0;
  let all = [];
  let total = null;
  console.log(`→ Fetching Tokko properties...`);
  do {
    const url = `${API_BASE}/property/?key=${API_KEY}&format=json&lang=${LANG}&limit=${limit}&offset=${offset}`;
    console.log(`  fetching offset ${offset}...`);
    const data = await fetchJson(url);
    const objs = data.objects || [];
    if (total === null) total = data.meta?.total_count ?? objs.length;
    all = all.concat(objs);
    if (objs.length < limit) break;
    offset += limit;
  } while (all.length < (total ?? Infinity));
  // Fetch detail for each to get videos (list endpoint omits videos sometimes)
  console.log(`  fetched ${all.length}/${total} list items. Fetching details for videos/photos full...`);
  const detailed = [];
  for (let i = 0; i < all.length; i++) {
    const id = all[i].id;
    try {
      const detail = await fetchJson(`${API_BASE}/property/${id}/?key=${API_KEY}&format=json&lang=${LANG}`);
      // Merge: detail has videos, photos full etc. Prefer detail
      detailed.push(detail);
      if ((i + 1) % 5 === 0) console.log(`    detail ${i + 1}/${all.length}`);
    } catch (e) {
      console.warn(`  ⚠ detail fetch failed for ${id}: ${e.message} - using list item`);
      detailed.push(all[i]);
    }
    // gentle throttle to avoid 429
    if (i % 10 === 9) await new Promise((r) => setTimeout(r, 300));
  }
  return detailed;
}

function normalizeForCache(raw) {
  // Minimal transform here - full normalize happens in tokko.ts at build time
  // We store raw + helper fields for cache
  return raw;
}

async function main() {
  const outDir = path.join(root, "src", "data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const cachePath = path.join(outDir, "tokko-cache.json");
  const ventaPath = path.join(outDir, "tokko-venta.json");
  const rentaPath = path.join(outDir, "tokko-renta.json");

  let rawProps = [];
  try {
    rawProps = await fetchAllProperties();
  } catch (e) {
    console.error("❌ Fetch failed:", e.message);
    if (fs.existsSync(cachePath)) {
      console.log("→ Usando cache existente, no se rompe build.");
      process.exit(0);
    } else {
      process.exit(1);
    }
  }

  // Store cache with meta
  const payload = {
    meta: {
      total_count: rawProps.length,
      synced_at: new Date().toISOString(),
      lang: LANG,
    },
    objects: rawProps,
  };
  fs.writeFileSync(cachePath, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`✓ Cache escrito: ${cachePath} (${rawProps.length} props)`);

  // Split by operation for convenience
  const venta = rawProps.filter((p) => p.operations?.some((op) => op.operation_id === 1));
  const renta = rawProps.filter((p) => p.operations?.some((op) => op.operation_id === 2 || op.operation_id === 3));

  fs.writeFileSync(ventaPath, JSON.stringify({ meta: { count: venta.length, synced_at: payload.meta.synced_at }, objects: venta }, null, 2), "utf-8");
  fs.writeFileSync(rentaPath, JSON.stringify({ meta: { count: renta.length, synced_at: payload.meta.synced_at }, objects: renta }, null, 2), "utf-8");
  console.log(`✓ Venta: ${venta.length} -> ${ventaPath}`);
  console.log(`✓ Renta: ${renta.length} -> ${rentaPath}`);

  // Print summary for deploy log
  console.log("\nResumen:");
  console.log(`  Venta IDs: ${venta.map((p) => p.id).join(", ")}`);
  console.log(`  Renta IDs: ${renta.map((p) => p.id).join(", ")}`);
}

main();
