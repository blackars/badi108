# syntax=docker/dockerfile:1
# BADI108 - Astro 7 hybrid (Node standalone) -> Cloud Run (minInstances 0, costo mínimo)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build hybrid: prerender estático + server para /propiedades /rentas dinámicos (Tokko live TTL 90s)
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
# Solo prod deps para imagen lean (~240MB vs 350MB)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "./dist/server/entry.mjs"]
