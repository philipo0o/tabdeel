# Tabdeel Frontend - Next.js Project

This is a Next.js frontend application for the Tabdeel website, converted from the original HTML design.

## 🐳 Docker Setup (Recommended)

### Quick Start with Docker
```bash
# Development mode with hot reload
npm run docker:dev

# Production mode
npm run docker:prod

# Stop containers
npm run docker:stop
```

### Full Stack Docker (Frontend + Backend + Database)
```bash
# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📦 Manual Setup (Alternative)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add the background image:**
   - Copy `Landing_Presetation_full_4k.png` to the `public/` folder

3. **Configure environment variables:**
   - Update `.env.local` with your NestJS backend URL
   - Default is set to `http://localhost:3001`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:3000`

## Project Structure

- `app/` - Next.js 13+ app directory with pages
- `components/` - Reusable React components
- `lib/` - Utility functions and API configuration
- `public/` - Static assets including images
- `Dockerfile` - Production Docker configuration
- `Dockerfile.dev` - Development Docker configuration
- `docker-compose.yml` - Full stack Docker setup

## Features

- ✅ Arabic RTL support
- ✅ Responsive design with Tailwind CSS
- ✅ Animated content spots with intersection observer
- ✅ API integration ready for NestJS backend
- ✅ TypeScript support
- ✅ Navigation component
- ✅ Contact form with API integration
- ✅ Docker support for development and production
- ✅ Docker Compose for full stack deployment

## Pages

- `/` - Home page with roadmap design
- `/about` - About page
- `/services` - Services page
- `/contact` - Contact form page

## Backend Integration

The project is configured to work with your NestJS backend:
- API calls are proxied through `/api/*` routes
- Authentication token handling included
- TypeScript interfaces for API responses
- Docker network communication between services

## Docker Configuration

### Development
- Hot reload enabled
- Source code mounted as volume
- Connects to external backend

### Production
- Optimized build with standalone output
- Multi-stage Docker build
- Automatic service discovery via Docker network

## Next Steps

1. Add your background image to the public folder
2. Customize the content in each content spot on the home page
3. Update the API endpoints in `lib/api.ts` to match your backend
4. Configure your backend Docker setup to use the same network
5. Add your specific content and styling as needed

## Useful Commands

```bash
# Docker commands
npm run docker:build    # Build production image
npm run docker:run      # Run production container
npm run docker:dev      # Development with hot reload
npm run docker:prod     # Full production stack
npm run docker:stop     # Stop all containers

# Regular commands
npm run dev            # Development server
npm run build          # Production build
npm run start          # Start production server
```