import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listLocalUsers, setLocalSession, verifyLocalUserPassword } from "@/lib/local-store";

const FALLBACK_EMAILS: Record<string, string> = {
  ravipchy: "ravipchy@paysol.local",
  ravi: "ravipchy@paysol.local",
  admin: "ravipchy@paysol.local",
};

// For demo purposes, all usernames accept password "password"
const DEMO_PASSWORD = "password";

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

export const verifyUsernamePassword = createServerFn({ method: "POST" })
  .validator((raw) =>
    z.object({ username: z.string().trim().min(2).max(40), password: z.string().min(1) }).parse(raw),
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
      throw new Error("Invalid username or password.");
    }

    // Validate password: explicit user passwords are hashed in local storage.
    // Seed/demo accounts without a hashed password may still use the demo password.
    const validPassword = user.password && user.password.length > 0
      ? await verifyLocalUserPassword(user, data.password)
      : data.password === DEMO_PASSWORD;

    if (!validPassword) {
      throw new Error("Invalid username or password.");
    }

    // Set the session
    setLocalSession(user.id, user.roles[0] as any);

    return { ok: true as const, userId: user.id, email: user.email, name: user.full_name, role: user.roles[0] };
  });
