export type DemoRole = "super_admin" | "master_distributor" | "distributor" | "retailer" | "agent";

export interface DemoTransaction {
  id: string;
  type: "Recharge" | "BBPS" | "AEPS" | "Transfer" | "Settlement" | "Commission";
  amount: number;
  status: "Success" | "Pending" | "Failed";
  reference: string;
  customer: string;
  createdAt: string;
  channel: string;
  note?: string;
}

export interface DemoNotification {
  id: string;
  title: string;
  message: string;
  type: "wallet" | "kyc" | "settlement" | "service";
  createdAt: string;
  read: boolean;
}

export interface DemoTicket {
  id: string;
  subject: string;
  category: "Recharge" | "Wallet" | "KYC" | "Settlement" | "Support";
  priority: "Low" | "Medium" | "High";
  status: "Open" | "Resolved" | "Pending";
  customer: string;
  createdAt: string;
  message: string;
}

export interface DemoApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: "Active" | "Paused";
}

export interface DemoPermission {
  id: string;
  role: DemoRole;
  feature: string;
  access: boolean;
}

export interface DemoActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
}

export interface DemoDmt2Request {
  id: string;
  beneficiaryName: string;
  bankAccount: string;
  ifsc: string;
  amount: number;
  submittedBy: string;
  submittedByRole: DemoRole;
  createdAt: string;
  note?: string;
  status: "PendingApproval" | "Approved" | "Rejected" | "Completed";
  lastUpdatedAt?: string;
}

const STORAGE_KEYS = {
  transactions: "mobi-connect-demo-transactions",
  notifications: "mobi-connect-demo-notifications",
  tickets: "mobi-connect-demo-tickets",
  apiKeys: "mobi-connect-demo-api-keys",
  permissions: "mobi-connect-demo-permissions",
  activity: "mobi-connect-demo-activity",
  dmt2Requests: "mobi-connect-demo-dmt2-requests",
};

const isBrowser = () => typeof window !== "undefined";

