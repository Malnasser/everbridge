# Use Node.js LTS version
FROM node:20-alpine AS base

# Install the specific pnpm version that matches your local environment
# First, check your local pnpm version with: pnpm --version
# Then replace 8.x.x with your exact version
RUN npm install -g pnpm@8.15.6

# Set working directory
WORKDIR /app

# Copy package files and configs
COPY package.json pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies with compatibility fix
RUN pnpm install --frozen-lockfile --strict-peer-dependencies=false

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install the same pnpm version
RUN npm install -g pnpm@8.15.6

# Install dependencies only for production
WORKDIR /app
COPY --from=base /app/package.json /app/pnpm-lock.yaml ./
COPY --from=base /app/tsconfig.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile --strict-peer-dependencies=false

# Install tsconfig-paths for runtime path resolution
RUN pnpm add tsconfig-paths

# Expose port
EXPOSE 3000

# Start the application with path resolution
CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main"]
