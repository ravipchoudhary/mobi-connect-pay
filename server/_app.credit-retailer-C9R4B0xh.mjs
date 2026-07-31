import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { A as LoaderCircle, X as CircleCheck, a as UserRound, h as ShieldCheck, ot as Banknote } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-Dg1urBTx.mjs";
import { n as useServerFn } from "./_ssr/createSsrRpc-CPVtKjHz.mjs";
import { r as listVerifiedRetailersForCredit, t as creditVerifiedRetailerWallet } from "./_ssr/wallet.functions-Dipt2yDg.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.credit-retailer-C9R4B0xh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmt(value) {
	return `₹${value.toLocaleString("en-IN")}`;
}
function CreditRetailerPage() {
	const qc = useQueryClient();
	const listRetailers = useServerFn(listVerifiedRetailersForCredit);
	const credit = useServerFn(creditVerifiedRetailerWallet);
	const [selectedUserId, setSelectedUserId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("5000");
	const [note, setNote] = (0, import_react.useState)("Wallet credit for verified retailer");
	const { data, isLoading } = useQuery({
		queryKey: ["verified-retailers-for-credit"],
		queryFn: () => listRetailers()
	});
	const retailers = (0, import_react.useMemo)(() => data?.retailers ?? [], [data]);
	const mutation = useMutation({
		mutationFn: () => credit({ data: {
			targetUserId: selectedUserId,
			amount: Number(amount),
			note
		} }),
		onSuccess: () => {
			toast.success("Wallet credit completed");
			qc.invalidateQueries({ queryKey: ["verified-retailers-for-credit"] });
			setAmount("5000");
			setNote("Wallet credit for verified retailer");
			setSelectedUserId("");
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Credit failed")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-6 w-6 text-primary" }), "Credit verified retailer wallet"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Send wallet credit only to retailers whose KYC is already approved."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "Verified retailer payout"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Pick a retailer from the verified list and credit their main wallet."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " KYC approved"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Retailer" }), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "Loading verified retailers…"
							}) : retailers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border p-3 text-sm text-muted-foreground",
								children: "No verified retailers are available right now."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedUserId,
								onValueChange: setSelectedUserId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select retailer" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: retailers.map((retailer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: retailer.id,
									children: [
										retailer.full_name,
										" • ",
										retailer.business_name || "Retailer"
									]
								}, retailer.id)) })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								value: amount,
								onChange: (e) => setAmount(e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Note (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Reason for wallet credit"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => mutation.mutate(),
							disabled: mutation.isPending || !selectedUserId || !amount || Number(amount) <= 0,
							className: "gap-2",
							children: [mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), "Credit wallet"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "The credit will be posted to the retailer’s main wallet."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Verified retailer list"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: retailers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border p-4 text-sm text-muted-foreground",
						children: "No verified retailers available."
					}) : retailers.map((retailer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-2xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-medium flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-4 w-4" }), retailer.full_name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: [
								retailer.business_name || "Retailer",
								" • +91 ",
								retailer.mobile
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "default",
							children: fmt(Number(retailer.balance ?? 0))
						})]
					}, retailer.id))
				})]
			})
		]
	});
}
//#endregion
export { CreditRetailerPage as component };
