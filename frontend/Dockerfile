# syntax=docker/dockerfile:1

# ── Base ───────────────────────────────────────────────────────
FROM node:24-alpine AS base
RUN npm install -g pnpm@12.23.0
WORKDIR /app

# ── Dependencias ───────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ── Desarrollo: ng serve con hot reload ────────────────────────
FROM deps AS dev
ENV NG_CLI_ANALYTICS=false
COPY . .
EXPOSE 4200
CMD ["pnpm", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "1000"]

# ── Build ──────────────────────────────────────────────────────
FROM deps AS build
ENV NG_CLI_ANALYTICS=false
COPY . .
RUN pnpm ng build --configuration production

# ── Producción: nginx sirve la SPA y hace proxy de /api ─────────
FROM nginx:stable-alpine AS prod
ENV BACKEND_UPSTREAM=http://backend:3000
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
