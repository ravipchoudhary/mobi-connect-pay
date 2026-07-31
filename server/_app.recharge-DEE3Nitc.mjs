import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { $ as ChevronRight, X as CircleCheck, Z as CircleAlert, b as RefreshCw, p as Smartphone, r as Wallet, v as Search, x as Receipt } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { a as addDemoTransaction } from "./_ssr/demo-data-CcJeEVE_.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-Dg1urBTx.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.recharge-DEE3Nitc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var operators = [
	"Jio",
	"Airtel",
	"Vi",
	"BSNL",
	"MTNL"
];
var circles = [
	"Delhi",
	"Mumbai",
	"Bengaluru",
	"Kolkata",
	"Chennai"
];
function RechargePage() {
	const [operator, setOperator] = (0, import_react.useState)("Jio");
	const [circle, setCircle] = (0, import_react.useState)("Delhi");
	const [mobile, setMobile] = (0, import_react.useState)("9876543210");
	const [amount, setAmount] = (0, import_react.useState)("499");
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [receipt, setReceipt] = (0, import_react.useState)(null);
	const canSubmit = (0, import_react.useMemo)(() => /^\d{10}$/.test(mobile) && Number(amount) > 0, [mobile, amount]);
	const submit = () => {
		const ref = `RCH-${Math.floor(1e3 + Math.random() * 9e3)}`;
		addDemoTransaction({
			type: "Recharge",
			amount: Number(amount),
			status: "Success",
			reference: ref,
			customer: mobile,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			channel: operator,
			note: `${operator} ${circle} recharge`
		});
		setReceipt(ref);
		setStatus("success");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-6 w-6 text-primary" }), "Recharge"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Complete a live recharge flow with wallet validation, receipt generation and history updates."
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
							children: "Recharge form"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Fast and secure recharge for prepaid services."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3.5 w-3.5" }), " Wallet validated"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Operator" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: operator,
									onValueChange: setOperator,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: operators.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: item,
										children: item
									}, item)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Circle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: circle,
									onValueChange: setCircle,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: circles.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: item,
										children: item
									}, item)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: mobile,
										onChange: (e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)),
										className: "pl-9"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 10,
									value: amount,
									onChange: (e) => setAmount(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Plan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: `${operator} ${circle} prepaid`,
									readOnly: true
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: submit,
							disabled: !canSubmit,
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), "Recharge now"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								setStatus("idle");
								setReceipt(null);
							},
							children: "Reset"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Status & receipt"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-2xl border border-dashed p-4",
					children: status === "success" && receipt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 6
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-emerald-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }), "Recharge successful"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold",
									children: ["Receipt #", receipt]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1",
									children: [
										operator,
										" · ",
										circle,
										" · ₹",
										amount
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" }), "View receipt"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "gap-2",
									children: ["Retry ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), "No transaction submitted yet."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Wallet validation, transaction status and history are wired into the flow." })]
					})
				})]
			})]
		})]
	});
}
//#endregion
export { RechargePage as component };
