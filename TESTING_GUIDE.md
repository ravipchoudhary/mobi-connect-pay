# Quick Start & Testing Guide

## Environment Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env File
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Configure Environment Variables
Edit `.env` with your Zoho Mail credentials:

```env
# Zoho Mail SMTP Configuration
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=your-zoho-email@zoho.com
ZOHO_SMTP_PASSWORD=your-zoho-app-password    # NOT your main password!
ZOHO_FROM_EMAIL=your-zoho-email@zoho.com
ZOHO_FROM_NAME=Pay Solution

# Development Mode
ALLOW_DEV_EMAIL=true    # Logs emails to console instead of sending
ALLOW_DEV_OTP=true      # Shows OTP in UI for testing
NODE_ENV=development
```

### How to Get Zoho Mail App Password
1. Go to https://mailadmin.zoho.com
2. Login to your Zoho account
3. Account Settings → Security → Two-Factor Authentication
4. Enable 2FA if not already enabled
5. Generate App Password for "Other Applications"
6. Copy the password and use in .env

### 4. Start Development Server
```bash
npm run dev
```

Server runs at: http://localhost:3000

---

## Testing Workflows

### Test 1: Username + Password + Email OTP Login ⭐

#### Flow
1. Open http://localhost:3000
2. Should redirect to http://localhost:3000/auth (if not logged in)
3. Click **"Username"** tab
4. Enter credentials:
   - Username: `superadmin`
   - Password: `password`
5. Click **"Sign in"**

#### Expected Result
✅ Success message: "Verification code sent to your email"
✅ Screen shows: "Verify Your Email"
✅ Shows masked email (e.g., `s****@paysol.local`)
✅ 6-digit input field for OTP
✅ "Resend in 30s" button (disabled initially)

#### Continue with OTP
1. Check console output for: `[DEV EMAIL]` message (dev mode)
2. Or check your Zoho Mail inbox
3. Find OTP code in email body
4. Copy the 6-digit code
5. Paste into OTP input field
6. Click **"Verify & Continue"**

#### Expected Result
✅ Redirected to Dashboard
✅ Shows welcome message: "Welcome back!"
✅ Dashboard shows user role-specific content

---

### Test 2: Wrong OTP Handling

#### Starting Point
You should be on the OTP verification screen from Test 1

#### Flow
1. Delete previous OTP entry
2. Enter any wrong 6-digit number (e.g., `000000`)
3. Click **"Verify & Continue"**

#### Expected Result
✅ Error message: "Invalid OTP. Please try again. (4 attempts remaining)"
✅ Input field clears
✅ Remaining attempts shown (5 → 4 → 3 → 2 → 1 → 0)

#### After 5 Wrong Attempts
✅ Error: "Too many incorrect attempts. Please request a new OTP."
✅ OTP session invalidated
✅ "Resend code" button is now active (cooldown expired)

---

### Test 3: OTP Expiry

#### Starting Point
Fresh OTP verification screen from Test 1

#### Simulate Expiry
1. Open browser DevTools (F12)
2. Go to Console tab
3. Modify OTP session in memory (for testing only):
   ```javascript
   // This simulates OTP expiration
   // In production, wait 5 minutes
   ```
4. Try to enter OTP after 5 minutes

#### Expected Result
✅ Error: "OTP has expired. Please request a new OTP."
✅ Resend button available
✅ Session fully invalidated

---

### Test 4: Resend OTP

#### Starting Point
OTP verification screen with OTP entered

#### Flow
1. Wait 30 seconds for cooldown (or click "Resend in Xs")
2. Button changes to **"Resend code"**
3. Click **"Resend code"**

#### Expected Result
✅ Success message: "New verification code sent"
✅ New OTP in email/console
✅ Previous OTP invalidated
✅ Resend button disabled again (30s cooldown)
✅ Countdown starts over

---

### Test 5: Invalid Credentials

#### Flow (Username Tab)
1. Click **"Username"** tab
2. Enter:
   - Username: `invalid_user`
   - Password: `password`
3. Click **"Sign in"**

#### Expected Result
✅ Error: "Invalid User ID or Password."
✅ No OTP sent
✅ Back at credentials screen

---

### Test 6: Inactive Account (Admin Only)

#### Setup
Edit [user record in local-store.json](../data/local-store.json):
```json
{
  "status": "inactive"  // Change from "active" to "inactive"
}
```

#### Flow (Username Tab)
1. Click **"Username"** tab
2. Enter superadmin credentials
3. Click **"Sign in"**

#### Expected Result
✅ Error: "Your account is inactive. Please contact your administrator."
✅ No OTP sent
✅ Account blocked from login

---

### Test 7: Missing Email Address

#### Setup
Edit user record (remove email field)

#### Flow
1. Username + password credentials
2. Click **"Sign in"**

#### Expected Result
✅ Error: "Registered email address is not available. Please contact your administrator."

---

### Test 8: Direct Dashboard Access Without Login

#### Flow
1. Open DevTools (F12)
2. Go to Console
3. Run: `localStorage.clear()`
4. Visit http://localhost:3000/dashboard

#### Expected Result
✅ Redirected to http://localhost:3000/auth
✅ Login required
✅ No dashboard access without authentication

---

### Test 9: Mobile OTP Tab (Existing Flow)

