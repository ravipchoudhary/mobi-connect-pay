import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash } from "crypto";

const MOBILE_RE = /^[6-9]\d{9}$/;
const OTP_TTL_MS = 5 * 60_000;
const RESEND_MS = 30_000;
const MAX_ATTEMPTS = 5;

function makeEmail(mobile: string) {
  return `${mobile}@paysol.local`;
}

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Send an OTP to the given mobile number. In dev (no SMS provider configured)
 * we return the code so the UI can display it. When you plug in MSG91/Twilio,
 * push the code over SMS from within the .handler().
 */
export const sendMobileOtp = createServerFn({ method: "POST" })
  .inputValidator((raw) => z.object({ mobile: z.string().regex(MOBILE_RE) }).parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Enforce "admin creates users" — reject unknown mobiles.
    const { data: prof } = await supabaseAdmin
      .from("profiles")
      .select("id, status")
      .eq("mobile", data.mobile)
      .maybeSingle();
    if (!prof) {
      throw new Error("This mobile is not registered. Ask your distributor/admin to create your account.");
    }
    if (prof.status !== "active") {
      throw new Error("Account is inactive. Contact your administrator.");
    }

    // Rate-limit resend
    const { data: recent } = await supabaseAdmin
      .from("mobile_otps")
      .select("last_sent_at")
      .eq("mobile", data.mobile)
      .is("consumed_at", null)
      .order("last_sent_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (recent) {
      const elapsed = Date.now() - new Date(recent.last_sent_at).getTime();
      if (elapsed < RESEND_MS) {
        const wait = Math.ceil((RESEND_MS - elapsed) / 1000);
        throw new Error(`Please wait ${wait}s before requesting a new OTP.`);
      }
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = sha256Hex(`${data.mobile}:${code}`);
    const { error } = await supabaseAdmin.from("mobile_otps").insert({
      mobile: data.mobile,
      code_hash: codeHash,
      expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    });
    if (error) throw new Error(error.message);

    // Send SMS via Twilio (through the Lovable connector gateway) when configured.
    let smsSent = false;
    const twilioKey = process.env.TWILIO_API_KEY;
    const lovableKey = process.env.LOVABLE_API_KEY;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    if (twilioKey && lovableKey && fromNumber) {
      try {
        const res = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": twilioKey,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: `+91${data.mobile}`,
            From: fromNumber,
            Body: `Your Pay Solution verification code is ${code}. It expires in 5 minutes. Do not share this code with anyone.`,
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          console.error(`Twilio send failed [${res.status}]: ${body}`);
        } else {
          smsSent = true;
        }
      } catch (e) {
        console.error("Twilio send threw", e);
      }
    }

    // SECURITY: never return the OTP code in production. Surfaced only when
    // ALLOW_DEV_OTP="true" and no SMS was actually delivered.
    const allowDevOtp = process.env.ALLOW_DEV_OTP === "true" && !smsSent;
    return { ok: true as const, devOtp: allowDevOtp ? code : undefined, smsSent };
  });


/**
 * Verify OTP → mint a Supabase session for `mobile@paysol.local`.
 * Returns { token_hash } which the client passes to
 * supabase.auth.verifyOtp({ type: 'magiclink', token_hash }) to establish
 * the session in the browser.
 */
export const verifyMobileOtp = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z
      .object({
        mobile: z.string().regex(MOBILE_RE),
        code: z.string().regex(/^\d{6}$/),
        fullName: z.string().trim().max(80).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rec, error } = await supabaseAdmin
      .from("mobile_otps")
      .select("*")
      .eq("mobile", data.mobile)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!rec) throw new Error("Please request a new OTP.");
    if (new Date(rec.expires_at).getTime() < Date.now()) {
      throw new Error("OTP expired. Please request a new one.");
    }
    if (rec.attempts >= MAX_ATTEMPTS) {
      throw new Error("Too many attempts. Please request a new OTP.");
    }
    const expected = sha256Hex(`${data.mobile}:${data.code}`);
    if (expected !== rec.code_hash) {
      await supabaseAdmin
        .from("mobile_otps")
        .update({ attempts: rec.attempts + 1 })
        .eq("id", rec.id);
      throw new Error(`Invalid OTP. ${MAX_ATTEMPTS - rec.attempts - 1} attempts remaining.`);
    }
    // Consume
    await supabaseAdmin.from("mobile_otps").update({ consumed_at: new Date().toISOString() }).eq("id", rec.id);

    // Find the auth user tied to this mobile. No auto-create — accounts
    // must be provisioned by an admin/distributor first.
    const { data: profByMobile } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("mobile", data.mobile)
      .maybeSingle();
    if (!profByMobile) {
      throw new Error("This mobile is not registered. Ask your distributor/admin to create your account.");
    }
    const email = profByMobile.email ?? makeEmail(data.mobile);
    const userId = profByMobile.id;


    // Update last_login_at
    await supabaseAdmin.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", userId);

    // Generate a magic link to hand the client a token_hash it can verify.
    const link = await supabaseAdmin.auth.admin.generateLink({ type: "magiclink", email });
    if (link.error) throw new Error(link.error.message);
    const properties = link.data.properties as { hashed_token?: string } | undefined;
    const tokenHash = properties?.hashed_token;
    if (!tokenHash) throw new Error("Could not mint session token.");
    return { ok: true as const, tokenHash, email };
  });
