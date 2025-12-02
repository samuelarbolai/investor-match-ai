FROM node:20-slim AS base
ARG CACHE_BUST=2

WORKDIR /app

COPY package.json ./
RUN npm install

# Copy all source files
COPY . .

# Prune dev dependencies
RUN npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/server.js"]

