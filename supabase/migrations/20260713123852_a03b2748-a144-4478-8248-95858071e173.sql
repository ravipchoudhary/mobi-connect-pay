
-- Grant EXECUTE on RLS-helper functions to authenticated (needed for policies to evaluate).
-- These live in `private` schema so they are NOT exposed via the PostgREST API.
GRANT EXECUTE ON FUNCTION private.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.get_primary_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_descendant_of(uuid, uuid) TO authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;

-- Public wrapper for wallet_move: service_role only, callable via PostgREST rpc.
CREATE OR REPLACE FUNCTION public.wallet_move(
  _user_id uuid, _kind wallet_kind, _direction ledger_direction, _amount numeric,
  _reference_type text, _reference_id uuid, _description text
) RETURNS public.wallet_ledger LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT private.wallet_move(_user_id, _kind, _direction, _amount, _reference_type, _reference_id, _description);
$$;

REVOKE ALL ON FUNCTION public.wallet_move(uuid, wallet_kind, ledger_direction, numeric, text, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_move(uuid, wallet_kind, ledger_direction, numeric, text, uuid, text) TO service_role;

-- Public admin-check wrapper for server code (service_role only).
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT private.is_admin(_user_id); $$;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;
