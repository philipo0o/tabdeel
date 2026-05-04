FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production

# Create the public/uploads directory so ServeStaticModule can serve uploaded files
# The Docker volume will mount over public/uploads to persist data
RUN mkdir -p public/uploads

EXPOSE 3001

CMD ["node", "dist/main"]
