# OTP Login + Invoice Status Implementation Guide

## Overview
This document describes the implementation of email-based OTP authentication and transaction status updates across the Pay Solution application.

## Changes Summary

### 1. Authentication Architecture Update

#### New OTP-Based Login Flow for Username/Password
Previously, username/password login directly created an authenticated session. Now it follows this flow:

```
Step 1: User submits username + password
   ↓
Step 2: Backend validates credentials
   ↓
Step 3: If valid, generate secure OTP
   ↓
Step 4: Send OTP to registered email via Zoho Mail SMTP
   ↓
Step 5: Return OTP session ID + masked email (NOT authenticated session)
   ↓
Step 6: Frontend shows OTP verification screen
   ↓
Step 7: User enters OTP from email
   ↓
Step 8: Backend verifies OTP hash
   ↓
Step 9: If valid, create authenticated session/JWT
   ↓
Step 10: Redirect to role-specific dashboard
```

**Key Security Features:**
- OTP generated on backend only
- OTP stored as SHA-256 hash (not plaintext)
- OTP: 6 digits, single-use, 5-minute expiry
- Max 5 verification attempts per session
- 30-second resend cooldown
- Previous OTP invalidated when new one generated
- Temporary OTP session before final authentication

#### Mobile OTP Flow (Unchanged)
Mobile-based OTP login continues to work as before. Retailers use mobile OTP, admins use username/password with email OTP.

### 2. Backend Implementation

#### New Files
- **`src/lib/email.service.ts`** - Zoho Mail SMTP service
  - `sendEmail()` - Send email via Zoho or log in dev mode
  - `generateOtpEmailHtml()` - Professional HTML email template
  - `generateOtpEmailText()` - Plain text email fallback
  - Development mode logs emails to console

#### Modified Files
- **`src/lib/local-store.ts`** - Enhanced with OTP session model
  - New `OtpSession` interface
  - `createOtpSession()` - Create new OTP session
  - `verifyOtpInSession()` - Verify OTP hash
  - `getOtpSession()` / `getOtpSessionByUserId()` - Retrieve sessions
  - `invalidateOtpSession()` - Invalidate OTP
  - `hashOtp()` - Hash OTP using SHA-256
  - `maskEmail()` - Mask email display (e.g., r****@example.com)
  - `cleanupExpiredOtpSessions()` - Remove expired sessions

- **`src/lib/username.functions.ts`** - New OTP-based login endpoints
  - `loginWithUsernamePassword()` - Step 1: Validate credentials + send OTP
  - `verifyEmailOtp()` - Step 2: Verify OTP + create session
  - `resendEmailOtp()` - Resend OTP to same email
  - `verifyUsernamePassword()` - Legacy endpoint (redirects to new flow)

#### OTP Session Model
```typescript
interface OtpSession {
  id: string;
  userId: string;
  otpHash: string; // SHA-256 hash, not plaintext
  email: string;
  maskedEmail: string; // e.g., "r****@example.com"
  expiresAt: number; // 5 minutes from creation
  attempts: number; // Incremented on wrong OTP
  maxAttempts: number; // 5
  verifiedAt: number | null; // Set after successful verification
  createdAt: number;
  ipAddress?: string;
  userAgent?: string;
  resendCooldownUntil: number; // 30 seconds from creation
}
```

### 3. Frontend Implementation

#### Updated Auth Routes
- **`src/routes/auth.tsx`** - Enhanced with email OTP verification
  - Two tabs: "Mobile OTP" and "Username"
  - "Mobile OTP" tab unchanged (mobile number → OTP → dashboard)
  - "Username" tab new flow: username+password → email OTP → dashboard
  - OTP verification screen with:
    - 6-digit input field
    - Masked email display
    - Countdown timer for resend
    - Back button to credentials
    - Auto-populate dev OTP in test mode
  - Error handling for all edge cases
  - Proper state management for both flows

#### OTP Verification UI Components
- Professional design matching existing Pay Solution theme
- 6-digit input fields with focus management
- Countdown timer (30s resend cooldown)
- Masked email display for privacy
- Clear error messages with remaining attempts
- Back button to reset flow
- Loading states during verification

