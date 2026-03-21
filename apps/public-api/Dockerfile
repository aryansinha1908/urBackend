FROM node:22-alpine

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy the common package package.json
COPY packages/common/package.json ./packages/common/

# Copy the app package.json
COPY apps/public-api/package.json ./apps/public-api/

# Install dependencies (this will install everything at root, and symlink workspaces)
RUN npm ci

# Copy the actual source code
COPY packages/common ./packages/common
COPY apps/public-api ./apps/public-api

# Set working directory to the app
WORKDIR /app/apps/public-api

EXPOSE 1235

CMD ["npm", "run", "start"]
