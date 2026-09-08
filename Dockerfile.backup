# =====================================
# BASE IMAGE
# =====================================
FROM node:18-bullseye

# -------------------------------------
# Build arguments
# -------------------------------------
ARG SERVICE_NAME
ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}
ENV SERVICE_NAME=${SERVICE_NAME}
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV PNPM_STORE_PATH=/pnpm-store

# -------------------------------------
# App directory
# -------------------------------------
WORKDIR /usr/src/app

# -------------------------------------
# Enable pnpm (locked)
# -------------------------------------
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

# -------------------------------------
# Copy workspace files (cache-friendly)
# -------------------------------------
COPY pnpm-workspace.yaml .
COPY package.json pnpm-lock.yaml ./

# -------------------------------------
# Install dependencies
# -------------------------------------
RUN pnpm install --frozen-lockfile

# -------------------------------------
# Copy full source AFTER install
# -------------------------------------
COPY apps ./apps
COPY libs ./libs
COPY nest-cli.json .
COPY tsconfig*.json ./

# -------------------------------------
# Build only selected service
# -------------------------------------
RUN pnpm build $SERVICE_NAME

# -------------------------------------
# Runtime
# -------------------------------------
EXPOSE 3000

# -------------------------------------
# Universal start command (DEV / PROD)
# -------------------------------------
CMD sh -c "\
  if [ \"$NODE_ENV\" = 'development' ]; then \
    echo '▶ Starting DEV mode for '$SERVICE_NAME; \
    pnpm start:dev $SERVICE_NAME; \
  else \
    echo '▶ Starting PROD mode for '$SERVICE_NAME; \
    node dist/apps/$SERVICE_NAME/main.js; \
  fi"
