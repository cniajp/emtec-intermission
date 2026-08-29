# syntax = docker/dockerfile:1.4

FROM node:24.20.0-slim AS base
WORKDIR /base
COPY --link package.json package-lock.json ./
RUN npm install

FROM node:24.20.0-slim
WORKDIR /base
RUN apt-get update && apt-get install -y tini \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY --link --from=base /base ./
COPY --link . .
RUN npm run build

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD [ "/usr/local/bin/npm", "run", "start" ]
EXPOSE 3000
