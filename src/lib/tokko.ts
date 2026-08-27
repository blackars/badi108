/**
 * Tokko Broker integration - Types & Normalizer
 * Mantiene estética actual, solo adapta datos.
 */

export interface TokkoPhoto {
  description: string | null;
  image: string;
  thumb: string;
  original: string;
  is_blueprint: boolean;
  is_front_cover: boolean;
  order: number;
}

export interface TokkoVideo {
  id: number;
  title: string;
  url: string;
  player_url: string;
  provider: string;
  video_id: string;
  description: string;
}

export interface TokkoOperation {
  operation_id: number; // 1 Venta, 2 Alquiler, 3 Temporal
  operation_type: string;
  prices: { currency: string; price: number; period: number; is_promotional: boolean }[];
}

export interface TokkoRawProperty {
  id: number;
  fake_address: string;
  address: string;
  publication_title: string;
  description: string;
  type: { id: number; code: string; name: string };
  operations: TokkoOperation[];
  photos: TokkoPhoto[];
  videos?: TokkoVideo[];
  suite_amount: number;
  room_amount: number;
  bathroom_amount: number;
  parking_lot_amount: number;
  surface: string | number;
  roofed_surface: string | number;
  total_surface: string | number;
  location: { full_location: string; short_location: string; name: string };
  tags?: any[];
  custom_tags?: any[];
  is_starred_on_web: boolean;
  created_at: string;
  deleted_at?: string | null;
  expenses?: number;
  geo_lat?: string;
  geo_long?: string;
}

export interface NormalizedProperty {
  id: number;
  slug: string;
  title: string;
  address: string;
  location: string;
  locationShort: string;
  description: string;
  operation: "venta" | "alquiler" | "temporal" | "unknown";
  operationLabel: string;
  price: number | null;
  currency: string;
  priceFormatted: string;
  typeCode: string;
  typeName: string;
  bedrooms: number;
  bathrooms: number;
  rooms: number;
  parking: number;
  surface: number | null;
  roofedSurface: number | null;
  totalSurface: number | null;
  expenses: number | null;
  photos: string[];
  thumbs: string[];
  cover: string | null;
  videos: TokkoVideo[];
  isStarred: boolean;
  createdAt: string;
  deletedAt: string | null;
  tokkoUrl?: string;
}

function parseSurface(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = parseFloat(String(v));
  return isNaN(n) || n === 0 ? null : n;
}

function formatPrice(price: number | null, currency: string): string {
  if (price === null || price === undefined || price === 0) return "Consultar";
  try {
    const c = currency === "MXN" ? "MXN" : currency === "USD" ? "USD" : currency;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: c,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `$${price.toLocaleString("es-MX")} ${currency}`;
  }
}

export function normalizeTokkoProperty(raw: TokkoRawProperty): NormalizedProperty {
  const op = raw.operations?.[0];
  const opId = op?.operation_id ?? 0;
  let operation: NormalizedProperty["operation"] = "unknown";
  let operationLabel = op?.operation_type ?? "Propiedad";
  if (opId === 1) {
    operation = "venta";
    operationLabel = "Venta";
  } else if (opId === 2) {
    operation = "alquiler";
    operationLabel = "Renta";
  } else if (opId === 3) {
    operation = "temporal";
    operationLabel = "Renta Temporal";
  }

  const priceObj = op?.prices?.[0];
  const price = priceObj?.price ?? null;
  const currency = priceObj?.currency ?? "MXN";

  const title = (raw.publication_title && raw.publication_title.trim() !== "" && !raw.publication_title.startsWith("Departamento -"))
    ? raw.publication_title.trim()
    : (raw.fake_address && raw.fake_address.trim() !== "" ? raw.fake_address.trim() : raw.address?.trim() || `Propiedad ${raw.id}`);

  // Fallback title for generic "Departamento - Villa..."
  let finalTitle = title;
  if (title.startsWith("Departamento -")) {
    finalTitle = raw.fake_address && raw.fake_address !== "Departamento - Villa de los Frailes"
      ? raw.fake_address
      : `Departamento ${raw.id} - ${raw.location?.name ?? "SMA"}`;
  }

  const photosSorted = [...(raw.photos || [])].sort((a, b) => {
    if (a.is_front_cover && !b.is_front_cover) return -1;
    if (!a.is_front_cover && b.is_front_cover) return 1;
    return (a.order ?? 0) - (b.order ?? 0);
  });

  const photos = photosSorted.map((p) => p.image).filter(Boolean);
  const thumbs = photosSorted.map((p) => p.thumb || p.image).filter(Boolean);
  const cover = photos[0] ?? null;

  // bedrooms: suite_amount is primary for dormitorios en Tokko MX
  const bedrooms = raw.suite_amount ?? raw.room_amount ?? 0;
  const bathrooms = raw.bathroom_amount ?? 0;

  return {
    id: raw.id,
    slug: String(raw.id),
    title: finalTitle,
    address: raw.fake_address || raw.address || "",
    location: raw.location?.full_location?.replace(/�/g, "a") ?? "San Miguel de Allende",
    locationShort: raw.location?.short_location?.replace(/�/g, "a") ?? raw.location?.name ?? "SMA",
    description: (raw.description || "").replace(/�/g, "a").trim(),
    operation,
    operationLabel,
    price,
    currency,
    priceFormatted: formatPrice(price, currency),
    typeCode: raw.type?.code ?? "",
    typeName: raw.type?.name ?? "Propiedad",
    bedrooms,
    bathrooms,
    rooms: raw.room_amount ?? 0,
    parking: raw.parking_lot_amount ?? 0,
    surface: parseSurface(raw.surface),
    roofedSurface: parseSurface(raw.roofed_surface),
    totalSurface: parseSurface(raw.total_surface),
    expenses: raw.expenses ?? null,
    photos,
    thumbs,
    cover,
    videos: raw.videos ?? [],
    isStarred: !!raw.is_starred_on_web,
    createdAt: raw.created_at,
    deletedAt: raw.deleted_at ?? null,
  };
}

