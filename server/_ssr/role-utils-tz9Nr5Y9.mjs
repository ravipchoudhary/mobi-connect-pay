import { a as findLocalUserById, o as getLocalSession } from "./local-store-CFEqhxru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/role-utils-tz9Nr5Y9.js
var KNOWN_ROLES = [
	"super_admin",
	"master_distributor",
	"distributor",
	"retailer",
	"agent",
	"support",
	"auditor"
];
function getEffectiveUserId(context) {
	return context?.userId ?? getLocalSession()?.userId ?? null;
}
function isAppRole(value) {
	return typeof value === "string" && KNOWN_ROLES.includes(value);
}
function normalizeRole(value) {
	if (!value) return [];
	if (Array.isArray(value)) return value.flatMap((entry) => normalizeRole(entry));
	if (typeof value === "string") {
		const trimmed = value.trim();
		return isAppRole(trimmed) ? [trimmed] : [];
	}
	if (typeof value === "object") {
		const record = value;
		return [
			record.role,
			record.roles,
			record.app_metadata,
			record.user_metadata
		].flatMap((entry) => normalizeRole(entry));
	}
	return [];
}
async function resolveCallerRoles(context) {
	const userId = getEffectiveUserId(context);
	const seen = /* @__PURE__ */ new Set();
	const add = (role) => {
		normalizeRole(role).forEach((value) => seen.add(value));
	};
	if (context.claims) {
		add(context.claims.role);
		add(context.claims.roles);
		add(context.claims.app_metadata);
		add(context.claims.user_metadata);
	}
	if (seen.size > 0) return Array.from(seen);
	if (userId) {
		const localUser = findLocalUserById(userId);
		if (localUser?.roles?.length) return localUser.roles;
	}
	return [];
}
//#endregion
export { resolveCallerRoles as n, getEffectiveUserId as t };
