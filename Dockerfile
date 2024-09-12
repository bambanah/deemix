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

FROM base AS runner

RUN apk add --no-cache su-exec

ENV NODE_ENV=production

ENV DEEMIX_DATA_DIR=/config
ENV DEEMIX_MUSIC_DIR=/downloads
ENV DEEMIX_HOST=0.0.0.0

COPY --from=installer /app .

RUN mkdir -p \
	$DEEMIX_DATA_DIR \
	$DEEMIX_MUSIC_DIR

# Create an entrypoint script
RUN echo '#!/bin/sh' > /entrypoint.sh && \
	echo 'chown -R nobody:users $DEEMIX_DATA_DIR $DEEMIX_MUSIC_DIR' >> /entrypoint.sh && \
	echo 'chmod -R 775 $DEEMIX_DATA_DIR $DEEMIX_MUSIC_DIR' >> /entrypoint.sh && \
	echo 'exec su-exec nobody:users "$@"' >> /entrypoint.sh && \
	chmod +x /entrypoint.sh

EXPOSE 6595

WORKDIR /app/webui

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/main.js"]
