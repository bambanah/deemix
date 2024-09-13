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

FROM ghcr.io/linuxserver/baseimage-alpine:3.20 AS runner

RUN apk add --no-cache nodejs=~20

COPY --from=installer /app /app

COPY docker/ /

ENV DEEMIX_DATA_DIR=/config/
ENV DEEMIX_MUSIC_DIR=/downloads/
ENV DEEMIX_SERVER_PORT=6595
ENV DEEMIX_HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE $DEEMIX_SERVER_PORT
ENTRYPOINT [ "/init" ]
