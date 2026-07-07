// Client-side mock auth store for Mobile + OTP flow.
// Swap the OTP send/verify with a real SMS provider (Twilio/MSG91) later.
import { useEffect, useState } from "react";

const SESSION_KEY = "paysol.session";
const USERS_KEY = "paysol.users";
const OTP_KEY = "paysol.otp";

export type UserRole =
  | "super_admin"
  | "master_distributor"
  | "distributor"
  | "retailer"
  | "agent"
  | "support"
  | "auditor";

export interface User {
  id: string;
  mobile: string;
  fullName: string;
  email?: string;
  role: UserRole;
  kycStatus: "pending" | "approved" | "rejected" | "not_started";
  walletBalance: number;
  createdAt: string;
}

export interface Session {
  userId: string;
  mobile: string;
  loggedInAt: string;
}

interface OtpRecord {
  mobile: string;
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string) {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
}

function getUsers(): Record<string, User> {
  return read<Record<string, User>>(USERS_KEY) ?? {};
}
function saveUsers(users: Record<string, User>) {
  write(USERS_KEY, users);
}

export function findUserByMobile(mobile: string): User | null {
  const users = getUsers();
  return Object.values(users).find((u) => u.mobile === mobile) ?? null;
}

export function sendOtp(mobile: string): { code: string; expiresAt: number } {
  const existing = read<OtpRecord>(OTP_KEY);
  const now = Date.now();
  if (existing && existing.mobile === mobile && now - existing.lastSentAt < 30_000) {
    const wait = Math.ceil((30_000 - (now - existing.lastSentAt)) / 1000);
    throw new Error(`Please wait ${wait}s before requesting a new OTP.`);
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const record: OtpRecord = {
    mobile,
    code,
    expiresAt: now + 5 * 60_000,
    attempts: 0,
    lastSentAt: now,
  };
  write(OTP_KEY, record);
  return { code, expiresAt: record.expiresAt };
}

export function verifyOtp(mobile: string, code: string): boolean {
  const rec = read<OtpRecord>(OTP_KEY);
  if (!rec || rec.mobile !== mobile) throw new Error("Please request a new OTP.");
  if (Date.now() > rec.expiresAt) {
    remove(OTP_KEY);
    throw new Error("OTP expired. Please request a new one.");
  }
  if (rec.attempts >= 5) {
    remove(OTP_KEY);
    throw new Error("Too many attempts. Account temporarily locked.");
  }
  if (rec.code !== code) {
    rec.attempts += 1;
    write(OTP_KEY, rec);
    throw new Error(`Invalid OTP. ${5 - rec.attempts} attempts remaining.`);
  }
  remove(OTP_KEY);
  return true;
}

export function createUser(input: {
  mobile: string;
  fullName: string;
  email?: string;
  role?: UserRole;
}): User {
  const users = getUsers();
  const id = crypto.randomUUID();
  const user: User = {
    id,
    mobile: input.mobile,
    fullName: input.fullName,
    email: input.email,
    role: input.role ?? "retailer",
    kycStatus: "pending",
    walletBalance: 25000,
    createdAt: new Date().toISOString(),
  };
  users[id] = user;
  saveUsers(users);
  return user;
}

export function updateUser(id: string, patch: Partial<User>): User | null {
  const users = getUsers();
  const existing = users[id];
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  users[id] = updated;
  saveUsers(users);
  return updated;
}

export function loginUser(userId: string) {
  const session: Session = {
    userId,
    mobile: getUsers()[userId]?.mobile ?? "",
    loggedInAt: new Date().toISOString(),
  };
  write(SESSION_KEY, session);
  window.dispatchEvent(new Event("paysol-auth-change"));
  return session;
}

export function logout() {
  remove(SESSION_KEY);
  if (isBrowser()) window.dispatchEvent(new Event("paysol-auth-change"));
}

export function getSession(): Session | null {
  return read<Session>(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  return getUsers()[session.userId] ?? null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    sync();
    setReady(true);
    window.addEventListener("paysol-auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("paysol-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { user, ready, isAuthenticated: !!user };
}
