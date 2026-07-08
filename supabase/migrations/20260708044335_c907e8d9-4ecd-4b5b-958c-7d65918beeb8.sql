
-- =====================================================
-- ENUMS
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('super_admin','master_distributor','distributor','retailer','agent','support','auditor');
CREATE TYPE public.user_status AS ENUM ('active','inactive','suspended','deleted');
CREATE TYPE public.kyc_status AS ENUM ('not_started','pending','approved','rejected');
CREATE TYPE public.wallet_kind AS ENUM ('main','commission','hold');
CREATE TYPE public.ledger_direction AS ENUM ('credit','debit');
CREATE TYPE public.txn_service AS ENUM ('recharge_mobile','recharge_dth','recharge_fastag','bbps','aeps','dmt','wallet_transfer','settlement','commission','refund','adjustment');
CREATE TYPE public.txn_status AS ENUM ('initiated','pending','success','failed','refunded','requery');
CREATE TYPE public.ticket_status AS ENUM ('open','in_progress','resolved','closed','reopened');
CREATE TYPE public.ticket_priority AS ENUM ('low','medium','high','urgent');

-- =====================================================
-- PROFILES
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  mobile TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.user_status NOT NULL DEFAULT 'active',
  kyc_status public.kyc_status NOT NULL DEFAULT 'not_started',
  business_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  gst_number TEXT,
  pan_number TEXT,
  aadhaar_last4 TEXT,
  avatar_url TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER ROLES  (never on profiles)
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','auditor','support'));
$$;

CREATE OR REPLACE FUNCTION public.get_primary_role(_user_id UUID)
RETURNS public.app_role LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'super_admin' THEN 1
    WHEN 'master_distributor' THEN 2
    WHEN 'distributor' THEN 3
    WHEN 'retailer' THEN 4
    WHEN 'agent' THEN 5
    WHEN 'support' THEN 6
    WHEN 'auditor' THEN 7 END
  LIMIT 1;
$$;

-- Descendants (hierarchy view) -- returns all users under _user_id
CREATE OR REPLACE FUNCTION public.is_descendant_of(_child UUID, _ancestor UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH RECURSIVE tree AS (
    SELECT id, parent_id FROM public.profiles WHERE id = _child
    UNION ALL
    SELECT p.id, p.parent_id FROM public.profiles p JOIN tree t ON t.parent_id = p.id
  )
  SELECT EXISTS (SELECT 1 FROM tree WHERE parent_id = _ancestor OR id = _ancestor);
$$;

-- Profiles RLS
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "admin read all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
CREATE POLICY "network read profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.is_descendant_of(id, auth.uid()));
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "admin update profiles" ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin insert profiles" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()) OR id = auth.uid());

-- user_roles RLS
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- =====================================================
-- WALLETS + LEDGER
-- =====================================================
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind public.wallet_kind NOT NULL,
  balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  hold NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind)
);
GRANT SELECT ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own wallets" ON public.wallets FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()) OR public.is_descendant_of(user_id, auth.uid()));

CREATE TABLE public.wallet_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  direction public.ledger_direction NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
  balance_after NUMERIC(14,2) NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wallet_ledger TO authenticated;
GRANT ALL ON public.wallet_ledger TO service_role;
ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own ledger" ON public.wallet_ledger FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()) OR public.is_descendant_of(user_id, auth.uid()));
CREATE INDEX ON public.wallet_ledger (wallet_id, created_at DESC);
CREATE INDEX ON public.wallet_ledger (user_id, created_at DESC);

-- =====================================================
-- OPERATORS (master data)
-- =====================================================
CREATE TABLE public.operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,        -- mobile, dth, fastag, electricity, gas, water, ...
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.operators TO authenticated;
GRANT SELECT ON public.operators TO anon;
GRANT ALL ON public.operators TO service_role;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "operators public" ON public.operators FOR SELECT USING (true);

-- =====================================================
-- TRANSACTIONS
-- =====================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service public.txn_service NOT NULL,
  status public.txn_status NOT NULL DEFAULT 'initiated',
  amount NUMERIC(14,2) NOT NULL,
  charge NUMERIC(14,2) NOT NULL DEFAULT 0,
  gst NUMERIC(14,2) NOT NULL DEFAULT 0,
  commission NUMERIC(14,2) NOT NULL DEFAULT 0,
  operator_id UUID REFERENCES public.operators(id),
  customer_ref TEXT,             -- mobile no, DTH id, consumer id, etc.
  operator_ref TEXT,             -- operator transaction id
  provider_ref TEXT,             -- aggregator id
  reference_no TEXT UNIQUE,      -- our external ref
  idempotency_key TEXT UNIQUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  failure_reason TEXT,
  device_ip INET,
  device_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own txns" ON public.transactions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()) OR public.is_descendant_of(user_id, auth.uid()));
CREATE POLICY "insert own txns" ON public.transactions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE INDEX ON public.transactions (user_id, created_at DESC);
CREATE INDEX ON public.transactions (service, status);

