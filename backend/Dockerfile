# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY src ./src
COPY tsconfig.json prisma ./

# Generate Prisma client
RUN bunx prisma generate

# Runtime stage
FROM oven/bun:latest

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/prisma ./prisma

# Create repos directory for file storage
RUN mkdir -p /app/repos

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:4000/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Run the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["bun", "run", "src/server.ts"]
