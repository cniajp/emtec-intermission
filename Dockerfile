# syntax = docker/dockerfile:1.4

FROM node:24.20.0-slim AS base
WORKDIR /base
# pnpm は corepack 経由。バージョンは package.json の packageManager で決まる
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
COPY --link package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:24.20.0-slim
WORKDIR /base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN apt-get update && apt-get install -y tini \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable
COPY --link --from=base /base ./
COPY --link . .
RUN pnpm run build

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD [ "pnpm", "run", "start" ]
EXPOSE 3000