-- =====================================================
-- BENEFICIARIES  (DMT)
-- =====================================================
CREATE TABLE public.beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc TEXT NOT NULL,
  bank_name TEXT,
  mobile TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, account_number, ifsc)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.beneficiaries TO authenticated;
GRANT ALL ON public.beneficiaries TO service_role;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own benes" ON public.beneficiaries FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- =====================================================
-- KYC DOCUMENTS
-- =====================================================
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,     -- aadhaar_front, aadhaar_back, pan, selfie, gst, bank_proof
  file_url TEXT NOT NULL,
  status public.kyc_status NOT NULL DEFAULT 'pending',
  remarks TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.kyc_documents TO authenticated;
GRANT ALL ON public.kyc_documents TO service_role;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own kyc read" ON public.kyc_documents FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "own kyc write" ON public.kyc_documents FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin kyc update" ON public.kyc_documents FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- =====================================================
-- COMMISSIONS  (rate cards)
-- =====================================================
CREATE TABLE public.commission_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role public.app_role NOT NULL,
  service public.txn_service NOT NULL,
  operator_id UUID REFERENCES public.operators(id),
  slab_min NUMERIC(14,2) NOT NULL DEFAULT 0,
  slab_max NUMERIC(14,2),
  rate_percent NUMERIC(6,4) NOT NULL DEFAULT 0,
  rate_flat NUMERIC(14,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.commission_plans TO authenticated;
GRANT ALL ON public.commission_plans TO service_role;
ALTER TABLE public.commission_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "commissions read" ON public.commission_plans FOR SELECT TO authenticated USING (true);

-- =====================================================
-- SETTLEMENTS
-- =====================================================
CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL,
  bank_account TEXT,
  ifsc TEXT,
  status public.txn_status NOT NULL DEFAULT 'pending',
  utr TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  remarks TEXT
);
GRANT SELECT, INSERT ON public.settlements TO authenticated;
GRANT ALL ON public.settlements TO service_role;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own settlements" ON public.settlements FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "own settlement create" ON public.settlements FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- TICKETS
-- =====================================================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority public.ticket_priority NOT NULL DEFAULT 'medium',
  status public.ticket_status NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES public.profiles(id),
  transaction_id UUID REFERENCES public.transactions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own tickets" ON public.tickets FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- =====================================================
-- AUDIT + ACTIVITY LOGS
-- =====================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin audit read" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
CREATE POLICY "self audit insert" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- =====================================================
-- NOTIFICATIONS
-- =====================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  kind TEXT NOT NULL DEFAULT 'info',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifs" ON public.notifications FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- =====================================================
-- API CONFIGS  (aggregator credentials, admin only)
-- =====================================================
CREATE TABLE public.api_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL UNIQUE,     -- eko, paynearby, setu, cashfree, msg91, ...
  is_active BOOLEAN NOT NULL DEFAULT false,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.api_configs TO authenticated;
GRANT ALL ON public.api_configs TO service_role;
ALTER TABLE public.api_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin api configs" ON public.api_configs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- =====================================================
-- TRIGGERS  (updated_at + auto profile/wallets/role on signup)
-- =====================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_wallets_updated BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_txn_updated BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-create profile + 3 wallets + default retailer role on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE mob TEXT;
BEGIN
  mob := COALESCE(NEW.phone, NEW.raw_user_meta_data->>'mobile', '');
  INSERT INTO public.profiles (id, mobile, full_name, email)
  VALUES (NEW.id, mob, COALESCE(NEW.raw_user_meta_data->>'full_name',''), NEW.email)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.wallets (user_id, kind) VALUES (NEW.id,'main'),(NEW.id,'commission'),(NEW.id,'hold')
  ON CONFLICT DO NOTHING;

  -- Default role: retailer.  Super admin must be granted manually.
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'retailer')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SEED  operators
-- =====================================================
INSERT INTO public.operators (code, name, category) VALUES
  ('AIRTEL','Airtel','mobile'),('JIO','Jio','mobile'),('VI','Vi','mobile'),('BSNL','BSNL','mobile'),
  ('TATASKY','Tata Play','dth'),('DISHTV','Dish TV','dth'),('AIRTELDTH','Airtel Digital TV','dth'),('D2H','Videocon d2h','dth'),
  ('FASTAG_HDFC','HDFC FASTag','fastag'),('FASTAG_ICICI','ICICI FASTag','fastag'),
  ('BESCOM','BESCOM','electricity'),('MSEB','MSEB','electricity'),('BSES','BSES','electricity'),
  ('IGL','Indraprastha Gas','gas'),('MGL','Mahanagar Gas','gas'),
  ('DELHI_JAL','Delhi Jal Board','water'),
  ('JIOFIBER','Jio Fiber','broadband'),('AIRTELXTREME','Airtel Xtreme','broadband')
ON CONFLICT DO NOTHING;
