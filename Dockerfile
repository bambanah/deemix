FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat


FROM base AS builder

RUN apk add --no-cache git

COPY . .

RUN corepack enable pnpm && pnpm i --frozen-lockfile && pnpm dist-server


FROM base AS runner

COPY --from=builder /app/dist/deemix-server dist/deemix-server

EXPOSE 6595

ENTRYPOINT ["dist/deemix-server"]
