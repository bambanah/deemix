FROM node:20-alpine AS base

ENV HUSKY=0
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

FROM base AS builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --frozen-lockfile

RUN pnpm build

FROM base AS runner

COPY --from=prod-deps /app/webui/node_modules ./webui/node_modules
COPY --from=prod-deps /app/node_modules ./node_modules

COPY --from=builder /app/webui/ ./webui/

ENV DEEMIX_DATA_DIR=/config/
ENV DEEMIX_MUSIC_DIR=/downloads/
ENV DEEMIX_HOST=0.0.0.0

EXPOSE 6595

ENTRYPOINT ["pnpm", "start"]
