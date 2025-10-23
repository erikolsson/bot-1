# Use official Bun image as base
FROM oven/bun:1 AS base

# Set working directory
WORKDIR /app

# Install dependencies stage
FROM base AS install
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Build stage
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Build the bot
RUN bun run build

# Production stage
FROM base AS production

# Copy node_modules from install stage
COPY --from=install /app/node_modules ./node_modules

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

# Expose port (Cloud Run will set PORT env var)
EXPOSE 5123

# Run the bot using the start script
CMD ["bun", "run", "start"]
