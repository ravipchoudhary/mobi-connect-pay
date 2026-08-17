import { o as __toESM } from "./_runtime.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { n as useSession } from "./_ssr/use-session-BKfs5ahQ.mjs";
import { t as Skeleton } from "./_ssr/skeleton-D9W9wFsj.mjs";
import { $ as CircleCheck, K as Copy, Z as CirclePause, h as Shield, i as Users, j as LoaderCircle, o as UserPlus, y as Search } from "./_libs/lucide-react.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-Dg1urBTx.mjs";
import { c as createServerFn } from "./_ssr/createServerFn-CIHAFgYl.mjs";
import { n as useServerFn, t as createSsrRpc } from "./_ssr/createSsrRpc-BO2LYp9r.mjs";
import { a as stringType, i as objectType, n as literalType, t as enumType } from "./_libs/zod.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./_ssr/dialog-DIo89e4g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.users-BEOd4sXK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
var ROLE_ORDER = [
	"super_admin",
	"master_distributor",
	"distributor",
	"retailer",
	"agent"
];
var MOBILE_RE = /^[6-9]\d{9}$/;
/**
* Create a downline user. Role hierarchy enforced server-side.
* Caller must be authenticated and have a role that permits creating targetRole.
*/
var createDownlineUser = createServerFn({ method: "POST" }).validator((raw) => objectType({
	fullName: stringType().trim().min(2).max(80),
	mobile: stringType().regex(MOBILE_RE),
	email: stringType().trim().email().optional().or(literalType("")),
	username: stringType().trim().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/).optional().or(literalType("")),
	password: stringType().min(8).max(72).optional().or(literalType("")),
	role: enumType(ROLE_ORDER),
	businessName: stringType().trim().max(120).optional().or(literalType("")),
	city: stringType().trim().max(60).optional().or(literalType("")),
	state: stringType().trim().max(60).optional().or(literalType(""))
}).parse(raw)).handler(createSsrRpc("2c76b7e84a90f7efbe64ded1d1797cb7db54e090c4b0644224410dacccd3d865"));
/**
* List users directly under the caller (parent_id = caller).
* Super admin sees everyone.
*/
var listDownlineUsers = createServerFn({ method: "GET" }).handler(createSsrRpc("0c0b2a7731c0dfcd3878ecbc17e5fc69e087db6d5d31b43645da46b2d2bbc18b"));
/**
* Toggle status active <-> suspended for a downline user.
*/
var setUserStatus = createServerFn({ method: "POST" }).validator((raw) => objectType({
	userId: stringType().uuid(),
	status: enumType([
		"active",
		"suspended",
		"inactive"
	])
}).parse(raw)).handler(createSsrRpc("9f379731e1b30c5f0472e627e15aec25fb4f2788880ca65d1db8169e634f8274"));
var ROLE_LABEL = {
	super_admin: "Super Admin",
	master_distributor: "Master Distributor",
	distributor: "Distributor",
	retailer: "Retailer",
	agent: "Agent",
	support: "Support",
	auditor: "Auditor"
};
function UsersPage() {
	const list = useServerFn(listDownlineUsers);
	const qc = useQueryClient();
	const { primaryRole } = useSession();
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const usersQuery = useQuery({
		queryKey: ["downline-users"],
		queryFn: () => list()
	});
	const filtered = (usersQuery.data?.users ?? []).filter((u) => {
		if (!search.trim()) return true;
		const q = search.toLowerCase();
		return u.full_name.toLowerCase().includes(q) || u.mobile.includes(q) || (u.username ?? "").toLowerCase().includes(q) || (u.business_name ?? "").toLowerCase().includes(q);
	});
	const creatable = usersQuery.data?.creatableRoles ?? [];
	const canCreate = primaryRole === "super_admin" || creatable.length > 0;
	const effectiveCreatableRoles = primaryRole === "super_admin" ? [
		"master_distributor",
		"distributor",
		"retailer",
		"agent",
		"super_admin"
	] : creatable;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: -6
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6 text-primary" }), "User Management"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Create and manage your downline. Each tier can only create the tier directly below it."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search name, mobile, username…",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "pl-9 h-10 w-72"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "default",
								size: "lg",
								disabled: !canCreate,
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), "New user"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateUserDialog, {
							creatableRoles: effectiveCreatableRoles,
							onCreated: () => {
								setOpen(false);
								qc.invalidateQueries({ queryKey: ["downline-users"] });
							}
						})]
					})]
				})]
			}),
			usersQuery.data?.callerRoles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground pr-1",
					children: "Your roles:"
				}), usersQuery.data.callerRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "secondary",
					className: "gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }), ROLE_LABEL[r] ?? r]
				}, r))]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border bg-card overflow-hidden",
				children: usersQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 space-y-3",
					children: [
						1,
						2,
						3,
						4
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }, i))
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-10 w-10 text-muted-foreground/40 mx-auto mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: search ? "No users match your search." : "No downline users yet. Click ‘New user’ to add one."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Name" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Role" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mobile" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Username" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Location" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRow, { user: u }, u.id)) })] })
			})
		]
	});
}
function UserRow({ user }) {
	const qc = useQueryClient();
	const setStatus = useServerFn(setUserStatus);
	const mutation = useMutation({
		mutationFn: (status) => setStatus({ data: {
			userId: user.id,
			status
		} }),
		onSuccess: () => {
			toast.success("User updated");
			qc.invalidateQueries({ queryKey: ["downline-users"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	const primaryRole = user.roles[0] ?? "—";
	const isActive = user.status === "active";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-medium",
			children: user.full_name
		}), user.business_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: user.business_name
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			children: ROLE_LABEL[primaryRole] ?? primaryRole
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
			className: "font-mono text-sm",
			children: ["+91 ", user.mobile]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "text-sm",
			children: user.username ?? "—"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "text-sm text-muted-foreground",
			children: [user.city, user.state].filter(Boolean).join(", ") || "—"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			className: "gap-1 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), "Active"]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			variant: "secondary",
			className: "gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-3 w-3" }), user.status]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "text-right",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: isActive ? "outline" : "default",
				disabled: mutation.isPending,
				onClick: () => mutation.mutate(isActive ? "suspended" : "active"),
				children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : isActive ? "Suspend" : "Activate"
			})
		})
	] });
}
function CreateUserDialog({ creatableRoles, onCreated }) {
	const create = useServerFn(createDownlineUser);
	const [role, setRole] = (0, import_react.useState)(creatableRoles[0] ?? "retailer");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [mobile, setMobile] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [businessName, setBusinessName] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [state, setState] = (0, import_react.useState)("");
	const needsPassword = role === "super_admin" || role === "master_distributor" || role === "distributor";
	const mutation = useMutation({
		mutationFn: () => create({ data: {
			fullName,
			mobile,
			email,
			username,
			password,
			role,
			businessName,
			city,
			state
		} }),
		onSuccess: () => {
			toast.success(`${ROLE_LABEL[role] ?? role} created`);
			setFullName("");
			setMobile("");
			setEmail("");
			setUsername("");
			setPassword("");
			setBusinessName("");
			setCity("");
			setState("");
			onCreated();
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to create user")
	});
	const genPassword = () => {
		const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
		let p = "";
		for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * 54)];
		setPassword(p + "@1");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create downline user" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "The new user will be linked to you as their parent in the hierarchy." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: role,
								onValueChange: setRole,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: creatableRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: r,
									children: ROLE_LABEL[r] ?? r
								}, r)) })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								placeholder: "Rohan Sharma"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: mobile,
								onChange: (e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)),
								placeholder: "9876543210"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "user@company.com"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Username ", needsPassword && "*"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: username,
								onChange: (e) => setUsername(e.target.value),
								placeholder: "rohan.s"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Password ", needsPassword && "*"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "text",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "Min 8 chars"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: genPassword,
										children: "Generate"
									}),
									password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: () => {
											navigator.clipboard.writeText(password);
											toast.success("Copied");
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 col-span-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Business name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: businessName,
									onChange: (e) => setBusinessName(e.target.value),
									placeholder: "Sharma Communications"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: city,
									onChange: (e) => setCity(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: state,
									onChange: (e) => setState(e.target.value)
								})]
							})
						]
					}),
					needsPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Admin / staff roles require a username + password. Retailers and agents sign in via mobile OTP."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => mutation.mutate(),
				disabled: mutation.isPending || !fullName || !/^[6-9]\d{9}$/.test(mobile),
				size: "lg",
				children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4 mr-2" }), "Create user"] })
			}) })
		]
	});
}
//#endregion
export { UsersPage as component };
