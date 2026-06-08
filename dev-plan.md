# BADI 108 - Real Estate Portfolio Website

## Plan de Desarrollo

### Identidad del Proyecto

- **Empresa**: Real Estate BADI 108
- **Proyecto insignia**: La Serena Residencial
- **Ubicación**: San Miguel de Allende, Guanajuato
- **Contacto**: 55 2748 6478 / 56 2418 3152
- **Dirección**: Carretera San Miguel - Calaya 41, Fracc. Villa de Los Frailes, 37790

### Branding

- **Logo**: Círculo con borde negro, fondo blanco, tipografía dorada "Real Estate BADI 108" con icono de casas
- **Ícono项目**: Hoja dorada/ocre
- **Colores**:
  - Lila/morado principal: `#6B3A7D`
  - Dorado: `#D4A843`
  - Blanco: `#FFFFFF`
  - Negro: `#1A1A1A`
  - Gris claro: `#F5F5F5`

---

## Stack Técnico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | **Astro 4** | Generación estática, islands para interactividad, rendimiento puro |
| Estilos | **Tailwind CSS** | Utilidades rápidas, diseño responsive sin escribir CSS custom |
| Animaciones | **GSAP + ScrollTrigger** | Parallax del cielo, text reveals, transiciones de secciones |
| Smooth Scroll | **Lenis** | Scroll suave nativo, integrable con GSAP |
| 3D Effects | **CSS 3D Transforms** | Tarjetas de propiedades con perspective/rotateY en hover |
| Formulario | **Formspree o Netlify Forms** | Sin backend, envío directo a email |
| Deploy | **Docker → Cloud Run** | Build estático + Nginx, escalado automático |
| CDN | **Cloud CDN (GCP)** | Assets estáticos con cache global |

---

## Arquitectura del Sitio

```
landing-page/
├── public/
│   ├── images/
│   │   ├── church/          # Capas de la iglesia para parallax
│   │   │   ├── church-back.jpg
│   │   │   ├── church-mid.jpg
│   │   │   └── church-front.png
│   │   ├── sky/             # Capas del cielo animado
│   │   │   ├── sky-gradient.jpg
│   │   │   └── clouds.png
│   │   ├── properties/      # Renders y fotos de propiedades
│   │   ├── typologies/      # Planos de planta (Sto. Domingo, etc.)
│   │   └── logo/
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── Hero.astro             # Iglesia + cielo animado
│   │   ├── SkyAnimation.astro     # Capas de cielo con movimiento
│   │   ├── PropertyCard.astro     # Tarjeta 3D de tipología
│   │   ├── PropertyGallery.astro  # Galería de tipologías
│   │   ├── About.astro
│   │   ├── Contact.astro
│   │   ├── Navbar.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro            # Landing principal
│   │   ├── propiedades.astro      # Galería completa
│   │   ├── la-serena.astro        # Proyecto La Serena
│   │   ├── nosotros.astro         # About BADI 108
│   │   └── contacto.astro         # Formulario
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── Dockerfile
└── package.json
```

---

## Estructura de Páginas

### 1. Landing (`/`)

- **Hero**: Iglesia de SMA con cielo animado (parallax 5 capas)
- **Sección "Descubre La Serena"**: Texto reveal al scroll + render del proyecto
- **Galería de Tipologías**: Grid de cards 3D (Sto. Domingo, etc.)
- **CTA**: "Agenda tu visita" → botón a contacto
- **Footer**: Logo BADI 108 + redes + contacto

### 2. Propiedades (`/propiedades`)

- Filtros por tipo (penthouse, departamento, casa)
- Grid de tarjetas 3D con hover effect
- Click → detalle con galería de fotos + plano + specs

### 3. La Serena (`/la-serena`)

- Hero específico del proyecto
- Amenidades del condominio
- Mapa de ubicación (Google Maps embed)
- Todas las tipologías disponibles

### 4. Nosotros (`/nosotros`)

- Historia de BADI 108
- Valores / misión
- Equipo (si aplica)
- Logos de certificaciones

### 5. Contacto (`/contacto`)

- Formulario (nombre, email, teléfono, interés)
- Mapa de ubicación de oficina
- Datos de contacto
- WhatsApp flotante

---

## Diseño del Hero (Iglesia + Cielo Animado)

Técnica de parallax con 5 capas superpuestas:

