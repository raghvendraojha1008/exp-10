-- Fix Authentication Settings for Community Watch App
-- Run this in Supabase SQL Editor after creating your project

-- 1. Disable email confirmation for development/testing
UPDATE auth.config
SET mailer_autoconfirm = true
WHERE instance_id = (SELECT id FROM auth.instances LIMIT 1);

-- 2. Enable signups without email verification
INSERT INTO auth.config (instance_id, mailer_autoconfirm, sms_autoconfirm)
VALUES (
  (SELECT id FROM auth.instances LIMIT 1),
  true,  -- Auto-confirm email
  false  -- Don't auto-confirm SMS
)
ON CONFLICT (instance_id) DO UPDATE
SET mailer_autoconfirm = EXCLUDED.mailer_autoconfirm,
    sms_autoconfirm = EXCLUDED.sms_autoconfirm;

-- 3. Update Site URL configuration
-- Note: You need to manually set this in Supabase Dashboard:
-- Go to Authentication → URL Configuration → Site URL
-- Set to: http://localhost:8787 (for local development)
-- Also add: http://localhost:8080 (if using different port)

-- 4. Check current configuration
SELECT 
  mailer_autoconfirm,
  sms_autoconfirm,
  security_captcha_enabled,
  security_manual_linking_enabled
FROM auth.config;

-- 5. Optional: Create a test admin user (password: testpassword123)
-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   confirmation_token,
--   email_change,
--   email_change_token_new,
--   recovery_token
-- ) VALUES (
--   (SELECT id FROM auth.instances LIMIT 1),
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'admin@example.com',
--   crypt('testpassword123', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW(),
--   '',
--   '',
--   '',
--   ''
-- );

-- 6. Add admin role to test user (if created above)
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
--   'admin'
-- );

-- 7. Check if changes applied
SELECT 
  'Auth Configuration Applied' as status,
  (SELECT mailer_autoconfirm FROM auth.config) as auto_confirm_enabled;