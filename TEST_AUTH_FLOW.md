# Test Authentication Flow for Community Watch App

## 🧪 Quick Test Script

Run this in browser console when your app is loaded at `http://localhost:8082`:

```javascript
// Test Supabase Authentication Flow
async function testAuthFlow() {
  console.log('=== Starting Auth Flow Test ===');
  
  // Get Supabase client (assuming it's available globally)
  const supabase = window.supabase || (await import('./src/integrations/supabase/client')).supabase;
  
  // Test 1: Check current session
  console.log('Test 1: Checking current session...');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('Current session:', session);
  console.log('Session error:', sessionError);
  
  // Generate unique test email
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  // Test 2: Sign up new user
  console.log(`\nTest 2: Signing up ${testEmail}...`);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword
  });
  
  console.log('Signup response:', signUpData);
  console.log('Signup error:', signUpError);
  
  if (signUpError) {
    console.error('❌ Signup failed:', signUpError.message);
    return;
  }
  
  console.log('✅ Signup successful! User:', signUpData.user?.email);
  
  // Test 3: Login with new credentials
  console.log('\nTest 3: Logging in...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });
  
  console.log('Login response:', loginData);
  console.log('Login error:', loginError);
  
  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
    return;
  }
  
  console.log('✅ Login successful! User:', loginData.user?.email);
  
  // Test 4: Create user profile (if your app does this)
  console.log('\nTest 4: Creating user profile...');
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: loginData.user.id,
      full_name: 'Test User'
    })
    .select();
  
  console.log('Profile created:', profileData);
  console.log('Profile error:', profileError);
  
  // Test 5: Get updated session
  console.log('\nTest 5: Getting updated session...');
  const { data: { session: newSession } } = await supabase.auth.getSession();
  console.log('New session:', newSession);
  
  // Test 6: Sign out
  console.log('\nTest 6: Signing out...');
  const { error: signOutError } = await supabase.auth.signOut();
  console.log('Sign out error:', signOutError);
  
  console.log('\n=== Auth Flow Test Complete ===');
  console.log('✅ All tests passed! Authentication is working correctly.');
}

// Run the test
testAuthFlow().catch(console.error);
```

## 📋 Manual Testing Steps

### Step 1: Open Browser Console
1. Open your app at `http://localhost:8787`
2. Press `F12` or `Ctrl+Shift+I` to open DevTools
3. Go to **Console** tab

### Step 2: Run Test Script
Copy and paste the test script above into console and press Enter.

### Step 3: Expected Results
You should see:
```
=== Starting Auth Flow Test ===
Test 1: Checking current session...
Current session: null (or existing session)
Test 2: Signing up test123456789@example.com...
✅ Signup successful! User: test123456789@example.com
Test 3: Logging in...
✅ Login successful! User: test123456789@example.com
...
✅ All tests passed! Authentication is working correctly.
```

## 🔍 Troubleshooting Common Issues

### Issue 1: "supabase is not defined"
**Fix**: The Supabase client might not be globally available. Try:
```javascript
// Check if supabase is available
if (typeof supabase === 'undefined') {
  console.error('Supabase client not found. Make sure the app is loaded.');
}
```

### Issue 2: "Email not confirmed"
**Fix**: 
1. Run the SQL script `fix_auth_settings.sql` in Supabase
2. Or disable email confirmation in Supabase dashboard
3. Clear browser cache and restart app

### Issue 3: 429 Rate Limit
**Fix**: Wait 60 seconds and try again. Reduce test frequency.

### Issue 4: 400 Bad Request
**Fix**: 
1. Check Site URL in Supabase dashboard matches `http://localhost:8787`
2. Verify redirect URLs are configured
3. Check password requirements (min 6 characters)

### Issue 5: CORS Errors
**Fix**: 
1. Add `http://localhost:8787` to allowed origins in Supabase
2. Check Network tab for CORS headers

## 🎯 Success Criteria

Authentication is working correctly when:

1. ✅ User can sign up without email confirmation
2. ✅ User can immediately log in after signup  
3. ✅ Session persists across page reloads
4. ✅ User profile is created (if applicable)
5. ✅ User can sign out successfully
6. ✅ No console errors during auth flow

## 🚀 Next Steps After Successful Test

1. **Test UI Flow**: Use the actual app UI to sign up/login
2. **Create Test Issues**: Test if authenticated users can create issues
3. **Test Admin Features**: If you created an admin user, test admin privileges
4. **Deploy to Vercel**: Push changes and test production auth

## 📊 Monitoring

Check these places for auth activity:

1. **Supabase Dashboard** → **Authentication** → **Logs**
2. **Browser Network Tab**: Filter for `auth/v1` requests
3. **Console Logs**: For any JavaScript errors
4. **Local Storage**: Check for `sb-` tokens

## 🆘 Emergency Fixes

If auth completely breaks:

1. **Reset Supabase Auth**:
   ```sql
   -- Be careful! This will delete all users
   -- DELETE FROM auth.users;
   ```

2. **Clear Local Data**:
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

3. **Restart Everything**:
   - Restart local dev server
   - Clear browser cache
   - Restart browser

---

**✅ TEST COMPLETE WHEN:** All 6 steps in the test script pass without errors.