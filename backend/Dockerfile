FROM node:20-bookworm-slim

WORKDIR /app

# System deps (ensure OpenSSL present)
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy project files
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma client and build the app (generates binaries for this runtime)
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production

# Apply migrations when available, otherwise push schema (useful for first run)
CMD ["sh", "-c", "npx prisma migrate deploy || npx prisma db push; node dist/main.js"]
