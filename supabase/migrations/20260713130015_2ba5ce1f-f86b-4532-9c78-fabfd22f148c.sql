
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_key ON public.profiles (lower(username)) WHERE username IS NOT NULL;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  admin_id uuid;
  admin_email text := 'ravipchy@paysol.local';
  admin_pwd text := 'Rpchy321@';
  admin_phone text := '+91' || lpad((floor(random()*9000000000)::bigint + 1000000000)::text, 10, '0');
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = admin_email;
  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, phone, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
      admin_email, admin_phone, crypt(admin_pwd, gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name','Ravi (Admin)','username','ravipchy','mobile', substring(admin_phone from 3)),
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_id,
      jsonb_build_object('sub', admin_id::text, 'email', admin_email),
      'email', admin_email, now(), now(), now());
  ELSE
    UPDATE auth.users SET encrypted_password = crypt(admin_pwd, gen_salt('bf')), updated_at = now()
    WHERE id = admin_id;
  END IF;

  UPDATE public.profiles
    SET username = 'ravipchy',
        full_name = COALESCE(NULLIF(full_name,''), 'Ravi (Admin)')
    WHERE id = admin_id;

  INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'super_admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
