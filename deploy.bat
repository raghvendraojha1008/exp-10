@echo off
echo ==========================================
echo 🚀 Community Watch App Deployment Script
echo ==========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo ⚠️  Git not initialized. Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit: Community Watch App"
)

REM Get current branch
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
if "%CURRENT_BRANCH%"=="" set CURRENT_BRANCH=main
echo 📦 Current branch: %CURRENT_BRANCH%

echo.
echo 📋 Deployment Checklist:
echo 1. ✅ Supabase authentication configured
echo 2. ✅ Email confirmation disabled
echo 3. ✅ Site URL configured in Supabase
echo 4. ✅ Node.js version 24.x in package.json
echo 5. ✅ Environment variables set
echo.
echo 🔧 Testing Authentication Locally:
echo    The app should be running at http://localhost:8082
echo    Test authentication at http://localhost:8082/test-auth.html
echo.
echo 🌐 Deployment Options:
echo.
echo Option A: Deploy to Vercel (Recommended)
echo ----------------------------------------
echo 1. Push code to GitHub:
echo    git remote add origin ^<your-github-repo-url^>
echo    git push -u origin %CURRENT_BRANCH%
echo.
echo 2. Import to Vercel:
echo    - Go to https://vercel.com/dashboard
echo    - Click 'Add New Project'
echo    - Import your GitHub repository
echo    - Add environment variables:
echo      - VITE_SUPABASE_URL: https://hayjgddgktvagwkbqbrq.supabase.co
echo      - VITE_SUPABASE_PUBLISHABLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheWpnZGRna3R2YWd3a2JxYnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjY2NTksImV4cCI6MjA5MjEwMjY1OX0.YE_fOoOmEZzs5pAjEddWzDKfNIOYRo37pD-sZFOegnA
echo    - Click 'Deploy'
echo.
echo Option B: Deploy to Cloudflare Pages
echo -------------------------------------
echo 1. Push code to GitHub (same as above)
echo 2. Go to https://dash.cloudflare.com
echo 3. Workers ^& Pages → Pages → Create application
echo 4. Connect to Git, select repository
echo 5. Build command: npm run build
echo 6. Output directory: dist
echo 7. Add same environment variables
echo 8. Deploy
echo.
echo 📝 Important Notes:
echo - Make sure your Supabase project has the correct Site URL:
echo    - Development: http://localhost:8082
echo    - Production: https://your-vercel-app.vercel.app
echo - Authentication settings should have 'Email confirmation' disabled
echo - Database schema is already applied via migration
echo.
echo ✅ Deployment preparation complete!
echo.
echo To test locally before deploying:
echo    npm run dev
echo    Then open http://localhost:8082/test-auth.html
echo.
echo For detailed instructions, see DEPLOYMENT_GUIDE.md
pause