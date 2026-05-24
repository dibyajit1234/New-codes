# =============================================================================
# TerraGraph Frontend — Multi-Stage Docker Build
# Stage 1: Vite production build (Node 20 Alpine)
# Stage 2: Static serving via Nginx 1.27 Alpine
# =============================================================================

# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package manifests first → dependency layer is cached on rebuild
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build for production
COPY . .
RUN npm run build

# ─── Stage 2: Runtime (Nginx) ────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Replace default Nginx config with our SPA + reverse-proxy config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/terragraph.conf

# Copy built static assets from the builder stage
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
