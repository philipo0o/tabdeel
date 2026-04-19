# Full Stack Docker Setup

This guide explains how to run the entire application (Frontend + Backend + Database) using Docker.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## Quick Start

1. **Navigate to the project root** (where `docker-compose.yml` is located):
   ```bash
   cd c:\Users\paziz2\Documents\tabdeel
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the services**:
   - **Frontend**: [http://localhost:3002](http://localhost:3002)
   - **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)
   - **PgAdmin** (Database Manager): [http://localhost:8080](http://localhost:8080)
     - Email: `admin@tabdeel.com`
     - Password: `admin`

## Development

- **Live Reload**: Both frontend and backend are configured with volume mounts. Changes you make to the code in `frontend/` or `backend/tabdeel-backend/` will automatically trigger a rebuild/restart in the containers.
- **Database**: The database data is persisted in a Docker volume `postgres_data`.

## Stopping the App

To stop the containers:
```bash
docker-compose down
```

## Troubleshooting

- **Port Conflicts**: Ensure ports `3001`, `3002`, `5432`, and `8080` are not used by other applications.
- **Permission Errors**: If you encounter file permission issues on Windows, explicitly grant Docker access to the project directory in Docker Desktop settings.
