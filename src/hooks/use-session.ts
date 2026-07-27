import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ensureLocalSession, findLocalUserById } from "@/lib/local-store";

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
      const localSession = ensureLocalSession();
      const localUser = localSession ? findLocalUserById(localSession.userId) : undefined;
      if (localUser) {
        setProfile({
          id: localUser.id,
          full_name: localUser.full_name,
          mobile: localUser.mobile,
          email: localUser.email,
          username: localUser.username,
          status: localUser.status,
          kyc_status: localUser.kyc_status,
          business_name: localUser.business_name,
          city: localUser.city,
          state: localUser.state,
          parent_id: localUser.parent_id,
          last_login_at: localUser.last_login_at,
          created_at: localUser.created_at,
        } as Profile);
        setRoles(localUser.roles as AppRole[]);
      } else {
        setProfile(null);
        setRoles([]);
      }
      return;
    }
    const { profile, roles } = await loadProfileAndRoles(s.user.id);
    setProfile(profile);
    setRoles(roles);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          await hydrate(null);
          if (mounted) setReady(true);
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session);
        await hydrate(data.session);
        setReady(true);
        const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, s) => {
          setSession(s);
          await hydrate(s);
        });
        return () => {
          mounted = false;
          sub.subscription.unsubscribe();
        };
      } catch {
        if (mounted) {
          await hydrate(null);
          setReady(true);
        }
      }
    };

    void init();
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
    isAuthenticated: !!session || roles.length > 0,
    refresh: async () => {
      if (session) await hydrate(session);
      else await hydrate(null);
    },
  };
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
  } catch {
    // noop for local fallback
  }
}
