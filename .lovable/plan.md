## Reality check

The spec asks for a full production BBPS/AEPS/DMT/Recharge platform with real provider integrations, Node/Express + Prisma + Postgres + Redis + S3, deployed to Vercel + Railway. Lovable builds a single **TanStack Start** app on **Lovable Cloud** (Postgres + auth + storage + edge functions). A few hard constraints up front:

- **No Next.js + separate Express backend.** One TanStack Start app; server logic goes in server functions / server routes.
- **No real BBPS / AEPS / DMT / Recharge.** Those require NPCI-licensed aggregator contracts (Eko, PayNearby, Setu, Cashfree BBPS, etc.), corporate KYC, and settlement bank accounts. I can't sign those on your behalf. I'll build the full UI + workflow + ledger and wire adapters so real API keys drop in later.
- **Real SMS OTP** needs a paid provider (MSG91 / Twilio / GatewayAPI). Until keys are added, OTP is shown on-screen for testing.
- Scope is ~20 modules. I'll ship in phases, not in one turn.

## What's already built

Auth shell (Mobile+OTP, mock), sidebar + topbar layout, dashboard skeleton, 17 module route placeholders, design tokens.

## Proposed phased build

### Phase 1 — Foundation (this batch)
1. Enable **Lovable Cloud** (Postgres, auth, storage, edge functions).
2. Schema: `profiles`, `user_roles` (7-role enum + `has_role()` SECURITY DEFINER), `wallets` (main/commission/hold), `wallet_ledger`, `transactions`, `kyc_documents`, `tickets`, `audit_logs`, `notifications`, `commissions`, `settlements`, `api_configs`, `operators`, `beneficiaries`.
3. RLS everywhere + GRANTs; hierarchy scoping via `parent_id` closure.
4. Real Mobile+OTP via Supabase phone auth (needs SMS provider secret) — falls back to dev OTP until keys added.
5. Admin-only user creation server functions enforcing hierarchy (Super Admin → MD → Distributor → Retailer → Agent).

### Phase 2 — Money core
Wallet (3 sub-wallets, ledger, transfer, statement, PDF/Excel export), KYC (upload to Cloud storage, admin approve/reject), Commission engine, Settlement.

### Phase 3 — Services (UI + provider adapter pattern, mock provider until real keys)
Recharge (Mobile/DTH/FASTag + operator detect), BBPS (all 14 categories: fetch/validate/pay/requery/complaint), DMT (beneficiary + IMPS/NEFT + OTP confirm), AEPS (UI + biometric device stub — real AEPS needs certified RD service SDK).

### Phase 4 — Ops
Reports (daily/weekly/monthly, PDF/Excel/CSV, scheduled email), Receipts (branded PDF + QR), Tickets (SLA, escalation), Audit & Activity logs, Notifications, RBAC matrix UI, Settings (SMS/Email/Payment gateway config, GST, API keys).

### Phase 5 — Hardening
Rate limiting on server routes, duplicate-txn idempotency keys, device/IP tracking, security scan, dark/light polish, table primitives (search/sort/filter/pagination/bulk export) applied everywhere.

## What I need from you before Phase 1

1. **Confirm Lovable Cloud** (Postgres + auth + storage + edge functions replaces your Next+Express+Prisma+Redis+S3 stack). Yes/No.
2. **SMS provider for real OTP** — MSG91, Twilio, GatewayAPI, or "keep dev OTP for now."
3. **BBPS/Recharge/AEPS/DMT aggregator** — which one do you have (or plan to get) a contract with? I'll build the adapter to its API shape. If none yet, I'll ship a mock provider with the exact same interface so switching is a config change.
4. **Priority order** if you want a different phase order (e.g. "Wallet + Recharge first, BBPS later").

Once you answer, I start Phase 1 immediately.