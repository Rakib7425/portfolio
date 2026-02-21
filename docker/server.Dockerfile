# Multi-stage build for Node.js backend
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY server/package.json server/yarn.lock* ./
RUN yarn install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY server ./

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN yarn build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 serveruser

# Copy built application
COPY --from=builder --chown=serveruser:nodejs /app/dist ./dist
COPY --from=builder --chown=serveruser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=serveruser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=serveruser:nodejs /app/prisma ./prisma

USER serveruser

EXPOSE 5000

ENV PORT=5000

CMD ["node", "dist/index.js"]