function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function seedIfNeeded() {
  const transactions = readStorage<DemoTransaction[]>(STORAGE_KEYS.transactions, []);
  if (transactions.length === 0) {
    writeStorage(STORAGE_KEYS.transactions, [
      { id: crypto.randomUUID(), type: "Recharge", amount: 499, status: "Success", reference: "RCH-1042", customer: "Asha Sharma", createdAt: "2026-07-14T09:10:00Z", channel: "Mobile", note: "Jio prepaid top-up" },
      { id: crypto.randomUUID(), type: "BBPS", amount: 1280, status: "Pending", reference: "BPS-2041", customer: "Ravi Kumar", createdAt: "2026-07-14T08:40:00Z", channel: "Electricity", note: "Electricity bill" },
      { id: crypto.randomUUID(), type: "AEPS", amount: 2500, status: "Success", reference: "AEP-3051", customer: "Mona Das", createdAt: "2026-07-13T17:25:00Z", channel: "Cash Withdrawal", note: "Withdrawal" },
      { id: crypto.randomUUID(), type: "Transfer", amount: 15000, status: "Success", reference: "TRF-4002", customer: "Self Transfer", createdAt: "2026-07-13T14:55:00Z", channel: "Wallet", note: "To commission wallet" },
      { id: crypto.randomUUID(), type: "Settlement", amount: 28000, status: "Pending", reference: "STL-5109", customer: "Distributor Ops", createdAt: "2026-07-12T20:12:00Z", channel: "Bank", note: "Daily settlement" },
    ]);
  }

  const notifications = readStorage<DemoNotification[]>(STORAGE_KEYS.notifications, []);
  if (notifications.length === 0) {
    writeStorage(STORAGE_KEYS.notifications, [
      { id: crypto.randomUUID(), title: "KYC approved", message: "Your KYC was renewed successfully.", type: "kyc", createdAt: "2026-07-14T09:30:00Z", read: false },
      { id: crypto.randomUUID(), title: "Settlement queued", message: "A settlement batch is awaiting approval.", type: "settlement", createdAt: "2026-07-14T08:10:00Z", read: false },
      { id: crypto.randomUUID(), title: "Wallet credited", message: "Commission credit posted to wallet.", type: "wallet", createdAt: "2026-07-13T18:05:00Z", read: true },
    ]);
  }

  const tickets = readStorage<DemoTicket[]>(STORAGE_KEYS.tickets, []);
  if (tickets.length === 0) {
    writeStorage(STORAGE_KEYS.tickets, [
      { id: crypto.randomUUID(), subject: "Recharge failed", category: "Recharge", priority: "High", status: "Open", customer: "Asha Sharma", createdAt: "2026-07-14T10:12:00Z", message: "Mobile recharge deducted but receipt not received." },
      { id: crypto.randomUUID(), subject: "Wallet top-up mismatch", category: "Wallet", priority: "Medium", status: "Pending", customer: "Ravi Kumar", createdAt: "2026-07-13T17:10:00Z", message: "Bank confirmation shows an additional payment." },
      { id: crypto.randomUUID(), subject: "KYC document resubmission", category: "KYC", priority: "Low", status: "Resolved", customer: "Mona Das", createdAt: "2026-07-12T19:10:00Z", message: "PAN and Aadhaar were updated." },
    ]);
  }

  const apiKeys = readStorage<DemoApiKey[]>(STORAGE_KEYS.apiKeys, []);
  if (apiKeys.length === 0) {
    writeStorage(STORAGE_KEYS.apiKeys, [
      { id: crypto.randomUUID(), name: "Retailer API", key: "pk_live_01HXXA1", createdAt: "2026-07-10T12:00:00Z", lastUsed: "2026-07-14T08:12:00Z", status: "Active" },
      { id: crypto.randomUUID(), name: "Distributor Ops", key: "pk_live_01HXXA2", createdAt: "2026-07-08T16:42:00Z", lastUsed: "2026-07-13T21:00:00Z", status: "Paused" },
    ]);
  }

  const permissions = readStorage<DemoPermission[]>(STORAGE_KEYS.permissions, []);
  if (permissions.length === 0) {
    writeStorage(STORAGE_KEYS.permissions, [
      { id: crypto.randomUUID(), role: "super_admin", feature: "System Wallet", access: true },
      { id: crypto.randomUUID(), role: "super_admin", feature: "KYC Approval", access: true },
      { id: crypto.randomUUID(), role: "master_distributor", feature: "Distributor Creation", access: true },
      { id: crypto.randomUUID(), role: "master_distributor", feature: "Settlement Approval", access: true },
      { id: crypto.randomUUID(), role: "distributor", feature: "Retailer Creation", access: true },
      { id: crypto.randomUUID(), role: "distributor", feature: "Wallet Requests", access: true },
      { id: crypto.randomUUID(), role: "retailer", feature: "Recharge", access: true },
      { id: crypto.randomUUID(), role: "retailer", feature: "BBPS", access: true },
      { id: crypto.randomUUID(), role: "retailer", feature: "Reports", access: true },
      { id: crypto.randomUUID(), role: "agent", feature: "Quick Recharge", access: true },
      { id: crypto.randomUUID(), role: "agent", feature: "Quick AEPS", access: true },
    ]);
  }

  const activity = readStorage<DemoActivityItem[]>(STORAGE_KEYS.activity, []);
  if (activity.length === 0) {
    writeStorage(STORAGE_KEYS.activity, [
      { id: crypto.randomUUID(), title: "Recharge completed", detail: "Airtel prepaid recharge of ₹499 succeeded.", timestamp: "10 mins ago" },
      { id: crypto.randomUUID(), title: "Settlement approved", detail: "Daily settlement batch moved to processing.", timestamp: "1 hr ago" },
      { id: crypto.randomUUID(), title: "KYC verified", detail: "Retailer PAN and Aadhaar were verified.", timestamp: "3 hrs ago" },
    ]);
  }

  const dmt2Requests = readStorage<DemoDmt2Request[]>(STORAGE_KEYS.dmt2Requests, []);
  if (dmt2Requests.length === 0) {
    writeStorage(STORAGE_KEYS.dmt2Requests, [
      {
        id: crypto.randomUUID(),
        beneficiaryName: "Priya Verma",
        bankAccount: "50100056781234",
        ifsc: "ICIC0004567",
        amount: 8500,
        submittedBy: "Asha Retailer",
        submittedByRole: "retailer",
        createdAt: "2026-07-15T10:30:00Z",
        note: "Initial request",
        status: "PendingApproval",
      },
      {
        id: crypto.randomUUID(),
        beneficiaryName: "Nikhil Rao",
        bankAccount: "50200012345678",
        ifsc: "SBIN0009876",
        amount: 22000,
        submittedBy: "Neha Agent",
        submittedByRole: "agent",
        createdAt: "2026-07-15T09:10:00Z",
        note: "Approved earlier",
        status: "Approved",
        lastUpdatedAt: "2026-07-15T09:25:00Z",
      },
    ]);
  }
}

