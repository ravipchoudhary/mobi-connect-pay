
-- 1. Private schema for security-definer helpers (not exposed to PostgREST)
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO postgres, service_role;
REVOKE ALL ON SCHEMA private FROM anon, authenticated, PUBLIC;

-- 2. Drop existing policies that reference the helpers (recreate below with qualified names)
DROP POLICY IF EXISTS "admin api configs" ON public.api_configs;
DROP POLICY IF EXISTS "admin audit read" ON public.audit_logs;
DROP POLICY IF EXISTS "self audit insert" ON public.audit_logs;
DROP POLICY IF EXISTS "commissions read" ON public.commission_plans;
DROP POLICY IF EXISTS "own kyc read" ON public.kyc_documents;
DROP POLICY IF EXISTS "admin kyc update" ON public.kyc_documents;
DROP POLICY IF EXISTS "admin read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "network read profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin update profiles" ON public.profiles;
DROP POLICY IF EXISTS "own settlements" ON public.settlements;
DROP POLICY IF EXISTS "own tickets" ON public.tickets;
DROP POLICY IF EXISTS "own txns" ON public.transactions;
DROP POLICY IF EXISTS "own roles read" ON public.user_roles;
DROP POLICY IF EXISTS "own ledger" ON public.wallet_ledger;
DROP POLICY IF EXISTS "own wallets" ON public.wallets;

-- 3. Move / recreate helpers in private schema
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_primary_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_descendant_of(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.wallet_move(uuid, wallet_kind, ledger_direction, numeric, text, uuid, text) CASCADE;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role); $$;

CREATE OR REPLACE FUNCTION private.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','auditor','support')); $$;

CREATE OR REPLACE FUNCTION private.get_primary_role(_user_id uuid)
RETURNS app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'super_admin' THEN 1 WHEN 'master_distributor' THEN 2 WHEN 'distributor' THEN 3
    WHEN 'retailer' THEN 4 WHEN 'agent' THEN 5 WHEN 'support' THEN 6 WHEN 'auditor' THEN 7 END
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION private.is_descendant_of(_child uuid, _ancestor uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH RECURSIVE tree AS (
    SELECT id, parent_id FROM public.profiles WHERE id = _child
    UNION ALL
    SELECT p.id, p.parent_id FROM public.profiles p JOIN tree t ON t.parent_id = p.id
  )
  SELECT EXISTS (SELECT 1 FROM tree WHERE parent_id = _ancestor OR id = _ancestor);
$$;

CREATE OR REPLACE FUNCTION private.wallet_move(
  _user_id uuid, _kind wallet_kind, _direction ledger_direction, _amount numeric,
  _reference_type text, _reference_id uuid, _description text
) RETURNS public.wallet_ledger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE w public.wallets; new_balance NUMERIC(14,2); led public.wallet_ledger;
BEGIN
  IF _amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  SELECT * INTO w FROM public.wallets WHERE user_id = _user_id AND kind = _kind FOR UPDATE;
  IF w IS NULL THEN RAISE EXCEPTION 'Wallet not found'; END IF;
  IF _direction = 'debit' THEN
    IF w.balance < _amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
    new_balance := w.balance - _amount;
  ELSE new_balance := w.balance + _amount; END IF;
  UPDATE public.wallets SET balance = new_balance WHERE id = w.id;
  INSERT INTO public.wallet_ledger (wallet_id, user_id, direction, amount, balance_after, reference_type, reference_id, description)
  VALUES (w.id, _user_id, _direction, _amount, new_balance, _reference_type, _reference_id, _description)
  RETURNING * INTO led;
  RETURN led;
END; $$;

-- 4. Fix search_path on trigger helpers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 5. Lock down EXECUTE on all SECURITY DEFINER helpers (revoke from anon/authenticated/public)
REVOKE ALL ON FUNCTION private.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.get_primary_role(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_descendant_of(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.wallet_move(uuid, wallet_kind, ledger_direction, numeric, text, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION private.has_role(uuid, app_role) TO postgres, service_role;
GRANT EXECUTE ON FUNCTION private.is_admin(uuid) TO postgres, service_role;
GRANT EXECUTE ON FUNCTION private.get_primary_role(uuid) TO postgres, service_role;
GRANT EXECUTE ON FUNCTION private.is_descendant_of(uuid, uuid) TO postgres, service_role;
GRANT EXECUTE ON FUNCTION private.wallet_move(uuid, wallet_kind, ledger_direction, numeric, text, uuid, text) TO postgres, service_role;

-- 6. Recreate policies referencing private.* (RLS evaluates as query owner via SECURITY DEFINER helpers)
-- api_configs
CREATE POLICY "admin api configs" ON public.api_configs FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'super_admin'::app_role));

-- audit_logs: read-only for admins, inserts only via service_role (no self-insert policy)
CREATE POLICY "admin audit read" ON public.audit_logs FOR SELECT TO authenticated
  USING (private.is_admin(auth.uid()));

-- commission_plans: admins only
CREATE POLICY "admin commissions read" ON public.commission_plans FOR SELECT TO authenticated
  USING (private.is_admin(auth.uid()));

-- kyc_documents
CREATE POLICY "own kyc read" ON public.kyc_documents FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.is_admin(auth.uid()));
CREATE POLICY "admin kyc update" ON public.kyc_documents FOR UPDATE TO authenticated
  USING (private.is_admin(auth.uid())) WITH CHECK (private.is_admin(auth.uid()));

-- profiles
CREATE POLICY "admin read all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (private.is_admin(auth.uid()));
CREATE POLICY "admin insert profiles" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (private.is_admin(auth.uid()) OR (id = auth.uid()));
CREATE POLICY "network read profiles" ON public.profiles FOR SELECT TO authenticated
  USING (private.is_descendant_of(id, auth.uid()));
CREATE POLICY "admin update profiles" ON public.profiles FOR UPDATE TO authenticated
  USING (private.is_admin(auth.uid())) WITH CHECK (private.is_admin(auth.uid()));

-- settlements
CREATE POLICY "own settlements" ON public.settlements FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.is_admin(auth.uid()));

-- tickets
CREATE POLICY "own tickets" ON public.tickets FOR ALL TO authenticated
  USING ((user_id = auth.uid()) OR private.is_admin(auth.uid()))
  WITH CHECK ((user_id = auth.uid()) OR private.is_admin(auth.uid()));

-- transactions
CREATE POLICY "own txns" ON public.transactions FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.is_admin(auth.uid()) OR private.is_descendant_of(user_id, auth.uid()));

-- user_roles
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.is_admin(auth.uid()));

-- wallet_ledger
CREATE POLICY "own ledger" ON public.wallet_ledger FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.is_admin(auth.uid()) OR private.is_descendant_of(user_id, auth.uid()));

-- wallets
CREATE POLICY "own wallets" ON public.wallets FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.is_admin(auth.uid()) OR private.is_descendant_of(user_id, auth.uid()));
