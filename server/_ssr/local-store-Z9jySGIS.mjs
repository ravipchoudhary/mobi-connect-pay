//#region node_modules/.nitro/vite/services/ssr/assets/local-store-Z9jySGIS.js
function stripSensitiveUserData(user) {
	const { pan_number, aadhaar_last4, address, pincode, gst_number, ...rest } = user;
	return rest;
}
var USERS_KEY = "mobi-connect-local-users";
var WALLETS_KEY = "mobi-connect-local-wallets";
var LEDGER_KEY = "mobi-connect-local-ledger";
var SESSION_KEY = "mobi-connect-local-session";
var SESSION_CLEARED_KEY = "mobi-connect-local-session-cleared";
var OTP_SESSIONS_KEY = "mobi-connect-otp-sessions";
var LOCAL_SESSION_CHANGED_EVENT = "local-session-changed";
var store = {
	users: [],
	wallets: [],
	ledger: [],
	session: null,
	otpSessions: []
};
var hydrated = false;
var serverStorageFilePath = null;
var serverFs = null;
if (typeof window === "undefined" && typeof process !== "undefined" && process.versions?.node) {
	const fs = await import("node:fs");
	const path = await import("node:path");
	serverFs = fs;
	serverStorageFilePath = path.resolve(process.cwd(), "data", "local-store.json");
	fs.mkdirSync(path.dirname(serverStorageFilePath), { recursive: true });
}
function getSeedUser(now) {
	return {
		id: "demo-admin",
		full_name: "Super Admin",
		mobile: "9999999999",
		email: "info@paysol.in",
		password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
		username: "superadmin",
		status: "active",
		kyc_status: "approved",
		business_name: "Pay Solution",
		city: "Delhi",
		state: "Delhi",
		parent_id: null,
		created_at: now,
		last_login_at: now,
		roles: ["super_admin"]
	};
}
function loadFromStorage() {
	if (hydrated) return;
	hydrated = true;
	if (typeof window !== "undefined") try {
		const users = window.localStorage.getItem(USERS_KEY);
		if (users) store.users = JSON.parse(users);
		const wallets = window.localStorage.getItem(WALLETS_KEY);
		if (wallets) store.wallets = JSON.parse(wallets);
		const ledger = window.localStorage.getItem(LEDGER_KEY);
		if (ledger) store.ledger = JSON.parse(ledger);
		const session = window.localStorage.getItem(SESSION_KEY);
		if (session) store.session = JSON.parse(session);
		const otpSessions = window.localStorage.getItem(OTP_SESSIONS_KEY);
		if (otpSessions) store.otpSessions = JSON.parse(otpSessions);
	} catch {}
	else if (serverStorageFilePath && serverFs) try {
		if (serverFs.existsSync(serverStorageFilePath)) {
			const raw = serverFs.readFileSync(serverStorageFilePath, "utf-8");
			const parsed = JSON.parse(raw);
			if (parsed.users) store.users = parsed.users;
			if (parsed.wallets) store.wallets = parsed.wallets;
			if (parsed.ledger) store.ledger = parsed.ledger;
			store.session = parsed.session ?? null;
			if (parsed.otpSessions) store.otpSessions = parsed.otpSessions;
		}
	} catch {}
	if (store.users.length === 0) {
		const seedUser = getSeedUser((/* @__PURE__ */ new Date()).toISOString());
		store.users = [seedUser];
		store.wallets = [
			{
				user_id: seedUser.id,
				kind: "main",
				balance: 5e5
			},
			{
				user_id: seedUser.id,
				kind: "commission",
				balance: 0
			},
			{
				user_id: seedUser.id,
				kind: "hold",
				balance: 0
			}
		];
		store.ledger = [];
		persistState();
	}
	if (typeof window !== "undefined") {
		const existingWallets = window.localStorage.getItem(WALLETS_KEY);
		if (existingWallets) {
			store.wallets = JSON.parse(existingWallets).filter((wallet) => wallet && typeof wallet.balance === "number");
			persistState();
		}
	}
}
function persistState() {
	if (typeof window === "undefined") {
		if (serverStorageFilePath && serverFs) try {
			serverFs.writeFileSync(serverStorageFilePath, JSON.stringify({
				users: store.users.map(stripSensitiveUserData),
				wallets: store.wallets,
				ledger: store.ledger,
				session: store.session,
				otpSessions: store.otpSessions
			}), "utf-8");
		} catch {}
		return;
	}
	try {
		window.localStorage.setItem(USERS_KEY, JSON.stringify(store.users.map(stripSensitiveUserData)));
		window.localStorage.setItem(WALLETS_KEY, JSON.stringify(store.wallets));
		window.localStorage.setItem(LEDGER_KEY, JSON.stringify(store.ledger));
		if (store.session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(store.session));
		else window.localStorage.removeItem(SESSION_KEY);
		if (store.otpSessions.length > 0) window.localStorage.setItem(OTP_SESSIONS_KEY, JSON.stringify(store.otpSessions));
		else window.localStorage.removeItem(OTP_SESSIONS_KEY);
	} catch {}
}
async function hashLocalUserPassword(password) {
	if (typeof crypto !== "undefined" && "subtle" in crypto) {
		const bytes = new TextEncoder().encode(password);
		const digest = await crypto.subtle.digest("SHA-256", bytes);
		return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
	}
	if (typeof process !== "undefined" && process.versions?.node) {
		const { createHash } = await import("crypto");
		return createHash("sha256").update(password).digest("hex");
	}
	throw new Error("Unable to hash password in this environment.");
}
async function verifyLocalUserPassword(user, password) {
	if (!user.password) return false;
	const hashed = await hashLocalUserPassword(password);
	return user.password === hashed;
}
async function createLocalUser(input) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const user = {
		id: crypto.randomUUID(),
		created_at: now,
		last_login_at: null,
		...input
	};
	if (user.password && user.password.length > 0) user.password = await hashLocalUserPassword(user.password);
	writeStorage(USERS_KEY, [...listLocalUsers(), user]);
	return user;
}
function upsertLocalUserRecord(user) {
	const users = listLocalUsers();
	const nextUsers = users.findIndex((candidate) => candidate.id === user.id) >= 0 ? users.map((candidate) => candidate.id === user.id ? {
		...candidate,
		...user
	} : candidate) : [...users, user];
	writeStorage(USERS_KEY, nextUsers);
	return nextUsers.find((candidate) => candidate.id === user.id) ?? user;
}
function updateLocalUser(userId, patch) {
	const users = listLocalUsers().map((user) => user.id === userId ? {
		...user,
		...patch
	} : user);
	writeStorage(USERS_KEY, users);
	return users.find((user) => user.id === userId);
}
function readStorage(key, fallback) {
	loadFromStorage();
	switch (key) {
		case USERS_KEY: return store.users;
		case WALLETS_KEY: return store.wallets;
		case LEDGER_KEY: return store.ledger;
		case SESSION_KEY: return store.session;
		case OTP_SESSIONS_KEY: return store.otpSessions;
		default: return fallback;
	}
}
function writeStorage(key, value) {
	loadFromStorage();
	switch (key) {
		case USERS_KEY:
			store.users = value;
			break;
		case WALLETS_KEY:
			store.wallets = value;
			break;
		case LEDGER_KEY:
			store.ledger = value;
			break;
		case SESSION_KEY:
			store.session = value;
			break;
		case OTP_SESSIONS_KEY:
			store.otpSessions = value;
			break;
	}
	persistState();
	try {
		if (typeof window !== "undefined") {
			window.__sessionDebug = window.__sessionDebug || [];
			window.__sessionDebug.push({
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				action: "writeStorage",
				key,
				value
			});
		}
	} catch (e) {}
}
loadFromStorage();
function listLocalUsers() {
	return readStorage(USERS_KEY, []);
}
function updateLocalUserStatus(userId, status) {
	writeStorage(USERS_KEY, listLocalUsers().map((u) => u.id === userId ? {
		...u,
		status
	} : u));
}
function getLocalSession() {
	if (typeof window !== "undefined") try {
		const raw = window.localStorage.getItem(SESSION_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
	return readStorage(SESSION_KEY, null);
}
function setLocalSession(userId, role) {
	try {
		if (typeof window !== "undefined") {
			window.__sessionDebug = window.__sessionDebug || [];
			window.__sessionDebug.push({
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				action: "setLocalSession",
				userId,
				role
			});
			try {
				window.localStorage.removeItem(SESSION_CLEARED_KEY);
			} catch {}
		}
	} catch {}
	writeStorage(SESSION_KEY, {
		userId,
		role: role ?? findLocalUserById(userId)?.roles[0]
	});
	try {
		if (typeof window !== "undefined") window.dispatchEvent(new Event(LOCAL_SESSION_CHANGED_EVENT));
	} catch {}
}
function clearLocalSession() {
	try {
		if (typeof window !== "undefined") {
			window.__sessionDebug = window.__sessionDebug || [];
			window.__sessionDebug.push({
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				action: "clearLocalSession"
			});
		}
	} catch {}
	writeStorage(SESSION_KEY, null);
	try {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(SESSION_CLEARED_KEY, Date.now().toString());
			window.dispatchEvent(new Event(LOCAL_SESSION_CHANGED_EVENT));
			window.dispatchEvent(new Event(LOCAL_SESSION_CHANGED_EVENT));
		}
	} catch {}
}
function isLocalSessionRecentlyCleared() {
	if (typeof window === "undefined") return false;
	try {
		const ts = window.localStorage.getItem(SESSION_CLEARED_KEY);
		if (!ts) return false;
		const delta = Date.now() - Number(ts);
		return !Number.isNaN(delta) && delta < 5e3;
	} catch {
		return false;
	}
}
function findLocalUserById(userId) {
	return listLocalUsers().find((u) => u.id === userId);
}
function getLocalWallets(userId) {
	return readStorage(WALLETS_KEY, []).filter((w) => w.user_id === userId);
}
function getLocalWalletSummary(userId) {
	loadFromStorage();
	const wallets = getLocalWallets(userId);
	const normalizedWallets = (wallets.length > 0 ? wallets : [
		{
			user_id: userId,
			kind: "main",
			balance: 0
		},
		{
			user_id: userId,
			kind: "commission",
			balance: 0
		},
		{
			user_id: userId,
			kind: "hold",
			balance: 0
		}
	]).map((wallet) => ({
		...wallet,
		balance: Number(wallet.balance) || 0
	}));
	if (wallets.length === 0 && typeof window !== "undefined") writeStorage(WALLETS_KEY, normalizedWallets);
	return {
		wallets: normalizedWallets,
		ledger: readStorage(LEDGER_KEY, []).filter((entry) => entry.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 100)
	};
}
function applyLocalWalletMove(userId, kind, direction, amount, referenceType, referenceId, description) {
	const wallets = readStorage(WALLETS_KEY, []);
	if (!wallets.find((w) => w.user_id === userId && w.kind === kind)) {
		if (direction === "debit") throw new Error("Insufficient wallet balance.");
		wallets.push({
			user_id: userId,
			kind,
			balance: 0
		});
	}
	let nextBalance = 0;
	writeStorage(WALLETS_KEY, wallets.map((w) => {
		if (w.user_id !== userId || w.kind !== kind) return w;
		nextBalance = direction === "credit" ? w.balance + amount : w.balance - amount;
		if (direction === "debit" && nextBalance < 0) throw new Error("Insufficient wallet balance.");
		return {
			...w,
			balance: nextBalance
		};
	}));
	const entry = {
		id: crypto.randomUUID(),
		user_id: userId,
		kind,
		direction,
		amount,
		balance_after: nextBalance,
		reference_type: referenceType,
		reference_id: referenceId,
		description,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const ledger = readStorage(LEDGER_KEY, []);
	ledger.push(entry);
	writeStorage(LEDGER_KEY, ledger);
	return { ok: true };
}
function maskEmail(email) {
	const [localPart, domain] = email.split("@");
	if (!localPart || !domain) return email;
	const visible = Math.max(1, Math.ceil(localPart.length / 4));
	return `${localPart.slice(0, visible) + "*".repeat(Math.max(1, localPart.length - visible))}@${domain}`;
}
async function hashOtp(otp) {
	if (typeof crypto !== "undefined" && "subtle" in crypto) {
		const bytes = new TextEncoder().encode(otp);
		const digest = await crypto.subtle.digest("SHA-256", bytes);
		return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
	}
	if (typeof process !== "undefined" && process.versions?.node) {
		const { createHash } = await import("crypto");
		return createHash("sha256").update(otp).digest("hex");
	}
	throw new Error("Unable to hash OTP in this environment.");
}
async function createOtpSession(userId, email, otp, options) {
	const otpHash = await hashOtp(otp);
	const now = Date.now();
	const session = {
		id: crypto.randomUUID(),
		userId,
		otpHash,
		email,
		maskedEmail: maskEmail(email),
		expiresAt: now + 300 * 1e3,
		attempts: 0,
		maxAttempts: 5,
		verifiedAt: null,
		createdAt: now,
		ipAddress: options?.ipAddress,
		userAgent: options?.userAgent,
		resendCooldownUntil: now + 30 * 1e3
	};
	const filtered = readStorage(OTP_SESSIONS_KEY, []).filter((s) => s.userId !== userId || s.expiresAt > now);
	filtered.push(session);
	writeStorage(OTP_SESSIONS_KEY, filtered);
	return session;
}
function getOtpSession(sessionId) {
	const sessions = readStorage(OTP_SESSIONS_KEY, []);
	const now = Date.now();
	return sessions.find((s) => s.id === sessionId && s.expiresAt > now);
}
function getOtpSessionByUserId(userId) {
	const sessions = readStorage(OTP_SESSIONS_KEY, []);
	const now = Date.now();
	return sessions.find((s) => s.userId === userId && s.expiresAt > now && !s.verifiedAt);
}
async function verifyOtpInSession(sessionId, otp) {
	const session = getOtpSession(sessionId);
	if (!session) return false;
	if (session.verifiedAt !== null) return false;
	if (session.attempts >= session.maxAttempts) return false;
	if (session.expiresAt <= Date.now()) return false;
	const matches = await hashOtp(otp) === session.otpHash;
	if (!matches) {
		session.attempts++;
		writeStorage(OTP_SESSIONS_KEY, readStorage(OTP_SESSIONS_KEY, []).map((s) => s.id === sessionId ? session : s));
	} else {
		session.verifiedAt = Date.now();
		writeStorage(OTP_SESSIONS_KEY, readStorage(OTP_SESSIONS_KEY, []).map((s) => s.id === sessionId ? session : s));
	}
	return matches;
}
function invalidateOtpSession(sessionId) {
	writeStorage(OTP_SESSIONS_KEY, readStorage(OTP_SESSIONS_KEY, []).filter((s) => s.id !== sessionId));
}
function cleanupExpiredOtpSessions() {
	const sessions = readStorage(OTP_SESSIONS_KEY, []);
	const now = Date.now();
	writeStorage(OTP_SESSIONS_KEY, sessions.filter((s) => s.expiresAt > now));
}
//#endregion
export { updateLocalUserStatus as _, createLocalUser as a, verifyOtpInSession as b, getLocalSession as c, getOtpSessionByUserId as d, invalidateOtpSession as f, updateLocalUser as g, setLocalSession as h, clearLocalSession as i, getLocalWalletSummary as l, listLocalUsers as m, applyLocalWalletMove as n, createOtpSession as o, isLocalSessionRecentlyCleared as p, cleanupExpiredOtpSessions as r, findLocalUserById as s, LOCAL_SESSION_CHANGED_EVENT as t, getOtpSession as u, upsertLocalUserRecord as v, verifyLocalUserPassword as y };
