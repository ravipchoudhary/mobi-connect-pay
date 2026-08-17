import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  Zap,
  KeyRound,
  UserCircle2,
  Loader2,
  ArrowLeft,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { sendMobileOtp, verifyMobileOtp } from "@/lib/otp.functions";
import { loginWithUsernamePassword, verifyEmailOtp, resendEmailOtp } from "@/lib/username.functions";
import { getLocalSession, isLocalSessionRecentlyCleared, setLocalSession, findLocalUserById, clearLocalSession, upsertLocalUserRecord, type LocalUserRecord } from "@/lib/local-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const session = getLocalSession();
      if (session?.userId) {
        const validUser = findLocalUserById(session.userId);
        if (validUser) {
          if (!isLocalSessionRecentlyCleared()) {
            throw redirect({ to: "/dashboard" });
          }
        } else {
          clearLocalSession();
        }
      }
    }
  },
});

type MobileStep = "mobile" | "otp" | "name";
type UsernameStep = "credentials" | "verify-otp";

const mobileSchema = z.string().regex(/^[6-9]\d{9}$/u, "Enter a valid 10-digit Indian mobile number");

function AuthPage() {
  const navigate = useNavigate();
  const send = useServerFn(sendMobileOtp);
  const verify = useServerFn(verifyMobileOtp);
  const loginPassword = useServerFn(loginWithUsernamePassword);
  const verifyOtp = useServerFn(verifyEmailOtp);
  const resendOtp = useServerFn(resendEmailOtp);

  // Mobile flow state
  const [mobileStep, setMobileStep] = useState<MobileStep>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  
  // Username flow state
  const [usernameStep, setUsernameStep] = useState<UsernameStep>("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [emailOtp, setEmailOtp] = useState("");
  
  // Common state
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const persistAuthSession = (userId: string, role?: string, profile?: LocalUserRecord) => {
    if (profile) {
      upsertLocalUserRecord(profile);
    }
    setLocalSession(userId, role as any);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const localSession = getLocalSession();
    const recentlyCleared = isLocalSessionRecentlyCleared();

    if (!recentlyCleared && localSession?.userId) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [navigate]);

  // Mobile OTP countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // MOBILE OTP FLOW
  const handleSendOtp = async (isResend = false) => {
    const parsed = mobileSchema.safeParse(mobile);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    try {
      const res = await send({ data: { mobile } });
      setDevOtp(res.devOtp ?? null);
      setResendIn(30);
      if (!isResend) setMobileStep("otp");
      toast.success(`OTP sent to +91 ${mobile}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter the 6-digit OTP");
    setLoading(true);
    try {
      const res = await verify({ data: { mobile, code: otp } });
      persistAuthSession(res.userId, res.role, (res as { user?: LocalUserRecord }).user);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard", replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // USERNAME + EMAIL OTP FLOW
  const handleLoginWithPassword = async () => {
    if (!username.trim()) return toast.error("Enter your username");
    if (!password) return toast.error("Enter your password");

    setLoading(true);
    try {
      const res = await loginPassword({ data: { username: username.trim(), password } });
      
      // Credentials valid, OTP sent
      setOtpSessionId(res.otpSessionId);
      setMaskedEmail(res.maskedEmail);
      setEmailOtp("");
      setResendIn(30);
      setUsernameStep("verify-otp");
      
      toast.success("Verification code sent to your email");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!otpSessionId) return toast.error("Session expired");
    if (emailOtp.length !== 6) return toast.error("Enter the 6-digit code");

    setLoading(true);
    try {
      const res = await verifyOtp({
        data: {
          otpSessionId,
          otp: emailOtp,
        },
      });
      
      persistAuthSession(res.userId, res.role, res.user);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard", replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmailOtp = async () => {
    if (!otpSessionId) return toast.error("Session expired");
    if (resendIn > 0) return;

    setLoading(true);
    try {
      const res = await resendOtp({ data: { otpSessionId } });
      setOtpSessionId(res.otpSessionId);
      setMaskedEmail(res.maskedEmail);
      setEmailOtp("");
      setResendIn(30);
      toast.success("New verification code sent");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCredentials = () => {
    setUsernameStep("credentials");
    setOtpSessionId(null);
    setMaskedEmail(null);
    setEmailOtp("");
    setResendIn(0);
  };

  return (
    <div className="min-h-screen w-full bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      <HeroPanel />
      <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="mobile">Mobile OTP</TabsTrigger>
              <TabsTrigger value="username">Username</TabsTrigger>
            </TabsList>
            
            {/* MOBILE OTP TAB */}
            <TabsContent value="mobile">
              <StepIndicator step={mobileStep} />
              <AnimatePresence mode="wait">
                {mobileStep === "mobile" && (
                  <StepShell key="mobile" title="Sign in to Pay Solution" subtitle="Enter your mobile number to receive a secure OTP.">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile number</Label>
                      <div className="flex items-center rounded-xl border border-input bg-card px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 transition">
                        <span className="text-sm font-medium text-muted-foreground pr-2 border-r border-border">+91</span>
                        <Input
                          id="mobile"
                          inputMode="numeric"
                          autoFocus
                          placeholder="9876543210"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                          className="border-0 bg-transparent focus-visible:ring-0 shadow-none h-12 text-base tracking-wide"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">We'll send a 6-digit code. Message rates may apply.</p>
                    </div>
                    <Button variant="hero" size="xl" className="w-full" disabled={loading} onClick={() => handleSendOtp()}>
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (<>Send OTP <ArrowRight className="h-4 w-4" /></>)}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      By continuing you agree to our <a className="text-primary hover:underline">Terms</a> and <a className="text-primary hover:underline">Privacy Policy</a>.
                    </p>
                  </StepShell>
                )}

                {mobileStep === "otp" && (
                  <StepShell
                    key="otp"
                    title="Verify OTP"
                    subtitle={<>Enter the 6-digit code sent to <span className="font-medium text-foreground">+91 {mobile}</span></>}
                  >
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot key={i} index={i} className="h-14 w-12 text-lg" />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {devOtp && (
                      <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-center text-xs text-muted-foreground">
                        Dev preview OTP: <span className="font-mono font-semibold text-primary">{devOtp}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <button type="button" className="text-muted-foreground hover:text-foreground transition" onClick={() => setMobileStep("mobile")}>Change number</button>
                      <button type="button" disabled={resendIn > 0} onClick={() => handleSendOtp(true)} className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline">
                        {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                      </button>
                    </div>
                    <Button variant="hero" size="xl" className="w-full" disabled={loading} onClick={handleVerifyMobileOtp}>
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Continue"}
                    </Button>
                  </StepShell>
                )}

                {mobileStep === "name" && (
                  <StepShell key="name" title="Complete your profile" subtitle="Just your name — you can add KYC details from Settings later.">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input id="fullName" autoFocus placeholder="Rohan Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-12" />
                    </div>
                    <Button variant="hero" size="xl" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (<>Finish <ArrowRight className="h-4 w-4" /></>)}
                    </Button>
                  </StepShell>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* USERNAME + EMAIL OTP TAB */}
            <TabsContent value="username">
              <AnimatePresence mode="wait">
                {usernameStep === "credentials" && (
                  <StepShell
                    key="credentials"
                    title="Sign in with username"
                    subtitle="For admin and staff accounts. Retailers should use Mobile OTP."
                  >
                    <div className="space-y-2">
                      <Label htmlFor="uname">Username</Label>
                      <Input
                        id="uname"
                        autoComplete="username"
                        autoFocus
                        placeholder="superadmin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pwd">Password</Label>
                      <Input
                        id="pwd"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLoginWithPassword()}
                        className="h-12"
                      />
                    </div>
                    <Button variant="hero" size="xl" className="w-full" disabled={loading} onClick={handleLoginWithPassword}>
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (<>Sign in <ArrowRight className="h-4 w-4" /></>)}
                    </Button>
                  </StepShell>
                )}

                {usernameStep === "verify-otp" && maskedEmail && (
                  <StepShell
                    key="verify-otp"
                    title="Verify Your Email"
                    subtitle={<>We've sent a verification code to <span className="font-medium text-foreground">{maskedEmail}</span></>}
                  >
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={emailOtp} onChange={setEmailOtp}>
                        <InputOTPGroup>
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot key={i} index={i} className="h-14 w-12 text-lg" />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      Check your registered email for the 6-digit verification code
                    </p>
                    <div className="flex items-center justify-between text-sm pt-4">
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground transition flex items-center gap-1"
                        onClick={handleBackToCredentials}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                      <button
                        type="button"
                        disabled={resendIn > 0}
                        onClick={handleResendEmailOtp}
                        className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline transition"
                      >
                        {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                      </button>
                    </div>
                    <Button variant="hero" size="xl" className="w-full" disabled={loading} onClick={handleVerifyEmailOtp}>
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Continue"}
                    </Button>
                  </StepShell>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]" />
      <div className="relative flex h-full flex-col justify-between p-14 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur-md"><Sparkles className="h-5 w-5" /></div>
          <div className="text-lg font-semibold tracking-tight">Pay Solution</div>
        </div>
        <div className="max-w-lg space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">The premium fintech dashboard for modern payments.</h1>
          <p className="text-base text-white/80">Recharge, BBPS, AEPS, DMT, Wallet, Settlements, and Commission — one beautiful platform. Secure by default with mobile OTP.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Wallet, label: "Instant Settlements" },
              { icon: ShieldCheck, label: "Bank-grade Security" },
              { icon: Zap, label: "99.99% API Uptime" },
              { icon: Smartphone, label: "OTP-only Login" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-md">
                <f.icon className="h-4 w-4 text-white/90" />
                <span className="text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-white/60">© {new Date().getFullYear()} Pay Solution. All rights reserved.</div>
      </div>
    </div>
  );
}

function StepIndicator({ step }: { step: MobileStep }) {
  const steps: { key: MobileStep; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "mobile", label: "Mobile", icon: Smartphone },
    { key: "otp", label: "OTP", icon: KeyRound },
    { key: "name", label: "Profile", icon: UserCircle2 },
  ];
  const activeIdx = steps.findIndex((s) => s.key === step);
  return (
    <div className="mb-8 flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={s.key} className="flex flex-1 items-center gap-2">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${active ? "border-primary bg-primary text-primary-foreground shadow-glow" : done ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"}`}>
              <s.icon className="h-4 w-4" />
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 flex-1 rounded-full transition ${done ? "bg-primary" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28, ease: "easeOut" }} className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </motion.div>
  );
}
