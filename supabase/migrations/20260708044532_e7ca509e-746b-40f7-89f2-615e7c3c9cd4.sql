
-- OTP table (server-side, no direct client access)
CREATE TABLE public.mobile_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  last_sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.mobile_otps (mobile, created_at DESC);
GRANT ALL ON public.mobile_otps TO service_role;
ALTER TABLE public.mobile_otps ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (server functions) touches it.

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_ledger;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Atomic wallet debit/credit RPC (used by all money moves)
CREATE OR REPLACE FUNCTION public.wallet_move(
  _user_id UUID,
  _kind public.wallet_kind,
  _direction public.ledger_direction,
  _amount NUMERIC,
  _reference_type TEXT,
  _reference_id UUID,
  _description TEXT
) RETURNS public.wallet_ledger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  w public.wallets;
  new_balance NUMERIC(14,2);
  led public.wallet_ledger;
BEGIN
  IF _amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  SELECT * INTO w FROM public.wallets WHERE user_id = _user_id AND kind = _kind FOR UPDATE;
  IF w IS NULL THEN RAISE EXCEPTION 'Wallet not found'; END IF;
  IF _direction = 'debit' THEN
    IF w.balance < _amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
    new_balance := w.balance - _amount;
  ELSE
    new_balance := w.balance + _amount;
  END IF;
  UPDATE public.wallets SET balance = new_balance WHERE id = w.id;
  INSERT INTO public.wallet_ledger (wallet_id, user_id, direction, amount, balance_after, reference_type, reference_id, description)
  VALUES (w.id, _user_id, _direction, _amount, new_balance, _reference_type, _reference_id, _description)
  RETURNING * INTO led;
  RETURN led;
END; $$;

REVOKE EXECUTE ON FUNCTION public.wallet_move(UUID, public.wallet_kind, public.ledger_direction, NUMERIC, TEXT, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.wallet_move(UUID, public.wallet_kind, public.ledger_direction, NUMERIC, TEXT, UUID, TEXT) TO service_role;
