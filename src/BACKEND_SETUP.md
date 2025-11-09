# SkySense Backend Setup Guide

Follow these steps to set up the complete backend infrastructure for SkySense.

## Prerequisites
- A Supabase account (free tier works perfectly)
- An OpenWeatherMap API key (free tier works)
- A Google Cloud Console project (for Google OAuth)

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with GitHub, Google, or Email
4. Click "New Project"
5. Fill in the project details:
   - **Name**: `skysense-weather`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (or choose paid if needed)
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

---

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. Copy and save these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   
4. You'll also need the **service_role key** for admin operations:
   - In the same API settings page, find "service_role" key
   - ⚠️ **NEVER expose this in client-side code!** Only use in secure backend operations

---

## Step 3: Set Up Database Tables

1. In your Supabase dashboard, click **SQL Editor** (in the left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `/database/schema.sql` from this project
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned"

**Verify your tables:**
- Click **Table Editor** in the sidebar
- You should see these tables:
  - `profiles`
  - `saved_locations`
  - `crowdsource_reports`
  - `user_preferences`
  - `weather_alerts`

---

## Step 4: Enable Authentication Providers

### Email/Password Authentication:
1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Find **Email** provider
3. Enable it (should be enabled by default)
4. Toggle ON "Enable email confirmations" (optional but recommended)
5. Save changes

### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable "Google+ API" or "Google People API"
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. Choose **Web application** as application type
7. Add these Authorized redirect URIs:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   (Replace `YOUR_PROJECT_REF` with your actual project reference)
8. Copy the **Client ID** and **Client Secret**
9. Go back to Supabase dashboard → **Authentication** → **Providers**
10. Find **Google** provider and enable it
11. Paste your Client ID and Client Secret
12. Save changes

---

## Step 5: Configure Row Level Security (RLS)

The schema.sql file includes RLS policies, but verify they're active:

1. Go to **Authentication** → **Policies** in Supabase
2. For each table, verify policies exist:
   - **profiles**: Users can read all, but only update their own
   - **saved_locations**: Users can only manage their own locations
   - **crowdsource_reports**: Users can read all, only create when authenticated
   - **user_preferences**: Users can only manage their own preferences

If policies are missing, they're included in the schema.sql file.

---

## Step 6: Get Weather API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" (it's free!)
3. Create an account
4. Go to **API keys** tab in your account
5. Copy your API key (or generate a new one)
6. Note: It may take 10 minutes to 2 hours for the key to activate

**API Features you'll use:**
- Current Weather Data
- 5 Day / 3 Hour Forecast
- Geocoding API (for location search)
- Air Pollution API
- One Call API 3.0 (requires paid plan, optional)

---

## Step 7: Create Environment Variables

1. Create a file named `.env.local` in your project root (same folder as App.tsx)
2. Copy the contents from `.env.example` in this project
3. Fill in your actual values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Weather API Configuration
VITE_OPENWEATHER_API_KEY=your-openweather-api-key-here

# Google OAuth (Optional - for server-side flows)
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# App Configuration
VITE_APP_URL=http://localhost:5173
```

4. **NEVER commit this file to git!** (it's in .gitignore by default)

---

## Step 8: Install Required Dependencies

Run this command in your project terminal:

```bash
npm install @supabase/supabase-js
```

This is the only additional dependency needed!

---

## Step 9: Initialize Supabase in Your App

The Supabase client is already configured in `/lib/supabase.ts`. 

**Verify the setup:**
1. Open `/lib/supabase.ts`
2. Make sure it's using the environment variables correctly
3. The file should already be ready to use!

---

## Step 10: Test Your Setup

### Test Database Connection:
1. Open your browser console (F12)
2. Run the app (`npm run dev`)
3. Check for any Supabase connection errors

### Test Authentication:
1. Go to the Sign Up screen
2. Create a test account with email/password
3. Check Supabase dashboard → **Authentication** → **Users**
4. Your test user should appear there!

### Test Database Operations:
1. Sign in to your test account
2. Try saving a location
3. Check Supabase dashboard → **Table Editor** → **saved_locations**
4. Your saved location should appear there!

---

## Step 11: Optional - Seed Initial Data

If you want to pre-populate some data:

1. Go to Supabase **SQL Editor**
2. Run the contents of `/database/seed.sql`
3. This will add some sample data for testing

---

## Step 12: Enable Realtime (Optional)

For live updates on crowdsource reports:

1. Go to **Database** → **Replication** in Supabase
2. Find the `crowdsource_reports` table
3. Toggle on "Enable Realtime"
4. Save changes

---

## Common Issues & Solutions

### Issue: "Invalid API key" from OpenWeatherMap
**Solution:** Wait 10 minutes to 2 hours after creating the key. Keys aren't instantly active.

### Issue: Supabase "Invalid API key"
**Solution:** Make sure you copied the `anon` key, not the `service_role` key for client-side code.

### Issue: Google OAuth not working
**Solution:** 
- Verify redirect URI exactly matches (including https://)
- Make sure OAuth consent screen is configured
- Check that Google+ API is enabled

### Issue: RLS policies blocking requests
**Solution:**
- Check if user is properly authenticated
- Verify policies in Supabase dashboard
- Check browser console for specific errors

### Issue: CORS errors
**Solution:**
- Supabase handles CORS automatically
- If you see CORS errors, check that your Supabase URL is correct
- Make sure you're using the `anon` key, not `service_role` key in client code

---

## Security Best Practices

1. ✅ **NEVER** expose `service_role` key in client-side code
2. ✅ Always use environment variables for sensitive data
3. ✅ Keep RLS policies enabled on all tables
4. ✅ Validate user input on both client and server
5. ✅ Use HTTPS in production
6. ✅ Regularly rotate API keys
7. ✅ Monitor Supabase dashboard for unusual activity

---

## Next Steps

1. **Production Deployment:**
   - Add production environment variables to your hosting platform
   - Update OAuth redirect URIs for production domain
   - Consider upgrading Supabase/OpenWeather plans if needed

2. **Monitoring:**
   - Set up Supabase email notifications
   - Monitor API usage in OpenWeatherMap dashboard
   - Check Supabase logs regularly

3. **Enhancements:**
   - Add email templates in Supabase for password reset
   - Configure Supabase Storage for user profile pictures
   - Set up Supabase Edge Functions for complex backend logic

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **OpenWeatherMap API Docs:** https://openweathermap.org/api
- **Supabase Discord:** https://discord.supabase.com
- **This Project's Database Docs:** See `/database/README.md`

---

## Checklist

Use this checklist to track your progress:

- [ ] Created Supabase project
- [ ] Copied Supabase URL and anon key
- [ ] Created database tables using schema.sql
- [ ] Enabled Email authentication
- [ ] Set up Google OAuth (optional)
- [ ] Verified RLS policies
- [ ] Got OpenWeatherMap API key
- [ ] Created .env.local file with all credentials
- [ ] Installed @supabase/supabase-js package
- [ ] Tested authentication (sign up/sign in)
- [ ] Tested database operations (save location)
- [ ] Verified everything works!

---

**You're all set! 🎉**

Your SkySense app is now connected to a fully functional backend with authentication, database, and real weather data.
