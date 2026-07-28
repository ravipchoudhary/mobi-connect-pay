import { useEffect, useState } from "react";
import { getLocalSession, findLocalUserById, clearLocalSession, LOCAL_SESSION_CHANGED_EVENT, type LocalUserRecord } from "@/lib/local-store";

export type Profile = LocalUserRecord;
export type AppRole = "super_admin" | "master_distributor" | "distributor" | "retailer" | "agent" | "support" | "auditor";

export interface AuthState {
  ready: boolean;
  session: { userId: string; role?: AppRole } | null;
  user: Profile | null;
  profile: Profile | null;
  roles: AppRole[];
  primaryRole: AppRole | null;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
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
  const [session, setSession] = useState<{ userId: string; role?: AppRole } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [ready, setReady] = useState(false);

  const hydrate = async () => {
    const localSession = getLocalSession();
    setSession(localSession);
    const localUser = localSession ? findLocalUserById(localSession.userId) : undefined;
    if (localUser) {
      setProfile(localUser);
      setRoles((localUser.roles as AppRole[]) || []);
    } else {
      setProfile(null);
      setRoles([]);
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        await hydrate();
        if (mounted) setReady(true);
      } catch {
        if (mounted) {
          setProfile(null);
          setRoles([]);
          setReady(true);
        }
      }
    };

    void init();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleSessionChange = () => {
      void hydrate();
    };

    if (typeof window === "undefined") return;

    window.addEventListener(LOCAL_SESSION_CHANGED_EVENT, handleSessionChange);
    window.addEventListener("storage", handleSessionChange);
    return () => {
      window.removeEventListener(LOCAL_SESSION_CHANGED_EVENT, handleSessionChange);
      window.removeEventListener("storage", handleSessionChange);
    };
  }, []);

  const primaryRole = roles.length
    ? ROLE_ORDER.find((r) => roles.includes(r)) ?? (roles[0] as AppRole)
    : null;

  return {
    ready,
    session,
    user: profile,
    profile,
    roles,
    primaryRole,
    isAuthenticated: !!session?.userId && !!profile,
    refresh: async () => {
      await hydrate();
    },
  };
}

export async function signOut() {
  clearLocalSession();
}
