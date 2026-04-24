# Supabase Authentication Settings Checklist

## ✅ Required Settings for Local Development

### 1. Email Provider Configuration
- [ ] **Disable email confirmation**: Go to Authentication → Providers → Email → Turn off "Confirm email"
- [ ] **Enable signups**: Ensure email signup is enabled
- [ ] **SMTP Setup (Optional)**: If you want actual emails, configure SMTP

### 2. URL Configuration
- [ ] **Site URL**: `http://localhost:8787`
- [ ] **Additional Redirect URLs**:
  - `http://localhost:8787/auth/callback`
  - `http://localhost:8080` (if different port)
  - `http://localhost:8080/auth/callback`
- [ ] **Allowed Request Origins**: Add `http://localhost:8787`

### 3. Security Settings
- [ ] **Rate limiting**: Be aware of 429 errors (wait and retry)
- [ ] **Password policy**: Default is fine for development
- [ ] **Session timeout**: Default 30 days is fine

### 4. Social Providers (Optional)
- [ ] **GitHub**: Configure OAuth app if needed
- [ ] **Google**: Configure OAuth credentials if needed
- [ ] **Others**: Facebook, Twitter, etc.

## 🔧 Manual Configuration via SQL

Run this in Supabase SQL Editor:

```sql
-- 1. Enable auto-confirm for development
UPDATE auth.config SET mailer_autoconfirm = true;

-- 2. Verify changes
SELECT mailer_autoconfirm, sms_autoconfirm FROM auth.config;

-- 3. Create test user (optional)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at
) VALUES (
  (SELECT id FROM auth.instances LIMIT 1),
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- 4. Add test user to profiles table
INSERT INTO public.profiles (id, full_name)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@example.com'),
  'Test User'
);
```

## 🧪 Testing Authentication

### Test 1: Signup Flow
```javascript
// Test signup with Supabase client
const { data, error } = await supabase.auth.signUp({
  email: 'newuser@example.com',
  password: 'securepassword123'
});

// Should return user without email confirmation
console.log('Signup:', data.user, error);
```

### Test 2: Login Flow
```javascript
// Test login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'newuser@example.com',
  password: 'securepassword123'
});

// Should login successfully
console.log('Login:', data.user, error);
```

### Test 3: Session Check
```javascript
// Check current session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

## 🚨 Common Issues & Solutions

### Issue 1: "Email not confirmed"
**Solution**: 
1. Disable email confirmation in Supabase dashboard
2. Run the SQL update above
3. Clear browser cache

### Issue 2: 429 Rate Limit Error
**Solution**:
1. Wait 1-2 minutes
2. Reduce frequency of auth requests
3. Implement exponential backoff in your code

### Issue 3: 400 Bad Request
**Solution**:
1. Check Site URL matches exactly
2. Verify redirect URLs
3. Ensure password meets requirements (6+ chars)

### Issue 4: Redirect Mismatch
**Solution**:
1. Update Site URL in Supabase dashboard
2. Add all possible localhost ports
3. Check `auth/callback` route exists in your app

## 📱 Mobile/App Configuration

If testing on mobile emulator or different device:
- Add device IP addresses to allowed origins
- Use `http://10.0.2.2:8787` for Android emulator
- Use `http://localhost:8787` for iOS simulator

## 🚀 Production Settings

Before deploying to production:
1. **Re-enable email confirmation** for security
2. **Update Site URL** to production domain
3. **Configure proper SMTP** for emails
4. **Set up proper redirect URLs**
5. **Enable HTTPS only**
6. **Review rate limits**

## 🔍 Debugging Tips

1. **Browser Console**: Check for auth errors
2. **Supabase Logs**: Go to Authentication → Logs
3. **Network Tab**: Inspect auth requests/responses
4. **Local Storage**: Check for auth tokens
5. **Supabase Dashboard**: Monitor real-time auth events

## 📞 Support Resources

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Community Discord**: https://discord.supabase.com
- **GitHub Issues**: Report bugs or issues

---

**✅ Configuration Complete when:**
1. Users can sign up without email confirmation
2. Users can log in immediately after signup
3. No 400/429 errors during auth flow
4. Sessions persist across page reloads