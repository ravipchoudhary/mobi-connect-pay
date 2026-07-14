# Enterprise B2B Fintech Upgrade Plan

Your request is enormous — a full Spice Money / PayNearby clone touches ~30+ modules, 6 dashboards, real payment/AEPS/BBPS/travel APIs, KYC, settlement, and RBAC. That is many weeks of work and thousands of lines of code. I can't ship it all in one turn without producing broken, half-wired screens — exactly what you asked me to avoid ("no placeholder pages").

I'll ship it in **focused, fully-working phases**. Each phase is production-quality, connected to real data via Lovable Cloud, and reviewable on its own. Please confirm the phase order (or reshuffle) and I'll start immediately.

---

## Phase 1 — Auth hardening & hierarchy (foundation)
- Remove public sign-up route entirely (already partly done — enforce `disable_signup` in Cloud auth).
- Finalize the two login tabs (Mobile+OTP, Username+Password) already scaffolded — polish UI, add "Remember me", forgot/reset password flow (email via Resend or Cloud email templates), device+login history tables + list UI.
- User-hierarchy enforcement: `parent_id` on `profiles`, RLS + `has_role` policies so each tier can only create the tier directly below.
- Admin "Create User" screen (Super Admin → MD → Distributor → Retailer → Agent) with role-gated forms.

## Phase 2 — Dashboards (Retailer, Distributor, Admin)
- Redesign `_app.dashboard.tsx` with role-aware panels: wallet, commission, settlement, today/month business, revenue chart (recharts), notifications, offers banner, quick actions.
- Spice-Money-style **service grid** for retailers — colorful rounded icons, hover animation, pinned/favorites (stored per-user in a `user_service_prefs` table).
- Distributor: retailer list, KYC approvals queue, wallet requests, growth chart.
- Admin: live txn stream, API status, revenue, user counts.

## Phase 3 — Wallet, Commission, Settlement, KYC (real flows)
Upgrade the existing modules end-to-end: wallet ledger UI, commission plans CRUD, settlement requests + approval workflow, KYC document upload (existing `kyc-docs` bucket) with reviewer queue.

## Phase 4 — Service modules (stubs → working forms)
Real forms + validation + transaction records for: AEPS, mATM, BBPS, DMT, Recharge, FASTag, Electricity/Gas/Water/Broadband, Aadhaar Pay, UPI QR, PAN, CMS.
Each writes to `transactions` and debits wallet through the existing `wallet_move` RPC. **API integrations are stubbed behind a provider adapter interface** — no real BBPS/AEPS API keys exist yet, so I mock the provider responses deterministically and expose a single place to wire real APIs later. I'll be explicit about which are live vs mocked; no "Coming Soon" screens.

## Phase 5 — Travel booking
Bus (RedBus/AbhiBus), Train, Flight, Hotel search + booking UI, booking history, cancellation, PNR, seat selection. Same adapter pattern — mocked provider until you connect real APIs.

## Phase 6 — Admin infra
API config screen, role/permission management UI, audit + activity logs viewers, support ticket workflow, notification center, dark/light theme toggle refinement, skeleton loaders across the app.

---

## Technical notes
- Stack stays as-is: TanStack Start + Lovable Cloud + shadcn + Tailwind. No routing changes; every existing route is upgraded in place.
- Provider adapters live in `src/lib/providers/*.ts` (bbps, aeps, dmt, travel) — each exports a typed interface so real APIs plug in via `standard_connectors` later.
- All new tables ship with GRANT + RLS in the same migration.
- Password login already wired; SMS OTP falls back to dev OTP until Twilio/MSG91 secrets are added.

---

## What I need from you
1. **Confirm the phase order above**, or tell me to prioritize differently (e.g. "start with retailer service grid").
2. **Password reset channel**: email via Lovable-managed auth emails (I can scaffold), or SMS OTP-based reset?
3. **Real provider APIs**: do you have accounts/keys for BBPS/AEPS/DMT/RedBus, or should everything use the mock adapter for now (fully functional UI, mock backend)?

Reply with the phase(s) to start and I'll begin implementation this turn.
