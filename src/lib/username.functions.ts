import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  listLocalUsers,
  setLocalSession,
  verifyLocalUserPassword,
  createOtpSession,
  getOtpSessionByUserId,
  verifyOtpInSession,
  invalidateOtpSession,
  getOtpSession,
  cleanupExpiredOtpSessions,
} from "@/lib/local-store";
import { sendEmail, generateOtpEmailHtml, generateOtpEmailText } from "@/lib/email.service";

const FALLBACK_EMAILS: Record<string, string> = {
  ravipchy: "info@paysol.in",
  ravi: "info@paysol.in",
  admin: "info@paysol.in",
  superadmin: "info@paysol.in",
};

// For demo purposes, all usernames accept password "password"
const DEMO_PASSWORD = "password";

function generateOtpCode(): string {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return String(100000 + (values[0] % 900000)).padStart(6, "0");
  }
  throw new Error("Unable to generate a secure OTP. Please try again later.");
}

export const resolveUsernameEmail = createServerFn({ method: "POST" })
  .validator((raw) =>
    z.object({ username: z.string().trim().min(2).max(40) }).parse(raw),
  )
  .handler(async ({ data }) => {
    const rawValue = data.username.trim();
    const normalized = rawValue.toLowerCase();

    if (normalized.includes("@")) {
      return { email: normalized };
    }

    const user = listLocalUsers().find((u) => u.username?.toLowerCase() === normalized);
    if (user?.email) {
      return { email: user.email };
    }

    const fallbackEmail = FALLBACK_EMAILS[normalized];
    if (fallbackEmail) {
      return { email: fallbackEmail };
    }

    throw new Error("Invalid username or password.");
  });

/**
 * Step 1: Verify username and password
 * If credentials are valid, generate and send OTP to user's registered email
 * Returns OTP session ID and masked email (NOT the authenticated session)
 */
export const loginWithUsernamePassword = createServerFn({ method: "POST" })
  .validator((raw) =>
    z.object({
      username: z.string().trim().min(2).max(40),
      password: z.string().min(1),
    }).parse(raw),
  )
  .handler(async ({ data }) => {
    const rawValue = data.username.trim();
    const normalized = rawValue.toLowerCase();

    let user = listLocalUsers().find((u) => u.username?.toLowerCase() === normalized);

    if (!user) {
      // Check if it's an email that matches a user
      user = listLocalUsers().find((u) => u.email?.toLowerCase() === normalized);
    }

    if (!user) {
      throw new Error("Invalid User ID or Password.");
    }

    // Check if account is active
    if (user.status !== "active") {
      throw new Error("Your account is inactive. Please contact your administrator.");
    }

    // Validate password
    const validPassword = user.password && user.password.length > 0
      ? await verifyLocalUserPassword(user, data.password)
      : data.password === DEMO_PASSWORD;

    if (!validPassword) {
      throw new Error("Invalid User ID or Password.");
    }

    // Credentials are valid - now generate OTP
    const email = user.email;
    if (!email) {
      throw new Error("Registered email address is not available. Please contact your administrator.");
    }

    console.log(`\n🔐 [LOGIN] Starting OTP flow for user: ${user.username}`);

    // Check for existing OTP session for this user and invalidate it
    const existingSession = getOtpSessionByUserId(user.id);
    if (existingSession) {
      console.log(`⚠️  [OTP] Invalidating existing session for user`);
      invalidateOtpSession(existingSession.id);
    }

    // Generate OTP
    console.log(`📍 [OTP] Generating 6-digit OTP...`);
    const otp = generateOtpCode();
    console.log(`✅ [OTP] Generated OTP: ${otp}`);

    // Create OTP session
    console.log(`💾 [OTP] Creating OTP session in local-store...`);
    const otpSession = await createOtpSession(user.id, email, otp, {
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    });
    console.log(`✅ [OTP] Session created with ID: ${otpSession.id}`);

    // Send OTP email
    console.log(`📧 [EMAIL] Preparing email template...`);
    const emailHtml = generateOtpEmailHtml(otp, otpSession.maskedEmail, 5);
    const emailText = generateOtpEmailText(otp, otpSession.maskedEmail, 5);

    console.log(`📤 [EMAIL] Sending OTP email to: ${email}`);
    const emailResult = await sendEmail({
      to: email,
      subject: "Login Verification Code - Pay Solution",
      html: emailHtml,
      text: emailText,
    });

    if (!emailResult.success) {
      // Clean up OTP session if email failed
      console.error(`❌ [EMAIL] Failed to send email: ${emailResult.error}`);
      invalidateOtpSession(otpSession.id);
      throw new Error("Unable to send verification code. Please try again or contact the administrator.");
    }

    console.log(`✅ [EMAIL] Email sent successfully! Message ID: ${emailResult.messageId}\n`);

    // Return OTP session info (NOT the authenticated session)
    return {
      ok: true as const,
      requiresOtp: true,
      otpSessionId: otpSession.id,
      maskedEmail: otpSession.maskedEmail,
      userId: user.id,
    };
  });

