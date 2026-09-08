# =====================================
# BUILDER
# =====================================
FROM node:18-bullseye AS builder

WORKDIR /usr/src/app

ARG SERVICE_NAME
ENV NODE_ENV=development
ENV SERVICE_NAME=${SERVICE_NAME}
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable \
    && corepack prepare pnpm@8.15.5 --activate

# Dependency files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Full dependencies — Nest CLI required for build
RUN pnpm install --frozen-lockfile

# Source
COPY apps ./apps
COPY libs ./libs
COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

# Build selected service
RUN pnpm run build:${SERVICE_NAME}


# =====================================
# PRODUCTION
# =====================================
FROM node:18-bookworm-slim AS production

WORKDIR /usr/src/app

ARG SERVICE_NAME
ENV NODE_ENV=production
ENV SERVICE_NAME=${SERVICE_NAME}

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable \
    && corepack prepare pnpm@8.15.5 --activate

# Only dependency manifests
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Only compiled application
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "node dist/apps/${SERVICE_NAME}/main.js"]