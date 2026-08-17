/**
 * Email service using Zoho Mail SMTP
 * Environment variables required:
 * - ZOHO_SMTP_HOST
 * - ZOHO_SMTP_PORT
 * - ZOHO_SMTP_USER
 * - ZOHO_SMTP_PASSWORD
 * - ZOHO_FROM_EMAIL
 * - ZOHO_FROM_NAME
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export function shouldUseDevEmailMode(): boolean {
  const allowDevEmail = process.env.ALLOW_DEV_EMAIL;

  if (allowDevEmail !== undefined) {
    return allowDevEmail.trim().toLowerCase() === "true";
  }

  return process.env.NODE_ENV === "development";
}

// In development, log emails instead of actually sending.
// If ALLOW_DEV_EMAIL is explicitly set to "false", always try to send over SMTP.
const DEV_MODE = shouldUseDevEmailMode();
const EMAIL_LOG: EmailOptions[] = [];

export function getDevEmailLog(): EmailOptions[] {
  return EMAIL_LOG;
}

export function clearDevEmailLog(): void {
  EMAIL_LOG.length = 0;
}

export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  const zohoHost = process.env.ZOHO_SMTP_HOST;
  const zohoPort = process.env.ZOHO_SMTP_PORT;
  const zohoUser = process.env.ZOHO_SMTP_USER;
  const zohoPassword = process.env.ZOHO_SMTP_PASSWORD;
  const zohoFromEmail = process.env.ZOHO_FROM_EMAIL;
  const zohoFromName = process.env.ZOHO_FROM_NAME || "Pay Solution";

  // Development mode: log emails instead of sending
  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║               📧 OTP EMAIL SERVICE LOG                     ║");
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log(`║ MODE: ${DEV_MODE ? "DEVELOPMENT (Console Logging)" : "PRODUCTION (Sending Email)".padEnd(50)} ║`);
  console.log(`║ To: ${options.to.padEnd(54)} ║`);
  console.log(`║ Subject: ${options.subject.padEnd(50)} ║`);
  
  // Extract OTP from HTML - look for any 6-digit number in the HTML
  const otpMatch = options.html.match(/(\d{6})/);
  const otp = otpMatch ? otpMatch[1] : "N/A";
  console.log(`║ OTP Code: ${otp.padEnd(49)} ║`);
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log(`║ ZOHO_SMTP_HOST: ${(zohoHost || "NOT SET").padEnd(43)} ║`);
  console.log(`║ ZOHO_SMTP_PORT: ${(zohoPort || "NOT SET").padEnd(43)} ║`);
  console.log(`║ ZOHO_SMTP_USER: ${(zohoUser || "NOT SET").substring(0, 43).padEnd(43)} ║`);
  console.log(`║ ZOHO_FROM_EMAIL: ${(zohoFromEmail || "NOT SET").substring(0, 41).padEnd(41)} ║`);
  console.log(`║ ALLOW_DEV_EMAIL: ${(process.env.ALLOW_DEV_EMAIL || "NOT SET").padEnd(41)} ║`);
  console.log(`║ NODE_ENV: ${(process.env.NODE_ENV || "NOT SET").padEnd(48)} ║`);
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  if (DEV_MODE || !zohoHost || !zohoPort || !zohoUser || !zohoPassword || !zohoFromEmail) {
    console.log(`✅ [DEV MODE] Email logged to console instead of sending\n`);
    EMAIL_LOG.push(options);
    return {
      success: true,
      messageId: `dev-${Date.now()}`,
    };
  }

  // Production: use Zoho Mail SMTP
  try {
    // Import nodemailer only when actually needed
    const nodemailer = await import("nodemailer");

    const smtpPort = Number(zohoPort);
    const transporter = nodemailer.default.createTransport({
      host: zohoHost,
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: smtpPort === 587,
      tls: smtpPort === 587 ? { rejectUnauthorized: false } : undefined,
      auth: {
        user: zohoUser,
        pass: zohoPassword,
      },
    });

    const result = await transporter.sendMail({
      from: `"${zohoFromName}" <${zohoFromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Email send failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

export function generateOtpEmailHtml(otp: string, maskedEmail: string, expiryMinutes: number = 5): string {
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
            <div class="footer-text">© ${new Date().getFullYear()} Pay Solution. All rights reserved.</div>
            <div class="footer-text">This is an automated security email. Please do not reply.</div>
            <div class="footer-text">For support, contact: support@paysolution.local</div>
        </div>
    </div>
</body>
</html>
  `;
}

export function generateOtpEmailText(otp: string, maskedEmail: string, expiryMinutes: number = 5): string {
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
© ${new Date().getFullYear()} Pay Solution
This is an automated security email. Please do not reply.
For support, contact: support@paysolution.local
  `;
}
