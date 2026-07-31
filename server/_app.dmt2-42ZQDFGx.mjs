import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { n as useSession } from "./_ssr/use-session-Bp3MsBUn.mjs";
import { N as Landmark, W as Clock3, X as CircleCheck, a as UserRound, h as ShieldCheck, ot as Banknote, r as Wallet } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { c as getDemoDmt2Requests, g as updateDemoDmt2RequestStatus, n as addDemoDmt2Request, r as addDemoNotification } from "./_ssr/demo-data-CcJeEVE_.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.dmt2-42ZQDFGx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fmt = (value) => `₹${value.toLocaleString("en-IN")}`;
function DMT2Page() {
	const { primaryRole, profile } = useSession();
	const role = primaryRole && [
		"super_admin",
		"master_distributor",
		"distributor",
		"retailer",
		"agent"
	].includes(primaryRole) ? primaryRole : "retailer";
	const [form, setForm] = (0, import_react.useState)({
		beneficiaryName: "Riya Sharma",
		bankAccount: "50401000012345",
		ifsc: "HDFC0001234",
		amount: "12000"
	});
	const [requests, setRequests] = (0, import_react.useState)(() => getDemoDmt2Requests());
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const canApprove = role === "super_admin" || role === "master_distributor" || role === "distributor";
	const pendingRequests = (0, import_react.useMemo)(() => requests.filter((item) => item.status === "PendingApproval"), [requests]);
	const recentRequests = (0, import_react.useMemo)(() => requests.slice(0, 4), [requests]);
	const submitRequest = () => {
		const amount = Number(form.amount);
		if (!form.beneficiaryName || !form.bankAccount || !form.ifsc || !amount || amount <= 0) {
			setFeedback("Please fill all fields with a valid amount.");
			return;
		}
		const request = addDemoDmt2Request({
			beneficiaryName: form.beneficiaryName,
			bankAccount: form.bankAccount,
			ifsc: form.ifsc,
			amount,
			submittedBy: profile?.full_name ?? "Retailer / Agent",
			submittedByRole: role,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			note: "Submitted for admin approval"
		});
		addDemoNotification({
			title: "DMT 2 request submitted",
			message: `${request.beneficiaryName} is waiting for approval. Amount ${fmt(request.amount)} is on hold.`,
			type: "wallet",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			read: false
		});
		setFeedback(`Request submitted successfully. ₹${amount.toLocaleString("en-IN")} is now on hold for approval.`);
		setRequests(getDemoDmt2Requests());
		setForm({
			beneficiaryName: "",
			bankAccount: "",
			ifsc: "",
			amount: ""
		});
	};
	const handleApproval = (id, status) => {
		updateDemoDmt2RequestStatus(id, status, status === "Approved" ? "Approved by admin" : "Rejected by admin");
		addDemoNotification({
			title: status === "Approved" ? "DMT 2 approved" : "DMT 2 rejected",
			message: status === "Approved" ? "The transfer has been approved and the hold has been released." : "The transfer request was rejected.",
			type: "settlement",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			read: false
		});
		setRequests(getDemoDmt2Requests());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-6 w-6 text-primary" }), "DMT 2"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Create bank transfer requests with beneficiary details, keep the amount on hold until admin approval, and complete the transfer after approval."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: "Transfer request form"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Fill beneficiary bank details and submit for approval."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Admin approval"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Beneficiary name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.beneficiaryName,
											onChange: (e) => setForm((prev) => ({
												...prev,
												beneficiaryName: e.target.value
											})),
											className: "pl-9"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bank account number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.bankAccount,
										onChange: (e) => setForm((prev) => ({
											...prev,
											bankAccount: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "IFSC code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.ifsc,
										onChange: (e) => setForm((prev) => ({
											...prev,
											ifsc: e.target.value.toUpperCase()
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.amount,
										onChange: (e) => setForm((prev) => ({
											...prev,
											amount: e.target.value
										}))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: submitRequest,
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }), "Submit for approval"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "The amount will be held from the wallet until an admin approves it."
							})]
						}),
						feedback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30",
							children: feedback
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "Approval status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Pending requests stay in hold until admin approval."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							children: [pendingRequests.length, " pending"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: recentRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border p-4 text-sm text-muted-foreground",
							children: "No transfer requests yet."
						}) : recentRequests.map((request) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: request.beneficiaryName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										request.bankAccount,
										" • ",
										request.ifsc
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: request.status === "PendingApproval" ? "secondary" : request.status === "Approved" || request.status === "Completed" ? "default" : "destructive",
									children: request.status === "PendingApproval" ? "Pending" : request.status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground",
									children: [
										fmt(request.amount),
										" • ",
										request.submittedBy
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: request.status === "PendingApproval" ? "On hold" : "Completed"
								})]
							})]
						}, request.id))
					})]
				})]
			}),
			canApprove ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Admin approval queue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Approve or reject pending bank transfer requests."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-3.5 w-3.5" }), " Pending review"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: pendingRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border p-4 text-sm text-muted-foreground",
						children: "No pending requests are waiting for approval."
					}) : pendingRequests.map((request) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: request.beneficiaryName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-muted-foreground",
								children: [
									request.bankAccount,
									" • ",
									request.ifsc,
									" • ",
									fmt(request.amount)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "h-3.5 w-3.5" }),
									" Submitted by ",
									request.submittedBy
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => handleApproval(request.id, "Approved"),
								className: "gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), "Approve"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => handleApproval(request.id, "Rejected"),
								children: "Reject"
							})]
						})]
					}, request.id))
				})]
			}) : null
		]
	});
}
//#endregion
export { DMT2Page as component };
