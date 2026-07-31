import { f as updateLocalUserStatus, i as createLocalUser, l as listLocalUsers } from "./local-store-CFEqhxru.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, n as literalType, t as enumType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { n as resolveCallerRoles, t as getEffectiveUserId } from "./role-utils-tz9Nr5Y9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-users.functions-BCuv-6Cb.js
var ROLE_ORDER = [
	"super_admin",
	"master_distributor",
	"distributor",
	"retailer",
	"agent"
];
var CREATABLE_BY = {
	super_admin: [
		"master_distributor",
		"distributor",
		"retailer",
		"agent",
		"super_admin"
	],
	master_distributor: [
		"distributor",
		"retailer",
		"agent"
	],
	distributor: ["retailer", "agent"],
	retailer: ["agent"],
	agent: []
};
var MOBILE_RE = /^[6-9]\d{9}$/;
/**
* Create a downline user. Role hierarchy enforced server-side.
* Caller must be authenticated and have a role that permits creating targetRole.
*/
var createDownlineUser_createServerFn_handler = createServerRpc({
	id: "2c76b7e84a90f7efbe64ded1d1797cb7db54e090c4b0644224410dacccd3d865",
	name: "createDownlineUser",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => createDownlineUser.__executeServer(opts));
var createDownlineUser = createServerFn({ method: "POST" }).validator((raw) => objectType({
	fullName: stringType().trim().min(2).max(80),
	mobile: stringType().regex(MOBILE_RE),
	email: stringType().trim().email().optional().or(literalType("")),
	username: stringType().trim().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/).optional().or(literalType("")),
	password: stringType().min(8).max(72).optional().or(literalType("")),
	role: enumType(ROLE_ORDER),
	businessName: stringType().trim().max(120).optional().or(literalType("")),
	city: stringType().trim().max(60).optional().or(literalType("")),
	state: stringType().trim().max(60).optional().or(literalType(""))
}).parse(raw)).handler(createDownlineUser_createServerFn_handler, async (args) => {
	const { data, context } = args;
	const userId = getEffectiveUserId(context);
	if (!userId) throw new Error("Unauthorized");
	const callerRoles = await resolveCallerRoles({
		userId,
		claims: context?.claims
	});
	const isSuper = callerRoles.includes("super_admin");
	const allowed = /* @__PURE__ */ new Set();
	if (isSuper) ROLE_ORDER.forEach((role) => allowed.add(role));
	else callerRoles.filter((role) => role in CREATABLE_BY).forEach((r) => CREATABLE_BY[r]?.forEach((t) => allowed.add(t)));
	if (!allowed.has(data.role)) throw new Error(`You are not permitted to create a ${data.role} user.`);
	if (listLocalUsers().some((u) => u.mobile === data.mobile)) throw new Error("A user with this mobile already exists.");
	const email = (data.email && data.email.length > 0 ? data.email : `${data.mobile}@paysol.local`).toLowerCase();
	const username = data.username && data.username.length > 0 ? data.username.toLowerCase() : null;
	if (username && listLocalUsers().some((u) => u.username === username)) throw new Error("This username is already taken.");
	return {
		ok: true,
		userId: (await createLocalUser({
			full_name: data.fullName,
			mobile: data.mobile,
			email,
			username,
			password: data.password && data.password.length > 0 ? data.password : null,
			status: "active",
			kyc_status: "pending",
			business_name: data.businessName || null,
			city: data.city || null,
			state: data.state || null,
			parent_id: userId,
			roles: [data.role]
		})).id
	};
});
var listDownlineUsers_createServerFn_handler = createServerRpc({
	id: "0c0b2a7731c0dfcd3878ecbc17e5fc69e087db6d5d31b43645da46b2d2bbc18b",
	name: "listDownlineUsers",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => listDownlineUsers.__executeServer(opts));
var listDownlineUsers = createServerFn({ method: "GET" }).handler(listDownlineUsers_createServerFn_handler, async (args) => {
	const { context } = args;
	const userId = getEffectiveUserId(context);
	if (!userId) throw new Error("Unauthorized");
	const roles = await resolveCallerRoles({
		userId,
		claims: context?.claims
	});
	const isSuper = roles.includes("super_admin");
	const users = (isSuper ? listLocalUsers() : listLocalUsers().filter((u) => u.parent_id === userId)).map((u) => ({
		...u,
		roles: u.roles
	}));
	const allowedToCreate = /* @__PURE__ */ new Set();
	if (isSuper) ROLE_ORDER.forEach((role) => allowedToCreate.add(role));
	else roles.filter((role) => role in CREATABLE_BY).forEach((r) => CREATABLE_BY[r]?.forEach((t) => allowedToCreate.add(t)));
	return {
		users,
		callerRoles: roles,
		creatableRoles: Array.from(allowedToCreate)
	};
});
var setUserStatus_createServerFn_handler = createServerRpc({
	id: "9f379731e1b30c5f0472e627e15aec25fb4f2788880ca65d1db8169e634f8274",
	name: "setUserStatus",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => setUserStatus.__executeServer(opts));
var setUserStatus = createServerFn({ method: "POST" }).validator((raw) => objectType({
	userId: stringType().uuid(),
	status: enumType([
		"active",
		"suspended",
		"inactive"
	])
}).parse(raw)).handler(setUserStatus_createServerFn_handler, async (args) => {
	const { data, context } = args;
	const userId = getEffectiveUserId(context);
	if (!userId) throw new Error("Unauthorized");
	if (!(await resolveCallerRoles({
		userId,
		claims: context?.claims
	})).includes("super_admin")) {
		const target = listLocalUsers().find((u) => u.id === data.userId);
		if (!target || target.parent_id !== userId) throw new Error("You can only manage users you created.");
	}
	updateLocalUserStatus(data.userId, data.status);
	return { ok: true };
});
//#endregion
export { createDownlineUser_createServerFn_handler, listDownlineUsers_createServerFn_handler, setUserStatus_createServerFn_handler };
