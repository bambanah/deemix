FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack install -g pnpm@latest-9
WORKDIR /app

COPY pnpm-lock.yaml .

FROM base AS builder

RUN pnpm install -g turbo

COPY . .

RUN turbo prune deemix-webui --docker

FROM base AS installer

COPY --from=builder /app/out/json/ .

RUN apk add --no-cache python3 make g++

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm turbo build --filter=deemix-webui...

FROM base AS runner

# RUN addgroup --system --gid 1001 expressjs
# RUN adduser --system --uid 1001 expressjs
# USER expressjs

COPY --from=installer /app .

ENV NODE_ENV=production

ENV DEEMIX_DATA_DIR=/config/
ENV DEEMIX_MUSIC_DIR=/downloads/
ENV DEEMIX_HOST=0.0.0.0

EXPOSE 6595

WORKDIR /app/webui

ENTRYPOINT ["node", "dist/main.js"]
