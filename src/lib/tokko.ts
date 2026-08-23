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
