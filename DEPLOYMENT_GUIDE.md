# Deployment Guide for Community Watch App

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)
The app is now configured for Vercel deployment with Node.js 24.x compatibility.

#### Steps to Deploy to Vercel:

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New Project**
   - Import your GitHub repository
   - Vercel will automatically detect the Vite/React configuration

3. **Configure Environment Variables**
   Add these environment variables in Vercel project settings:

   | Variable Name | Value |
   |---------------|-------|
   | `VITE_SUPABASE_URL` | `https://hayjgddgktvagwkbqbrq.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheWpnZGRna3R2YWd3a2JxYnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjY2NTksImV4cCI6MjA5MjEwMjY1OX0.YE_fOoOmEZzs5pAjEddWzDKfNIOYRo37pD-sZFOegnA` |

4. **Build Settings (Auto-detected)**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Deploy**
   Click **Deploy** and wait for the build to complete.

### Option 2: Deploy to Cloudflare Pages

#### Steps to Deploy to Cloudflare Pages:

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Cloudflare Pages deployment"
   git push origin main
   ```

2. **Create Cloudflare Pages Project**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** → **Pages**
   - Click **Create application** → **Connect to Git**
   - Select your GitHub repository

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** (leave empty)

4. **Add Environment Variables**
   Add the same environment variables as above in Cloudflare Pages settings.

5. **Deploy**
   Click **Save and Deploy**

## Authentication Testing
Before deploying, test authentication locally:

1. **Run the app locally:**
   ```bash
   npm run dev
   ```

2. **Open test page:**
   Navigate to `http://localhost:8082/test-auth.html`

3. **Test authentication flow:**
   - Click "Load Supabase Client"
   - Click "Run Complete Auth Flow Test"
   - Verify signup/login works without email confirmation errors

## Files Created/Modified for Deployment
- `package.json` - Added Node.js 24.x engine for Vercel compatibility
- `vercel.json` - Vercel deployment configuration
- `wrangler.jsonc` - Cloudflare Pages configuration
- `vite.config.ts` - Added build optimization
- `.env` - Local environment variables
- `TEST_AUTH_FLOW.md` - Comprehensive testing guide
- `test-auth.html` - Interactive authentication test page

## Verification
- ✅ Node.js version updated to 24.x (Vercel compatible)
- ✅ Supabase authentication configured (email confirmation disabled)
- ✅ Site URL properly configured in Supabase dashboard
- ✅ Local authentication testing available
- ✅ Both Vercel and Cloudflare Pages configurations ready

## Next Steps
1. Test authentication locally using the test page
2. Push code to GitHub
3. Deploy to your preferred platform (Vercel recommended)
4. Configure environment variables in the deployment platform
5. Verify the deployed application works correctly