export function categorize(properties: NormalizedProperty[]) {
  const venta = properties.filter((p) => p.operation === "venta");
  const alquiler = properties.filter((p) => p.operation === "alquiler" || p.operation === "temporal");
  return { venta, alquiler };
}

export function getSpecs(p: NormalizedProperty): string[] {
  const specs: string[] = [];
  if (p.bedrooms) specs.push(`${p.bedrooms} Recámara${p.bedrooms > 1 ? "s" : ""}`);
  if (p.bathrooms) specs.push(`${p.bathrooms} Baño${p.bathrooms > 1 ? "s" : ""}`);
  if (p.surface) specs.push(`${p.surface} m²`);
  else if (p.totalSurface) specs.push(`${p.totalSurface} m²`);
  if (p.parking) specs.push(`${p.parking} Estacionamiento${p.parking > 1 ? "s" : ""}`);
  if (p.typeName) specs.push(p.typeName);
  return specs;
}

// --- Live fetch con cache TTL para SSR (Cloud Run costo mínimo) ---
const TOKKO_TTL_MS = parseInt(import.meta.env.TOKKA_TTL_MS || process.env.TOKKA_TTL_MS || "90000", 10); // 90s default, configurable 90-120s
const TOKKO_API_BASE = "https://www.tokkobroker.com/api/v1";

type CacheEntry = { data: TokkoRawProperty[]; expires: number };
const cache = new Map<string, CacheEntry>();

function getApiKey(): string | null {
  // Astro SSR: import.meta.env es el preferido, fallback process.env para Node/Docker
  const k = (import.meta as any).env?.TOKKO_API_KEY || (typeof process !== "undefined" ? (process as any).env?.TOKKO_API_KEY : null);
  return k || null;
}

function getLang(): string {
  return (import.meta as any).env?.TOKKO_LANG || (typeof process !== "undefined" ? (process as any).env?.TOKKO_LANG : null) || "es_ar";
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Tokko HTTP ${res.status} ${await res.text().then((t) => t.slice(0, 300))}`);
  return res.json();
}

async function fetchAllLive(): Promise<TokkoRawProperty[]> {
  const key = getApiKey();
  const lang = getLang();
  if (!key) throw new Error("TOKKO_API_KEY no configurada");
  const limit = 50;
  let offset = 0;
  let all: TokkoRawProperty[] = [];
  let total: number | null = null;
  do {
    const data = await fetchJson(`${TOKKO_API_BASE}/property/?key=${key}&format=json&lang=${lang}&limit=${limit}&offset=${offset}`);
    const objs: TokkoRawProperty[] = data.objects || [];
    if (total === null) total = data.meta?.total_count ?? objs.length;
    all = all.concat(objs);
    if (objs.length < limit) break;
    offset += limit;
  } while (all.length < (total ?? Infinity));

  // detalle para videos (list no trae videos completos)
  const detailed: TokkoRawProperty[] = [];
  for (let i = 0; i < all.length; i++) {
    try {
      const d = await fetchJson(`${TOKKO_API_BASE}/property/${all[i].id}/?key=${key}&format=json&lang=${lang}`);
      detailed.push(d);
    } catch {
      detailed.push(all[i]);
    }
    if (i % 10 === 9) await new Promise((r) => setTimeout(r, 200));
  }
  return detailed;
}

export async function getTokkoLive(): Promise<TokkoRawProperty[]> {
  const cacheKey = "all";
  const now = Date.now();
  const hit = cache.get(cacheKey);
  if (hit && now < hit.expires) return hit.data;

  // stale-while-revalidate: si hay hit expirado, devolverlo y refrescar en background
  if (hit) {
    // refresco background sin bloquear (fire-and-forget)
    fetchAllLive()
      .then((data) => cache.set(cacheKey, { data, expires: Date.now() + TOKKO_TTL_MS }))
      .catch(() => {});
    return hit.data;
  }

  // miss: fetch bloqueante
  try {
    const data = await fetchAllLive();
    cache.set(cacheKey, { data, expires: now + TOKKO_TTL_MS });
    return data;
  } catch (e) {
    // fallback a cache disco (src/data) si live falla y existe
    try {
      const fs = await import("fs");
      const path = await import("path");
      const cachePath = path.join(process.cwd(), "src", "data", "tokko-cache.json");
      if (fs.existsSync(cachePath)) {
        const raw = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
        return raw.objects ?? raw;
      }
    } catch {}
    throw e;
  }
}

export async function getTokkoVentaLive(): Promise<NormalizedProperty[]> {
  const all = await getTokkoLive();
  return all
    .filter((p) => p.operations?.some((op) => op.operation_id === 1))
    .map((p) => normalizeTokkoProperty(p));
}

export async function getTokkoRentaLive(): Promise<NormalizedProperty[]> {
  const all = await getTokkoLive();
  return all
    .filter((p) => p.operations?.some((op) => op.operation_id === 2 || op.operation_id === 3))
    .map((p) => normalizeTokkoProperty(p));
}

export async function getTokkoByIdLive(id: string | number): Promise<NormalizedProperty | null> {
  const all = await getTokkoLive();
  const found = all.find((p) => String(p.id) === String(id));
  return found ? normalizeTokkoProperty(found) : null;
}
