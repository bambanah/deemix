FROM node:20-alpine AS base

WORKDIR /app


FROM base AS builder

RUN apk add --no-cache git

COPY . .
RUN corepack enable pnpm && pnpm i --frozen-lockfile

RUN pnpm dist-server


FROM lsiobase/alpine:3.20

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/dist/deemix-server-linux ./dist/deemix-server-linux

EXPOSE 6595

ENTRYPOINT ["dist/deemix-server-linux"]
