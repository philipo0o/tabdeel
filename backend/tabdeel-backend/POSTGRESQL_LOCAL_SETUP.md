# PostgreSQL Local Installation Guide

## Quick Setup (5 Minutes)

### Step 1: Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Choose latest version (PostgreSQL 16.x recommended)
4. Download the Windows x86-64 installer

### Step 2: Install PostgreSQL

1. **Run the installer** (postgresql-16.x-windows-x64.exe)
2. **Installation Directory:** Keep default
   ```
   C:\Program Files\PostgreSQL\16
   ```
3. **Components:** Keep all selected:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4
   - ✅ Stack Builder
   - ✅ Command Line Tools

4. **Data Directory:** Keep default

5. **Password Setup:** 
   - Enter password: `postgres`
   - **IMPORTANT: Remember this password!**
   - Confirm password: `postgres`

6. **Port:** Keep `5432`

7. **Locale:** Keep default

8. **Click "Next"** → **"Install"**

9. **Wait 2-3 minutes**

10. **Finish:**
    - ✅ Uncheck "Launch Stack Builder"
    - Click "Finish"

### Step 3: Verify Installation

**Check if PostgreSQL is running:**

1. Press `Win + R`
2. Type: `services.msc`
3. Press Enter
4. Look for **"postgresql-x64-16"**
5. Status should be **"Running"**

If not running:
- Right-click → Start

### Step 4: Create Database

**Method 1: Using pgAdmin (Recommended - Visual)**

1. **Open pgAdmin 4** from Start Menu
2. **First time:** Set a master password (any password you want)
3. **Left sidebar:** Expand "Servers" → "PostgreSQL 16"
4. **Enter password:** `postgres` (the one you set during installation)
5. **Right-click "Databases"** → "Create" → "Database..."
6. **Database name:** `biking_club`
7. **Owner:** postgres
8. **Click "Save"**

**Method 2: Using Command Line (Faster)**

1. **Open Command Prompt** (Win + R, type `cmd`, Enter)

2. **Navigate to PostgreSQL bin:**
   ```cmd
   cd "C:\Program Files\PostgreSQL\16\bin"
   ```

3. **Connect to PostgreSQL:**
   ```cmd
   psql -U postgres
   ```

4. **Enter your password** when prompted

5. **Create database:**
   ```sql
   CREATE DATABASE biking_club;
   ```

6. **Verify it was created:**
   ```sql
   \l
   ```
   (You should see `biking_club` in the list)

7. **Exit:**
   ```sql
   \q
   ```

### Step 5: Update .env File

Your `.env` file should already be configured for local PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=biking_club
```

**If you used a different password during installation, update `DB_PASSWORD`**

### Step 6: Test Connection

In your backend folder, run:

```bash
node test-supabase-connection.js
```

You should see:
```
✅ Connected successfully!
✅ Query successful!
🎉 Supabase connection test PASSED!
```

### Step 7: Start Your Backend

```bash
npm run start:dev
```

You should see:
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [NestApplication] Nest application successfully started
Backend running on http://localhost:3001
```

## Troubleshooting

### Error: "password authentication failed"
- Check your password in `.env` file
- Make sure it matches the password you set during installation
- No quotes around the password

### Error: "database 'biking_club' does not exist"
- You need to create the database (see Step 4)
- Use pgAdmin or command line to create it

### Error: "could not connect to server"
- PostgreSQL service is not running
- Open Services (services.msc)
- Find "postgresql-x64-16"
- Right-click → Start

### Error: "port 5432 is already in use"
- Another PostgreSQL instance is running
- Or another application is using port 5432
- Either stop the other service or change the port in `.env`

### Can't find psql command
- Add PostgreSQL to PATH:
  1. Win + R → `sysdm.cpl` → Enter
  2. Advanced → Environment Variables
  3. System Variables → Path → Edit
  4. New → `C:\Program Files\PostgreSQL\16\bin`
  5. OK → OK → OK
  6. Restart Command Prompt

## Using pgAdmin 4

pgAdmin is a visual tool to manage your database:

### Connect to Database
1. Open pgAdmin 4
2. Servers → PostgreSQL 16 → Databases → biking_club

### View Tables
1. biking_club → Schemas → public → Tables
2. You'll see all your tables after running the backend

### View Data
1. Right-click on a table
2. View/Edit Data → All Rows

### Run SQL Queries
1. Tools → Query Tool
2. Write your SQL
3. Press F5 or click Execute

## Useful Commands

### Connect to database:
```bash
psql -U postgres -d biking_club
```

### List all databases:
```sql
\l
```

### List all tables:
```sql
\dt
```

### View table structure:
```sql
\d table_name
```

### View all data in a table:
```sql
SELECT * FROM "user";
```

### Exit psql:
```sql
\q
```

## Next Steps

Once PostgreSQL is installed and running:

1. ✅ PostgreSQL installed
2. ✅ Database `biking_club` created
3. ✅ `.env` file configured
4. ✅ Connection test passed
5. ✅ Start backend: `npm run start:dev`
6. ✅ Tables automatically created by TypeORM
7. ✅ View tables in pgAdmin
8. ✅ Connect frontend

---

**You're all set! Your backend now runs with local PostgreSQL.** 🎉
