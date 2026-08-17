import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { n as useSession } from "./_ssr/use-session-BKfs5ahQ.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { G as CreditCard, P as Landmark, Q as CircleDollarSign, S as Receipt, T as PiggyBank, _t as Activity, ct as Bell, dt as BadgePercent, ft as ArrowUpRight, g as ShieldCheck, i as Users, l as TrendingUp, m as Smartphone, n as X, nt as ChevronRight, o as UserPlus, r as Wallet, rt as ChevronLeft, st as Briefcase, ut as Banknote, v as Send, x as RefreshCw, z as FileText } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { c as getDemoActivity, d as getDemoNotifications, f as getDemoPermissions, g as getDemoWalletSummary, h as getDemoTransactions, p as getDemoSliderImages } from "./_ssr/demo-data-CrcRAGHm.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.dashboard-CQVfI2rM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImageSlider({ images, autoPlay = true, autoPlayInterval = 5e3, onEdit, onDelete, isAdmin = false }) {
	const [currentIndex, setCurrentIndex] = (0, import_react.useState)(0);
	const activeImages = images.filter((img) => img.active);
	if (activeImages.length === 0) return null;
	(0, import_react.useEffect)(() => {
		if (!autoPlay) return;
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % activeImages.length);
		}, autoPlayInterval);
		return () => clearInterval(interval);
	}, [
		autoPlay,
		autoPlayInterval,
		activeImages.length
	]);
	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
	};
	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % activeImages.length);
	};
	const currentImage = activeImages[currentIndex];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-64 w-full overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: currentImage.imageUrl,
					alt: currentImage.title,
					className: "h-full w-full object-cover transition-opacity duration-500"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col justify-end p-6 text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold mb-2",
							children: currentImage.title
						}),
						currentImage.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gray-200 mb-4",
							children: currentImage.description
						}),
						currentImage.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-fit",
							size: "sm",
							children: "Learn More →"
						})
					]
				}),
				isAdmin && onEdit && onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-4 right-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "bg-white/10 border-white/20 hover:bg-white/20",
						onClick: () => onEdit(currentImage),
						children: "Edit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "destructive",
						className: "bg-red-500/20 border-red-500/30 hover:bg-red-500/30",
						onClick: () => onDelete(currentImage.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				activeImages.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: goToPrevious,
					className: "absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: goToNext,
					className: "absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-6 w-6" })
				})] })
			]
		}), activeImages.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center gap-2 bg-black/20 py-3 backdrop-blur-sm",
			children: activeImages.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setCurrentIndex(index),
				className: `h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`
			}, index))
		})]
	});
}
var fmt = (value) => `₹${value.toLocaleString("en-IN")}`;
function RoleDashboard() {
	const { primaryRole, profile } = useSession();
	const role = primaryRole ?? "retailer";
	const name = profile?.full_name?.split(" ")[0] ?? "there";
	const transactions = getDemoTransactions();
	const notifications = getDemoNotifications();
	const activity = getDemoActivity();
	const summary = getDemoWalletSummary();
	const permissions = getDemoPermissions().filter((item) => item.role === role);
	if (role === "super_admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperAdminDashboard, {
		name,
		summary,
		transactions,
		notifications,
		activity,
		permissions
	});
	if (role === "master_distributor") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasterDistributorDashboard, {
		name,
		summary,
		transactions,
		notifications,
		activity,
		permissions
	});
	if (role === "distributor") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DistributorDashboard, {
		name,
		summary,
		transactions,
		notifications,
		activity,
		permissions
	});
	if (role === "agent") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentDashboard, {
		name,
		summary,
		transactions,
		notifications,
		activity,
		permissions
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RetailerDashboard, {
		name,
		summary,
		transactions,
		notifications,
		activity,
		permissions
	});
}
function SuperAdminDashboard({ name, summary, transactions, notifications, activity, permissions }) {
	const sliderImages = getDemoSliderImages();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
				title: `Enterprise Control Panel`,
				subtitle: `Welcome back, ${name}. Manage revenue, users, wallets and settlements from one panel.`,
				accent: "from-indigo-600 to-violet-500"
			}),
			sliderImages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageSlider, {
				images: sliderImages,
				autoPlay: true,
				autoPlayInterval: 6e3
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						label: "Total Revenue",
						value: fmt(128e4),
						icon: CircleDollarSign,
						tint: "bg-indigo-500"
					},
					{
						label: "Today's Revenue",
						value: fmt(182e3),
						icon: TrendingUp,
						tint: "bg-emerald-500"
					},
					{
						label: "Wallet Balance",
						value: fmt(64e4),
						icon: Wallet,
						tint: "bg-amber-500"
					},
					{
						label: "System Wallet",
						value: fmt(268e4),
						icon: PiggyBank,
						tint: "bg-sky-500"
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `rounded-xl p-2 text-white ${item.tint}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-2xl font-semibold",
						children: item.value
					})]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[1.2fr_0.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Live transactions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Recent activity across the network"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							children: [summary.txCount, " total"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: transactions.slice(0, 5).map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: tx.type
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									tx.customer,
									" · ",
									tx.reference
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: fmt(tx.amount)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: tx.status === "Processed Successfully" ? "default" : tx.status === "Pending" ? "secondary" : "destructive",
									children: tx.status
								})]
							})]
						}, tx.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Quick actions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "System operations"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: [
							{
								label: "Create User",
								icon: UserPlus,
								to: "/users"
							},
							{
								label: "Credit Wallet",
								icon: Wallet,
								to: "/wallet"
							},
							{
								label: "Credit Retailer",
								icon: Banknote,
								to: "/credit-retailer"
							},
							{
								label: "Approve KYC",
								icon: ShieldCheck,
								to: "/kyc"
							},
							{
								label: "Settlement Approval",
								icon: Landmark,
								to: "/settlement"
							},
							{
								label: "Reports",
								icon: FileText,
								to: "/reports"
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "justify-start gap-2",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
							})
						}, item.label))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Recent activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: activity.slice(0, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: item.detail
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: item.timestamp
								})
							]
						}, item.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Notifications"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: notifications.slice(0, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 rounded-2xl border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mt-0.5 h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: item.message
							})] })]
						}, item.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Permission matrix"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2 md:grid-cols-2",
					children: permissions.map((permission) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-2xl border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: permission.feature }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: permission.access ? "default" : "secondary",
							children: permission.access ? "Allowed" : "Blocked"
						})]
					}, permission.id))
				})]
			})
		]
	});
}
function MasterDistributorDashboard({ name, summary, transactions, notifications, activity, permissions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
				title: "Master Distributor Control",
				subtitle: `Welcome back, ${name}. Oversee distributors, wallets and settlements.`,
				accent: "from-emerald-600 to-lime-500"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						label: "Wallet",
						value: fmt(56e4),
						icon: Wallet
					},
					{
						label: "Commission",
						value: fmt(182500),
						icon: BadgePercent
					},
					{
						label: "Settlement",
						value: fmt(325e3),
						icon: Landmark
					},
					{
						label: "Distributors",
						value: "24",
						icon: Users
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-emerald-500/10 p-2 text-emerald-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-2xl font-semibold",
						children: item.value
					})]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Distributor pipeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: transactions.slice(0, 4).map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: tx.customer
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									tx.type,
									" · ",
									tx.reference
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: fmt(tx.amount)
							})]
						}, tx.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Quick actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2",
						children: [
							{
								label: "Create Distributor",
								icon: UserPlus,
								to: "/users"
							},
							{
								label: "Distributor Wallet",
								icon: Wallet,
								to: "/wallet"
							},
							{
								label: "Reports",
								icon: FileText,
								to: "/reports"
							},
							{
								label: "Settlement",
								icon: Landmark,
								to: "/settlement"
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "justify-start gap-2",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
							})
						}, item.label))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Recent activity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: activity.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: item.detail
						})]
					}, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Permissions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2 md:grid-cols-2",
					children: permissions.map((permission) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border p-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: permission.feature }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: permission.access ? "default" : "secondary",
							children: permission.access ? "Allowed" : "Blocked"
						})]
					}, permission.id))
				})]
			})
		]
	});
}
function DistributorDashboard({ name, summary, transactions, notifications, activity, permissions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
				title: "Distributor Operations",
				subtitle: `Welcome back, ${name}. Support retailers and manage wallet requests.`,
				accent: "from-sky-600 to-cyan-500"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						label: "Wallet",
						value: fmt(22e4),
						icon: Wallet
					},
					{
						label: "Commission",
						value: fmt(84500),
						icon: BadgePercent
					},
					{
						label: "Settlement",
						value: fmt(126e3),
						icon: Landmark
					},
					{
						label: "Retailers",
						value: "18",
						icon: Users
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-sky-500/10 p-2 text-sky-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-2xl font-semibold",
						children: item.value
					})]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Retailer requests"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: transactions.slice(0, 4).map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: tx.customer
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									tx.type,
									" · ",
									tx.reference
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: tx.status === "Pending" ? "secondary" : "default",
								children: tx.status
							})]
						}, tx.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Quick actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2",
						children: [
							{
								label: "Create Retailer",
								icon: UserPlus,
								to: "/users"
							},
							{
								label: "Retailer Reports",
								icon: FileText,
								to: "/reports"
							},
							{
								label: "Wallet Requests",
								icon: Wallet,
								to: "/wallet"
							},
							{
								label: "Settlement",
								icon: Landmark,
								to: "/settlement"
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "justify-start gap-2",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
							})
						}, item.label))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Notifications"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: notifications.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: item.message
						})]
					}, item.id))
				})]
			})
		]
	});
}
function RetailerDashboard({ name, summary, transactions, notifications, activity, permissions }) {
	const services = [
		{
			title: "Recharge",
			icon: Smartphone,
			gradient: "from-orange-500 to-amber-400",
			desc: "Mobile, DTH & FASTag"
		},
		{
			title: "BBPS",
			icon: Receipt,
			gradient: "from-sky-500 to-cyan-400",
			desc: "Electricity, water, gas"
		},
		{
			title: "AEPS",
			icon: CreditCard,
			gradient: "from-violet-600 to-fuchsia-500",
			desc: "Cash withdrawal & deposit"
		},
		{
			title: "DMT 2",
			icon: Banknote,
			gradient: "from-emerald-500 to-green-400",
			desc: "Bank transfer with approval"
		},
		{
			title: "Money Transfer",
			icon: Send,
			gradient: "from-emerald-500 to-green-400",
			desc: "DMT, IMPS, NEFT"
		},
		{
			title: "Travel",
			icon: Briefcase,
			gradient: "from-pink-500 to-rose-400",
			desc: "Bus, rail & flights"
		},
		{
			title: "Insurance",
			icon: ShieldCheck,
			gradient: "from-indigo-500 to-blue-400",
			desc: "Health, motor, LIC"
		},
		{
			title: "PAN",
			icon: FileText,
			gradient: "from-slate-700 to-slate-500",
			desc: "Cards & correction"
		},
		{
			title: "Wallet",
			icon: Wallet,
			gradient: "from-amber-500 to-orange-500",
			desc: "Transfers & statements"
		},
		{
			title: "Reports",
			icon: Activity,
			gradient: "from-teal-500 to-emerald-400",
			desc: "Daily & monthly"
		},
		{
			title: "Support",
			icon: Bell,
			gradient: "from-rose-500 to-pink-400",
			desc: "Tickets & alerts"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
				title: "Retailer Home",
				subtitle: `Welcome back, ${name}. Launch services instantly from your business dashboard.`,
				accent: "from-rose-600 to-orange-500"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						label: "Wallet Balance",
						value: fmt(124500),
						icon: Wallet
					},
					{
						label: "Today Revenue",
						value: fmt(37500),
						icon: TrendingUp
					},
					{
						label: "Pending Settlements",
						value: fmt(12800),
						icon: Landmark
					},
					{
						label: "Open Tickets",
						value: "3",
						icon: Bell
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-rose-500/10 p-2 text-rose-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-2xl font-semibold",
						children: item.value
					})]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
				children: services.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					whileHover: {
						y: -4,
						scale: 1.01
					},
					transition: { duration: .2 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: service.title === "Recharge" ? "/recharge" : service.title === "BBPS" ? "/bbps" : service.title === "AEPS" ? "/aeps" : service.title === "DMT 2" ? "/dmt2" : service.title === "Money Transfer" ? "/dmt" : service.title === "Wallet" ? "/wallet" : service.title === "Reports" ? "/reports" : service.title === "Support" ? "/support" : "/dashboard",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: `overflow-hidden border-0 bg-linear-to-br ${service.gradient} p-0 text-white shadow-lg`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-full flex-col justify-between p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(service.icon, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-semibold",
										children: service.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-white/80",
										children: service.desc
									})]
								})]
							})
						})
					})
				}, service.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Recent transactions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: transactions.slice(0, 4).map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border bg-white/70 p-3 dark:bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: tx.type
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: tx.customer
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: fmt(tx.amount)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: tx.status === "Success" ? "default" : tx.status === "Pending" ? "secondary" : "destructive",
									children: tx.status
								})]
							})]
						}, tx.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Quick launch"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2",
						children: [
							{
								label: "Recharge",
								icon: Smartphone,
								to: "/recharge"
							},
							{
								label: "BBPS",
								icon: Receipt,
								to: "/bbps"
							},
							{
								label: "AEPS",
								icon: CreditCard,
								to: "/aeps"
							},
							{
								label: "DMT 2",
								icon: Banknote,
								to: "/dmt2"
							},
							{
								label: "Wallet",
								icon: Wallet,
								to: "/wallet"
							},
							{
								label: "Support",
								icon: Bell,
								to: "/support"
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "justify-start gap-2",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
							})
						}, item.label))
					})]
				})]
			})
		]
	});
}
function AgentDashboard({ name, summary, transactions, notifications, activity, permissions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
				title: "Agent Quick Desk",
				subtitle: `Welcome back, ${name}. Handle quick cash-outs and recharges with speed.`,
				accent: "from-amber-600 to-orange-500"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						label: "Wallet",
						value: fmt(54e3),
						icon: Wallet
					},
					{
						label: "Quick Recharge",
						value: "24",
						icon: Smartphone
					},
					{
						label: "Quick BBPS",
						value: "11",
						icon: Receipt
					},
					{
						label: "Quick AEPS",
						value: "7",
						icon: CreditCard
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-amber-500/10 p-2 text-amber-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-2xl font-semibold",
						children: item.value
					})]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Recent transactions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: transactions.slice(0, 5).map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: tx.customer
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: tx.type
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: fmt(tx.amount)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: tx.status })]
							})]
						}, tx.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Quick actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2",
						children: [
							{
								label: "Quick Recharge",
								icon: Smartphone,
								to: "/recharge"
							},
							{
								label: "Quick BBPS",
								icon: Receipt,
								to: "/bbps"
							},
							{
								label: "Quick AEPS",
								icon: CreditCard,
								to: "/aeps"
							},
							{
								label: "DMT 2",
								icon: Banknote,
								to: "/dmt2"
							},
							{
								label: "Wallet",
								icon: Wallet,
								to: "/wallet"
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "justify-start gap-2",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
							})
						}, item.label))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Notifications"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: notifications.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: item.message
						})]
					}, item.id))
				})]
			})
		]
	});
}
function Hero({ title, subtitle, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			y: 6
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: `overflow-hidden rounded-3xl bg-linear-to-r ${accent} p-6 text-white shadow-lg`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-white/80",
				children: subtitle
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), " Live business portal"]
			})]
		})
	});
}
function DashboardPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleDashboard, {});
}
//#endregion
export { DashboardPage as component };
