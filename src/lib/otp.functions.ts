import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listLocalUsers, setLocalSession } from "@/lib/local-store";

const MOBILE_RE = /^[6-9]\d{9}$/;
const OTP_TTL_MS = 5 * 60_000;
const RESEND_MS = 30_000;
const MAX_ATTEMPTS = 5;
const exposeDevOtp = process.env.ALLOW_DEV_OTP !== "false";

interface OtpRecord {
  mobile: string;
  code: string;
  expires_at: number;
  attempts: number;
}

// Simple in-memory OTP storage (in production, use database)
const otpStore = new Map<string, OtpRecord>();

function makeEmail(mobile: string) {
  return `${mobile}@paysol.local`;
}

function generateOtpCode() {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return String(100000 + (values[0] % 900000)).padStart(6, "0");
  }

  throw new Error("Unable to generate a secure OTP. Please try again later.");
}

export const sendMobileOtp = createServerFn({ method: "POST" })
  .validator((raw) => z.object({ mobile: z.string().regex(MOBILE_RE) }).parse(raw))
  .handler(async ({ data }) => {
    const user = listLocalUsers().find((u) => u.mobile === data.mobile);
    if (!user) {
      throw new Error("This mobile is not registered. Ask your distributor/admin to create your account.");
    }
    if (user.status !== "active") {
      throw new Error("Account is inactive. Contact your administrator.");
    }

    // Rate-limit resend
    const recent = otpStore.get(data.mobile);
    if (recent && recent.expires_at > Date.now()) {
      const elapsed = Date.now() - (recent.expires_at - OTP_TTL_MS);
      if (elapsed < RESEND_MS) {
        const wait = Math.ceil((RESEND_MS - elapsed) / 1000);
        throw new Error(`Please wait ${wait}s before requesting a new OTP.`);
      }
    }

    const code = generateOtpCode();
    otpStore.set(data.mobile, {
      mobile: data.mobile,
      code,
      expires_at: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });

    // Cleanup old OTPs
    const now = Date.now();
    for (const [mobile, record] of otpStore) {
      if (record.expires_at < now) {
        otpStore.delete(mobile);
      }
    }

    return { ok: true as const, devOtp: exposeDevOtp ? code : undefined, smsSent: false };
  });

export const verifyMobileOtp = createServerFn({ method: "POST" })
  .validator((raw) =>
    z
      .object({
        mobile: z.string().regex(MOBILE_RE),
        code: z.string().regex(/^\d{6}$/),
        fullName: z.string().trim().max(80).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    const user = listLocalUsers().find((u) => u.mobile === data.mobile);
    if (!user) {
      throw new Error("This mobile is not registered. Ask your distributor/admin to create your account.");
    }

    const otpRec = otpStore.get(data.mobile);
    if (!otpRec || otpRec.expires_at <= Date.now()) {
      throw new Error("Please request a new OTP.");
    }
    if (otpRec.attempts >= MAX_ATTEMPTS) {
      throw new Error("Too many attempts. Please request a new OTP.");
    }
    if (otpRec.code !== data.code) {
      otpRec.attempts++;
      throw new Error(`Invalid OTP. ${MAX_ATTEMPTS - otpRec.attempts} attempts remaining.`);
    }

    // Consume OTP
    otpStore.delete(data.mobile);

    // Set local session
    setLocalSession(user.id, user.roles[0] as any);

    const email = user.email ?? makeEmail(data.mobile);
    return {
      ok: true as const,
      userId: user.id,
      email,
      role: user.roles[0],
      user: { ...user, password: undefined },
    };
  });
