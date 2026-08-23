# Tokko Broker - Integración BADI 108

## Resumen
Integración automática Tokko → sitio. Mantiene estética actual (`src/pages/propiedades/index.astro:33`, `src/pages/rentas.astro:62`) y agrega propiedades sincronizadas.

- **Ventas (5):** `src/data/tokko-venta.json` → `src/pages/propiedades/index.astro` (sección Tokko) + detalle `src/pages/propiedades/tokko/[slug].astro` (`/propiedades/tokko/6528692` etc)
- **Rentas (10):** `src/data/tokko-renta.json` → `src/pages/rentas.astro` (sección Tokko) + detalle `src/pages/rentas/tokko/[slug].astro`
- **Cache:** `src/data/tokko-cache.json` (15 props totales)
- **Normalizer:** `src/lib/tokko.ts` (mapea `operations.type` 1=Venta / 2=Alquiler, `suite_amount`, `surface`, `photos`, `videos` youtube)
- **Sync script:** `scripts/sync-tokko.mjs` usa `TOKKO_API_KEY` de `.env` o secret.

## Local
```bash
# .env (ya creado, no se commitea)
TOKKO_API_KEY=5818a01f6d8f04c920aa2ffe6e628788e7775753
npm run tokko:sync   # descarga 15 props -> src/data/*.json
npm run build        # genera 43 páginas (vs 28 antes)
npm run dev
```

## GitHub Pages - Configurar Secret
1. GitHub repo blackars/badi108 → Settings → Secrets and variables → Actions → New repository secret
   - Name: `TOKKO_API_KEY`
   - Value: `5818a01f6d8f04c920aa2ffe6e628788e7775753`
2. Push a `master` → workflow `Deploy to GitHub Pages` hace sync opcional.
3. Workflow `Sync Tokko Broker` corre diario 10:00 UTC y hace commit automático si hay cambios en Tokko → dispara deploy.

Si no configuras el Secret, el deploy usa el cache commiteado (no se rompe).

## Qué hace el cliente en Tokko
1. Crea/edita propiedad en Tokko y selecciona Operación Venta o Alquiler + publica.
2. En máximo 24h (o manual Workflow Dispatch) aparece en badi108realstate.com sin tocar código.
3. Para forzar inmediato: GitHub → Actions → Sync Tokko Broker → Run workflow.

## Archivos clave
- `src/components/tokko/PropertyCard.astro` - replica `border-gray-200 hover:border-primary` + `bg-gold` badge + `group-hover:scale-105`
- `src/pages/propiedades/tokko/[slug].astro` - galería 70vh + `detailBar` + specs (usa `src/pages/rentas/[slug].astro:43` como referencia)
- `src/pages/rentas/tokko/[slug].astro` - idem para rentas

## Notas
- Imágenes usan CDN Tokko `https://static.tokkobroker.com/pictures/...` (hotlink, no copia local).
- `deleted_at` se ignora porque tienes check "mostrar no disponibles" activado. Si quieres ocultar no disponibles, filtrar en `scripts/sync-tokko.mjs`.
- Developments = 0 (no usas emprendimientos Tokko), por eso se categoriza solo por operación.