#### Flow
1. Go to http://localhost:3000/auth
2. Click **"Mobile OTP"** tab
3. Enter mobile: `9999999999`
4. Click **"Send OTP"**
5. Check console for OTP (dev mode shows in banner)
6. Enter 6-digit OTP
7. Click **"Verify & Continue"**

#### Expected Result
✅ Existing mobile OTP flow still works
✅ Both tabs available
✅ Each tab independent flow

---

### Test 10: Invoice Status - Recharge

#### Flow
1. Login via Username + Email OTP
2. Go to **Recharge** section
3. Fill in:
   - Operator: Jio
   - Circle: Delhi
   - Mobile: 9876543210
   - Amount: 499
4. Click **"Recharge now"**

#### Expected Result
✅ Success message: "Recharge successful"
✅ Receipt shows status badge: **"Processed Successfully"** (green badge)
✅ Amount shown: ₹499
✅ Reference ID displayed

---

### Test 11: Transaction Status in Dashboard

#### Flow
1. Logged into dashboard
2. Go to Recent Transactions section
3. Look at recent transactions

#### Expected Result
✅ Show recent transactions from Test 10
✅ Status badge shows: "Processed Successfully"
✅ Badge is green (default variant)
✅ Shows: Type, Customer, Reference, Amount, Status

---

### Test 12: Reports - Status Display

#### Flow
1. Go to **Reports** section
2. View transaction table

#### Expected Result
✅ Table shows all transactions
✅ Status column shows: "Processed Successfully" / "Pending" / "Failed"
✅ Status badges are color-coded:
   - Green: "Processed Successfully"
   - Yellow/Orange: "Pending"
   - Red: "Failed"
✅ Search filters by status text

---

### Test 13: Role-Based Redirect After Login

#### Test Super Admin Role
1. Login as superadmin
2. After OTP verification

#### Expected Result
✅ Redirected to **Admin Dashboard** (shows super_admin specific content)
✅ Sidebar shows admin-only options

#### For Other Roles
If you have other user accounts in local-store:
- MASTER_DISTRIBUTOR → Master Distributor Dashboard
- DISTRIBUTOR → Distributor Dashboard
- RETAILER → Retailer Dashboard
- AGENT → Agent Dashboard

---

### Test 14: BBPS, AEPS, DMT Status

#### Test BBPS
1. Go to **BBPS** section
2. Select operator, fill consumer, amount
3. Click **"Fetch bill"** then **"Pay bill"**
4. ✅ Should show "Processed Successfully"

#### Test AEPS
1. Go to **AEPS** section
2. Fill bank, service, amount
3. Click **"Process transaction"**
4. ✅ Should show "Processed Successfully"

#### Test DMT
1. Go to **Money Transfer** section
2. Fill beneficiary, method, amount
3. Click **"Send money"**
4. ✅ Should show "Processed Successfully"

---

## Development Mode Features

### Email Logging (ALLOW_DEV_EMAIL=true)
Emails logged to console with:
```
[DEV EMAIL] To: user@example.com
[DEV EMAIL] Subject: Login Verification Code
[DEV EMAIL] HTML: [email template preview]...
```

### OTP Display (ALLOW_DEV_OTP=true)
OTP shown in banner on OTP verification screen for easy testing

### Database Persistence
Local storage persisted in [data/local-store.json](../data/local-store.json)

---

## Production Deployment Checklist

- [ ] Remove `ALLOW_DEV_EMAIL` or set to `false`
- [ ] Remove `ALLOW_DEV_OTP` or set to `false`
- [ ] Set `NODE_ENV=production`
- [ ] Configure real Zoho Mail SMTP
- [ ] Use app-specific password (not account password)
- [ ] Store credentials in environment/secrets manager
- [ ] Test email delivery with real SMTP
- [ ] Monitor authentication logs
- [ ] Set up email alerts for failed deliveries
- [ ] Implement additional rate limiting per IP
- [ ] Use HTTPS/TLS for all connections
- [ ] Implement audit logging
- [ ] Regular security audits

---

## Troubleshooting

### Email Not Sending in Production
1. Check Zoho SMTP credentials
2. Verify app-specific password
3. Check firewall/port 465
4. Review Zoho Mail logs
5. Check application error logs

### OTP Not Arriving
1. Check spam/junk folder
2. Verify email address on user account
3. Check Zoho Mail admin panel
4. Verify SMTP settings
5. Check logs for send failures

### Login Stuck on OTP Screen
1. Check browser console for errors
2. Verify OTP session in local storage
3. Clear browser cache
4. Check if OTP expired
5. Try resend

### Dashboard Not Loading After OTP
1. Check if session created in local storage
2. Verify user exists in database
3. Check browser console for errors
4. Clear cache and reload
5. Check routing configuration

---

## API Testing with cURL

### Login with Password
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "password": "password"
  }'
```

### Verify OTP
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "otpSessionId": "uuid-from-login",
    "otp": "123456"
  }'
```

### Resend OTP
```bash
curl -X POST http://localhost:3000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "otpSessionId": "uuid-from-login"
  }'
```

---

## Support

For issues:
1. Check console for errors
2. Review server logs
3. Check email delivery logs
4. Verify .env configuration
5. See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for detailed docs

---

**Version:** 1.0.0  
**Last Updated:** 2026-08-17
