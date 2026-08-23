# BADI 108 - Diario de Desarrollo

## Proyectos

### La Serena Residencial
- **Slug**: `la-serena`
- **Estado**: Implementado
- **Propiedades**: Aldama, Guadiana, Recreo, Umarán, Zacateros
- **URLs**: `/propiedades/la-serena`, `/propiedades/la-serena/[slug]`

### Privadas La Condesa
- **Slug**: `la-condesa`
- **Estado**: Agregado (2026-06-27)
- **Propiedades**: San Agustín, San Angel, San Gabriel, San Leonel, San Miguel, San Pablo, San Rafael, Lotes Residenciales
- **URLs**: `/propiedades/la-condesa`, `/propiedades/la-condesa/[slug]`

---

## Historial de Cambios

### 2026-06-27 - Agregar Privadas La Condesa

**Archivos creados:**
- `dev-diary.md` - Esta bitácora
- `src/components/TypologiesLaCondesa.astro` - Componente de tipologías para La Condesa
- `src/pages/propiedades/la-condesa.astro` - Página de detalle del proyecto
- `src/pages/propiedades/la-condesa/[slug].astro` - Página individual por modelo

**Archivos modificados:**
- `src/pages/propiedades/index.astro` - Se agregó card de Privadas La Condesa

**Assets agregados:**
- `public/images/propiedades/la-condesa/` - Fotos organizadas por modelo (12 subcarpetas)

**Datos extraídos de PDFs:**
- Info General: `202510 Resumen Privadas La Condesa.pdf` y `PLC Presentación 2026 l.pdf`
- Precios: `20260506 Lista de Precios Casas EXT.pdf` y listas de terrenos
- Modelos: specs de cada modelo desde la presentación PDF

**Modelos agregados:**
| Modelo | Tipo | Precio Desde | Const m² | Rec | Baños |
|--------|------|-------------|----------|-----|-------|
| San Agustín | Casa | $6,560,000 | 280 | 4 | 4 |
| San Ángel | Casa | $5,697,000 | 159 | 2 | 2 |
| San Gabriel | Casa | $6,380,000 | 265 | 3 | 3 |
| San Leonel | Casa | $6,500,000 | 255 | 3 | 3 |
| San Miguel | Casa | $6,100,000 | 233 | 3 | 3 |
| San Pablo | Casa | $6,298,000 | 197 | 3 | 3 |
| San Rafael | Casa | $6,460,000 | 252 | 3 | 3 |
| Lotes Res. | Terreno | $2,100,000 | — | — | — |

**Decisiones:**
- Se usó slug `la-condesa` (no `privadas-la-condesa`) por ser más corto
- Se creó componente separado `TypologiesLaCondesa.astro` en lugar de reutilizar el de La Serena
- Imágenes copiadas a `public/images/propiedades/la-condesa/` siguiendo la convención existente
- Precios basados en lista de precios de mayo 2026
- Amenidades del desarrollo extraídas del resumen PDF

### 2026-06-27 - Compresión masiva de imágenes a WebP

**Archivos modificados:**
- Todas las imágenes de `public/images/` (351 archivos originales → 347 WebP)
- `Hero.astro`, `Navbar.astro`, `About.astro`, `Contact.astro`, `Footer.astro` → referencias .webp
- `Typologies.astro` → thumbnails .webp
- `nosotros.astro`, `rentas.astro`, `propiedades/index.astro`, `la-serena.astro` → referencias .webp

**Resultado:**
- La Condesa: 232 MB → 66 MB (71% reducción)
- La Serena + General: 58 MB → 39 MB (34% reducción)
- Total imágenes: 347 WebP, 105.6 MB
- 0 archivos JPG/PNG restantes
- Build verificado sin errores

**Pendientes:**
- [ ] Revisar datos extraídos de PDFs para confirmar precios y specs
- [ ] Agregar modelo San Leonel Ampliado si aplica

### 2026-06-28 - Actualización La Serena + Correcciones

**Cambios en La Serena:**
- Eliminada propiedad Santo Domingo (Insurgentes 6-D)
- Agregada propiedad Umarán (placeholder, sin contenido real disponible)
- Amenidades: agregadas 5 nuevas (Terraza Sunset Bar, Recepción 24/7, Restaurante Room Service, Anfiteatro, Salón de Usos Múltiples)
- Sección de contacto La Serena al final de `la-serena.astro`
- Bullets de ubicaciones cercanas debajo del botón Google Maps

