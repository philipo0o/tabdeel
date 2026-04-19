# Supabase Setup Guide for Tabdeel Backend

## Step 1: Create Supabase Account & Project

1. **Go to Supabase:**
   - Visit: https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub, Google, or Email

2. **Create New Project:**
   - Click "New Project"
   - **Organization:** Create new or select existing
   - **Project Name:** `tabdeel-biking-club` (or any name you prefer)
   - **Database Password:** Create a strong password and **SAVE IT!**
   - **Region:** Choose closest to you:
     - Middle East: `West Asia (Mumbai)`
     - Europe: `Europe (Frankfurt)` or `Europe (London)`
     - US: `East US (North Virginia)`
   - Click "Create new project"
   - Wait ~2 minutes for setup to complete

## Step 2: Get Your Database Credentials

1. **Open Project Settings:**
   - Click the **gear icon** (⚙️) in the left sidebar
   - Select **Database** from the menu

2. **Find Connection Details:**
   - Scroll down to **Connection string** section
   - You'll see several fields:
     - **Host:** `db.xxxxxxxxxxxxx.supabase.co`
     - **Database name:** `postgres`
     - **Port:** `5432`
     - **User:** `postgres`
     - **Password:** [The password you created]

3. **Copy Your Connection Info:**
   - **Host:** Copy the value (e.g., `db.abcdefghijklmno.supabase.co`)
   - **Password:** Use the password you created in Step 1

## Step 3: Update Your .env File

1. **Open the `.env` file** in your backend folder
2. **Replace the placeholder values:**

```env
DB_HOST=db.abcdefghijklmno.supabase.co    # Replace with your actual host
DB_PORT=5432                                # Keep as is
DB_USER=postgres                            # Keep as is
DB_PASSWORD=your_actual_password_here       # Replace with your password
DB_NAME=postgres                            # Keep as is
```

## Step 4: Start Your Backend

1. **Open terminal in backend folder**
2. **Run:**
   ```bash
   npm run start:dev
   ```

3. **Check the logs:**
   - You should see: "Nest application successfully started"
   - TypeORM will automatically create all tables in Supabase

## Step 5: View Your Database Tables

1. **Go to Supabase Dashboard**
2. **Click "Table Editor"** in the left sidebar
3. **You should see all your tables:**
   - user
   - article
   - event
   - comment
   - album
   - album_photo
   - publication
   - news
   - content

## Troubleshooting

### Connection Error: "ECONNREFUSED"
- Check your internet connection
- Verify DB_HOST is correct (no extra spaces)
- Verify DB_PASSWORD is correct

### Connection Error: "password authentication failed"
- Double-check your password in .env file
- Make sure there are no quotes around the password
- Try resetting your database password in Supabase settings

### Tables Not Created
- Check that `synchronize: true` in app.module.ts
- Check backend logs for errors
- Verify all entity files are in the correct location

## Supabase Dashboard Features

### Table Editor
- View and edit data directly
- Add/delete rows manually
- Export data as CSV

### SQL Editor
- Run custom SQL queries
- Create indexes
- View table schemas

### Database Backups
- Automatic daily backups (free tier)
- Manual backups available

### API Documentation
- Auto-generated REST API
- Auto-generated GraphQL API
- Real-time subscriptions

## Free Tier Limits

- **Database Size:** 500 MB
- **Bandwidth:** 2 GB/month
- **API Requests:** Unlimited
- **Storage:** 1 GB

This should be more than enough for development!

## Security Best Practices

1. **Never commit .env file to Git**
   - Already in .gitignore
   
2. **Use strong passwords**
   - At least 12 characters
   - Mix of letters, numbers, symbols

3. **Enable Row Level Security (RLS)** for production
   - Go to Table Editor
   - Click on table → RLS policies

4. **Use environment variables in production**
   - Don't use .env file in production
   - Use hosting platform's environment variables

## Next Steps

Once your backend is running with Supabase:
1. Test API endpoints with Postman or the test file
2. Connect your frontend
3. Create some test data
4. View data in Supabase dashboard

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- NestJS + Supabase: https://docs.nestjs.com/techniques/database

---

**Your backend is now configured for Supabase! 🚀**
