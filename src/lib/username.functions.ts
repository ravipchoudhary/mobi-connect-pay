import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Resolve a username → auth email so the browser can call
 * supabase.auth.signInWithPassword. We do this on the server so we never
 * expose the full user table to anon.
 */
export const resolveUsernameEmail = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z.object({ username: z.string().trim().min(2).max(40) }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uname = data.username.toLowerCase();
    const { data: prof } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .ilike("username", uname)
      .maybeSingle();
    if (!prof?.email) {
      // Avoid leaking which usernames exist.
      throw new Error("Invalid username or password.");
    }
    return { email: prof.email };
  });
