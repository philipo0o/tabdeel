# Quick Start - Supabase Connection

## 🚀 3-Minute Setup

### 1. Create Supabase Project
```
1. Go to: https://supabase.com
2. Sign up / Login
3. Click "New Project"
4. Name: tabdeel-biking-club
5. Password: [Create & Save It!]
6. Region: Choose closest
7. Wait 2 minutes
```

### 2. Get Your Credentials
```
1. Click ⚙️ (Settings) → Database
2. Find "Connection string" section
3. Copy these values:
   - Host: db.xxxxx.supabase.co
   - Password: [Your password]
```

### 3. Update .env File
```env
DB_HOST=db.xxxxx.supabase.co          # ← Paste your host here
DB_PASSWORD=your_password              # ← Paste your password here
```

### 4. Start Backend
```bash
npm run start:dev
```

### 5. Verify
```
✅ Check terminal: "Nest application successfully started"
✅ Go to Supabase → Table Editor
✅ See your tables: user, article, event, album, news, etc.
```

## 📝 Your Credentials Template

```
Supabase Project: tabdeel-biking-club
Host: db._________________.supabase.co
Password: _________________________
Database: postgres
Port: 5432
User: postgres
```

## ⚡ Common Issues

**Can't connect?**
- Check internet connection
- Verify host/password in .env
- No quotes around password

**Tables not created?**
- Check backend logs for errors
- Verify synchronize: true in app.module.ts

## 🎯 Next Steps

1. ✅ Backend running with Supabase
2. Test API: http://localhost:3001/api/users
3. View data: Supabase Dashboard → Table Editor
4. Connect frontend

---

Need help? Check `SUPABASE_SETUP.md` for detailed guide!
