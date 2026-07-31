import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as findLocalUserById, o as getLocalSession, r as clearLocalSession, t as LOCAL_SESSION_CHANGED_EVENT } from "./local-store-CdTts1db.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-session-kPz8K158.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var ROLE_ORDER = [
	"super_admin",
	"master_distributor",
	"distributor",
	"retailer",
	"agent",
	"support",
	"auditor"
];
function useSession() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	const hydrate = async () => {
		const localSession = getLocalSession();
		setSession(localSession);
		const localUser = localSession ? findLocalUserById(localSession.userId) : void 0;
		if (localUser) {
			setProfile(localUser);
			setRoles(localUser.roles || []);
		} else {
			setProfile(null);
			setRoles([]);
		}
	};
	(0, import_react.useEffect)(() => {
		let mounted = true;
		const init = async () => {
			try {
				await hydrate();
				if (mounted) setReady(true);
			} catch {
				if (mounted) {
					setProfile(null);
					setRoles([]);
					setReady(true);
				}
			}
		};
		init();
		return () => {
			mounted = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const handleSessionChange = () => {
			hydrate();
		};
		if (typeof window === "undefined") return;
		window.addEventListener(LOCAL_SESSION_CHANGED_EVENT, handleSessionChange);
		window.addEventListener("storage", handleSessionChange);
		return () => {
			window.removeEventListener(LOCAL_SESSION_CHANGED_EVENT, handleSessionChange);
			window.removeEventListener("storage", handleSessionChange);
		};
	}, []);
	return {
		ready,
		session,
		user: profile,
		profile,
		roles,
		primaryRole: roles.length ? ROLE_ORDER.find((r) => roles.includes(r)) ?? roles[0] : null,
		isAuthenticated: !!session?.userId && !!profile,
		refresh: async () => {
			await hydrate();
		}
	};
}
async function signOut() {
	clearLocalSession();
}
//#endregion
export { useSession as n, signOut as t };
