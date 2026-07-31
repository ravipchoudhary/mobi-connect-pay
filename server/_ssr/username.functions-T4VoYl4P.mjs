import { l as listLocalUsers, m as verifyLocalUserPassword, u as setLocalSession } from "./local-store-CFEqhxru.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/username.functions-T4VoYl4P.js
var FALLBACK_EMAILS = {
	ravipchy: "ravipchy@paysol.local",
	ravi: "ravipchy@paysol.local",
	admin: "ravipchy@paysol.local"
};
var DEMO_PASSWORD = "password";
var resolveUsernameEmail_createServerFn_handler = createServerRpc({
	id: "d84ef2ae7d181a250316c94c4d06710b2e1ff702170e90fb7ea7617d835d136e",
	name: "resolveUsernameEmail",
	filename: "src/lib/username.functions.ts"
}, (opts) => resolveUsernameEmail.__executeServer(opts));
var resolveUsernameEmail = createServerFn({ method: "POST" }).validator((raw) => objectType({ username: stringType().trim().min(2).max(40) }).parse(raw)).handler(resolveUsernameEmail_createServerFn_handler, async ({ data }) => {
	const normalized = data.username.trim().toLowerCase();
	if (normalized.includes("@")) return { email: normalized };
	const user = listLocalUsers().find((u) => u.username?.toLowerCase() === normalized);
	if (user?.email) return { email: user.email };
	const fallbackEmail = FALLBACK_EMAILS[normalized];
	if (fallbackEmail) return { email: fallbackEmail };
	throw new Error("Invalid username or password.");
});
var verifyUsernamePassword_createServerFn_handler = createServerRpc({
	id: "e69806ee8e0970a82b2060d95ade0f3784dc736bb8749e124f493ac23a86c7e4",
	name: "verifyUsernamePassword",
	filename: "src/lib/username.functions.ts"
}, (opts) => verifyUsernamePassword.__executeServer(opts));
var verifyUsernamePassword = createServerFn({ method: "POST" }).validator((raw) => objectType({
	username: stringType().trim().min(2).max(40),
	password: stringType().min(1)
}).parse(raw)).handler(verifyUsernamePassword_createServerFn_handler, async ({ data }) => {
	const normalized = data.username.trim().toLowerCase();
	let user = listLocalUsers().find((u) => u.username?.toLowerCase() === normalized);
	if (!user) user = listLocalUsers().find((u) => u.email?.toLowerCase() === normalized);
	if (!user) throw new Error("Invalid username or password.");
	if (!(user.password && user.password.length > 0 ? await verifyLocalUserPassword(user, data.password) : data.password === DEMO_PASSWORD)) throw new Error("Invalid username or password.");
	setLocalSession(user.id, user.roles[0]);
	return {
		ok: true,
		userId: user.id,
		email: user.email,
		name: user.full_name,
		role: user.roles[0],
		user: {
			...user,
			password: void 0
		}
	};
});
//#endregion
export { resolveUsernameEmail_createServerFn_handler, verifyUsernamePassword_createServerFn_handler };