/**
 * Step 2: Verify OTP and create authenticated session
 * This endpoint is called after the user enters the OTP from their email
 */
export const verifyEmailOtp = createServerFn({ method: "POST" })
  .validator((raw) =>
    z.object({
      otpSessionId: z.string().min(1),
      otp: z.string().regex(/^\d{6}$/),
    }).parse(raw),
  )
  .handler(async ({ data }) => {
    // Clean up expired sessions periodically
    cleanupExpiredOtpSessions();

    const session = getOtpSession(data.otpSessionId);

    if (!session) {
      throw new Error("OTP session expired. Please request a new OTP.");
    }

    if (session.verifiedAt !== null) {
      throw new Error("This OTP session has already been verified. Please request a new OTP.");
    }

    if (session.expiresAt <= Date.now()) {
      invalidateOtpSession(data.otpSessionId);
      throw new Error("OTP has expired. Please request a new OTP.");
    }

    if (session.attempts >= session.maxAttempts) {
      invalidateOtpSession(data.otpSessionId);
      throw new Error("Too many incorrect attempts. Please request a new OTP.");
    }

    // Verify OTP
    const isValid = await verifyOtpInSession(data.otpSessionId, data.otp);

    if (!isValid) {
      const updatedSession = getOtpSession(data.otpSessionId);
      if (updatedSession && updatedSession.attempts >= updatedSession.maxAttempts) {
        invalidateOtpSession(data.otpSessionId);
        throw new Error("Too many incorrect attempts. Please request a new OTP.");
      }
      const remaining = updatedSession ? updatedSession.maxAttempts - updatedSession.attempts : 0;
      throw new Error(`Invalid OTP. Please try again. (${remaining} attempts remaining)`);
    }

    // OTP verified - get user and create authenticated session
    const user = listLocalUsers().find((u) => u.id === session.userId);
    if (!user) {
      invalidateOtpSession(data.otpSessionId);
      throw new Error("User not found. Please log in again.");
    }

    // Create authenticated session
    setLocalSession(user.id, user.roles[0] as any);

    return {
      ok: true as const,
      userId: user.id,
      email: user.email,
      name: user.full_name,
      role: user.roles[0],
      user: { ...user, password: undefined },
    };
  });

/**
 * Resend OTP to user's email
 */
export const resendEmailOtp = createServerFn({ method: "POST" })
  .validator((raw) =>
    z.object({
      otpSessionId: z.string().min(1),
    }).parse(raw),
  )
  .handler(async ({ data }) => {
    const session = getOtpSession(data.otpSessionId);

    if (!session) {
      throw new Error("OTP session expired. Please request a new OTP.");
    }

    if (session.verifiedAt !== null) {
      throw new Error("This OTP session has already been verified. Please log in again.");
    }

    if (session.expiresAt <= Date.now()) {
      invalidateOtpSession(data.otpSessionId);
      throw new Error("OTP session expired. Please request a new OTP.");
    }

    // Check if resend cooldown has passed
    if (session.resendCooldownUntil > Date.now()) {
      const waitSeconds = Math.ceil((session.resendCooldownUntil - Date.now()) / 1000);
      throw new Error(`Please wait ${waitSeconds}s before requesting another OTP.`);
    }

    // Generate new OTP
    const otp = generateOtpCode();

    // Update session with new OTP
    invalidateOtpSession(data.otpSessionId);
    const newSession = await createOtpSession(session.userId, session.email, otp, {
      userAgent: session.userAgent,
    });

    // Send OTP email
    const emailHtml = generateOtpEmailHtml(otp, newSession.maskedEmail, 5);
    const emailText = generateOtpEmailText(otp, newSession.maskedEmail, 5);

    const emailResult = await sendEmail({
      to: session.email,
      subject: "Login Verification Code - Pay Solution",
      html: emailHtml,
      text: emailText,
    });

    if (!emailResult.success) {
      invalidateOtpSession(newSession.id);
      throw new Error("Unable to send verification code. Please try again or contact the administrator.");
    }

    return {
      ok: true as const,
      otpSessionId: newSession.id,
      maskedEmail: newSession.maskedEmail,
    };
  });

/**
 * Legacy: Direct username/password login without OTP (for backward compatibility)
 * This is kept for testing purposes only
 */
export const verifyUsernamePassword = createServerFn({ method: "POST" })
  .validator((raw) =>
    z.object({ username: z.string().trim().min(2).max(40), password: z.string().min(1) }).parse(raw),
  )
  .handler(async ({ data }) => {
    // For now, redirect to new OTP flow
    return loginWithUsernamePassword({ data });
  });
