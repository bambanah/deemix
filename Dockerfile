FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

FROM base AS builder

RUN apk add --no-cache git

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/
COPY webui/package.json ./webui/
COPY deemix/package.json ./deemix/
COPY deezer-js/package.json ./deezer-js/

RUN corepack enable pnpm && pnpm install

COPY . .

RUN pnpm build

FROM base AS runner

COPY --from=builder /app/package.json ./
COPY --from=builder /app/server/dist/ ./server/dist/
COPY --from=builder /app/webui/public/ ./webui/public/

ENV DEEMIX_DATA_DIR=/config/
ENV DEEMIX_MUSIC_DIR=/downloads/
ENV DEEMIX_HOST=0.0.0.0

EXPOSE 6595

ENTRYPOINT ["node", "server/dist/app.js"]
