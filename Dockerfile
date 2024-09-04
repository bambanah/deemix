FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

FROM base AS builder

COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY . .

RUN pnpm install -r --offline && pnpm build

FROM base AS runner

COPY --from=builder /app/package.json ./

COPY --from=builder /app/webui/ ./webui/
# COPY --from=builder --exclude=client/ /app/webui/ ./webui/
# COPY --from=builder /app/webui/src/client/dist/ ./webui/src/client/dist/

ENV DEEMIX_DATA_DIR=/config/
ENV DEEMIX_MUSIC_DIR=/downloads/
ENV DEEMIX_HOST=0.0.0.0

EXPOSE 6595

ENTRYPOINT ["pnpm", "start"]
