# BADI 108 - Real Estate Portfolio

Sitio web de portafolio para Real Estate BADI 108, proyecto La Serena Residencial en San Miguel de Allende.

## Stack

- Astro 6
- Tailwind CSS 4
- GSAP + ScrollTrigger
- Lenis (smooth scroll)

## Desarrollo

```bash
npm install
npm run dev
```

## Deploy a GitHub Pages

```bash
# Construir el sitio
npm run build

# Desplegar (usa gh-pages, instalar con: npm install -g gh-pages)
npx gh-pages -d dist --dotfiles
```

O manualmente: hacer push de la carpeta `dist/` a la branch `gh-pages` y configurar GitHub Pages en el repo para que use esa branch.

**Configuración de GitHub Pages:**
1. Ir a Settings > Pages del repositorio
2. Source: "Deploy from a branch"
3. Branch: `gh-pages` / `/ (root)`
4. La URL será: `https://blackars.github.io/badi108/`
