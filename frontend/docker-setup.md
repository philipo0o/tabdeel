# Docker Setup for Tabdeel Frontend

## Quick Start

### Development Mode
```bash
# Build and run in development mode
npm run docker:dev
```

### Production Mode
```bash
# Build and run in production mode
npm run docker:prod
```

## Manual Docker Commands

### Build the Docker Image
```bash
docker build -t tabdeel-frontend .
```

### Run the Container
```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-backend:3001 tabdeel-frontend
```

## Docker Compose Options

### Full Stack (Frontend + Backend + Database)
```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop all services
docker-compose down
```

### Development Only (Frontend)
```bash
# Start development server with hot reload
docker-compose -f docker-compose.dev.yml up --build
```

## Environment Variables

The Docker setup uses these environment variables:

- `NEXT_PUBLIC_API_URL`: Backend API URL (defaults to http://tabdeel-backend:3001 in Docker)
- `NODE_ENV`: Environment mode (development/production)

## Network Configuration

The Docker setup creates a `tabdeel-network` bridge network that allows:
- Frontend to communicate with backend via `tabdeel-backend:3001`
- Backend to communicate with database via `postgres:5432`

## Volumes

- `postgres_data`: Persistent storage for PostgreSQL database
- Development mode mounts source code for hot reload

## Ports

- Frontend: `3000`
- Backend: `3001` 
- Database: `5432`

## Integration with Existing Backend

To integrate with your existing backend Docker setup:

1. Make sure your backend uses the same network name (`tabdeel-network`)
2. Update the backend service name in docker-compose.yml if different
3. Ensure your backend image name matches in the docker-compose.yml