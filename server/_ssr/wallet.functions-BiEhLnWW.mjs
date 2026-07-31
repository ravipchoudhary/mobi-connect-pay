import { l as listLocalUsers, n as applyLocalWalletMove, s as getLocalWalletSummary } from "./local-store-CFEqhxru.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, r as numberType, t as enumType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { n as resolveCallerRoles } from "./role-utils-tz9Nr5Y9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet.functions-BiEhLnWW.js
/** Load all wallets + last 100 ledger entries for the current user. */
var getMyWalletOverview_createServerFn_handler = createServerRpc({
	id: "2126a6ecc8ee62cf0b1932a84e68ca4d3d03e630fadd5fe7c34fcc37c77df0a0",
	name: "getMyWalletOverview",
	filename: "src/lib/wallet.functions.ts"
}, (opts) => getMyWalletOverview.__executeServer(opts));
var getMyWalletOverview = createServerFn({ method: "GET" }).handler(getMyWalletOverview_createServerFn_handler, async (args) => {
	const { context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	return getLocalWalletSummary(context.userId);
});
var transferBetweenOwnWallets_createServerFn_handler = createServerRpc({
	id: "a3286e95bc7d6841ec9b6892e6f62f2e5a5dffbdeb1cb35f24064c1205333fde",
	name: "transferBetweenOwnWallets",
	filename: "src/lib/wallet.functions.ts"
}, (opts) => transferBetweenOwnWallets.__executeServer(opts));
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
}).refine((d) => d.from !== d.to, { message: "Source and destination must differ" }).parse(raw)).handler(transferBetweenOwnWallets_createServerFn_handler, async (args) => {
	const { data, context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	const ref = crypto.randomUUID();
	applyLocalWalletMove(context.userId, data.from, "debit", data.amount, "wallet_transfer", ref, data.note ?? `Transfer ${data.from} → ${data.to}`);
	applyLocalWalletMove(context.userId, data.to, "credit", data.amount, "wallet_transfer", ref, data.note ?? `Transfer ${data.from} → ${data.to}`);
	return { ok: true };
});
var requestWalletTopup_createServerFn_handler = createServerRpc({
	id: "d9678013493c18c5011bf48d158e38ea420b74f84ac0f2d93b06f355388a1a88",
	name: "requestWalletTopup",
	filename: "src/lib/wallet.functions.ts"
}, (opts) => requestWalletTopup.__executeServer(opts));
var requestWalletTopup = createServerFn({ method: "POST" }).validator((raw) => objectType({
	amount: numberType().positive().max(5e5),
	targetUserId: stringType().uuid().optional()
}).parse(raw)).handler(requestWalletTopup_createServerFn_handler, async (args) => {
	const { data, context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	const ctx = context;
	if (!(await resolveCallerRoles({
		userId: ctx.userId,
		claims: ctx.claims
	})).some((r) => ["super_admin", "support"].includes(r))) throw new Error("Wallet top-up requires a verified payment. Contact your administrator or complete the payment flow.");
	applyLocalWalletMove(data.targetUserId ?? ctx.userId, "main", "credit", data.amount, "admin_topup", crypto.randomUUID(), `Admin credit by ${ctx.userId}`);
	return { ok: true };
});
var listVerifiedRetailersForCredit_createServerFn_handler = createServerRpc({
	id: "d5bfda6d99b56061715f5290d902e3f08901dfd394083ce2940a9012ceaf10a0",
	name: "listVerifiedRetailersForCredit",
	filename: "src/lib/wallet.functions.ts"
}, (opts) => listVerifiedRetailersForCredit.__executeServer(opts));
var listVerifiedRetailersForCredit = createServerFn({ method: "GET" }).handler(listVerifiedRetailersForCredit_createServerFn_handler, async (args) => {
	const { context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	const ctx = context;
	if (!(await resolveCallerRoles({
		userId: ctx.userId,
		claims: ctx.claims
	})).some((r) => ["super_admin", "support"].includes(r))) throw new Error("Only admins can view verified retailers for wallet credits.");
	return { retailers: listLocalUsers().filter((user) => user.kyc_status === "approved" && user.roles.includes("retailer")).map((user) => ({
		id: user.id,
		full_name: user.full_name,
		mobile: user.mobile,
		business_name: user.business_name,
		kyc_status: user.kyc_status,
		balance: getLocalWalletSummary(user.id).wallets.find((w) => w.kind === "main")?.balance ?? 0
	})) };
});
var creditVerifiedRetailerWallet_createServerFn_handler = createServerRpc({
	id: "db8d7909eed18063cfd70f56466d2f58c15de60b7fc8ea5e8b4062102bfd504b",
	name: "creditVerifiedRetailerWallet",
	filename: "src/lib/wallet.functions.ts"
}, (opts) => creditVerifiedRetailerWallet.__executeServer(opts));
var creditVerifiedRetailerWallet = createServerFn({ method: "POST" }).validator((raw) => objectType({
	targetUserId: stringType().uuid(),
	amount: numberType().positive().max(5e5),
	note: stringType().max(200).optional()
}).parse(raw)).handler(creditVerifiedRetailerWallet_createServerFn_handler, async (args) => {
	const { data, context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	const ctx = context;
	if (!(await resolveCallerRoles({
		userId: ctx.userId,
		claims: ctx.claims
	})).some((r) => ["super_admin", "support"].includes(r))) throw new Error("Only admins can credit verified retailers.");
	const targetProfile = listLocalUsers().find((user) => user.id === data.targetUserId);
	if (!targetProfile || targetProfile.kyc_status !== "approved") throw new Error("Only KYC-approved retailers can receive wallet credits.");
	if (!targetProfile.roles.includes("retailer")) throw new Error("Wallet credit is allowed only for retailer accounts.");
	applyLocalWalletMove(data.targetUserId, "main", "credit", data.amount, "admin_retailer_credit", crypto.randomUUID(), data.note ?? `Retailer wallet credit by ${ctx.userId}`);
	return { ok: true };
});
//#endregion
export { creditVerifiedRetailerWallet_createServerFn_handler, getMyWalletOverview_createServerFn_handler, listVerifiedRetailersForCredit_createServerFn_handler, requestWalletTopup_createServerFn_handler, transferBetweenOwnWallets_createServerFn_handler };