seedIfNeeded();

export function getDemoTransactions() {
  return readStorage<DemoTransaction[]>(STORAGE_KEYS.transactions, []);
}

export function addDemoTransaction(input: Omit<DemoTransaction, "id">) {
  const next = [...getDemoTransactions(), { id: crypto.randomUUID(), ...input }];
  writeStorage(STORAGE_KEYS.transactions, next);
  return next[next.length - 1];
}

export function getDemoNotifications() {
  return readStorage<DemoNotification[]>(STORAGE_KEYS.notifications, []);
}

export function markNotificationRead(id: string) {
  const next = getDemoNotifications().map((item) => (item.id === id ? { ...item, read: true } : item));
  writeStorage(STORAGE_KEYS.notifications, next);
  return next;
}

export function addDemoNotification(input: Omit<DemoNotification, "id">) {
  const next = [{ id: crypto.randomUUID(), ...input }, ...getDemoNotifications()];
  writeStorage(STORAGE_KEYS.notifications, next);
  return next[0];
}

export function getDemoTickets() {
  return readStorage<DemoTicket[]>(STORAGE_KEYS.tickets, []);
}

export function addDemoTicket(input: Omit<DemoTicket, "id">) {
  const next = [{ id: crypto.randomUUID(), ...input }, ...getDemoTickets()];
  writeStorage(STORAGE_KEYS.tickets, next);
  return next[0];
}

export function updateDemoTicketStatus(id: string, status: DemoTicket["status"]) {
  const next = getDemoTickets().map((item) => (item.id === id ? { ...item, status } : item));
  writeStorage(STORAGE_KEYS.tickets, next);
  return next;
}

export function getDemoApiKeys() {
  return readStorage<DemoApiKey[]>(STORAGE_KEYS.apiKeys, []);
}

export function addDemoApiKey(input: Omit<DemoApiKey, "id">) {
  const next = [{ id: crypto.randomUUID(), ...input }, ...getDemoApiKeys()];
  writeStorage(STORAGE_KEYS.apiKeys, next);
  return next[0];
}

export function toggleDemoApiKey(id: string) {
  const next = getDemoApiKeys().map((item) => (item.id === id ? { ...item, status: item.status === "Active" ? "Paused" : "Active" } : item));
  writeStorage(STORAGE_KEYS.apiKeys, next);
  return next;
}

export function getDemoPermissions() {
  return readStorage<DemoPermission[]>(STORAGE_KEYS.permissions, []);
}

export function updateDemoPermission(id: string, access: boolean) {
  const next = getDemoPermissions().map((item) => (item.id === id ? { ...item, access } : item));
  writeStorage(STORAGE_KEYS.permissions, next);
  return next;
}

export function getDemoActivity() {
  return readStorage<DemoActivityItem[]>(STORAGE_KEYS.activity, []);
}

export function addDemoActivity(input: Omit<DemoActivityItem, "id">) {
  const next = [{ id: crypto.randomUUID(), ...input }, ...getDemoActivity()];
  writeStorage(STORAGE_KEYS.activity, next);
  return next[0];
}

export function getDemoWalletSummary() {
  const transactions = getDemoTransactions();
  const totalVolume = transactions.reduce((sum, item) => sum + item.amount, 0);
  const completed = transactions.filter((item) => item.status === "Success").length;
  const pending = transactions.filter((item) => item.status === "Pending").length;
  const failed = transactions.filter((item) => item.status === "Failed").length;
  return { totalVolume, completed, pending, failed, txCount: transactions.length };
}

export function getDemoDmt2Requests() {
  return readStorage<DemoDmt2Request[]>(STORAGE_KEYS.dmt2Requests, []);
}

export function addDemoDmt2Request(input: Omit<DemoDmt2Request, "id" | "status">) {
  const next = [{ id: crypto.randomUUID(), status: "PendingApproval" as const, ...input }, ...getDemoDmt2Requests()];
  writeStorage(STORAGE_KEYS.dmt2Requests, next);
  return next[0];
}

export function updateDemoDmt2RequestStatus(id: string, status: DemoDmt2Request["status"], note?: string) {
  const next = getDemoDmt2Requests().map((item) => (item.id === id ? { ...item, status, note: note ?? item.note, lastUpdatedAt: new Date().toISOString() } : item));
  writeStorage(STORAGE_KEYS.dmt2Requests, next);
  return next;
}