### 4. Transaction Status Updates

#### Status Enum Changes
**Old:**
```typescript
status: "Success" | "Pending" | "Failed"
```

**New:**
```typescript
status: "Processed Successfully" | "Pending" | "Failed" | "Refunded" | "Cancelled"
```

#### Updated Files
- `src/lib/demo-data.ts`
  - `DemoTransaction` status type updated
  - `DemoDmt2Request` status updated to "Processed Successfully" / "Pending"
  - Seed data updated with new status values

- `src/routes/_app.recharge.tsx` - Uses "Processed Successfully"
- `src/routes/_app.bbps.tsx` - Uses "Processed Successfully"
- `src/routes/_app.aeps.tsx` - Uses "Processed Successfully"
- `src/routes/_app.dmt.tsx` - Uses "Processed Successfully"
- `src/routes/_app.reports.tsx` - Displays new status format
- `src/components/role-dashboard.tsx` - Displays new status format

#### Badge Display Logic
```typescript
// Status badge variants
tx.status === "Processed Successfully" ? "default" : 
tx.status === "Pending" ? "secondary" : 
"destructive"
```

### 5. Environment Configuration

#### Required Environment Variables
```
# Zoho Mail SMTP
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=your-email@zoho.com
ZOHO_SMTP_PASSWORD=your-app-password
ZOHO_FROM_EMAIL=your-email@zoho.com
ZOHO_FROM_NAME=Pay Solution

# Development
ALLOW_DEV_EMAIL=true    # Log emails instead of sending
ALLOW_DEV_OTP=true      # Show OTP in UI for testing
NODE_ENV=development
```

#### Setup Instructions
1. Copy `.env.example` to `.env`
2. Fill in Zoho Mail credentials
3. Set `ALLOW_DEV_EMAIL=true` for development
4. In production, remove dev flags or set to `false`

### 6. API Endpoints

#### POST /api/auth/login-with-password
**Request:**
```json
{
  "username": "superadmin",
  "password": "password"
}
```

**Response (Credentials Valid, OTP Sent):**
```json
{
  "ok": true,
  "requiresOtp": true,
  "otpSessionId": "uuid",
  "maskedEmail": "r****@example.com",
  "userId": "uuid"
}
```

**Response (Credentials Invalid):**
```json
{
  "error": "Invalid User ID or Password."
}
```

**Error Cases:**
- "Invalid User ID or Password."
- "Your account is inactive. Please contact your administrator."
- "Registered email address is not available. Please contact your administrator."
- "Unable to send verification code. Please try again or contact the administrator."

#### POST /api/auth/verify-otp
**Request:**
```json
{
  "otpSessionId": "uuid",
  "otp": "123456"
}
```

**Response (OTP Valid):**
```json
{
  "ok": true,
  "userId": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "role": "super_admin",
  "user": { /* user object */ }
}
```

**Error Cases:**
- "OTP session expired. Please request a new OTP."
- "This OTP session has already been verified. Please log in again."
- "OTP has expired. Please request a new OTP."
- "Too many incorrect attempts. Please request a new OTP."
- "Invalid OTP. Please try again. (X attempts remaining)"

#### POST /api/auth/resend-otp
**Request:**
```json
{
  "otpSessionId": "uuid"
}
```

**Response:**
```json
{
  "ok": true,
  "otpSessionId": "new-uuid",
  "maskedEmail": "r****@example.com"
}
```

**Error Cases:**
- "OTP session expired. Please request a new OTP."
- "This OTP session has already been verified. Please log in again."
- "Please wait Xs before requesting another OTP."

### 7. Security Considerations

✅ **Implemented:**
- OTP never transmitted or logged in plaintext
- OTP hashed with SHA-256 before storage
- Temporary OTP session (OTP_PENDING state, not AUTHENTICATED)
- Max 5 verification attempts
- 5-minute OTP expiry
- 30-second resend cooldown
- Previous OTP invalidated on new generation
- Email validated before OTP creation
- Masked email display to user
- Rate limiting on login attempts
- Automatic cleanup of expired sessions

