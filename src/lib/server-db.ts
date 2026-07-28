import initSqlJs from "sql.js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createHash, randomBytes, pbkdf2Sync, timingSafeEqual } from "node:crypto";

const DB_FILE = resolve(process.cwd(), "data", "db.sqlite");
mkdirSync(dirname(DB_FILE), { recursive: true });

let dbPromise: Promise<import("sql.js").Database> | null = null;

async function initDb() {
  const SQL = await initSqlJs({
    locateFile: (file: string) => new URL(`../../node_modules/sql.js/dist/${file}`, import.meta.url).href,
  });

  const bytes = existsSync(DB_FILE) ? readFileSync(DB_FILE) : undefined;
  const db = bytes ? new SQL.Database(new Uint8Array(bytes)) : new SQL.Database();
  db.run("PRAGMA foreign_keys = ON;");

  db.run(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  email TEXT,
  username TEXT UNIQUE,
  password_hash TEXT,
  password_salt TEXT,
  status TEXT NOT NULL,
  kyc_status TEXT NOT NULL,
  business_name TEXT,
  city TEXT,
  state TEXT,
  parent_id TEXT,
  created_at TEXT NOT NULL,
  last_login_at TEXT,
  roles TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wallets (
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  balance REAL NOT NULL,
  PRIMARY KEY (user_id, kind),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  direction TEXT NOT NULL,
  amount REAL NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS kyc_documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_data TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  remarks TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mobile_otps (
  id TEXT PRIMARY KEY,
  mobile TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  attempts INTEGER NOT NULL,
  consumed_at TEXT,
  last_sent_at TEXT NOT NULL
);
  `);

  const stmt = db.prepare("SELECT COUNT(1) AS count FROM users");
  const hasRow = stmt.step();
  const countRow = hasRow ? stmt.getAsObject() : { count: 0 };
  stmt.free();
  if (!countRow.count) {
    const now = new Date().toISOString();
    const salt = randomBytes(16).toString("hex");
    const passwordHash = pbkdf2Sync("superadmin123", salt, 310000, 64, "sha512").toString("hex");
    db.run(
      `INSERT INTO users (id, full_name, mobile, email, username, password_hash, password_salt, status, kyc_status, business_name, city, state, parent_id, created_at, last_login_at, roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "demo-admin",
        "Super Admin",
        "9999999999",
        "admin@paysol.local",
        "superadmin",
        passwordHash,
        salt,
        "active",
        "approved",
        "Pay Solution",
        "Delhi",
        "Delhi",
        null,
        now,
        now,
        JSON.stringify(["super_admin"]),
      ],
    );
    db.run("INSERT INTO wallets (user_id, kind, balance) VALUES (?, ?, ?);", ["demo-admin", "main", 500000]);
    db.run("INSERT INTO wallets (user_id, kind, balance) VALUES (?, ?, ?);", ["demo-admin", "commission", 0]);
    db.run("INSERT INTO wallets (user_id, kind, balance) VALUES (?, ?, ?);", ["demo-admin", "hold", 0]);
    saveDb(db);
  }

  return db;
}

function getDb() {
  if (!dbPromise) {
    dbPromise = initDb();
  }
  return dbPromise;
}

function saveDb(db: import("sql.js").Database) {
  const data = db.export();
  writeFileSync(DB_FILE, Buffer.from(data));
}

function parseRow(row: any) {
  if (!row) return null;
  if (row.roles && typeof row.roles === "string") {
    return { ...row, roles: JSON.parse(row.roles) };
  }
  return row;
}

export async function findUserById(userId: string) {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?;");
  stmt.bind([userId]);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return parseRow(row);
}

export async function findUserByMobile(mobile: string) {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE mobile = ?;");
  stmt.bind([mobile]);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return parseRow(row);
}

export async function findUserByUsername(username: string) {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?;");
  stmt.bind([username]);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return parseRow(row);
}

