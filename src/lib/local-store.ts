type Role = "super_admin" | "master_distributor" | "distributor" | "retailer" | "agent";

export interface LocalUserRecord {
  id: string;
  full_name: string;
  mobile: string;
  email: string | null;
  password?: string | null;
  username: string | null;
  status: "active" | "suspended" | "inactive";
  kyc_status: string;
  business_name: string | null;
  city: string | null;
  state: string | null;
  parent_id: string | null;
  created_at: string;
  last_login_at: string | null;
  roles: Role[];
  pan_number?: string | null;
  aadhaar_last4?: string | null;
  address?: string | null;
  pincode?: string | null;
  gst_number?: string | null;
}

type LocalUserStorageRecord = Omit<LocalUserRecord, "pan_number" | "aadhaar_last4" | "address" | "pincode" | "gst_number">;

function stripSensitiveUserData(user: LocalUserRecord): LocalUserStorageRecord {
  const { pan_number, aadhaar_last4, address, pincode, gst_number, ...rest } = user;
  return rest;
}

export interface LocalWalletRecord {
  user_id: string;
  kind: "main" | "commission" | "hold";
  balance: number;
}

export interface LocalLedgerEntry {
  id: string;
  user_id: string;
  kind: "main" | "commission" | "hold";
  direction: "credit" | "debit";
  amount: number;
  balance_after?: number;
  reference_type: string;
  reference_id: string;
  description: string;
  created_at: string;
}

const USERS_KEY = "mobi-connect-local-users";
const WALLETS_KEY = "mobi-connect-local-wallets";
const LEDGER_KEY = "mobi-connect-local-ledger";
const SESSION_KEY = "mobi-connect-local-session";
const SESSION_CLEARED_KEY = "mobi-connect-local-session-cleared";
export const LOCAL_SESSION_CHANGED_EVENT = "local-session-changed";

interface StoreState {
  users: LocalUserRecord[];
  wallets: LocalWalletRecord[];
  ledger: LocalLedgerEntry[];
  session: { userId: string; role?: Role } | null;
}

const store: StoreState = {
  users: [],
  wallets: [],
  ledger: [],
  session: null,
};

let hydrated = false;

function getSeedUser(now: string): LocalUserRecord {
  return {
    id: "demo-admin",
    full_name: "Super Admin",
    mobile: "9999999999",
    email: "admin@paysol.local",
    // SHA-256 hash of "password"
    password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    username: "superadmin",
    status: "active",
    kyc_status: "approved",
    business_name: "Pay Solution",
    city: "Delhi",
    state: "Delhi",
    parent_id: null,
    created_at: now,
    last_login_at: now,
    roles: ["super_admin"],
  };
}

function loadFromStorage() {
  if (hydrated) return;
  hydrated = true;

  if (typeof window !== "undefined") {
    try {
      const users = window.localStorage.getItem(USERS_KEY);
      if (users) store.users = JSON.parse(users) as LocalUserStorageRecord[] as LocalUserRecord[];
      const wallets = window.localStorage.getItem(WALLETS_KEY);
      if (wallets) store.wallets = JSON.parse(wallets) as LocalWalletRecord[];
      const ledger = window.localStorage.getItem(LEDGER_KEY);
      if (ledger) store.ledger = JSON.parse(ledger) as LocalLedgerEntry[];
      const session = window.localStorage.getItem(SESSION_KEY);
      if (session) store.session = JSON.parse(session) as { userId: string; role?: Role } | null;
    } catch {
      // ignore and fall back to defaults
    }
  }

  if (store.users.length === 0) {
    const now = new Date().toISOString();
    const seedUser = getSeedUser(now);
    store.users = [seedUser];
    store.wallets = [
      { user_id: seedUser.id, kind: "main", balance: 500000 },
      { user_id: seedUser.id, kind: "commission", balance: 0 },
      { user_id: seedUser.id, kind: "hold", balance: 0 },
    ];
    store.ledger = [];
    // Do not auto-create a session on first load; require explicit sign-in.
    if (typeof window !== "undefined") {
      persistState();
    }
  }
}

