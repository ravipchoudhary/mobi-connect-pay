import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { H as CreditCard, I as FingerprintPattern, X as CircleCheck, h as ShieldCheck, r as Wallet } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { a as addDemoTransaction } from "./_ssr/demo-data-CcJeEVE_.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.aeps-B3nDQdor.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var banks = [
	"SBI",
	"HDFC",
	"ICICI",
	"Axis",
	"PNB"
];
var actions = [
	"Cash Withdrawal",
	"Cash Deposit",
	"Mini Statement",
	"Balance Enquiry"
];
function AEPSPage() {
	const [bank, setBank] = (0, import_react.useState)("SBI");
	const [mode, setMode] = (0, import_react.useState)(actions[0]);
	const [amount, setAmount] = (0, import_react.useState)("2500");
	const [status, setStatus] = (0, import_react.useState)("idle");
	const runTransaction = () => {
		addDemoTransaction({
			type: "AEPS",
			amount: Number(amount),
			status: "Success",
			reference: `AEP-${Math.floor(1e3 + Math.random() * 9e3)}`,
			customer: "Aadhaar Customer",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			channel: bank,
			note: `${mode} through ${bank}`
		});
		setStatus("complete");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { className: "h-6 w-6 text-primary" }), "AEPS"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Handle cash and account services with bank selection and biometric-ready workflows."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-[1.1fr_0.9fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "AEPS service"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Choose the bank and service to continue."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Secure"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bank" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: bank,
									onValueChange: setBank,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: banks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: item,
										children: item
									}, item)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Service" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: mode,
									onValueChange: setMode,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: actions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: item,
										children: item
									}, item)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: amount,
									onChange: (e) => setAmount(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: runTransaction,
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), "Process transaction"]
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Transaction outcome"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-2xl border p-4",
					children: status === "complete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-emerald-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }), "AEPS request completed"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40",
							children: [
								mode,
								" for ₹",
								amount,
								" via ",
								bank,
								" has been recorded successfully."
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }), "Ready to start."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Complete the form to create a real AEPS transaction entry." })]
					})
				})]
			})]
		})]
	});
}
//#endregion
export { AEPSPage as component };