```
┌─────────────────────────────────┐
│  capa 5: Texto "LA SERENA"     │  ← Se mueve lento al scroll
│  ┌───────────────────────────┐  │
│  │ capa 4: Cielo (gradiente)│  │  ← Movimiento lateral lento
│  │ + nubes superpuestas     │  │
│  │ ┌─────────────────────┐  │  │
│  │ │ capa 3: Montañas    │  │  │  ← Movimiento medio
│  │ │ ┌─────────────────┐ │  │  │
│  │ │ │ capa 2: Iglesia │ │  │  │  ← Movimiento más rápido
│  │ │ │ ┌─────────────┐ │ │  │  │
│  │ │ │ │ capa 1:     │ │ │  │  │  ← Foreground fijo
│  │ │ │ │ Edificios   │ │ │  │  │
│  │ │ │ └─────────────┘ │ │  │  │
│  │ │ └─────────────────┘ │  │  │
│  │ └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

- Cada capa es una imagen PNG con transparencia
- GSAP mueve cada capa en eje X o Y a diferentes velocidades al hacer scroll
- Las nubes se animan con keyframes CSS (movimiento perpetuo lateral)
- El cielo usa un gradiente animado que cambia de tono (atardecer → día)
- La iglesia se separa de las montañas con parallax offset

---

## Tarjetas de Propiedades (Efecto 3D)

Efecto 3D en CSS puro:

```css
/* Perspective container */
.property-card {
  perspective: 1000px;
  transform-style: preserve-3d;
}

/* En hover: rotación 3D suave */
.property-card:hover {
  transform: rotateY(5deg) rotateX(-2deg);
  box-shadow: -20px 20px 60px rgba(0,0,0,0.3);
}

/* Transición de imagen: zoom suave + overlay */
.property-card .image {
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.property-card:hover .image {
  transform: scale(1.08);
}
```

Cada tarjeta muestra:
- Imagen del render/fachada (fondo)
- Nombre de la tipología ("STO. DOMINGO")
- Metros cuadrados
- Iconos de habitaciones (recámaras, baños, etc.)
- Hover: revela plano de planta + precio

---

## Tipologías de Propiedades (La Serena Residencial)

### STO. DOMINGO - Pent House

- **Superficie**: 226.63 m² totales
- **Niveles**: Primer nivel
- **Recámaras**: 4 (1 principal con vestidor + 3 secundarias)
- **Baños**: 4 completos + 2 medios
- **Espacios**: Sala-comedor, cocina, bodega, cuarto de lavado
- **Exteriores**: Terraza, roof garden con pergolado

*(Agregar aquí las demás tipologías según los planos)*

---

## Micro-interacciones

| Elemento | Interacción |
|----------|-------------|
| **Cursor** | Punto dorado que sigue al mouse, se agranda en links |
| **Navbar** | Se oculta al bajar, aparece al subir. Logo animado al hover |
| **Cards propiedad** | Rotación 3D + sombra dinámica + overlay de detalles |
| **Texto hero** | Fade-in con blur que se resuelve al scroll |
| **Nubes cielo** | Movimiento perpetuo lateral con CSS animation |
| **Botones** | Fill de color dorado de izquierda a derecha en hover |
| **Números** | Counter animado (año fundación, propiedades vendidas) |
| **Galería fotos** | Lightbox con transición tipo "deslizamiento" |
| **Formulario** | Labels que flotan al hacer focus, validación en tiempo real |
| **WhatsApp** | Icono flotante con bounce sutil cada 3s |

---

## Optimización de Imágenes

Para crear profundidad económicamente:

1. **Separar fondos**: Quitar el cielo de fotos de renders con remove.bg o Photoshop
2. **Crear capas**: Del cielo separado, montañas, edificios, iglesia
3. **Formato WebP**: Todas las imágenes en WebP (20-30% menos peso)
4. **Lazy loading**: Cargar solo lo visible + 200px más allá del viewport
5. **Blur placeholder**: Placeholder con blur mientras carga la imagen real

---

## Deploy en Cloud Run

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

```bash
# Build
docker build -t badi108-web .

# Push a Container Registry
docker push gcr.io/tu-proyecto/badi108-web

# Deploy
gcloud run deploy badi108-web \
  --image gcr.io/tu-proyecto/badi108-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Paleta de Colores

```
Lila/morado principal:  #6B3A7D  (del fondo del logo)
Dorado:                 #D4A843  (letra + hoja del logo)
Blanco:                 #FFFFFF  (fondo limpio)
Negro:                  #1A1A1A  (texto principal)
Gris claro:             #F5F5F5  (secciones alternas)
```

---

## Próximos Pasos

1. **Revisar documentación adjunta** (planos, precios, renders)
2. **Definir tipologías completas** de La Serena Residencial
3. **Obtener renders/fotos** de exteriores e interiores
4. **Separar imágenes en capas** para efectos parallax
5. **Crear wireframes** de cada página
6. **Desarrollar componente Hero** con parallax del cielo
7. **Implementar galería de tipologías** con efectos 3D
8. **Configurar formulario de contacto**
9. **Deploy en Cloud Run**

---

## Notas

- El sitio es el primero de BADI 108, con La Serena como proyecto insignia
- En el futuro se agregarán más proyectos
- Priorizar rendimiento y experiencia de usuario mobile
- Las animaciones deben ser sutiles, no invasivas
- El tono es elegante y premium,-reflejando la exclusividad de San Miguel de Allende