**Correcciones:**
- Corregida imagen `serenacover.webp` (no existía) → `prototipos.webp` en la-serena.astro
- Corregido thumb San Leonel: `DSC06927.JPG` → `DSC06927.webp`

**Archivos modificados:**
- `src/components/Typologies.astro` - Santo Domingo → Umarán
- `src/pages/propiedades/la-serena/[slug].astro` - Santo Domingo → Umarán
- `src/components/Amenities.astro` - +5 amenidades
- `src/pages/propiedades/la-serena.astro` - Sección contacto + bullets ubicaciones
- `public/images/propiedades/umaran/` - Imágenes placeholder (copiadas de Aldama)

### 2026-07-10 - Sección de Rentas: 10 Propiedades Reales

**Contexto:**
Se reemplazaron las 8 propiedades placeholder de la sección Rentas con las 10 propiedades reales del inventario (`inventario_de_renta.txt`), incluyendo contenido multimedia (fotos y videos) de la carpeta `inventario renta`.

**Archivos modificados:**
- `src/pages/rentas.astro` - Array de propiedades actualizado (8 placeholders → 10 propiedades reales)
- `src/pages/rentas/[slug].astro` - Propiedades reales con descripciones completas, soporte para video (getMedia en lugar de getImages), galería con soporte image/video

**Assets creados en `public/images/rentas/`:**
| Carpeta | Imágenes WebP | Videos WebM |
|---------|---------------|-------------|
| relox-08b | 9 | 1 |
| relox-07c-aldama | 13 | 2 |
| relox-07a-aldama-pj | 27 | 1 |
| relox-10a-recreo | 24 | 1 |
| insurgentes-10d | 14 | 1 |
| relox-17c-aldama | 42 | 1 |
| hidalgo-08a-recreo-pj | 39 | 1 |
| hidalgo-02c | 53 | 0 |
| relox-28d-recreo | 15 | 0 |
| relox-02c-recreo | 49 | 0 |

**Conversión de medios:**
- Imágenes: jpeg/png/jpg → WebP (calidad 80)
- Videos: mp4 → WebM (VP8, CRF 30, sin audio)
- Eliminadas 8 carpetas placeholder anteriores (casa-pilar, depto-alameda, etc.)

**Decisiones:**
- Slugs basados en nombre de carpeta del inventario (ej: `relox-08b`, `insurgentes-10d`)
- Precios establecidos como "Consultar" (no especificados en inventario)
- Descripciones textuales completas extraídas directamente del `.txt`
- Galería actualizada para soportar tanto imágenes como videos (.webm)

### 2026-07-10 - Corrección GitHub Actions Workflow

**Problema:**
Error en build de GitHub Actions: "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24"

**Archivos modificados:**
- `.github/workflows/deploy.yml` - Actions actualizadas a versiones compatibles con Node.js 24

**Cambios en actions:**
| Action | Versión anterior | Nueva versión |
|--------|-----------------|---------------|
| actions/checkout | v4 | v5 |
| actions/setup-node | v4 | v5 |
| actions/upload-pages-artifact | v3 | v4 |
| actions/deploy-pages | v4 | v5 |

### 2026-07-10 - Barra de Detalles en Páginas de Rentas

**Contexto:**
Se agregó una barra de especificaciones con formato `86 m² | 2 Recámaras | 2 Baños | Terraza | Jardín Privado | Frente a Casa Club` a cada página de detalle de propiedad en renta.

**Archivos modificados:**
- `src/pages/rentas/[slug].astro` - Nuevo campo `detailBar` en cada propiedad + barra visual en template

**Detail bars por propiedad:**
| Propiedad | Detail Bar |
|-----------|------------|
| Relox 08-B | 86 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Jardín \| Planta Jardín |
| Relox 07-C Aldama | 105 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Cocina Equipada \| Planta Intermedia |
| Relox 07-A Aldama P-J | 105 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Jardín Privado \| Planta Jardín |
| Relox 10-A Recreo | 86 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Jardín Privado \| Frente a Casa Club |
| Insurgentes 10-D | 86 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Vista a Canchas de Tenis y Pádel |
| Relox 17-C Aldama | 105 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Cocina Integral \| Departamento Nuevo y Recién Remodelado |
| Hidalgo 08-A Recreo P-J | 86 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Jardín Privado \| Amueblado y Equipado |
| Hidalgo 02-C | 86 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Amueblado y Equipado |
| Relox 28-D Recreo | 86 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Amueblado y Equipado |
| Relox 02-C Recreo | 86 m² \| 2 Recámaras \| 2 Baños \| Terraza \| Amueblado y Equipado |