function persistState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(store.users.map(stripSensitiveUserData)));
    window.localStorage.setItem(WALLETS_KEY, JSON.stringify(store.wallets));
    window.localStorage.setItem(LEDGER_KEY, JSON.stringify(store.ledger));
    if (store.session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(store.session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // ignore storage write failures
  }
}

async function hashLocalUserPassword(password: string): Promise<string> {
  if (typeof crypto !== "undefined" && "subtle" in crypto) {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  if (typeof process !== "undefined" && process.versions?.node) {
    const { createHash } = await import("crypto");
    return createHash("sha256").update(password).digest("hex");
  }

  throw new Error("Unable to hash password in this environment.");
}

export async function verifyLocalUserPassword(user: LocalUserRecord, password: string) {
  if (!user.password) return false;
  const hashed = await hashLocalUserPassword(password);
  return user.password === hashed;
}

export async function createLocalUser(input: Omit<LocalUserRecord, "id" | "created_at" | "last_login_at">): Promise<LocalUserRecord> {
  const now = new Date().toISOString();
  const user: LocalUserRecord = {
    id: crypto.randomUUID(),
    created_at: now,
    last_login_at: null,
    ...input,
  };

  if (user.password && user.password.length > 0) {
    user.password = await hashLocalUserPassword(user.password);
  }

  const users = [...listLocalUsers(), user];
  writeStorage(USERS_KEY, users);
  return user;
}

export function updateLocalUser(userId: string, patch: Partial<LocalUserRecord>): LocalUserRecord | undefined {
  const users = listLocalUsers().map((user) => (user.id === userId ? { ...user, ...patch } : user));
  writeStorage(USERS_KEY, users);
  return users.find((user) => user.id === userId);
}

function readStorage<T>(key: string, fallback: T): T {
  loadFromStorage();
  switch (key) {
    case USERS_KEY:
      return store.users as T;
    case WALLETS_KEY:
      return store.wallets as T;
    case LEDGER_KEY:
      return store.ledger as T;
    case SESSION_KEY:
      return (store.session as T);
    default:
      return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  loadFromStorage();
  switch (key) {
    case USERS_KEY:
      store.users = value as LocalUserRecord[];
      break;
    case WALLETS_KEY:
      store.wallets = value as LocalWalletRecord[];
      break;
    case LEDGER_KEY:
      store.ledger = value as LocalLedgerEntry[];
      break;
    case SESSION_KEY:
      store.session = value as { userId: string; role?: Role } | null;
      break;
  }
  persistState();
  try {
    if (typeof window !== "undefined") {
      // @ts-ignore - attach debug array for runtime inspection
      window.__sessionDebug = window.__sessionDebug || [];
      // @ts-ignore
      window.__sessionDebug.push({ ts: new Date().toISOString(), action: "writeStorage", key, value });
    }
  } catch (e) {
    // ignore
  }
}

loadFromStorage();

export function listLocalUsers(): LocalUserRecord[] {
  return readStorage<LocalUserRecord[]>(USERS_KEY, []);
}

export function updateLocalUserStatus(userId: string, status: LocalUserRecord["status"]): void {
  const users = listLocalUsers().map((u) => (u.id === userId ? { ...u, status } : u));
  writeStorage(USERS_KEY, users);
}

export function getLocalSession() {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as { userId: string; role?: Role }) : null;
    } catch {
      return null;
    }
  }

  return readStorage<{ userId: string; role?: Role } | null>(SESSION_KEY, null);
}

export function setLocalSession(userId: string, role?: Role) {
  try {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.__sessionDebug = window.__sessionDebug || [];
      // @ts-ignore
      window.__sessionDebug.push({ ts: new Date().toISOString(), action: "setLocalSession", userId, role });
      try {
        // clear any recent-cleared sentinel when explicitly setting a session
        window.localStorage.removeItem(SESSION_CLEARED_KEY);
      } catch {}
    }
  } catch {}

  const resolvedRole = role ?? findLocalUserById(userId)?.roles[0];
  writeStorage(SESSION_KEY, { userId, role: resolvedRole });

  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(LOCAL_SESSION_CHANGED_EVENT));
    }
  } catch {}
}

