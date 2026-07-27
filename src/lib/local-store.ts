type Role = "super_admin" | "master_distributor" | "distributor" | "retailer" | "agent";

export interface LocalUserRecord {
  id: string;
  full_name: string;
  mobile: string;
  email: string | null;
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
  reference_type: string;
  reference_id: string;
  description: string;
  created_at: string;
}

const USERS_KEY = "mobi-connect-local-users";
const WALLETS_KEY = "mobi-connect-local-wallets";
const LEDGER_KEY = "mobi-connect-local-ledger";
const SESSION_KEY = "mobi-connect-local-session";

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

function loadFromStorage() {
  if (hydrated) return;
  hydrated = true;

  if (typeof window !== "undefined") {
    try {
      const users = window.localStorage.getItem(USERS_KEY);
      if (users) store.users = JSON.parse(users) as LocalUserRecord[];
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
    const seedUser: LocalUserRecord = {
      id: "demo-admin",
      full_name: "Super Admin",
      mobile: "9999999999",
      email: "admin@paysol.local",
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
    store.users = [seedUser];
    store.wallets = [
      { user_id: seedUser.id, kind: "main", balance: 500000 },
      { user_id: seedUser.id, kind: "commission", balance: 0 },
      { user_id: seedUser.id, kind: "hold", balance: 0 },
    ];
    store.ledger = [];
    store.session = { userId: seedUser.id, role: "super_admin" };
    persistState();
  }
}

function persistState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(store.users));
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
}

loadFromStorage();

export function listLocalUsers(): LocalUserRecord[] {
  return readStorage<LocalUserRecord[]>(USERS_KEY, []);
}

export function createLocalUser(input: Omit<LocalUserRecord, "id" | "created_at" | "last_login_at">): LocalUserRecord {
  const now = new Date().toISOString();
  const user: LocalUserRecord = {
    id: crypto.randomUUID(),
    created_at: now,
    last_login_at: null,
    ...input,
  };
  const users = [...listLocalUsers(), user];
  writeStorage(USERS_KEY, users);
  return user;
}

export function updateLocalUserStatus(userId: string, status: LocalUserRecord["status"]): void {
  const users = listLocalUsers().map((u) => (u.id === userId ? { ...u, status } : u));
  writeStorage(USERS_KEY, users);
}

export function getLocalSession() {
  return readStorage<{ userId: string; role?: Role } | null>(SESSION_KEY, null);
}

export function setLocalSession(userId: string, role?: Role) {
  writeStorage(SESSION_KEY, { userId, role });
}

export function clearLocalSession() {
  writeStorage(SESSION_KEY, null);
}

export function ensureLocalSession() {
  const existing = getLocalSession();
  if (existing?.userId) return existing;

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
  const next = wallets.map((w) => {
    if (w.user_id !== userId || w.kind !== kind) return w;
    const nextBalance = direction === "credit" ? w.balance + amount : w.balance - amount;
    return { ...w, balance: nextBalance };
  });
  writeStorage(WALLETS_KEY, next);
  const entry: LocalLedgerEntry = {
    id: crypto.randomUUID(),
    user_id: userId,
    kind,
    direction,
    amount,
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
