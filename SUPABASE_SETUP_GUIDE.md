# Complete Supabase Setup Guide for Community Watch App

## 📋 Overview
This guide will help you set up a Supabase backend for your Community Watch application, replacing the Lovable database with your own Supabase instance.

## 🚀 Step 1: Create Supabase Account and Project

### 1.1 Sign up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, GitLab, or email
4. Verify your email address

### 1.2 Create New Project
1. Click **"New project"**
2. Enter project details:
   - **Name**: `community-watch-app`
   - **Database Password**: Create a strong password (save this for later)
   - **Region**: Choose closest region (e.g., `Singapore (ap-southeast-1)`)
3. Click **"Create new project"**
4. Wait 1-2 minutes for project to be provisioned

### 1.3 Get Project Credentials
Once project is ready:
1. Go to **Project Settings** (gear icon in left sidebar)
2. Navigate to **API** tab
3. Copy these values:
   - **URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIs...`
   - **service_role key**: (keep this secure, never expose in frontend)

## 🗄️ Step 2: Run Database Migrations

### 2.1 Connect to Supabase SQL Editor
1. In Supabase dashboard, go to **SQL Editor** in left sidebar
2. Click **"New query"**

### 2.2 Run Migration Script
Copy the entire content from `supabase/migrations/20260418170424_b5d8ea9c-eefe-445a-80da-cf821c093a0b.sql` and paste into the SQL Editor, then click **"Run"**.

### 2.3 Verify Tables Created
Go to **Table Editor** in left sidebar, you should see these tables:
- `profiles`
- `user_roles`
- `issues`
- `issue_comments`
- `issue_upvotes`
- `issue_images`
- `issue_status_history`

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Update Local `.env` File
Edit your `.env` file with new Supabase credentials:

```env
# Replace with your Supabase credentials
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here

# Optional: For server-side operations
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
VITE_SUPABASE_PROJECT_ID=your-project-ref
```

### 3.2 Update Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update these variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your anon/public key
4. Click **"Save"**

## 🔐 Step 4: Set Up Authentication

### 4.1 Configure Auth Providers
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable these providers:
   - **Email**: Enable, set confirmation emails if needed
   - **GitHub**: Optional, for social login
   - **Google**: Optional, for social login

### 4.2 Configure Site URL
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to:
   - Local: `http://localhost:8787`
   - Production: Your Vercel deployment URL
3. Set **Additional Redirect URLs** if needed

### 4.3 Email Templates (Optional)
Customize email templates in **Authentication** → **Email Templates**:
- Confirm signup
- Invite user
- Reset password
- Email change

## 🧪 Step 5: Test the Setup

### 5.1 Test Local Connection
1. Run the app locally:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:8787`
3. Try to sign up/create account
4. Test creating an issue

### 5.2 Test Database Connection
1. In Supabase dashboard, go to **Table Editor**
2. Check if data is being inserted into tables
3. Test RLS (Row Level Security) by logging in as different users

### 5.3 Test API Endpoints
Use Supabase client in browser console:
```javascript
// Test if client is working
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

// Test query
const { data, error } = await supabase.from('issues').select('*');
console.log(data, error);
```

## 🚢 Step 6: Deploy to Vercel with New Credentials

### 6.1 Push Updated Code
```bash
git add .
git commit -m "Switch to custom Supabase database"
git push origin main
```

### 6.2 Trigger New Deployment
Vercel will automatically deploy with new environment variables.

### 6.3 Verify Deployment
1. Check Vercel deployment logs for errors
2. Test production app:
   - Sign up flow
   - Issue creation
   - Map functionality
3. Monitor Supabase logs for any issues

## 🛠️ Step 7: Advanced Configuration

### 7.1 Row Level Security (RLS) Policies
The migration already includes RLS policies. Verify they're working:
- Users can only see their own profiles
- Users can create and view issues
- Admins have additional privileges

### 7.2 Storage Setup (for issue images)
1. Go to **Storage** in Supabase dashboard
2. Create a bucket named `issue-images`
3. Set policies:
   - Public read access for viewing images
   - Authenticated users can upload
   - Users can only delete their own uploads

### 7.3 Database Backups
1. Go to **Database** → **Backups**
2. Enable automatic daily backups
3. Set retention period (7-30 days recommended)

### 7.4 Monitoring
1. **Logs**: Check **Logs Explorer** for API requests
2. **Database**: Monitor **Database Health**
3. **Auth**: Review **Authentication** → **Users**

## 🆘 Troubleshooting

### Common Issues & Solutions

#### Issue: "Missing Supabase environment variables"
**Solution**: Verify `.env` file and Vercel environment variables are set correctly.

#### Issue: "RLS policy violation"
**Solution**: Check if user is authenticated. Test policies in SQL Editor:
```sql
-- Test RLS policies
SET ROLE anon;
SELECT * FROM issues; -- Should return empty for anonymous

SET ROLE authenticated;
SELECT * FROM issues; -- Should return user's issues
```

#### Issue: "Authentication failed"
**Solution**:
1. Check Site URL in Supabase Auth settings
2. Verify redirect URLs are correct
3. Check browser console for CORS errors

#### Issue: "Build fails on Vercel"
**Solution**:
1. Check Vercel build logs
2. Ensure environment variables are set in Vercel
3. Verify Node.js version compatibility

## 📈 Next Steps

1. **Add Analytics**: Set up PostHog or similar for user analytics
2. **Enable Realtime**: Turn on Realtime for live updates
3. **Set up Webhooks**: For notifications and integrations
4. **Performance Optimization**: Add database indexes for frequent queries
5. **Scale Resources**: Upgrade Supabase plan as user base grows

## 📞 Support
- **Supabase Docs**: https://supabase.com/docs
- **Community Discord**: https://discord.supabase.com
- **GitHub Issues**: For app-specific issues

---

**✅ Setup Complete!** Your Community Watch app is now running on your own Supabase backend.