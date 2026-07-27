import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FALLBACK_EMAILS: Record<string, string> = {
  ravipchy: "ravipchy@paysol.local",
  ravi: "ravipchy@paysol.local",
  admin: "ravipchy@paysol.local",
};

/**
 * Resolve a username → auth email so the browser can call
 * supabase.auth.signInWithPassword. We do this on the server so we never
 * expose the full user table to anon.
 */
export const resolveUsernameEmail = createServerFn({ method: "POST" })
  .validator((raw) =>
    z.object({ username: z.string().trim().min(2).max(40) }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rawValue = data.username.trim();
    const normalized = rawValue.toLowerCase();

    if (normalized.includes("@")) {
      return { email: normalized };
    }

    const { data: prof } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .ilike("username", normalized)
      .maybeSingle();

    if (prof?.email) {
      return { email: prof.email };
    }

    const fallbackEmail = FALLBACK_EMAILS[normalized];
    if (fallbackEmail) {
      return { email: fallbackEmail };
    }

    // Avoid leaking which usernames exist.
    throw new Error("Invalid username or password.");
  });
