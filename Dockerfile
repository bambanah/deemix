FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack install -g pnpm@latest-9
WORKDIR /app

COPY pnpm-lock.yaml .

FROM base AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch --prod

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --offline --frozen-lockfile --prod --ignore-scripts

FROM base AS builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --offline --frozen-lockfile

RUN pnpm build

FROM base AS runner

COPY . ./

COPY --from=builder /app/webui/dist ./webui/dist

COPY --from=prod-deps /app/webui/node_modules ./webui/node_modules/
COPY --from=prod-deps /app/node_modules ./node_modules

ENV DEEMIX_DATA_DIR=/config/
ENV DEEMIX_MUSIC_DIR=/downloads/
ENV DEEMIX_HOST=0.0.0.0

EXPOSE 6595

ENTRYPOINT ["pnpm", "start"]
