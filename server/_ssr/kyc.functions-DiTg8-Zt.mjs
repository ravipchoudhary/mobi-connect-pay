import { g as updateLocalUser, m as listLocalUsers, s as findLocalUserById } from "./local-store-Z9jySGIS.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, n as literalType, t as enumType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { n as resolveCallerRoles } from "./role-utils-BOS5-Wkq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kyc.functions-DiTg8-Zt.js
var DOC_TYPES = [
	"aadhaar_front",
	"aadhaar_back",
	"pan",
	"selfie",
	"gst",
	"bank_proof"
];
var kycDocs = [];
var listMyKyc_createServerFn_handler = createServerRpc({
	id: "881463f41fb34281d471e949f238ca51cc40a00a66363281bc354f28e0b56671",
	name: "listMyKyc",
	filename: "src/lib/kyc.functions.ts"
}, (opts) => listMyKyc.__executeServer(opts));
var listMyKyc = createServerFn({ method: "GET" }).handler(listMyKyc_createServerFn_handler, async (args) => {
	const { context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	return kycDocs.filter((d) => d.user_id === context.userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});
var recordKycDoc_createServerFn_handler = createServerRpc({
	id: "5819067632a3801522878cfa0e5d994133d44499ccdc0185fbe87e723a4bdc10",
	name: "recordKycDoc",
	filename: "src/lib/kyc.functions.ts"
}, (opts) => recordKycDoc.__executeServer(opts));
var recordKycDoc = createServerFn({ method: "POST" }).validator((raw) => objectType({
	doc_type: enumType(DOC_TYPES),
	file_url: stringType().min(1).max(500)
}).parse(raw)).handler(recordKycDoc_createServerFn_handler, async (args) => {
	const { data, context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	kycDocs.push({
		id: crypto.randomUUID(),
		user_id: context.userId,
		doc_type: data.doc_type,
		file_url: data.file_url,
		status: "pending",
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	return { ok: true };
});
var submitKycForReview_createServerFn_handler = createServerRpc({
	id: "3d4f02749ba77e4b88d1b2126e3126e6eeeacb743164f797f61b5deaf7625028",
	name: "submitKycForReview",
	filename: "src/lib/kyc.functions.ts"
}, (opts) => submitKycForReview.__executeServer(opts));
var submitKycForReview = createServerFn({ method: "POST" }).validator((raw) => objectType({
	full_name: stringType().trim().min(2).max(80),
	pan_number: stringType().trim().length(10).optional().or(literalType("")),
	aadhaar_last4: stringType().regex(/^\d{4}$/).optional().or(literalType("")),
	business_name: stringType().trim().max(120).optional(),
	address: stringType().trim().max(300).optional(),
	city: stringType().trim().max(80).optional(),
	state: stringType().trim().max(80).optional(),
	pincode: stringType().regex(/^\d{6}$/).optional().or(literalType("")),
	gst_number: stringType().trim().max(20).optional()
}).parse(raw)).handler(submitKycForReview_createServerFn_handler, async (args) => {
	const { data, context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	const user = findLocalUserById(context.userId);
	if (!user) throw new Error("User not found");
	updateLocalUser(context.userId, {
		full_name: data.full_name,
		pan_number: data.pan_number && data.pan_number.length > 0 ? data.pan_number : null,
		aadhaar_last4: data.aadhaar_last4 && data.aadhaar_last4.length > 0 ? data.aadhaar_last4 : null,
		business_name: data.business_name ?? user.business_name,
		address: data.address && data.address.length > 0 ? data.address : null,
		city: data.city ?? user.city,
		state: data.state ?? user.state,
		pincode: data.pincode && data.pincode.length > 0 ? data.pincode : null,
		gst_number: data.gst_number && data.gst_number.length > 0 ? data.gst_number : null,
		kyc_status: "pending"
	});
	return { ok: true };
});
var reviewKyc_createServerFn_handler = createServerRpc({
	id: "dbdb65b15d7ab268cbb800ec2d03c93275d348451cd092f427b42c2b103dd067",
	name: "reviewKyc",
	filename: "src/lib/kyc.functions.ts"
}, (opts) => reviewKyc.__executeServer(opts));
var reviewKyc = createServerFn({ method: "POST" }).validator((raw) => objectType({
	user_id: stringType().uuid(),
	decision: enumType(["approved", "rejected"]),
	remarks: stringType().max(300).optional()
}).parse(raw)).handler(reviewKyc_createServerFn_handler, async (args) => {
	const { data, context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	if (!(await resolveCallerRoles({
		userId: context.userId,
		claims: context.claims
	})).some((r) => [
		"super_admin",
		"auditor",
		"support"
	].includes(r))) throw new Error("Forbidden");
	const updated = updateLocalUser(data.user_id, { kyc_status: data.decision });
	kycDocs.filter((d) => d.user_id === data.user_id).forEach((d) => {
		d.status = data.decision;
		d.reviewed_by = context.userId;
		d.reviewed_at = (/* @__PURE__ */ new Date()).toISOString();
		d.remarks = data.remarks;
	});
	return {
		ok: true,
		updatedUser: updated
	};
});
var listPendingKyc_createServerFn_handler = createServerRpc({
	id: "491a621ace5d08940f2d8a6d2e5d76bf890f6c138ac2259097000c585449c5d2",
	name: "listPendingKyc",
	filename: "src/lib/kyc.functions.ts"
}, (opts) => listPendingKyc.__executeServer(opts));
var listPendingKyc = createServerFn({ method: "GET" }).handler(listPendingKyc_createServerFn_handler, async (args) => {
	const { context } = args;
	if (!context?.userId) throw new Error("Unauthorized");
	if (!(await resolveCallerRoles({
		userId: context.userId,
		claims: context.claims
	})).some((r) => [
		"super_admin",
		"auditor",
		"support"
	].includes(r))) return [];
	return listLocalUsers().filter((u) => u.kyc_status === "pending").map((u) => ({
		id: u.id,
		full_name: u.full_name,
		mobile: u.mobile,
		kyc_status: u.kyc_status,
		city: u.city,
		state: u.state,
		created_at: u.created_at
	})).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});
//#endregion
export { listMyKyc_createServerFn_handler, listPendingKyc_createServerFn_handler, recordKycDoc_createServerFn_handler, reviewKyc_createServerFn_handler, submitKycForReview_createServerFn_handler };
