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
