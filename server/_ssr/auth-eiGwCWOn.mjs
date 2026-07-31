import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-DMJo-YE3.mjs";
import { c as isLocalSessionRecentlyCleared, o as getLocalSession, p as upsertLocalUserRecord, u as setLocalSession } from "./local-store-CFEqhxru.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as LoaderCircle, D as Minus, P as KeyRound, f as Sparkles, h as ShieldCheck, lt as ArrowRight, p as Smartphone, q as CircleUserRound, r as Wallet, t as Zap } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-urnAgQfI.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { n as jt, t as Lt } from "../_libs/input-otp.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-eiGwCWOn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var InputOTP = import_react.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lt, {
	ref,
	containerClassName: cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName),
	className: cn("disabled:cursor-not-allowed", className),
	...props
}));
InputOTP.displayName = "InputOTP";
var InputOTPGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center", className),
	...props
}));
InputOTPGroup.displayName = "InputOTPGroup";
var InputOTPSlot = import_react.forwardRef(({ index, className, ...props }, ref) => {
	const { char, hasFakeCaret, isActive } = import_react.useContext(jt).slots[index];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md", isActive && "z-10 ring-1 ring-ring", className),
		...props,
		children: [char, hasFakeCaret && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" })
		})]
	});
});
InputOTPSlot.displayName = "InputOTPSlot";
var InputOTPSeparator = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	role: "separator",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
}));
InputOTPSeparator.displayName = "InputOTPSeparator";
var MOBILE_RE = /^[6-9]\d{9}$/;
var sendMobileOtp = createServerFn({ method: "POST" }).validator((raw) => objectType({ mobile: stringType().regex(MOBILE_RE) }).parse(raw)).handler(createSsrRpc("dd0c76af6de7f43745617255528a67fe19bd2a9ef12db2cb71b95cde00b53c1a"));
var verifyMobileOtp = createServerFn({ method: "POST" }).validator((raw) => objectType({
	mobile: stringType().regex(MOBILE_RE),
	code: stringType().regex(/^\d{6}$/),
	fullName: stringType().trim().max(80).optional()
}).parse(raw)).handler(createSsrRpc("b6d049347e2289db2fc08d612602f8525efeea75017b812a51117ec28b1bc944"));
createServerFn({ method: "POST" }).validator((raw) => objectType({ username: stringType().trim().min(2).max(40) }).parse(raw)).handler(createSsrRpc("d84ef2ae7d181a250316c94c4d06710b2e1ff702170e90fb7ea7617d835d136e"));
var verifyUsernamePassword = createServerFn({ method: "POST" }).validator((raw) => objectType({
	username: stringType().trim().min(2).max(40),
	password: stringType().min(1)
}).parse(raw)).handler(createSsrRpc("e69806ee8e0970a82b2060d95ade0f3784dc736bb8749e124f493ac23a86c7e4"));
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var mobileSchema = stringType().regex(/^[6-9]\d{9}$/u, "Enter a valid 10-digit Indian mobile number");
function AuthPage() {
	const navigate = useNavigate();
	const send = useServerFn(sendMobileOtp);
	const verify = useServerFn(verifyMobileOtp);
	const verifyPassword = useServerFn(verifyUsernamePassword);
	const [step, setStep] = (0, import_react.useState)("mobile");
	const [mobile, setMobile] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [resendIn, setResendIn] = (0, import_react.useState)(0);
	const [devOtp, setDevOtp] = (0, import_react.useState)(null);
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const persistAuthSession = (userId, role, profile) => {
		if (profile) upsertLocalUserRecord(profile);
		setLocalSession(userId, role);
	};
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const localSession = getLocalSession();
		if (!isLocalSessionRecentlyCleared() && localSession?.userId) navigate({
			to: "/dashboard",
			replace: true
		});
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		if (resendIn <= 0) return;
		const t = setTimeout(() => setResendIn((s) => s - 1), 1e3);
		return () => clearTimeout(t);
	}, [resendIn]);
	const handleSendOtp = async (isResend = false) => {
		const parsed = mobileSchema.safeParse(mobile);
		if (!parsed.success) return toast.error(parsed.error.issues[0].message);
		setLoading(true);
		try {
			const res = await send({ data: { mobile } });
			setDevOtp(res.devOtp ?? null);
			setResendIn(30);
			if (!isResend) setStep("otp");
			toast.success(`OTP sent to +91 ${mobile}`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to send OTP");
		} finally {
			setLoading(false);
		}
	};
	const handleVerifyOtp = async () => {
		if (otp.length !== 6) return toast.error("Enter the 6-digit OTP");
		setLoading(true);
		try {
			const res = await verify({ data: {
				mobile,
				code: otp
			} });
			persistAuthSession(res.userId, res.role, res.user);
			toast.success("Welcome back!");
			navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Verification failed");
		} finally {
			setLoading(false);
		}
	};
	const submitName = async () => {
		if (fullName.trim().length < 2) return toast.error("Enter your full name");
		setLoading(true);
		try {
			toast.success("Account ready");
			navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to save details");
		} finally {
			setLoading(false);
		}
	};
	const submitPassword = async () => {
		if (username.trim().length < 2) return toast.error("Enter your username");
		if (password.length < 6) return toast.error("Enter your password");
		setLoading(true);
		try {
			const res = await verifyPassword({ data: {
				username: username.trim(),
				password
			} });
			persistAuthSession(res.userId, res.role, res.user);
			toast.success("Welcome back!");
			navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Sign-in failed");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen w-full bg-background lg:grid lg:grid-cols-[1.05fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "mobile",
					className: "w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid w-full grid-cols-2 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "mobile",
								children: "Mobile OTP"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "username",
								children: "Username"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "mobile",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepIndicator, { step }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
								mode: "wait",
								children: [
									step === "mobile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepShell, {
										title: "Sign in to Pay Solution",
										subtitle: "Enter your mobile number to receive a secure OTP.",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "mobile",
														children: "Mobile number"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center rounded-xl border border-input bg-card px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 transition",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-sm font-medium text-muted-foreground pr-2 border-r border-border",
															children: "+91"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "mobile",
															inputMode: "numeric",
															autoFocus: true,
															placeholder: "9876543210",
															value: mobile,
															onChange: (e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)),
															onKeyDown: (e) => e.key === "Enter" && handleSendOtp(),
															className: "border-0 bg-transparent focus-visible:ring-0 shadow-none h-12 text-base tracking-wide"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground pt-1",
														children: "We'll send a 6-digit code. Message rates may apply."
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "hero",
												size: "xl",
												className: "w-full",
												disabled: loading,
												onClick: () => handleSendOtp(),
												children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Send OTP ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-center text-xs text-muted-foreground",
												children: [
													"By continuing you agree to our ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														className: "text-primary hover:underline",
														children: "Terms"
													}),
													" and ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														className: "text-primary hover:underline",
														children: "Privacy Policy"
													}),
													"."
												]
											})
										]
									}, "mobile"),
									step === "otp" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepShell, {
										title: "Verify OTP",
										subtitle: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Enter the 6-digit code sent to ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-foreground",
											children: ["+91 ", mobile]
										})] }),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTP, {
													maxLength: 6,
													value: otp,
													onChange: setOtp,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPGroup, { children: [
														0,
														1,
														2,
														3,
														4,
														5
													].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, {
														index: i,
														className: "h-14 w-12 text-lg"
													}, i)) })
												})
											}),
											devOtp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-center text-xs text-muted-foreground",
												children: ["Dev preview OTP: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-semibold text-primary",
													children: devOtp
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "text-muted-foreground hover:text-foreground transition",
													onClick: () => setStep("mobile"),
													children: "Change number"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: resendIn > 0,
													onClick: () => handleSendOtp(true),
													className: "text-primary hover:underline disabled:text-muted-foreground disabled:no-underline",
													children: resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "hero",
												size: "xl",
												className: "w-full",
												disabled: loading,
												onClick: handleVerifyOtp,
												children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "Verify & Continue"
											})
										]
									}, "otp"),
									step === "name" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepShell, {
										title: "Complete your profile",
										subtitle: "Just your name — you can add KYC details from Settings later.",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "fullName",
												children: "Full name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "fullName",
												autoFocus: true,
												placeholder: "Rohan Sharma",
												value: fullName,
												onChange: (e) => setFullName(e.target.value),
												className: "h-12"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "hero",
											size: "xl",
											className: "w-full",
											disabled: loading,
											onClick: submitName,
											children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Finish ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
										})]
									}, "name")
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "username",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepShell, {
								title: "Sign in with username",
								subtitle: "For admin and staff accounts. Retailers should use Mobile OTP.",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "uname",
											children: "Username"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "uname",
											autoComplete: "username",
											placeholder: "ravipchy",
											value: username,
											onChange: (e) => setUsername(e.target.value),
											className: "h-12"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "pwd",
											children: "Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "pwd",
											type: "password",
											autoComplete: "current-password",
											placeholder: "••••••••",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											onKeyDown: (e) => e.key === "Enter" && submitPassword(),
											className: "h-12"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "hero",
										size: "xl",
										className: "w-full",
										disabled: loading,
										onClick: submitPassword,
										children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Sign in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
									})
								]
							})
						})
					]
				})
			})
		})]
	});
}
function HeroPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative hidden overflow-hidden bg-gradient-hero lg:block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex h-full flex-col justify-between p-14 text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-semibold tracking-tight",
						children: "Pay Solution"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-lg space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl font-semibold leading-tight text-white sm:text-5xl",
							children: "The premium fintech dashboard for modern payments."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-white/80",
							children: "Recharge, BBPS, AEPS, DMT, Wallet, Settlements, and Commission — one beautiful platform. Secure by default with mobile OTP."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								{
									icon: Wallet,
									label: "Instant Settlements"
								},
								{
									icon: ShieldCheck,
									label: "Bank-grade Security"
								},
								{
									icon: Zap,
									label: "99.99% API Uptime"
								},
								{
									icon: Smartphone,
									label: "OTP-only Login"
								}
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-4 w-4 text-white/90" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: f.label
								})]
							}, f.label))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-white/60",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Pay Solution. All rights reserved."
					]
				})
			]
		})]
	});
}
function StepIndicator({ step }) {
	const steps = [
		{
			key: "mobile",
			label: "Mobile",
			icon: Smartphone
		},
		{
			key: "otp",
			label: "OTP",
			icon: KeyRound
		},
		{
			key: "name",
			label: "Profile",
			icon: CircleUserRound
		}
	];
	const activeIdx = steps.findIndex((s) => s.key === step);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-8 flex items-center gap-2",
		children: steps.map((s, i) => {
			const done = i < activeIdx;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${i === activeIdx ? "border-primary bg-primary text-primary-foreground shadow-glow" : done ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4" })
				}), i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-0.5 flex-1 rounded-full transition ${done ? "bg-primary" : "bg-border"}` })]
			}, s.key);
		})
	});
}
function StepShell({ title, subtitle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -12
		},
		transition: {
			duration: .28,
			ease: "easeOut"
		},
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-semibold tracking-tight",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: subtitle
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-5",
			children
		})]
	});
}
//#endregion
export { AuthPage as component };
