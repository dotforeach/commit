# syntax=docker/dockerfile:1

# ── Base ───────────────────────────────────────────────────────
FROM node:24-alpine AS base
RUN npm install -g pnpm@12.23.0
WORKDIR /app

# ── Dependencias (todas, para dev y build) ─────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ── Desarrollo: hot reload, el código se monta como volumen ─────
FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 3000 9229
CMD ["sh", "-c", "pnpm prisma generate && pnpm prisma migrate deploy && pnpm start:dev"]

# ── Build ──────────────────────────────────────────────────────
FROM deps AS build
COPY . .
RUN pnpm prisma generate && pnpm build

# ── Migraciones (paso de release en producción) ────────────────
FROM build AS migrate
ENV NODE_ENV=production
CMD ["pnpm", "prisma", "migrate", "deploy"]

# ── Dependencias de producción ─────────────────────────────────
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ── Producción ─────────────────────────────────────────────────
FROM node:24-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "dist/main.js"]
