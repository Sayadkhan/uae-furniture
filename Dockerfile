# =========================
# Base
# =========================
FROM node:20-alpine AS base
WORKDIR /app

# =========================
# Dependencies
# =========================
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# =========================
# Builder
# =========================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# =========================
# Runner (production)
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nodejs -g 1001 \
 && adduser -S nextjs -u 1001

# Copy only required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
