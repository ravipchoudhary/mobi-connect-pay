import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { it as Bell, v as Search } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { l as getDemoNotifications, m as markNotificationRead, r as addDemoNotification } from "./_ssr/demo-data-CcJeEVE_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.notifications-vHhqjb82.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const notifications = getDemoNotifications();
	const filtered = (0, import_react.useMemo)(() => notifications.filter((item) => [item.title, item.message].join(" ").toLowerCase().includes(query.toLowerCase())), [notifications, query]);
	const sendAlert = () => addDemoNotification({
		title: "New payout queued",
		message: "A new payout batch is ready for approval.",
		type: "settlement",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		read: false
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-6 w-6 text-primary" }), "Notifications"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Review wallet, settlement and KYC alerts in one place."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full md:max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search notifications",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: sendAlert,
					children: "Send alert"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-3",
				children: filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-start justify-between rounded-2xl border p-4 ${item.read ? "bg-background" : "bg-primary/5"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: item.message
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: item.type }), !item.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => markNotificationRead(item.id),
							children: "Mark read"
						})]
					})]
				}, item.id))
			})]
		})]
	});
}
//#endregion
export { NotificationsPage as component };