export async function createUser(input: {
  full_name: string;
  mobile: string;
  email: string | null;
  username: string | null;
  password_hash: string | null;
  password_salt: string | null;
  status: string;
  kyc_status: string;
  business_name: string | null;
  city: string | null;
  state: string | null;
  parent_id: string | null;
  roles: string[];
}) {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  db.run(
    `INSERT INTO users (id, full_name, mobile, email, username, password_hash, password_salt, status, kyc_status, business_name, city, state, parent_id, created_at, last_login_at, roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      input.full_name,
      input.mobile,
      input.email,
      input.username,
      input.password_hash,
      input.password_salt,
      input.status,
      input.kyc_status,
      input.business_name,
      input.city,
      input.state,
      input.parent_id,
      now,
      null,
      JSON.stringify(input.roles),
    ],
  );
  db.run("INSERT OR IGNORE INTO wallets (user_id, kind, balance) VALUES (?, ?, ?);", [id, "main", 0]);
  db.run("INSERT OR IGNORE INTO wallets (user_id, kind, balance) VALUES (?, ?, ?);", [id, "commission", 0]);
  db.run("INSERT OR IGNORE INTO wallets (user_id, kind, balance) VALUES (?, ?, ?);", [id, "hold", 0]);
  saveDb(db);
  return { id, created_at: now, last_login_at: null, ...input };
}

export async function listUsers(parentId?: string) {
  const db = await getDb();
  const query = parentId ? "SELECT * FROM users WHERE parent_id = ? ORDER BY created_at DESC;" : "SELECT * FROM users ORDER BY created_at DESC;";
  const stmt = db.prepare(query);
  if (parentId) stmt.bind([parentId]);
  const rows: any[] = [];
  while (stmt.step()) rows.push(parseRow(stmt.getAsObject()));
  stmt.free();
  return rows;
}

export async function updateUserStatus(userId: string, status: string) {
  const db = await getDb();
  db.run("UPDATE users SET status = ? WHERE id = ?;", [status, userId]);
  saveDb(db);
}

export async function updateUserProfile(userId: string, patch: Partial<{ full_name: string; kyc_status: string; pan_number?: string | null; aadhaar_last4?: string | null; business_name?: string | null; address?: string | null; city?: string | null; state?: string | null; pincode?: string | null; gst_number?: string | null; }>) {
  const db = await getDb();
  const allowedFields = [
    "full_name",
    "kyc_status",
    "pan_number",
    "aadhaar_last4",
    "business_name",
    "address",
    "city",
    "state",
    "pincode",
    "gst_number",
  ] as const;

  const updates = allowedFields.filter((field) => field in patch) as Array<keyof typeof patch>;
  if (!updates.length) return;

  const sets = updates.map((key) => `${key} = ?`).join(", ");
  const values = updates.map((key) => patch[key]);
  db.run(`UPDATE users SET ${sets} WHERE id = ?;`, [...values, userId]);
  saveDb(db);
}

export async function getWalletSummary(userId: string) {
  const db = await getDb();
  const walletsStmt = db.prepare("SELECT kind, balance FROM wallets WHERE user_id = ?;");
  walletsStmt.bind([userId]);
  const wallets: any[] = [];
  while (walletsStmt.step()) wallets.push(walletsStmt.getAsObject());
  walletsStmt.free();

  const ledgerStmt = db.prepare("SELECT * FROM ledger WHERE user_id = ? ORDER BY created_at DESC LIMIT 100;");
  ledgerStmt.bind([userId]);
  const ledger: any[] = [];
  while (ledgerStmt.step()) ledger.push(ledgerStmt.getAsObject());
  ledgerStmt.free();

  return { wallets, ledger };
}

export async function applyWalletMove(userId: string, kind: string, direction: "credit" | "debit", amount: number, referenceType: string, referenceId: string, description: string) {
  const db = await getDb();
  db.run("BEGIN TRANSACTION;");

  try {
    const walletStmt = db.prepare("SELECT balance FROM wallets WHERE user_id = ? AND kind = ?;");
    walletStmt.bind([userId, kind]);
    const hasRow = walletStmt.step();
    const wallet = hasRow ? walletStmt.getAsObject() : null;
    walletStmt.free();

    if (!wallet) {
      db.run("INSERT INTO wallets (user_id, kind, balance) VALUES (?, ?, ?);", [userId, kind, 0]);
    }

    const currentBalance = wallet ? Number(wallet.balance) : 0;
    const nextBalance = direction === "credit" ? currentBalance + amount : currentBalance - amount;

    if (direction === "debit" && nextBalance < 0) {
      db.run("ROLLBACK;");
      throw new Error("Insufficient funds for this wallet move.");
    }

    db.run("UPDATE wallets SET balance = ? WHERE user_id = ? AND kind = ?;", [nextBalance, userId, kind]);
    db.run(
      `INSERT INTO ledger (id, user_id, kind, direction, amount, reference_type, reference_id, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [crypto.randomUUID(), userId, kind, direction, amount, referenceType, referenceId, description, new Date().toISOString()],
    );
    db.run("COMMIT;");
    saveDb(db);
    return { ok: true as const };
  } catch (err) {
    try {
      db.run("ROLLBACK;");
    } catch {}
    throw err;
  }
}

