import { o as __toESM } from "./_runtime.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { n as useSession } from "./_ssr/use-session-BKfs5ahQ.mjs";
import { $ as CircleCheck, V as FileCheckCorner, Y as CircleX, c as Upload, g as ShieldCheck, j as LoaderCircle, q as Clock3 } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
import { c as createServerFn } from "./_ssr/createServerFn-CIHAFgYl.mjs";
import { n as useServerFn, t as createSsrRpc } from "./_ssr/createSsrRpc-BO2LYp9r.mjs";
import { a as stringType, i as objectType, n as literalType, t as enumType } from "./_libs/zod.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.kyc-BYWxJFL4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var DOC_TYPES$1 = [
	"aadhaar_front",
	"aadhaar_back",
	"pan",
	"selfie",
	"gst",
	"bank_proof"
];
var listMyKyc = createServerFn({ method: "GET" }).handler(createSsrRpc("881463f41fb34281d471e949f238ca51cc40a00a66363281bc354f28e0b56671"));
var recordKycDoc = createServerFn({ method: "POST" }).validator((raw) => objectType({
	doc_type: enumType(DOC_TYPES$1),
	file_url: stringType().min(1).max(500)
}).parse(raw)).handler(createSsrRpc("5819067632a3801522878cfa0e5d994133d44499ccdc0185fbe87e723a4bdc10"));
var submitKycForReview = createServerFn({ method: "POST" }).validator((raw) => objectType({
	full_name: stringType().trim().min(2).max(80),
	pan_number: stringType().trim().length(10).optional().or(literalType("")),
	aadhaar_last4: stringType().regex(/^\d{4}$/).optional().or(literalType("")),
	business_name: stringType().trim().max(120).optional(),
	address: stringType().trim().max(300).optional(),
	city: stringType().trim().max(80).optional(),
	state: stringType().trim().max(80).optional(),
	pincode: stringType().regex(/^\d{6}$/).optional().or(literalType("")),
	gst_number: stringType().trim().max(20).optional()
}).parse(raw)).handler(createSsrRpc("3d4f02749ba77e4b88d1b2126e3126e6eeeacb743164f797f61b5deaf7625028"));
var reviewKyc = createServerFn({ method: "POST" }).validator((raw) => objectType({
	user_id: stringType().uuid(),
	decision: enumType(["approved", "rejected"]),
	remarks: stringType().max(300).optional()
}).parse(raw)).handler(createSsrRpc("dbdb65b15d7ab268cbb800ec2d03c93275d348451cd092f427b42c2b103dd067"));
var listPendingKyc = createServerFn({ method: "GET" }).handler(createSsrRpc("491a621ace5d08940f2d8a6d2e5d76bf890f6c138ac2259097000c585449c5d2"));
var DOC_TYPES = [
	{
		key: "aadhaar_front",
		label: "Aadhaar (front)"
	},
	{
		key: "aadhaar_back",
		label: "Aadhaar (back)"
	},
	{
		key: "pan",
		label: "PAN card"
	},
	{
		key: "selfie",
		label: "Selfie / Live photo"
	},
	{
		key: "gst",
		label: "GST certificate"
	},
	{
		key: "bank_proof",
		label: "Bank proof (cheque)"
	}
];
function KycPage() {
	const { profile, roles } = useSession();
	const isAdmin = roles.some((r) => r === "super_admin" || r === "support" || r === "auditor");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: "Compliance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-3xl font-semibold tracking-tight",
						children: "KYC Verification"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Upload documents and submit personal details to unlock all services."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KycStatusBadge, { status: profile?.kyc_status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileForm, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsCard, {})]
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminReviewPanel, {})
		]
	});
}
function KycStatusBadge({ status }) {
	const map = {
		approved: {
			label: "Approved",
			cls: "bg-success/15 text-success border-success/30",
			icon: CircleCheck
		},
		pending: {
			label: "Under review",
			cls: "bg-warning/15 text-warning border-warning/30",
			icon: Clock3
		},
		rejected: {
			label: "Rejected",
			cls: "bg-destructive/15 text-destructive border-destructive/30",
			icon: CircleX
		},
		not_started: {
			label: "Not started",
			cls: "bg-muted text-muted-foreground border-border",
			icon: ShieldCheck
		}
	};
	const s = map[status ?? "not_started"] ?? map.not_started;
	const I = s.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${s.cls}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-3.5 w-3.5" }),
			" ",
			s.label
		]
	});
}
function ProfileForm() {
	const { profile, refresh } = useSession();
	const submit = useServerFn(submitKycForReview);
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		full_name: profile?.full_name ?? "",
		pan_number: profile?.pan_number ?? "",
		aadhaar_last4: profile?.aadhaar_last4 ?? "",
		business_name: profile?.business_name ?? "",
		address: profile?.address ?? "",
		city: profile?.city ?? "",
		state: profile?.state ?? "",
		pincode: profile?.pincode ?? "",
		gst_number: profile?.gst_number ?? ""
	});
	(0, import_react.useEffect)(() => {
		if (profile) setForm({
			full_name: profile.full_name ?? "",
			pan_number: profile.pan_number ?? "",
			aadhaar_last4: profile.aadhaar_last4 ?? "",
			business_name: profile.business_name ?? "",
			address: profile.address ?? "",
			city: profile.city ?? "",
			state: profile.state ?? "",
			pincode: profile.pincode ?? "",
			gst_number: profile.gst_number ?? ""
		});
	}, [profile]);
	const mut = useMutation({
		mutationFn: () => submit({ data: form }),
		onSuccess: async () => {
			toast.success("Submitted for review");
			await refresh();
			qc.invalidateQueries({ queryKey: ["kyc-mine"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Submission failed")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold tracking-tight",
					children: "Personal & business details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Required for KYC approval and settlement."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full name",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.full_name,
							onChange: (e) => setForm({
								...form,
								full_name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Business / trade name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.business_name,
							onChange: (e) => setForm({
								...form,
								business_name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "PAN",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.pan_number,
							maxLength: 10,
							onChange: (e) => setForm({
								...form,
								pan_number: e.target.value.toUpperCase()
							}),
							placeholder: "ABCDE1234F"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Aadhaar (last 4)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.aadhaar_last4,
							maxLength: 4,
							onChange: (e) => setForm({
								...form,
								aadhaar_last4: e.target.value.replace(/\D/g, "")
							}),
							placeholder: "1234"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "GST number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.gst_number,
							onChange: (e) => setForm({
								...form,
								gst_number: e.target.value.toUpperCase()
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Pincode",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.pincode,
							maxLength: 6,
							onChange: (e) => setForm({
								...form,
								pincode: e.target.value.replace(/\D/g, "")
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "City",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.city,
							onChange: (e) => setForm({
								...form,
								city: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "State",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.state,
							onChange: (e) => setForm({
								...form,
								state: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: form.address,
								onChange: (e) => setForm({
									...form,
									address: e.target.value
								})
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "hero",
					size: "lg",
					onClick: () => mut.mutate(),
					disabled: mut.isPending || form.full_name.trim().length < 2,
					children: mut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Submit for review"
				})
			})
		]
	});
}
function Field({ label, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			className: "text-xs",
			children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-1 text-destructive",
				children: "*"
			})]
		}), children]
	});
}
function DocumentsCard() {
	const list = useServerFn(listMyKyc);
	const record = useServerFn(recordKycDoc);
	const qc = useQueryClient();
	const { data: docs } = useQuery({
		queryKey: ["kyc-mine"],
		queryFn: () => list({ data: void 0 })
	});
	const uploaded = (0, import_react.useMemo)(() => new Set((docs ?? []).map((d) => d.doc_type)), [docs]);
	const onUploaded = () => qc.invalidateQueries({ queryKey: ["kyc-mine"] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold tracking-tight",
				children: "Documents"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "JPG, PNG or PDF · Max 5MB each."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3",
				children: DOC_TYPES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocRow, {
					docKey: d.key,
					label: d.label,
					uploaded: uploaded.has(d.key),
					record,
					onDone: onUploaded
				}, d.key))
			})
		]
	});
}
function DocRow({ docKey, label, uploaded, record, onDone }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	const { user } = useSession();
	const onFile = async (file) => {
		if (!user) return;
		if (file.size > 5 * 1024 * 1024) return toast.error("File is larger than 5MB");
		setBusy(true);
		try {
			await record({ data: {
				doc_type: docKey,
				file_url: `${docKey}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`
			} });
			toast.success(`${label} uploaded`);
			onDone();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Upload failed");
		} finally {
			setBusy(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-xl border border-dashed border-border bg-card px-4 py-4 transition hover:border-primary/50 hover:bg-accent/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: uploaded ? "Uploaded — under review" : "Not uploaded yet"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				uploaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					className: "rounded-full",
					children: "Pending"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "file",
					accept: "image/*,application/pdf",
					hidden: true,
					onChange: (e) => e.target.files?.[0] && onFile(e.target.files[0])
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => inputRef.current?.click(),
					disabled: busy,
					children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }),
						" ",
						uploaded ? "Replace" : "Upload"
					] })
				})
			]
		})]
	});
}
function AdminReviewPanel() {
	const list = useServerFn(listPendingKyc);
	const review = useServerFn(reviewKyc);
	const qc = useQueryClient();
	const { data: pending } = useQuery({
		queryKey: ["kyc-pending"],
		queryFn: () => list({ data: void 0 })
	});
	const mut = useMutation({
		mutationFn: (v) => review({ data: v }),
		onSuccess: () => {
			toast.success("KYC updated");
			qc.invalidateQueries({ queryKey: ["kyc-pending"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 shadow-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold tracking-tight",
				children: "Admin review queue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Users with pending KYC submissions."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				children: [pending?.length ?? 0, " pending"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 divide-y divide-border",
			children: [(!pending || pending.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-6 text-center text-sm text-muted-foreground",
				children: "No pending KYCs."
			}), pending?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 py-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: p.full_name || "Unnamed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"+91 ",
							p.mobile,
							" · ",
							p.city || "—",
							", ",
							p.state || "—"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => mut.mutate({
							user_id: p.id,
							decision: "rejected"
						}),
						children: "Reject"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "hero",
						onClick: () => mut.mutate({
							user_id: p.id,
							decision: "approved"
						}),
						children: "Approve"
					})]
				})]
			}, p.id))]
		})]
	});
}
//#endregion
export { KycPage as component };
