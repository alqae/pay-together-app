# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist/pay-together/browser /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf # Copy custom nginx configuration if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
