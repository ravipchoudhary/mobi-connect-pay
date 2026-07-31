import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { at as BellRing, g as Settings, h as ShieldCheck, ot as Banknote } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.settings-KiCVh_l6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [sms, setSms] = (0, import_react.useState)("MSG91");
	const [gateway, setGateway] = (0, import_react.useState)("Razorpay");
	const [gst, setGst] = (0, import_react.useState)("27ABCDE1234F1Z5");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-6 w-6 text-primary" }), "Settings"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Configure the core gateway, notification and compliance preferences."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "System preferences"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SMS gateway" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sms,
								onChange: (e) => setSms(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment gateway" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: gateway,
								onChange: (e) => setGateway(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GSTIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: gst,
								onChange: (e) => setGst(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Save preferences" })
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "Operational status"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: [
							{
								label: "SMS delivery",
								value: "Healthy"
							},
							{
								label: "Wallet syncing",
								value: "Healthy"
							},
							{
								label: "Settlement queue",
								value: "3 pending"
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: item.value })]
						}, item.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center gap-2 rounded-2xl border border-dashed p-3 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4" }), " Bank accounts and compliance settings are ready for configuration."]
					})
				]
			})]
		})]
	});
}
//#endregion
export { SettingsPage as component };
