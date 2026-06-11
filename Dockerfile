FROM node:22-alpine AS builder
WORKDIR /app
COPY badi108-web/package*.json ./
RUN npm ci
COPY badi108-web/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY badi108-web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
