# Stage 1: Build the server
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy the monorepo (the .dockerignore file will exclude unrelated packages)
COPY . .

# Install the root and workspace dependencies, including dev dependencies
RUN npm ci

# Build the server using the --workspace flag
RUN npm run build --workspace packages/server

# Stage 2: Create the production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set the environment variable to production
ENV NODE_ENV=production

# Copy the root package.json and package-lock.json files from the builder stage
COPY --from=builder /app/package*.json ./

# Copy the package/server package.json and package-lock.json files from the builder stage
COPY --from=builder /app/packages/server/package*.json ./packages/server/

# Install the root and workspace dependencies, excluding dev dependencies
RUN npm ci --omit dev

# Copy the server build output from the builder stage
COPY --from=builder /app/packages/server/dist ./packages/server/dist

# Copy data folder
COPY data ./data

# Expose the port your server will run on
EXPOSE 3000

# Start the server
CMD ["npm", "start", "-w", "packages/server"]