**Estilo:**
- Fondo `bg-gray-50` con borde `border-gray-200`
- Separadores dorados (`text-gold`) entre ítems
- Ubicación: debajo del precio, arriba de la descripción

### 2026-07-10 - Video Promocional La Serena Residencial

**Contexto:**
Se agregó una sección de video full-width a la página de La Serena Residencial, justo arriba de la sección de Prototipos. El video se reproduce automáticamente y tiene botón para activar/desactivar sonido.

**Archivos modificados:**
- `src/pages/propiedades/la-serena.astro` - Nueva sección de video + script de mute/unmute

**Assets creados:**
- `public/videos/la-serena-promo.mp4` - Video comprimido (4.81 MB, H.264 + AAC, 60s)
- `public/videos/la-serena-promo.webm` - Versión WebM sin audio (6.9 MB)

**Conversión de video:**
- Original: WhatsApp Video 2026-07-10 (7.5 MB, 640x362, 60s)
- mp4: libx264 CRF 28 + AAC 128k → 4.81 MB (36% reducción)
- webm: libvpx CRF 30, sin audio → 6.9 MB

**Características de la sección:**
- Full-width, altura `75vh` con `min-height: 300px`
- Fondo negro (`bg-black`) para letterbox invisible
- Video con `object-contain` (nunca se recorta)
- Botón de sonido con iconos muted/unmuted (alternancia)
- Auto-reproducción en loop, muteado por defecto (restricción de navegadores)

**Responsive:**
- `object-contain` asegura que el video se vea completo en todos los tamaños
- `max-height: 75vh` previene que exceda el viewport
- Flexbox centrado vertical y horizontalmente
- En mobile: barras negras arriba/abajo si es necesario, video siempre visible completo

### 2026-08-23 - Integración Tokko Broker: Capa Base + Sincronización

**Contexto:**
La inmobiliaria comenzó a usar Tokko Broker para cargar propiedades. Riesgo de perder cliente si el sitio no refleja el inventario Tokko. Se propuso integración automática que mantuviera 100% la estética/diseño actual e incorporara propiedades creadas en Tokko a `/propiedades` (ventas) y `/rentas` (alquileres). Se obtuvo API Key `5818a01f6d8f04c920aa2ffe6e628788e7775753` con checks "mostrar info interna" y "mostrar propiedades no disponibles" activos.

**Investigación API:**
- Endpoints probados: `GET /api/v1/property/?key=...&format=json&lang=es_ar&limit=50` y `GET /api/v1/property/{id}/`, `development`, `property_type`.
- Resultado: `total_count: 15` (5 Venta `operation_id=1`, 10 Alquiler `operation_id=2`, 0 temporal), `development: 0` (no usa emprendimientos Tokko, categorización solo por operación), `type: AP Departamento / HO Casa / LA Terreno`, `photos: 23-65` por prop, `videos: youtube player_url` en rentas.
- Desarrollo con `display_name: BADI 108 Real Estate & property manager`, branch `78063`.

**Archivos creados:**
- `src/lib/tokko.ts` - Types `TokkoRawProperty`, `NormalizedProperty`, `normalizeTokkoProperty()`, `getSpecs()`, `categorize()`, `formatPrice()` (MXN/USD, `suite_amount`→recámaras, `bathroom_amount`, `surface/roofed_surface`, `photos` ordenadas por `is_front_cover`+`order`)
- `scripts/sync-tokko.mjs` - Fetch paginado `limit=50` + detalle por ID para `videos`, throttle 300ms, guarda `src/data/tokko-cache.json` (655k, 15 props), `tokko-venta.json` (5), `tokko-renta.json` (10) con `synced_at`, fallback a cache si API falla (no rompe build)
- `src/components/tokko/PropertyCard.astro` - Replica exacta `src/pages/rentas.astro:66` y `src/pages/propiedades/index.astro:34` (`h-64 overflow-hidden border-gray-200 hover:border-primary`, `group-hover:scale-105`, badge `bg-gold` + `typeName`, `line-clamp`, `specs` pills `bg-gray-100`)
- `src/data/tokko-cache.json`, `tokko-venta.json`, `tokko-renta.json` - Cache commiteado
- `.env` (no commiteado, en `.gitignore:19`) + `.env.example` - `TOKKO_API_KEY`
- `src/data/` directorios, `scripts/` directorios