export async function listVerifiedRetailers() {
  const db = await getDb();
  const stmt = db.prepare("SELECT id, full_name, mobile, business_name, kyc_status FROM users WHERE kyc_status = 'approved' AND json_extract(roles, '$[0]') = 'retailer' ORDER BY full_name ASC;");
  const retailers: any[] = [];
  while (stmt.step()) retailers.push(stmt.getAsObject());
  stmt.free();
  return retailers;
}

export async function insertKycDocument(input: {
  user_id: string;
  doc_type: string;
  file_name: string;
  file_data: string;
}) {
  const db = await getDb();
  db.run(
    `INSERT INTO kyc_documents (id, user_id, doc_type, file_name, file_data, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [crypto.randomUUID(), input.user_id, input.doc_type, input.file_name, input.file_data, "pending", new Date().toISOString()],
  );
  saveDb(db);
  return { ok: true as const };
}

export async function listKycDocuments(userId: string) {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM kyc_documents WHERE user_id = ? ORDER BY created_at DESC;");
  stmt.bind([userId]);
  const documents: any[] = [];
  while (stmt.step()) documents.push(stmt.getAsObject());
  stmt.free();
  return documents;
}

export async function findPendingKyc() {
  const db = await getDb();
  const stmt = db.prepare("SELECT id, full_name, mobile, kyc_status, city, state, created_at FROM users WHERE kyc_status = 'pending' ORDER BY created_at DESC;");
  const pending: any[] = [];
  while (stmt.step()) pending.push(stmt.getAsObject());
  stmt.free();
  return pending;
}

export async function reviewKyc(userId: string, decision: "approved" | "rejected", reviewedBy: string, remarks?: string) {
  const db = await getDb();
  db.run("UPDATE users SET kyc_status = ? WHERE id = ?;", [decision, userId]);
  db.run(
    `UPDATE kyc_documents SET status = ?, reviewed_by = ?, reviewed_at = ?, remarks = ? WHERE user_id = ?;`,
    [decision, reviewedBy, new Date().toISOString(), remarks ?? null, userId],
  );
  saveDb(db);
  return { ok: true as const };
}

export async function createOtp(mobile: string, codeHash: string) {
  const db = await getDb();
  const now = Date.now();
  const id = crypto.randomUUID();
  db.run(
    `INSERT INTO mobile_otps (id, mobile, code_hash, expires_at, attempts, consumed_at, last_sent_at) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [id, mobile, codeHash, new Date(now + 5 * 60_000).toISOString(), 0, null, new Date(now).toISOString()],
  );
  saveDb(db);
  return { ok: true as const };
}

export async function findLatestOtpByMobile(mobile: string) {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM mobile_otps WHERE mobile = ? ORDER BY last_sent_at DESC LIMIT 1;");
  stmt.bind([mobile]);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

export async function consumeOtp(id: string) {
  const db = await getDb();
  db.run("UPDATE mobile_otps SET consumed_at = ? WHERE id = ?;", [new Date().toISOString(), id]);
  saveDb(db);
}

export async function incrementOtpAttempts(id: string, attempts: number) {
  const db = await getDb();
  db.run("UPDATE mobile_otps SET attempts = ? WHERE id = ?;", [attempts, id]);
  saveDb(db);
}

function verifyPasswordHash(password: string, hash: string, salt: string | null) {
  if (!salt) {
    const digest = createHash("sha256").update(password).digest("hex");
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(digest, "hex"));
  }

  const derived = pbkdf2Sync(password, salt, 310000, 64, "sha512").toString("hex");
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}

export async function findUserByUsernameAndPassword(username: string, password: string) {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?;");
  stmt.bind([username]);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  if (!row) return null;
  const passwordHash = row.password_hash as string | null;
  const salt = row.password_salt as string | null;
  if (!passwordHash || !verifyPasswordHash(password, passwordHash, salt)) {
    return null;
  }
  return parseRow(row);
}

export async function updateUserLastLogin(userId: string) {
  const db = await getDb();
  const now = new Date().toISOString();
  db.run("UPDATE users SET last_login_at = ? WHERE id = ?;", [now, userId]);
  saveDb(db);
}
