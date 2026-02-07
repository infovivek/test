import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import { env } from "./env.js"

const dbDir = path.dirname(path.resolve(env.DB_PATH))
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(path.resolve(env.DB_PATH))

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mobile_number TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin','reseller','user')),
      login_status TEXT NOT NULL DEFAULT 'Active' CHECK(login_status IN ('Active','Inactive')),
      quota INTEGER NOT NULL DEFAULT 1000,
      quota_used INTEGER NOT NULL DEFAULT 0,
      validity TEXT,
      reseller_id TEXT,
      email TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS instances (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      instance_name TEXT NOT NULL,
      phone_number TEXT DEFAULT '',
      connection_status TEXT NOT NULL DEFAULT 'Disconnected' CHECK(connection_status IN ('Connected','Disconnected')),
      webhook_status TEXT NOT NULL DEFAULT 'Disabled' CHECK(webhook_status IN ('Enabled','Disabled')),
      webhook_url TEXT DEFAULT '',
      qr_code TEXT DEFAULT '',
      session_data TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      instance_id TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'text' CHECK(type IN ('text','image','video','document','audio')),
      direction TEXT NOT NULL CHECK(direction IN ('incoming','outgoing')),
      status TEXT NOT NULL DEFAULT 'sent' CHECK(status IN ('pending','sent','delivered','read','failed')),
      media_url TEXT DEFAULT '',
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (instance_id) REFERENCES instances(id)
    );

    CREATE TABLE IF NOT EXISTS broadcasts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      instance_id TEXT NOT NULL,
      instance_name TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending','Processing','Completed','Failed','Scheduled')),
      total_recipients INTEGER NOT NULL DEFAULT 0,
      sent_count INTEGER NOT NULL DEFAULT 0,
      delivered_count INTEGER NOT NULL DEFAULT 0,
      failed_count INTEGER NOT NULL DEFAULT 0,
      message_type TEXT NOT NULL DEFAULT 'text',
      message_content TEXT NOT NULL DEFAULT '',
      media_url TEXT DEFAULT '',
      recipients TEXT NOT NULL DEFAULT '[]',
      scheduled_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (instance_id) REFERENCES instances(id)
    );

    CREATE TABLE IF NOT EXISTS chatbots (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      instance_id TEXT NOT NULL,
      instance_name TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      trigger_keyword TEXT NOT NULL,
      response_message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (instance_id) REFERENCES instances(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL DEFAULT 0,
      quota INTEGER NOT NULL DEFAULT 0,
      validity_days INTEGER NOT NULL DEFAULT 30,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL DEFAULT '',
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL DEFAULT '',
      amount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending','Completed','Failed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL CHECK(type IN ('Credit','Debit')),
      amount REAL NOT NULL DEFAULT 0,
      description TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS recharges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL DEFAULT '',
      amount REAL NOT NULL DEFAULT 0,
      plan TEXT DEFAULT '',
      payment_method TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Success','Failed','Pending')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, key)
    );
  `)

  console.log("Database initialized successfully")
}

export default db