**Archivos modificados:**
- `package.json:8` - Scripts `tokko:sync` y `tokko:build`

**Decisiones:**
- Build-time static (`astro.config.mjs:11 output:'static'`) para compatibilidad GitHub Pages, no expone API_KEY al cliente, usa cache commiteado.
- Mantener 3 proyectos fijos (La Serena, La Condesa, Santa Anita) + agregar Tokko debajo (híbrido), no reemplazo total para preservar SEO/contenido artesanal.
- Hotlink CDN Tokko `https://static.tokkobroker.com/pictures/...` sin copia local.
- `deleted_at` ignorado (cliente habilitó "mostrar no disponibles", todos los 15 tienen `deleted_at 2026-08-21` pero se muestran igual).

**Commit:** `873bb5b` `feat(tokko): capa base + cache inicial (5 ventas / 10 rentas) - sync script y normalizer`

### 2026-08-23 - Integración Tokko en /propiedades y /rentas (Cards + Detalle)

**Archivos creados:**
- `src/pages/propiedades/tokko/[slug].astro` - `getStaticPaths()` desde `tokko-venta.json` → `normalizeTokkoProperty`, galería 70vh `bg-black` con `prev/next` + `counter`, `detailBar` `bg-gray-50 border-gray-200`, `description whitespace-pre-line`, `videos` iframe youtube, `specs` grid, CTA `Consultor por esta propiedad` (reusa `src/pages/rentas/[slug].astro:43` layout)
- `src/pages/rentas/tokko/[slug].astro` - Idem para rentas, `priceFormatted + / mes`, galería thumbs + `+N fotos` indicador

**Archivos modificados:**
- `src/pages/propiedades/index.astro:1-30` - Import `PropertyCard`, `normalizeTokkoProperty`, `fs/path`, carga `tokko-venta.json` build-time, mapea `specs` + `href:/propiedades/tokko/{slug}`; template agregó sección `Tokko Broker · Actualizado / Propiedades en Venta` con `grid md:grid-cols-2 lg:grid-cols-3 gap-8` (inicialmente separada con `mt-20`)
- `src/pages/rentas.astro:1-32` - Import Tokko, carga `tokko-renta.json` → `tokkoRenta` con `href:/rentas/tokko/{slug}`; template agregó sección `Rentas desde Tokko` `mt-16` + grid
- `package.json` ya modificado

**Resultado:**
- `npm run build` → 43 páginas (vs 28 previas): `propiedades/tokko/6528692,6530975,6554051,7184667,7275193` (5) y `rentas/tokko/6528712,6765543,7310184,7669630,7670669,7793319,7830234,8688398,8692692,8692757` (10)
- IDs Venta: `6528692 ($5.5M Casa), 6530975 ($6.3M Depto), 6554051 ($2.4M Terreno SOLD OUT), 7184667 ($3.6M), 7275193 ($21M)`; Alquiler: `6528712 ($20k), 6765543 ($16.5k sin muebles), 7310184 ($19k), 7669630 ($22k sin muebles), 7670669 ($23k), 7793319 ($20k), 7830234 ($18k), 8688398 ($20k), 8692692 ($17.5k), 8692757 ($3.8k/$220 USD)`

**Commit:** `f61c4d4` `feat(tokko): integra /propiedades y /rentas con Tokko - cards + detalle (15 props) sin romper estética`

### 2026-08-23 - Workflows GitHub Actions + Documentación

**Archivos creados:**
- `.github/workflows/tokko-sync.yml` - `on: schedule 0 10 * * *` + `workflow_dispatch`, `permissions: contents: write`, checkout, setup-node 22, `npm ci`, `node scripts/sync-tokko.mjs` con `secrets.TOKKO_API_KEY`, `git add src/data/*.json`, commit `chore(tokko): sync automatico $(date)` + `git push` si hay cambios (dispara deploy)
- `README_TOKKO.md` - Resumen integración, uso local `tokko:sync/build`, config Secret `TOKKO_API_KEY`, IDs, archivos clave

**Archivos modificados:**
- `.github/workflows/deploy.yml:30` - Nuevo step `Sync Tokko Broker` antes de `Build with Astro`, `env: TOKKO_API_KEY: ${{ secrets.TOKKO_API_KEY }}`, `if [ -n "$TOKKO_API_KEY" ] then node scripts/sync-tokko.mjs || echo fallback` else `usando cache commiteado`

