# ---- Build Stage ----
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY tsconfig*.json ./
COPY src ./src
COPY nest-cli.json .
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine
WORKDIR /usr/src/app

# Copy package json and install only production deps
COPY package*.json ./
RUN npm ci --omit=dev --silent

# Copy built artifacts
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/main.js"]