export function clearLocalSession() {
  try {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.__sessionDebug = window.__sessionDebug || [];
      // @ts-ignore
      window.__sessionDebug.push({ ts: new Date().toISOString(), action: "clearLocalSession" });
    }
  } catch {}
  writeStorage(SESSION_KEY, null);
  try {
    if (typeof window !== "undefined") {
      // mark a short-lived sentinel so auto-creation checks can avoid immediately recreating a session
      window.localStorage.setItem(SESSION_CLEARED_KEY, Date.now().toString());
      window.dispatchEvent(new Event(LOCAL_SESSION_CHANGED_EVENT));
      window.dispatchEvent(new Event(LOCAL_SESSION_CHANGED_EVENT));
    }
  } catch {}
}

export function isLocalSessionRecentlyCleared() {
  if (typeof window === "undefined") return false;
  try {
    const ts = window.localStorage.getItem(SESSION_CLEARED_KEY);
    if (!ts) return false;
    const delta = Date.now() - Number(ts);
    return !Number.isNaN(delta) && delta < 5000;
  } catch {
    return false;
  }
}

export function ensureLocalSession() {
  const existing = getLocalSession();
  if (existing?.userId) return existing;

  // If a session was just cleared by the user, avoid auto-creating a new one immediately.
  try {
    if (typeof window !== "undefined") {
      const ts = window.localStorage.getItem(SESSION_CLEARED_KEY);
      if (ts) {
        const delta = Date.now() - Number(ts || 0);
        if (!Number.isNaN(delta) && delta < 5000) {
          return null;
        }
      }
    }
  } catch {}

  const admin = listLocalUsers().find((user) => user.roles.includes("super_admin"));
  if (admin) {
    setLocalSession(admin.id, "super_admin");
    return { userId: admin.id, role: "super_admin" as const };
  }

  const first = listLocalUsers()[0];
  if (first) {
    setLocalSession(first.id, first.roles[0]);
    return { userId: first.id, role: first.roles[0] };
  }

  return null;
}

export function findLocalUserById(userId: string): LocalUserRecord | undefined {
  return listLocalUsers().find((u) => u.id === userId);
}

export function getLocalWallets(userId: string): LocalWalletRecord[] {
  return readStorage<LocalWalletRecord[]>(WALLETS_KEY, []).filter((w) => w.user_id === userId);
}

export function getLocalWalletSummary(userId: string) {
  const wallets = getLocalWallets(userId);
  return {
    wallets,
    ledger: readStorage<LocalLedgerEntry[]>(LEDGER_KEY, []).filter((entry) => entry.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 100),
  };
}

export function applyLocalWalletMove(userId: string, kind: LocalWalletRecord["kind"], direction: "credit" | "debit", amount: number, referenceType: string, referenceId: string, description: string) {
  const wallets = readStorage<LocalWalletRecord[]>(WALLETS_KEY, []);
  const existing = wallets.find((w) => w.user_id === userId && w.kind === kind);
  if (!existing) {
    wallets.push({ user_id: userId, kind, balance: 0 });
  }
  let nextBalance = 0;
  const next = wallets.map((w) => {
    if (w.user_id !== userId || w.kind !== kind) return w;
    nextBalance = direction === "credit" ? w.balance + amount : w.balance - amount;
    return { ...w, balance: nextBalance };
  });
  writeStorage(WALLETS_KEY, next);
  const entry: LocalLedgerEntry = {
    id: crypto.randomUUID(),
    user_id: userId,
    kind,
    direction,
    amount,
    balance_after: nextBalance,
    reference_type: referenceType,
    reference_id: referenceId,
    description,
    created_at: new Date().toISOString(),
  };
  const ledger = readStorage<LocalLedgerEntry[]>(LEDGER_KEY, []);
  ledger.push(entry);
  writeStorage(LEDGER_KEY, ledger);
  return { ok: true as const };
}