⚠️ **Important for Production:**
- Use environment variables only (NEVER hardcode credentials)
- Use Zoho SMTP password, not main account password
- Set `NODE_ENV=production` and `ALLOW_DEV_EMAIL=false`
- Implement additional rate limiting (login attempts per IP)
- Use HTTPS only
- Store Zoho credentials in secure vault
- Monitor failed authentication attempts
- Log authentication events for audit trail
- Use JWT with appropriate expiry times

### 8. Testing Checklist

#### Login Flow
- [ ] Username + Password → OTP sent to email
- [ ] Correct OTP → Dashboard access
- [ ] Wrong OTP → Error message, attempt counter
- [ ] 5 wrong attempts → OTP session invalidated
- [ ] Expired OTP → Error, request new
- [ ] Resend OTP → New code sent, previous invalidated
- [ ] Resend before cooldown → Error message
- [ ] Direct URL access without OTP → Redirected to login

#### Mobile OTP Flow
- [ ] Existing flow still works
- [ ] Both tabs available

#### Invoice Status
- [ ] Recharge successful → "Processed Successfully"
- [ ] BBPS successful → "Processed Successfully"
- [ ] AEPS successful → "Processed Successfully"
- [ ] DMT successful → "Processed Successfully"
- [ ] Dashboard recent transactions show correct status
- [ ] Reports display correct status
- [ ] Badge colors correct (green for success, yellow for pending)
- [ ] Pending transactions stay "Pending"
- [ ] Failed transactions show "Failed"

#### Role-Based Redirect
- [ ] Super Admin → Admin Dashboard
- [ ] Master Distributor → Master Distributor Dashboard
- [ ] Distributor → Distributor Dashboard
- [ ] Retailer → Retailer Dashboard
- [ ] Agent → Agent Dashboard

#### Error Handling
- [ ] Invalid username → Error message
- [ ] Invalid password → Error message
- [ ] Inactive account → Error message
- [ ] No email on account → Error message
- [ ] SMTP failure → User-friendly error, server logs error
- [ ] Expired OTP → Error message
- [ ] Wrong OTP → Error with remaining attempts
- [ ] Session expired → Error, request new OTP

#### Email (Dev Mode)
- [ ] OTP emails logged to console
- [ ] Email contains OTP code
- [ ] Email contains masked email
- [ ] Email is professional/readable
- [ ] HTML and plain text versions work

### 9. Database Changes

#### OTP Sessions Table
Store in `local-store.json` with structure:
```json
{
  "otpSessions": [
    {
      "id": "uuid",
      "userId": "uuid",
      "otpHash": "sha256-hash",
      "email": "user@example.com",
      "maskedEmail": "u****@example.com",
      "expiresAt": 1692288000000,
      "attempts": 0,
      "maxAttempts": 5,
      "verifiedAt": null,
      "createdAt": 1692287700000,
      "resendCooldownUntil": 1692287730000
    }
  ]
}
```

### 10. Deployment Notes

#### Installation
```bash
npm install
npm run build
# Set environment variables in .env
# Source .env before starting
node server/index.mjs
```

#### Docker
If using Docker, set environment variables:
```dockerfile
ENV ZOHO_SMTP_HOST=smtp.zoho.com
ENV ZOHO_SMTP_PORT=465
ENV ZOHO_SMTP_USER=your-email
ENV ZOHO_SMTP_PASSWORD=your-password
ENV NODE_ENV=production
ENV ALLOW_DEV_EMAIL=false
```

#### Verification After Deploy
1. Test login flow end-to-end
2. Verify Zoho SMTP sending emails
3. Check OTP emails arrive
4. Verify OTP verification works
5. Check transaction status displays correctly
6. Verify role-based redirect
7. Monitor logs for any email send failures

### 11. Backward Compatibility

- Mobile OTP flow unchanged
- Mobile tab still available
- Existing users can use mobile OTP
- Admin username/password login now requires OTP
- All existing transaction data preserved
- Status display updated but not the underlying data

---

## Support & Documentation

For issues or questions:
1. Check error messages in UI
2. Check server logs for detailed errors
3. Check email service logs (Zoho Mail)
4. Review OTP session state in local-store.json
5. Check browser console for frontend errors

---

Last Updated: 2026-08-17
Version: 1.0.0
