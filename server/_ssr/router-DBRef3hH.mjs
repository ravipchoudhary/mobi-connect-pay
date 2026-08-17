import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as getLocalSession, i as clearLocalSession, p as isLocalSessionRecentlyCleared, s as findLocalUserById } from "./local-store-Z9jySGIS.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DBRef3hH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DSREtahm.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Please try again or head back to the dashboard."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$23 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Pay Solution — Premium Fintech Dashboard" },
			{
				name: "description",
				content: "Pay Solution is a premium fintech platform for Recharge, BBPS, AEPS, DMT, Wallet and Settlements. Secure Mobile OTP login."
			},
			{
				property: "og:title",
				content: "Pay Solution — Premium Fintech Dashboard"
			},
			{
				property: "og:description",
				content: "Recharge, BBPS, AEPS, DMT, Wallet & Settlements — all in one premium dashboard."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Pay Solution — Premium Fintech Dashboard"
			},
			{
				name: "description",
				content: "Pay Solution is a premium fintech platform for Recharge, BBPS, AEPS, DMT, Wallet and Settlements. Secure Mobile OTP login."
			},
			{
				property: "og:description",
				content: "Pay Solution is a premium fintech platform for Recharge, BBPS, AEPS, DMT, Wallet and Settlements. Secure Mobile OTP login."
			},
			{
				name: "twitter:description",
				content: "Pay Solution is a premium fintech platform for Recharge, BBPS, AEPS, DMT, Wallet and Settlements. Secure Mobile OTP login."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f6adf328-cfb7-4bf3-9b7a-7b15e4989d5d/id-preview-bcb21ba7--ab000d2a-13df-4f39-935a-bcb31640ad14.lovable.app-1783418890844.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f6adf328-cfb7-4bf3-9b7a-7b15e4989d5d/id-preview-bcb21ba7--ab000d2a-13df-4f39-935a-bcb31640ad14.lovable.app-1783418890844.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$23.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$21 = () => import("./auth-dx9fq3s_.mjs");
var Route$22 = createFileRoute("/auth")({
	component: lazyRouteComponent($$splitComponentImporter$21, "component"),
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			const session = getLocalSession();
			if (session?.userId) if (findLocalUserById(session.userId)) {
				if (!isLocalSessionRecentlyCleared()) throw redirect({ to: "/dashboard" });
			} else clearLocalSession();
		}
	}
});
var $$splitComponentImporter$20 = () => import("../_app-CtNrdaIK.mjs");
var Route$21 = createFileRoute("/_app")({
	component: lazyRouteComponent($$splitComponentImporter$20, "component"),
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			const session = getLocalSession();
			if (!(session?.userId && findLocalUserById(session.userId))) throw redirect({ to: "/auth" });
		}
	}
});
var Route$20 = createFileRoute("/")({ beforeLoad: () => {
	if (typeof window !== "undefined") {
		const session = getLocalSession();
		throw redirect({ to: session?.userId && findLocalUserById(session.userId) ? "/dashboard" : "/auth" });
	}
	throw redirect({ to: "/auth" });
} });
var $$splitComponentImporter$19 = () => import("../_app.wallet-DUfJD0CY.mjs");
var Route$19 = createFileRoute("/_app/wallet")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("../_app.users-BEOd4sXK.mjs");
var Route$18 = createFileRoute("/_app/users")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("../_app.support-a1QA4fY7.mjs");
var Route$17 = createFileRoute("/_app/support")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("../_app.settlement-DMD0TUWp.mjs");
var Route$16 = createFileRoute("/_app/settlement")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("../_app.settings-BZWc7Oe0.mjs");
var Route$15 = createFileRoute("/_app/settings")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("../_app.roles-Ccs3I5b4.mjs");
var Route$14 = createFileRoute("/_app/roles")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("../_app.reports-B3Wz2WrS.mjs");
var Route$13 = createFileRoute("/_app/reports")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("../_app.recharge-Ky6vb_hw.mjs");
var Route$12 = createFileRoute("/_app/recharge")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("../_app.notifications-BVxEbOtK.mjs");
var Route$11 = createFileRoute("/_app/notifications")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("../_app.kyc-BYWxJFL4.mjs");
var Route$10 = createFileRoute("/_app/kyc")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("../_app.dmt2-DT5lsPNy.mjs");
var Route$9 = createFileRoute("/_app/dmt2")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("../_app.dmt-BsgxE2E2.mjs");
var Route$8 = createFileRoute("/_app/dmt")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("../_app.dashboard-CQVfI2rM.mjs");
var Route$7 = createFileRoute("/_app/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("../_app.credit-retailer-D0dCI_5L.mjs");
var Route$6 = createFileRoute("/_app/credit-retailer")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("../_app.commission-CqkiQENd.mjs");
var Route$5 = createFileRoute("/_app/commission")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("../_app.bbps-CDQtdhPW.mjs");
var Route$4 = createFileRoute("/_app/bbps")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("../_app.audit-logs-B0yVehAH.mjs");
var Route$3 = createFileRoute("/_app/audit-logs")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("../_app.api-management-vsBu5H5a.mjs");
var Route$2 = createFileRoute("/_app/api-management")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("../_app.aeps-B0WlSsDt.mjs");
var Route$1 = createFileRoute("/_app/aeps")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("../_app.activity-DCM9hA7h.mjs");
var Route = createFileRoute("/_app/activity")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var AuthRoute = Route$22.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$23
});
var AppRoute = Route$21.update({
	id: "/_app",
	getParentRoute: () => Route$23
});
var IndexRoute = Route$20.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$23
});
var AppWalletRoute = Route$19.update({
	id: "/wallet",
	path: "/wallet",
	getParentRoute: () => AppRoute
});
var AppUsersRoute = Route$18.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AppRoute
});
var AppSupportRoute = Route$17.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => AppRoute
});
var AppSettlementRoute = Route$16.update({
	id: "/settlement",
	path: "/settlement",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$15.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppRolesRoute = Route$14.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => AppRoute
});
var AppReportsRoute = Route$13.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AppRoute
});
var AppRechargeRoute = Route$12.update({
	id: "/recharge",
	path: "/recharge",
	getParentRoute: () => AppRoute
});
var AppNotificationsRoute = Route$11.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AppRoute
});
var AppKycRoute = Route$10.update({
	id: "/kyc",
	path: "/kyc",
	getParentRoute: () => AppRoute
});
var AppDmt2Route = Route$9.update({
	id: "/dmt2",
	path: "/dmt2",
	getParentRoute: () => AppRoute
});
var AppDmtRoute = Route$8.update({
	id: "/dmt",
	path: "/dmt",
	getParentRoute: () => AppRoute
});
var AppDashboardRoute = Route$7.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRoute
});
var AppCreditRetailerRoute = Route$6.update({
	id: "/credit-retailer",
	path: "/credit-retailer",
	getParentRoute: () => AppRoute
});
var AppCommissionRoute = Route$5.update({
	id: "/commission",
	path: "/commission",
	getParentRoute: () => AppRoute
});
var AppBbpsRoute = Route$4.update({
	id: "/bbps",
	path: "/bbps",
	getParentRoute: () => AppRoute
});
var AppAuditLogsRoute = Route$3.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => AppRoute
});
var AppApiManagementRoute = Route$2.update({
	id: "/api-management",
	path: "/api-management",
	getParentRoute: () => AppRoute
});
var AppAepsRoute = Route$1.update({
	id: "/aeps",
	path: "/aeps",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppActivityRoute: Route.update({
		id: "/activity",
		path: "/activity",
		getParentRoute: () => AppRoute
	}),
	AppAepsRoute,
	AppApiManagementRoute,
	AppAuditLogsRoute,
	AppBbpsRoute,
	AppCommissionRoute,
	AppCreditRetailerRoute,
	AppDashboardRoute,
	AppDmtRoute,
	AppDmt2Route,
	AppKycRoute,
	AppNotificationsRoute,
	AppRechargeRoute,
	AppReportsRoute,
	AppRolesRoute,
	AppSettingsRoute,
	AppSettlementRoute,
	AppSupportRoute,
	AppUsersRoute,
	AppWalletRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	AuthRoute
};
var routeTree = Route$23._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
