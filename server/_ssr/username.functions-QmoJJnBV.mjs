import { o as __toESM } from "../_runtime.mjs";
import { b as verifyOtpInSession, d as getOtpSessionByUserId, f as invalidateOtpSession, h as setLocalSession, m as listLocalUsers, o as createOtpSession, r as cleanupExpiredOtpSessions, u as getOtpSession, y as verifyLocalUserPassword } from "./local-store-Z9jySGIS.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/username.functions-QmoJJnBV.js
function shouldUseDevEmailMode() {
	const allowDevEmail = process.env.ALLOW_DEV_EMAIL;
	if (allowDevEmail !== void 0) return allowDevEmail.trim().toLowerCase() === "true";
	return false;
}
var DEV_MODE = shouldUseDevEmailMode();
var EMAIL_LOG = [];
async function sendEmail(options) {
	const zohoHost = process.env.ZOHO_SMTP_HOST;
	const zohoPort = process.env.ZOHO_SMTP_PORT;
	const zohoUser = process.env.ZOHO_SMTP_USER;
	const zohoPassword = process.env.ZOHO_SMTP_PASSWORD;
	const zohoFromEmail = process.env.ZOHO_FROM_EMAIL;
	const zohoFromName = process.env.ZOHO_FROM_NAME || "Pay Solution";
	console.log("\n╔════════════════════════════════════════════════════════════╗");
	console.log("║               📧 OTP EMAIL SERVICE LOG                     ║");
	console.log("╠════════════════════════════════════════════════════════════╣");
	console.log(`║ MODE: ${DEV_MODE ? "DEVELOPMENT (Console Logging)" : "PRODUCTION (Sending Email)".padEnd(50)} ║`);
	console.log(`║ To: ${options.to.padEnd(54)} ║`);
	console.log(`║ Subject: ${options.subject.padEnd(50)} ║`);
	const otpMatch = options.html.match(/(\d{6})/);
	const otp = otpMatch ? otpMatch[1] : "N/A";
	console.log(`║ OTP Code: ${otp.padEnd(49)} ║`);
	console.log("╠════════════════════════════════════════════════════════════╣");
	console.log(`║ ZOHO_SMTP_HOST: ${(zohoHost || "NOT SET").padEnd(43)} ║`);
	console.log(`║ ZOHO_SMTP_PORT: ${(zohoPort || "NOT SET").padEnd(43)} ║`);
	console.log(`║ ZOHO_SMTP_USER: ${(zohoUser || "NOT SET").substring(0, 43).padEnd(43)} ║`);
	console.log(`║ ZOHO_FROM_EMAIL: ${(zohoFromEmail || "NOT SET").substring(0, 41).padEnd(41)} ║`);
	console.log(`║ ALLOW_DEV_EMAIL: ${(process.env.ALLOW_DEV_EMAIL || "NOT SET").padEnd(41)} ║`);
	console.log(`║ NODE_ENV: ${"production".padEnd(48)} ║`);
	console.log("╚════════════════════════════════════════════════════════════╝\n");
	if (DEV_MODE || !zohoHost || !zohoPort || !zohoUser || !zohoPassword || !zohoFromEmail) {
		console.log(`✅ [DEV MODE] Email logged to console instead of sending\n`);
		EMAIL_LOG.push(options);
		return {
			success: true,
			messageId: `dev-${Date.now()}`
		};
	}
	try {
		const nodemailer = await import("../_libs/_.mjs").then((m) => /* @__PURE__ */ __toESM(m.default));
		const smtpPort = Number(zohoPort);
		return {
			success: true,
			messageId: (await nodemailer.default.createTransport({
				host: zohoHost,
				port: smtpPort,
				secure: smtpPort === 465,
				requireTLS: smtpPort === 587,
				tls: smtpPort === 587 ? { rejectUnauthorized: false } : void 0,
				auth: {
					user: zohoUser,
					pass: zohoPassword
				}
			}).sendMail({
				from: `"${zohoFromName}" <${zohoFromEmail}>`,
				to: options.to,
				subject: options.subject,
				html: options.html,
				text: options.text
			})).messageId
		};
	} catch (error) {
		console.error("Email send failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send email"
		};
	}
}
function generateOtpEmailHtml(otp, maskedEmail, expiryMinutes = 5) {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Verification Code</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 40px 20px;
            text-align: center;
        }
        .header-logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            padding: 40px 20px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #333;
        }
        .otp-section {
            background-color: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-label {
            font-size: 12px;
            text-transform: uppercase;
            color: #999;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            font-family: "Courier New", monospace;
            letter-spacing: 4px;
            margin: 20px 0;
        }
        .otp-expire {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
        }
        .message {
            font-size: 14px;
            line-height: 1.8;
            color: #555;
            margin: 20px 0;
        }
        .warning {
            background-color: #fef3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 30px 0;
            border-radius: 4px;
            font-size: 13px;
            color: #856404;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-logo">🔐 Pay Solution</div>
            <div>Security & Login Verification</div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello,</div>
            
            <div class="message">
                We've received a login attempt for your Pay Solution account.
                <br><br>
                Your verification code is:
            </div>
            
            <div class="otp-section">
                <div class="otp-label">One-Time Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div class="otp-expire">Valid for ${expiryMinutes} minutes</div>
            </div>
            
            <div class="message">
                If you didn't attempt this login or don't recognize the activity, 
                please contact your administrator immediately for account security.
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <br>
                • Never share this code with anyone
                <br>
                • Our team will never ask for this code
                <br>
                • Each code can only be used once
                <br>
                • This code expires in ${expiryMinutes} minutes
            </div>
            
            <div class="message">
                <strong>Account Details:</strong>
                <br>
                Email: ${maskedEmail}
                <br>
                If this was not you, please secure your account immediately.
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">© ${(/* @__PURE__ */ new Date()).getFullYear()} Pay Solution. All rights reserved.</div>
            <div class="footer-text">This is an automated security email. Please do not reply.</div>
            <div class="footer-text">For support, contact: support@paysolution.local</div>
        </div>
    </div>
</body>
</html>
  `;
}
function generateOtpEmailText(otp, maskedEmail, expiryMinutes = 5) {
	return `
LOGIN VERIFICATION CODE
═══════════════════════════

Hello,

We've received a login attempt for your Pay Solution account.

Your verification code is:

    ${otp}

This code is valid for ${expiryMinutes} minutes.

IMPORTANT SECURITY NOTICE:
- Never share this code with anyone
- Our team will never ask for this code
- Each code can only be used once
- This code expires in ${expiryMinutes} minutes

Account Details:
Email: ${maskedEmail}

If you didn't attempt this login or don't recognize this activity,
please contact your administrator immediately for account security.

---
© ${(/* @__PURE__ */ new Date()).getFullYear()} Pay Solution
This is an automated security email. Please do not reply.
For support, contact: support@paysolution.local
  `;
}
var FALLBACK_EMAILS = {
	ravipchy: "info@paysol.in",
	ravi: "info@paysol.in",
	admin: "info@paysol.in",
	superadmin: "info@paysol.in"
};
var DEMO_PASSWORD = "password";
function generateOtpCode() {
	if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
		const values = /* @__PURE__ */ new Uint32Array(1);
		crypto.getRandomValues(values);
		return String(1e5 + values[0] % 9e5).padStart(6, "0");
	}
	throw new Error("Unable to generate a secure OTP. Please try again later.");
}
var resolveUsernameEmail_createServerFn_handler = createServerRpc({
	id: "d84ef2ae7d181a250316c94c4d06710b2e1ff702170e90fb7ea7617d835d136e",
	name: "resolveUsernameEmail",
	filename: "src/lib/username.functions.ts"
}, (opts) => resolveUsernameEmail.__executeServer(opts));
var resolveUsernameEmail = createServerFn({ method: "POST" }).validator((raw) => objectType({ username: stringType().trim().min(2).max(40) }).parse(raw)).handler(resolveUsernameEmail_createServerFn_handler, async ({ data }) => {
	const normalized = data.username.trim().toLowerCase();
	if (normalized.includes("@")) return { email: normalized };
	const user = listLocalUsers().find((u) => u.username?.toLowerCase() === normalized);
	if (user?.email) return { email: user.email };
	const fallbackEmail = FALLBACK_EMAILS[normalized];
	if (fallbackEmail) return { email: fallbackEmail };
	throw new Error("Invalid username or password.");
});
var loginWithUsernamePassword_createServerFn_handler = createServerRpc({
	id: "81dbad7b2ffad52fa09738a89de82b0c8f80a7404299f2caf339d59418f4cd7e",
	name: "loginWithUsernamePassword",
	filename: "src/lib/username.functions.ts"
}, (opts) => loginWithUsernamePassword.__executeServer(opts));
var loginWithUsernamePassword = createServerFn({ method: "POST" }).validator((raw) => objectType({
	username: stringType().trim().min(2).max(40),
	password: stringType().min(1)
}).parse(raw)).handler(loginWithUsernamePassword_createServerFn_handler, async ({ data }) => {
	const normalized = data.username.trim().toLowerCase();
	let user = listLocalUsers().find((u) => u.username?.toLowerCase() === normalized);
	if (!user) user = listLocalUsers().find((u) => u.email?.toLowerCase() === normalized);
	if (!user) throw new Error("Invalid User ID or Password.");
	if (user.status !== "active") throw new Error("Your account is inactive. Please contact your administrator.");
	if (!(user.password && user.password.length > 0 ? await verifyLocalUserPassword(user, data.password) : data.password === DEMO_PASSWORD)) throw new Error("Invalid User ID or Password.");
	const email = user.email;
	if (!email) throw new Error("Registered email address is not available. Please contact your administrator.");
	console.log(`\n🔐 [LOGIN] Starting OTP flow for user: ${user.username}`);
	const existingSession = getOtpSessionByUserId(user.id);
	if (existingSession) {
		console.log(`⚠️  [OTP] Invalidating existing session for user`);
		invalidateOtpSession(existingSession.id);
	}
	console.log(`📍 [OTP] Generating 6-digit OTP...`);
	const otp = generateOtpCode();
	console.log(`✅ [OTP] Generated OTP: ${otp}`);
	console.log(`💾 [OTP] Creating OTP session in local-store...`);
	const otpSession = await createOtpSession(user.id, email, otp, { userAgent: typeof navigator !== "undefined" ? navigator.userAgent : void 0 });
	console.log(`✅ [OTP] Session created with ID: ${otpSession.id}`);
	console.log(`📧 [EMAIL] Preparing email template...`);
	const emailHtml = generateOtpEmailHtml(otp, otpSession.maskedEmail, 5);
	const emailText = generateOtpEmailText(otp, otpSession.maskedEmail, 5);
	console.log(`📤 [EMAIL] Sending OTP email to: ${email}`);
	const emailResult = await sendEmail({
		to: email,
		subject: "Login Verification Code - Pay Solution",
		html: emailHtml,
		text: emailText
	});
	if (!emailResult.success) {
		console.error(`❌ [EMAIL] Failed to send email: ${emailResult.error}`);
		invalidateOtpSession(otpSession.id);
		throw new Error("Unable to send verification code. Please try again or contact the administrator.");
	}
	console.log(`✅ [EMAIL] Email sent successfully! Message ID: ${emailResult.messageId}\n`);
	return {
		ok: true,
		requiresOtp: true,
		otpSessionId: otpSession.id,
		maskedEmail: otpSession.maskedEmail,
		userId: user.id
	};
});
var verifyEmailOtp_createServerFn_handler = createServerRpc({
	id: "10a6cf8d71eb513449bfa96cd56e675fff18854ce8c9dbf3c90c61a49ca0d53a",
	name: "verifyEmailOtp",
	filename: "src/lib/username.functions.ts"
}, (opts) => verifyEmailOtp.__executeServer(opts));
var verifyEmailOtp = createServerFn({ method: "POST" }).validator((raw) => objectType({
	otpSessionId: stringType().min(1),
	otp: stringType().regex(/^\d{6}$/)
}).parse(raw)).handler(verifyEmailOtp_createServerFn_handler, async ({ data }) => {
	cleanupExpiredOtpSessions();
	const session = getOtpSession(data.otpSessionId);
	if (!session) throw new Error("OTP session expired. Please request a new OTP.");
	if (session.verifiedAt !== null) throw new Error("This OTP session has already been verified. Please request a new OTP.");
	if (session.expiresAt <= Date.now()) {
		invalidateOtpSession(data.otpSessionId);
		throw new Error("OTP has expired. Please request a new OTP.");
	}
	if (session.attempts >= session.maxAttempts) {
		invalidateOtpSession(data.otpSessionId);
		throw new Error("Too many incorrect attempts. Please request a new OTP.");
	}
	if (!await verifyOtpInSession(data.otpSessionId, data.otp)) {
		const updatedSession = getOtpSession(data.otpSessionId);
		if (updatedSession && updatedSession.attempts >= updatedSession.maxAttempts) {
			invalidateOtpSession(data.otpSessionId);
			throw new Error("Too many incorrect attempts. Please request a new OTP.");
		}
		const remaining = updatedSession ? updatedSession.maxAttempts - updatedSession.attempts : 0;
		throw new Error(`Invalid OTP. Please try again. (${remaining} attempts remaining)`);
	}
	const user = listLocalUsers().find((u) => u.id === session.userId);
	if (!user) {
		invalidateOtpSession(data.otpSessionId);
		throw new Error("User not found. Please log in again.");
	}
	setLocalSession(user.id, user.roles[0]);
	return {
		ok: true,
		userId: user.id,
		email: user.email,
		name: user.full_name,
		role: user.roles[0],
		user: {
			...user,
			password: void 0
		}
	};
});
var resendEmailOtp_createServerFn_handler = createServerRpc({
	id: "ff2cb59cf9ba9370b14caa3e7d19df7e32e38ce95f409865464426b7824de84a",
	name: "resendEmailOtp",
	filename: "src/lib/username.functions.ts"
}, (opts) => resendEmailOtp.__executeServer(opts));
var resendEmailOtp = createServerFn({ method: "POST" }).validator((raw) => objectType({ otpSessionId: stringType().min(1) }).parse(raw)).handler(resendEmailOtp_createServerFn_handler, async ({ data }) => {
	const session = getOtpSession(data.otpSessionId);
	if (!session) throw new Error("OTP session expired. Please request a new OTP.");
	if (session.verifiedAt !== null) throw new Error("This OTP session has already been verified. Please log in again.");
	if (session.expiresAt <= Date.now()) {
		invalidateOtpSession(data.otpSessionId);
		throw new Error("OTP session expired. Please request a new OTP.");
	}
	if (session.resendCooldownUntil > Date.now()) {
		const waitSeconds = Math.ceil((session.resendCooldownUntil - Date.now()) / 1e3);
		throw new Error(`Please wait ${waitSeconds}s before requesting another OTP.`);
	}
	const otp = generateOtpCode();
	invalidateOtpSession(data.otpSessionId);
	const newSession = await createOtpSession(session.userId, session.email, otp, { userAgent: session.userAgent });
	const emailHtml = generateOtpEmailHtml(otp, newSession.maskedEmail, 5);
	const emailText = generateOtpEmailText(otp, newSession.maskedEmail, 5);
	if (!(await sendEmail({
		to: session.email,
		subject: "Login Verification Code - Pay Solution",
		html: emailHtml,
		text: emailText
	})).success) {
		invalidateOtpSession(newSession.id);
		throw new Error("Unable to send verification code. Please try again or contact the administrator.");
	}
	return {
		ok: true,
		otpSessionId: newSession.id,
		maskedEmail: newSession.maskedEmail
	};
});
var verifyUsernamePassword_createServerFn_handler = createServerRpc({
	id: "e69806ee8e0970a82b2060d95ade0f3784dc736bb8749e124f493ac23a86c7e4",
	name: "verifyUsernamePassword",
	filename: "src/lib/username.functions.ts"
}, (opts) => verifyUsernamePassword.__executeServer(opts));
var verifyUsernamePassword = createServerFn({ method: "POST" }).validator((raw) => objectType({
	username: stringType().trim().min(2).max(40),
	password: stringType().min(1)
}).parse(raw)).handler(verifyUsernamePassword_createServerFn_handler, async ({ data }) => {
	return loginWithUsernamePassword({ data });
});
//#endregion
export { loginWithUsernamePassword_createServerFn_handler, resendEmailOtp_createServerFn_handler, resolveUsernameEmail_createServerFn_handler, verifyEmailOtp_createServerFn_handler, verifyUsernamePassword_createServerFn_handler };
