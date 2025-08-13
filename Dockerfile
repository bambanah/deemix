FROM node:24-alpine AS base

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

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

FROM ghcr.io/linuxserver/baseimage-alpine:3.22 AS runner

RUN apk add --no-cache nodejs>=24.0.0

COPY --from=installer /app /app

COPY --chown=root:root docker/ /

ENV DEEMIX_DATA_DIR=/config/
ENV DEEMIX_MUSIC_DIR=/downloads/
ENV DEEMIX_SERVER_PORT=6595
ENV DEEMIX_HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE $DEEMIX_SERVER_PORT
ENTRYPOINT [ "/init" ]
