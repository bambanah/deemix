FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat


FROM base AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY . .

RUN corepack enable pnpm && pnpm dist-server


FROM base AS runner


COPY --from=builder /app/dist/deemix-server-linux dist/deemix-server-linux

EXPOSE 6595

ENTRYPOINT ["dist/deemix-server-linux"]
