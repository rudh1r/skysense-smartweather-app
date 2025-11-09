# SkySense Backend - Quick Start Guide

Get your SkySense backend up and running in 15 minutes!

## Prerequisites

- ✅ A Supabase account (free)
- ✅ An OpenWeatherMap account (free)
- ✅ Google Cloud Console project (optional, for Google OAuth)

---

## Step-by-Step Setup

### 1️⃣ Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in details:
   - **Name:** `skysense-weather`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

### 2️⃣ Set Up Database (2 minutes)

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Open `/database/schema.sql` from this project
4. Copy ALL the contents
5. Paste into SQL Editor
6. Click **"Run"** (or Ctrl/Cmd + Enter)
7. You should see: "Success. No rows returned" ✅

**Verify:** Click **"Table Editor"** - you should see 6 tables:
- profiles
- saved_locations
- crowdsource_reports
- report_votes
- user_preferences
- weather_alerts

### 3️⃣ Get Supabase Credentials (1 minute)

1. Go to **Project Settings** (gear icon)
2. Click **"API"** in left menu
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

**Save these!** You'll need them in step 6.

### 4️⃣ Enable Authentication (2 minutes)

#### Email/Password:
1. Go to **Authentication** → **Providers**
2. Find **Email** - it should be enabled by default ✅
3. (Optional) Toggle ON "Enable email confirmations"

#### Google OAuth (Optional):
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Choose **"Web application"**
6. Add redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   (Replace YOUR_PROJECT with your Supabase project ref)
7. Copy **Client ID** and **Client Secret**
8. Back in Supabase → **Authentication** → **Providers**
9. Find **Google** and enable it
10. Paste Client ID and Client Secret
11. Save

### 5️⃣ Get Weather API Key (3 minutes)

1. Go to [openweathermap.org](https://openweathermap.org/api)
2. Click **"Sign Up"** (free!)
3. Complete registration
4. Go to **"API keys"** tab
5. Copy your API key (or create a new one)

**⏰ Important:** The API key may take 10 minutes to 2 hours to activate!

### 6️⃣ Configure Environment Variables (2 minutes)

1. In your project root, create a file named `.env.local`
2. Copy this template and fill in your values:

```env
# Supabase (from Step 3)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenWeatherMap (from Step 5)
VITE_OPENWEATHER_API_KEY=your-weather-api-key-here

# App URL
VITE_APP_URL=http://localhost:5173
```

3. Save the file

**🔒 Security:** Never commit `.env.local` to git!

### 7️⃣ Install Dependencies (1 minute)

Run this in your terminal:

```bash
npm install @supabase/supabase-js
```

That's it! Just one package to install.

### 8️⃣ Test Your Setup (1 minute)

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open your browser console (F12)

3. Try creating an account:
   - Go to Sign Up screen
   - Create a test account
   - Check for errors in console

4. Verify in Supabase:
   - Go to **Authentication** → **Users**
   - Your test user should be there! ✅

---

## Verification Checklist

- [ ] Supabase project created
- [ ] Database tables created (6 tables)
- [ ] Supabase credentials saved
- [ ] Email authentication enabled
- [ ] OpenWeatherMap API key obtained
- [ ] `.env.local` file created and filled
- [ ] `@supabase/supabase-js` installed
- [ ] Test user created successfully

---

## What You've Set Up

✅ **Database:** PostgreSQL with 6 tables and security policies  
✅ **Authentication:** Email/password (+ Google OAuth if configured)  
✅ **Weather API:** Real-time weather data from OpenWeatherMap  
✅ **User Profiles:** Automatic profile creation  
✅ **Saved Locations:** Location management  
✅ **Crowdsourcing:** Community weather reports  
✅ **Preferences:** User settings storage  
✅ **Alerts:** Weather alert system  

---

## Next Steps

### Start Using the APIs

Check out these files for examples:

1. **Authentication:**
   - `/lib/auth-helpers.ts` - Sign in, sign up, sign out functions
   - Example: `signInWithEmail(email, password)`

2. **Weather Data:**
   - `/lib/weather-api.ts` - Get weather, forecasts, air quality
   - Example: `getCurrentWeather(lat, lon)`

3. **Database:**
   - `/lib/db-operations.ts` - Save locations, create reports, etc.
   - Example: `addSavedLocation(userId, location)`

### Integration Guide

Read `/API_INTEGRATION_GUIDE.md` for:
- Complete code examples
- How to replace mock data with real APIs
- Best practices
- Common patterns

### Full Documentation

- **Backend Setup:** `/BACKEND_SETUP.md` - Detailed instructions
- **Database Docs:** `/database/README.md` - Database structure
- **API Guide:** `/API_INTEGRATION_GUIDE.md` - Code examples

---

## Troubleshooting

### Issue: "Missing environment variable"
**Fix:** Check your `.env.local` file has all required values

### Issue: OpenWeatherMap returns "Invalid API key"
**Fix:** Wait 10 minutes to 2 hours - new keys take time to activate

### Issue: "Row Level Security" errors
**Fix:** Make sure you ran the complete `schema.sql` file

### Issue: Can't create user
**Fix:** 
1. Check Supabase dashboard → Authentication → Providers
2. Make sure Email provider is enabled
3. Check browser console for specific error

### Issue: Database operations fail
**Fix:**
1. Verify user is signed in: `await getCurrentUser()`
2. Check RLS policies in Supabase dashboard
3. Make sure table was created correctly

---

## Common Questions

**Q: Do I need a credit card?**  
A: No! Both Supabase and OpenWeatherMap have generous free tiers.

**Q: How many API calls can I make?**  
A: OpenWeatherMap free tier: 1,000 calls/day (≈ 40 calls/hour)

**Q: Is my data secure?**  
A: Yes! All tables have Row Level Security (RLS) enabled. Users can only access their own data.

**Q: Can I use this in production?**  
A: Yes! Just update environment variables in your hosting platform and use production Supabase project.

**Q: What if I hit API limits?**  
A: Cache weather data in `saved_locations.cached_weather_data` to reduce API calls.

---

## Support

Need help?

1. **Check documentation:**
   - `/BACKEND_SETUP.md`
   - `/database/README.md`
   - `/API_INTEGRATION_GUIDE.md`

2. **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

3. **OpenWeatherMap Docs:** [openweathermap.org/api](https://openweathermap.org/api)

4. **Community:**
   - [Supabase Discord](https://discord.supabase.com)

---

## You're Ready! 🎉

Your SkySense backend is fully configured and ready to use!

**What you can do now:**
- ✅ Sign up / Sign in users
- ✅ Get real weather data
- ✅ Save user locations
- ✅ Create crowdsource reports
- ✅ Manage user preferences
- ✅ Display weather alerts

**Start coding!** Check `/API_INTEGRATION_GUIDE.md` for examples.

---

**Setup Time:** ~15 minutes  
**Last Updated:** 2025  
**Version:** 1.0.0
