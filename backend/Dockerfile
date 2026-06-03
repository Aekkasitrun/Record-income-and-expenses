# Stage 1: development dependencies
FROM node:20-alpine AS dev-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: production dependencies
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 3: build
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
COPY --from=dev-deps /app/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build

# Stage 4: runtime
FROM node:20-alpine AS runtime
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 4000
CMD ["node", "dist/main"]
