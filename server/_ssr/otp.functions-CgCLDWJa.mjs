import { l as listLocalUsers, u as setLocalSession } from "./local-store-CFEqhxru.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/otp.functions-CgCLDWJa.js
var MOBILE_RE = /^[6-9]\d{9}$/;
var OTP_TTL_MS = 5 * 6e4;
var RESEND_MS = 3e4;
var MAX_ATTEMPTS = 5;
var exposeDevOtp = process.env.ALLOW_DEV_OTP !== "false";
var otpStore = /* @__PURE__ */ new Map();
function makeEmail(mobile) {
	return `${mobile}@paysol.local`;
}
function generateOtpCode() {
	if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
		const values = /* @__PURE__ */ new Uint32Array(1);
		crypto.getRandomValues(values);
		return String(1e5 + values[0] % 9e5).padStart(6, "0");
	}
	throw new Error("Unable to generate a secure OTP. Please try again later.");
}
var sendMobileOtp_createServerFn_handler = createServerRpc({
	id: "dd0c76af6de7f43745617255528a67fe19bd2a9ef12db2cb71b95cde00b53c1a",
	name: "sendMobileOtp",
	filename: "src/lib/otp.functions.ts"
}, (opts) => sendMobileOtp.__executeServer(opts));
var sendMobileOtp = createServerFn({ method: "POST" }).validator((raw) => objectType({ mobile: stringType().regex(MOBILE_RE) }).parse(raw)).handler(sendMobileOtp_createServerFn_handler, async ({ data }) => {
	const user = listLocalUsers().find((u) => u.mobile === data.mobile);
	if (!user) throw new Error("This mobile is not registered. Ask your distributor/admin to create your account.");
	if (user.status !== "active") throw new Error("Account is inactive. Contact your administrator.");
	const recent = otpStore.get(data.mobile);
	if (recent && recent.expires_at > Date.now()) {
		const elapsed = Date.now() - (recent.expires_at - OTP_TTL_MS);
		if (elapsed < RESEND_MS) {
			const wait = Math.ceil((RESEND_MS - elapsed) / 1e3);
			throw new Error(`Please wait ${wait}s before requesting a new OTP.`);
		}
	}
	const code = generateOtpCode();
	otpStore.set(data.mobile, {
		mobile: data.mobile,
		code,
		expires_at: Date.now() + OTP_TTL_MS,
		attempts: 0
	});
	const now = Date.now();
	for (const [mobile, record] of otpStore) if (record.expires_at < now) otpStore.delete(mobile);
	return {
		ok: true,
		devOtp: exposeDevOtp ? code : void 0,
		smsSent: false
	};
});
var verifyMobileOtp_createServerFn_handler = createServerRpc({
	id: "b6d049347e2289db2fc08d612602f8525efeea75017b812a51117ec28b1bc944",
	name: "verifyMobileOtp",
	filename: "src/lib/otp.functions.ts"
}, (opts) => verifyMobileOtp.__executeServer(opts));
var verifyMobileOtp = createServerFn({ method: "POST" }).validator((raw) => objectType({
	mobile: stringType().regex(MOBILE_RE),
	code: stringType().regex(/^\d{6}$/),
	fullName: stringType().trim().max(80).optional()
}).parse(raw)).handler(verifyMobileOtp_createServerFn_handler, async ({ data }) => {
	const user = listLocalUsers().find((u) => u.mobile === data.mobile);
	if (!user) throw new Error("This mobile is not registered. Ask your distributor/admin to create your account.");
	const otpRec = otpStore.get(data.mobile);
	if (!otpRec || otpRec.expires_at <= Date.now()) throw new Error("Please request a new OTP.");
	if (otpRec.attempts >= MAX_ATTEMPTS) throw new Error("Too many attempts. Please request a new OTP.");
	if (otpRec.code !== data.code) {
		otpRec.attempts++;
		throw new Error(`Invalid OTP. ${MAX_ATTEMPTS - otpRec.attempts} attempts remaining.`);
	}
	otpStore.delete(data.mobile);
	setLocalSession(user.id, user.roles[0]);
	const email = user.email ?? makeEmail(data.mobile);
	return {
		ok: true,
		userId: user.id,
		email,
		role: user.roles[0],
		user: {
			...user,
			password: void 0
		}
	};
});
//#endregion
export { sendMobileOtp_createServerFn_handler, verifyMobileOtp_createServerFn_handler };
