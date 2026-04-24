# Site URL Configuration for Supabase Authentication

## Problem
You're getting 400/429 errors and "email not confirmed" because:
1. Site URL is not configured in Supabase
2. Email confirmation is enabled
3. Redirect URLs don't match

## Solution Steps

### Step 1: Configure Site URL in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Set **Site URL** to: `http://localhost:8787`
4. Add **Additional Redirect URLs**:
   - `http://localhost:8787/auth/callback`
   - `http://localhost:8080` (if using different port)
   - `http://localhost:8080/auth/callback`
5. Click **Save**

### Step 2: Disable Email Confirmation (Development)
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Click on **Email** provider
3. Toggle off **"Confirm email"** or **"Enable confirmations"**
4. Alternatively, run the SQL script `fix_auth_settings.sql` in SQL Editor

### Step 3: Update Local Development Port
Check which port your app runs on:
```bash
# Check package.json scripts
npm run dev
```

If it runs on port 8080 instead of 8787, update:
1. Site URL in Supabase to `http://localhost:8080`
2. Redirect URLs accordingly

### Step 4: Clear Browser Cache
After making changes:
1. Clear browser cache and cookies
2. Restart your local dev server
3. Test signup/login again

## Verification
To verify configuration is correct:

1. **Check Site URL**:
   ```sql
   SELECT * FROM auth.config;
   ```

2. **Test Signup**:
   - Should create user without email confirmation
   - Should redirect properly
   - Should log in immediately

## Production Configuration
For production deployment (Vercel):
1. Set **Site URL** to your production domain (e.g., `https://your-app.vercel.app`)
2. Add production redirect URLs
3. Consider re-enabling email confirmation for security

## Common Issues & Fixes

### Issue: "email not confirmed"
**Fix**: Disable email confirmation in Supabase Auth settings

### Issue: 429 Rate Limit Error
**Fix**: Wait a few minutes and try again. Supabase limits requests per second.

### Issue: 400 Bad Request
**Fix**: Check Site URL and redirect URLs match exactly

### Issue: Redirect loop
**Fix**: Ensure `auth/callback` route exists in your app and Site URL includes it

## Quick SQL Fix
Run this in Supabase SQL Editor:
```sql
-- Disable email confirmation
UPDATE auth.config SET mailer_autoconfirm = true;