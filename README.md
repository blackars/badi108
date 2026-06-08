# BADI 108 - Real Estate Portfolio

Sitio web de portafolio para Real Estate BADI 108, proyecto La Serena Residencial en San Miguel de Allende.

## Stack

- Astro 4
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis (smooth scroll)

## Desarrollo

```bash
npm install
npm run dev
```

## Deploy

```bash
docker build -t badi108-web .
docker push gcr.io/tu-proyecto/badi108-web
gcloud run deploy badi108-web --image gcr.io/tu-proyecto/badi108-web
```
