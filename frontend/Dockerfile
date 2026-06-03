# Stage 1: development dependencies
FROM node:20-alpine AS dev-deps
WORKDIR /app
COPY package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
RUN npm install --legacy-peer-deps

# Stage 2: production dependencies
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Stage 3: build
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
COPY --from=dev-deps /app/node_modules ./node_modules
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 4: runtime (nginx)
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
