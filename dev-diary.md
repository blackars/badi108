# BADI 108 - Diario de Desarrollo

## Proyectos

### La Serena Residencial
- **Slug**: `la-serena`
- **Estado**: Implementado
- **Propiedades**: Aldama, Guadiana, Recreo, Santo Domingo, Zacateros
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
