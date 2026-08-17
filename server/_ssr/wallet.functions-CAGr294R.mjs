import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BO2LYp9r.mjs";
import { a as stringType, i as objectType, r as numberType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet.functions-CAGr294R.js
/** Load all wallets + last 100 ledger entries for the current user. */
var getMyWalletOverview = createServerFn({ method: "GET" }).handler(createSsrRpc("2126a6ecc8ee62cf0b1932a84e68ca4d3d03e630fadd5fe7c34fcc37c77df0a0"));
/** Transfer money between two wallets belonging to the same user. */
var transferBetweenOwnWallets = createServerFn({ method: "POST" }).validator((raw) => objectType({
	from: enumType([
		"main",
		"commission",
		"hold"
	]),
	to: enumType([
		"main",
		"commission",
		"hold"
	]),
	amount: numberType().positive().max(1e6),
	note: stringType().max(200).optional()
}).refine((d) => d.from !== d.to, { message: "Source and destination must differ" }).parse(raw)).handler(createSsrRpc("a3286e95bc7d6841ec9b6892e6f62f2e5a5dffbdeb1cb35f24064c1205333fde"));
/**
* Admin-initiated wallet credit. Regular users cannot self-credit — a real
* payment gateway must call an authenticated webhook that verifies a captured
* payment before invoking this function. This admin path exists only so
* super_admins/support can settle reconciliation cases manually.
*/
var requestWalletTopup = createServerFn({ method: "POST" }).validator((raw) => objectType({
	amount: numberType().positive().max(5e5),
	targetUserId: stringType().uuid().optional()
}).parse(raw)).handler(createSsrRpc("d9678013493c18c5011bf48d158e38ea420b74f84ac0f2d93b06f355388a1a88"));
var listVerifiedRetailersForCredit = createServerFn({ method: "GET" }).handler(createSsrRpc("d5bfda6d99b56061715f5290d902e3f08901dfd394083ce2940a9012ceaf10a0"));
var creditVerifiedRetailerWallet = createServerFn({ method: "POST" }).validator((raw) => objectType({
	targetUserId: stringType().uuid(),
	amount: numberType().positive().max(5e5),
	note: stringType().max(200).optional()
}).parse(raw)).handler(createSsrRpc("db8d7909eed18063cfd70f56466d2f58c15de60b7fc8ea5e8b4062102bfd504b"));
//#endregion
export { transferBetweenOwnWallets as a, requestWalletTopup as i, getMyWalletOverview as n, listVerifiedRetailersForCredit as r, creditVerifiedRetailerWallet as t };