**Decisiones:**
- Secret en repo `blackars/badi108` → Settings → Secrets → `TOKKO_API_KEY`; sin secret deploy usa cache commiteado (no se rompe).
- Sync diario 10:00 UTC (04:00 MX) + manual dispatch para inmediato.

**Commit:** `c413415` `feat(tokko): workflow sync diario + docs TOKKO_API_KEY secret`

### 2026-08-23 - Unificación de Grillas (Quitar Títulos Tokko)

**Contexto:**
Pedido: quitar en ambas páginas título/subtítulo/texto "Tokko Broker" y dejar todas juntas de seguido en misma sección.

**Archivos modificados:**
- `src/pages/propiedades/index.astro:133-160` - Eliminado `div mt-20` con `Tokko Broker · Actualizado / Propiedades en Venta` + párrafo `sincronizadas...`; fusionado a grilla única `grid md:grid-cols-2 lg:grid-cols-3` con 3 proyectos fijos + `tokkoVenta.map()` continuos
- `src/pages/rentas.astro:124-151` - Eliminado `div mt-16` con `Tokko Broker · Actualizado / Rentas desde Tokko`; fusionado a grilla única `grid sm:grid-cols-2 lg:grid-cols-3` con 8 rentals locales + `tokkoRenta.map()`

**Resultado:**
- `dist/propiedades/index.html` y `dist/rentas/index.html` `Tokko count 0`, `Propiedades en Venta 0` verificado con `python -c count`
- Build 43 páginas ok

**Commit:** `4fff7bb` `feat: integra Tokko sin separadores - grilla unificada en /propiedades y /rentas`

### 2026-08-23 - Favicon enlazado en Layout

**Archivos modificados:**
- `src/layouts/Layout.astro:18` - Agregado `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` + `<link rel="icon" type="image/x-icon" href="/favicon.ico">` + `<link rel="shortcut icon">` apuntando a `public/favicon.*` (verificado `dist/favicon.svg` 758b, `dist/favicon.ico` 655b)

**Commit:** `1f99dfa` `feat: favicon .svg + .ico enlazados en Layout (public/favicon.*)`

### 2026-08-23 - Separador Excelentes Oportunidades en /propiedades

**Pedido:**
En sección propiedades usar separación de los 3 proyectos y poner propiedades individuales bajo línea delgada con título centrado `Excelentes Oportunidades`.

**Archivos modificados:**
- `src/pages/propiedades/index.astro:146-168` - Re-introducida separación: `div max-w-6xl mx-auto mt-16 pt-10 border-t border-gray-200` con `h3 text-2xl md:text-3xl font-bold text-dark Excelentes Oportunidades` centrado + `div w-14 h-0.5 bg-gold mx-auto mt-4` + grilla `tokkoVenta` debajo. Mantiene rentas unificadas sin separador.

**Resultado:**
- `propiedades/index.html` muestra 3 cards fijos + línea `border-t` + título centrado + 5 cards Tokko

**Commit:** `e92d242` `feat(propiedades): separa 3 proyectos + sección 'Excelentes Oportunidades' con línea delgada para Tokko`

### 2026-08-23 - Cambio Favicon a favicon-badi108.ico

**Contexto:**
Nuevo favicon entregado como `public/favicon-badi108.ico` (78k).

**Archivos modificados:**
- `src/layouts/Layout.astro:18-20` - Cambiado de `favicon.svg`+`favicon.ico` a solo `favicon-badi108.ico` (`<link rel="icon" type="image/x-icon" href="/favicon-badi108.ico">` + `<link rel="shortcut icon">`)
- `public/favicon.svg` (9 líneas, svg negro/blanco dark-mode) → eliminado
- `public/favicon.ico` (655b) → eliminado
- `public/favicon-badi108.ico` (78100b) → agregado

**Resultado:**
- `npm run build` → `dist/favicon-badi108.ico` único, `dist/index.html` contiene `href="/favicon-badi108.ico"` verificado con `python re.finditer`
- Push `e92d242..8f1b054`

**Commit:** `8f1b054` `fix(favicon): cambia referencia a favicon-badi108.ico (public/favicon-badi108.ico)`

**Estado final:**
- `git log --oneline` `8f1b054..873bb5b` 7 commits encima de `98efdc0`, `git push origin master` verificado `43 page(s) built`, `dist/propiedades/tokko/*` + `dist/rentas/tokko/*` ok, workflows listos para sync diario con `TOKKO_API_KEY` secret.
