import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AppRole = Database["public"]["Enums"]["app_role"];

export interface AuthState {
  ready: boolean;
  session: Session | null;
  user: Session["user"] | null;
  profile: Profile | null;
  roles: AppRole[];
  primaryRole: AppRole | null;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

async function loadProfileAndRoles(userId: string): Promise<{ profile: Profile | null; roles: AppRole[] }> {
  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  return { profile: profile ?? null, roles: (roleRows ?? []).map((r) => r.role as AppRole) };
}

const ROLE_ORDER: AppRole[] = [
  "super_admin",
  "master_distributor",
  "distributor",
  "retailer",
  "agent",
  "support",
  "auditor",
];

export function useSession(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [ready, setReady] = useState(false);

  const hydrate = async (s: Session | null) => {
    if (!s) {
      setProfile(null);
      setRoles([]);
      return;
    }
    const { profile, roles } = await loadProfileAndRoles(s.user.id);
    setProfile(profile);
    setRoles(roles);
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      await hydrate(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, s) => {
      setSession(s);
      await hydrate(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const primaryRole = roles.length
    ? ROLE_ORDER.find((r) => roles.includes(r)) ?? roles[0]
    : null;

  return {
    ready,
    session,
    user: session?.user ?? null,
    profile,
    roles,
    primaryRole,
    isAuthenticated: !!session,
    refresh: async () => {
      if (session) await hydrate(session);
    },
  };
}

export async function signOut() {
  await supabase.auth.signOut();
}
