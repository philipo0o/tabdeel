# Docker Setup Guide for Windows

It seems **Docker is not installed** or **not running** on your machine. Follow these steps to get it working.

## Step 1: Install Docker Desktop

1. **Download**: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. **Install**: Run the installer.
   - ✅ Ensure "Use WSL 2 instead of Hyper-V" is checked (recommended).
3. **Restart**: You will likely need to restart your computer.

## Step 2: Start Docker

1. Open **Docker Desktop** from your Start Menu.
2. Wait for the whale icon in the taskbar to stop animating.
3. It should say **"Engine running"** in green at the bottom left of the Docker Dashboard.

## Step 3: Verify Installation

Open a **new** terminal (PowerShell or Command Prompt) and run:

```bash
docker --version
```

If you see a version number (e.g., `Docker version 24.0.0`), you are ready!

---

## Step 4: Run Your Database

Once Docker is running, you can start the database using the file I created for you:

1. Open terminal in `backend/tabdeel-backend`
2. Run:
   ```bash
   docker compose up -d postgres
   ```
3. Check if it's running:
   ```bash
   docker ps
   ```

## Step 5: Start Backend

Now your backend can connect to the local Docker database:

```bash
npm run start:dev
```

---

## Troubleshooting

### "docker: command not found"
- Docker is not installed or not in your PATH.
- Solution: Install Docker Desktop (Step 1) and restart your terminal.

### "error during connect: ... is the docker daemon running?"
- Docker Desktop is installed but **not running**.
- Solution: Open Docker Desktop from Start Menu.

### "Ports are not available: ... bind: an attempt was made to access a socket..."
- Port 5432 is already in use by another Postgres instance.
- Solution: Stop local Postgres service or change port in `docker-compose.yml`.
