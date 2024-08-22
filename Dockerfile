FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat


FROM base AS builder

RUN apk add --no-cache git

COPY . .

RUN corepack enable pnpm && pnpm i --frozen-lockfile && pnpm dist-server


FROM base AS runner

COPY --from=builder /app/dist/deemix-server-linux dist/deemix-server-linux

ENV DEEMIX_DATA_DIR=/config/
ENV DEEMIX_MUSIC_DIR=/downloads/
ENV DEEMIX_HOST=0.0.0.0

EXPOSE 6595

ENTRYPOINT ["dist/deemix-server-linux"]
