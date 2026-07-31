import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { C as Plus, P as KeyRound, u as ToggleRight } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { h as toggleDemoApiKey, s as getDemoApiKeys, t as addDemoApiKey } from "./_ssr/demo-data-CcJeEVE_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.api-management-DKpNVOpK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApiManagementPage() {
	const [name, setName] = (0, import_react.useState)("");
	const apiKeys = getDemoApiKeys();
	const createKey = () => {
		if (!name.trim()) return;
		addDemoApiKey({
			name: name.trim(),
			key: `pk_live_${Math.random().toString(36).slice(2, 8)}`,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			lastUsed: "Just now",
			status: "Active"
		});
		setName("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-6 w-6 text-primary" }), "API management"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Create and manage API keys for partner integrations."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full md:max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium",
						children: "API key name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Partner gateway",
						className: "mt-2"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "gap-2",
					onClick: createKey,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Generate key"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-3",
				children: apiKeys.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: item.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: item.key
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: item.status === "Active" ? "default" : "secondary",
							children: item.status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "gap-2",
							onClick: () => toggleDemoApiKey(item.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRight, { className: "h-4 w-4" }), "Toggle"]
						})]
					})]
				}, item.id))
			})]
		})]
	});
}
//#endregion
export { ApiManagementPage as component };
