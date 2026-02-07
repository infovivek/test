import bcrypt from "bcryptjs"
import { initDatabase } from "./config/database.js"
import db from "./config/database.js"
import { generateId, now } from "./utils/helpers.js"

async function seed() {
  initDatabase()

  const ts = now()

  // Check if admin already exists
  const existing = db.prepare("SELECT id FROM users WHERE mobile_number = ?").get("+919994472344")
  if (existing) {
    console.log("Seed data already exists. Skipping.")
    return
  }

  console.log("Seeding database...")

  // Create admin user (matches the credentials from the original site)
  const adminId = generateId()
  const adminPassword = await bcrypt.hash("919994472344", 10)
  db.prepare(
    `INSERT INTO users (id, name, mobile_number, password, role, quota, validity, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'admin', 100000, '2026-12-31', ?, ?)`
  ).run(adminId, "Admin", "+919994472344", adminPassword, ts, ts)

  // Create reseller user
  const resellerId = generateId()
  const resellerPassword = await bcrypt.hash("password123", 10)
  db.prepare(
    `INSERT INTO users (id, name, mobile_number, password, role, quota, validity, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'reseller', 50000, '2026-06-30', ?, ?)`
  ).run(resellerId, "Rahul Sharma", "+919876543210", resellerPassword, ts, ts)

  // Create regular users
  const users = [
    { name: "Priya Patel", phone: "+918765432109", quota: 5000 },
    { name: "Amit Kumar", phone: "+917654321098", quota: 2000 },
    { name: "Sneha Gupta", phone: "+916543210987", quota: 15000 },
    { name: "Vikram Singh", phone: "+915432109876", quota: 3000 },
    { name: "Meera Joshi", phone: "+914321098765", quota: 1000 },
  ]

  const userIds: string[] = []
  for (const u of users) {
    const id = generateId()
    userIds.push(id)
    const pwd = await bcrypt.hash("password123", 10)
    db.prepare(
      `INSERT INTO users (id, name, mobile_number, password, role, quota, reseller_id, validity, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'user', ?, ?, '2025-12-31', ?, ?)`
    ).run(id, u.name, u.phone, pwd, u.quota, resellerId, ts, ts)
  }

  // Create instances
  const instances = [
    { name: "Sales-Team", phone: "+91 98765 43210", status: "Connected", webhook: "Enabled" },
    { name: "Support-Bot", phone: "+91 99887 76655", status: "Connected", webhook: "Enabled" },
    { name: "Marketing-WA", phone: "", status: "Disconnected", webhook: "Disabled" },
    { name: "Customer-Service", phone: "+91 91234 56789", status: "Connected", webhook: "Enabled" },
    { name: "Notifications", phone: "+91 87654 32109", status: "Disconnected", webhook: "Disabled" },
  ]

  const instanceIds: string[] = []
  for (const inst of instances) {
    const id = generateId()
    instanceIds.push(id)
    db.prepare(
      `INSERT INTO instances (id, user_id, instance_name, phone_number, connection_status, webhook_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, adminId, inst.name, inst.phone, inst.status, inst.webhook, ts, ts)
  }

  // Create chatbots
  const bots = [
    { name: "Welcome Bot", instance: 0, keyword: "#hello", response: "Welcome! How can I help you today?" },
    { name: "Price Bot", instance: 0, keyword: "#price", response: "Our pricing starts at $9.99/month. Visit our website for details." },
    { name: "Support Bot", instance: 1, keyword: "#help", response: "Our support team will get back to you within 24 hours." },
    { name: "Hours Bot", instance: 1, keyword: "#hours", response: "We are available Mon-Fri 9AM to 6PM IST." },
  ]

  for (const bot of bots) {
    db.prepare(
      `INSERT INTO chatbots (id, user_id, instance_id, instance_name, name, trigger_keyword, response_message, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`
    ).run(generateId(), adminId, instanceIds[bot.instance], instances[bot.instance].name, bot.name, bot.keyword, bot.response, ts)
  }

  // Create products
  const products = [
    { name: "Starter Plan", desc: "For small businesses", price: 999, quota: 1000, days: 30 },
    { name: "Pro Plan", desc: "For growing teams", price: 2999, quota: 5000, days: 30 },
    { name: "Enterprise Plan", desc: "Unlimited features", price: 9999, quota: 25000, days: 30 },
    { name: "Reseller Plan", desc: "For resellers & agencies", price: 19999, quota: 100000, days: 90 },
    { name: "Trial Plan", desc: "Free trial for 7 days", price: 0, quota: 100, days: 7 },
  ]

  const productIds: string[] = []
  for (const p of products) {
    const id = generateId()
    productIds.push(id)
    db.prepare(
      `INSERT INTO products (id, name, description, price, quota, validity_days, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?)`
    ).run(id, p.name, p.desc, p.price, p.quota, p.days, ts)
  }

  // Create sample broadcasts
  const broadcastData = [
    { name: "Diwali Special Offer", inst: 0, status: "Completed", total: 500, sent: 498, delivered: 485, failed: 2 },
    { name: "Weekly Newsletter", inst: 2, status: "Processing", total: 1200, sent: 650, delivered: 640, failed: 5 },
    { name: "Payment Reminder", inst: 1, status: "Scheduled", total: 350, sent: 0, delivered: 0, failed: 0 },
    { name: "New Product Launch", inst: 0, status: "Completed", total: 800, sent: 798, delivered: 790, failed: 2 },
  ]

  for (const b of broadcastData) {
    db.prepare(
      `INSERT INTO broadcasts (id, user_id, name, instance_id, instance_name, status, total_recipients, sent_count, delivered_count, failed_count, message_type, message_content, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'text', 'Sample broadcast message', ?, ?)`
    ).run(generateId(), adminId, b.name, instanceIds[b.inst], instances[b.inst].name, b.status, b.total, b.sent, b.delivered, b.failed, ts, ts)
  }

  // Create sample messages
  const sampleConversations = [
    { phone: "+919876543210", msgs: [
      { content: "Hi! I wanted to ask about the Diwali sale", dir: "incoming" },
      { content: "Hello! Yes, we have amazing offers this Diwali. Up to 50% off!", dir: "outgoing" },
      { content: "That sounds great! Can you send me the catalog?", dir: "incoming" },
      { content: "Sure! Here's our Diwali special catalog.", dir: "outgoing" },
      { content: "Thank you for the update!", dir: "incoming" },
    ]},
    { phone: "+918765432109", msgs: [
      { content: "Hello, I placed an order yesterday", dir: "incoming" },
      { content: "Hi! Let me check your order status.", dir: "outgoing" },
      { content: "Your order #12345 is out for delivery.", dir: "outgoing" },
      { content: "When will the delivery arrive?", dir: "incoming" },
    ]},
  ]

  for (const conv of sampleConversations) {
    for (let i = 0; i < conv.msgs.length; i++) {
      const msg = conv.msgs[i]
      const msgTime = new Date(Date.now() - (conv.msgs.length - i) * 120000).toISOString().replace("T", " ").substring(0, 19)
      db.prepare(
        `INSERT INTO messages (id, instance_id, contact_phone, content, type, direction, status, timestamp)
         VALUES (?, ?, ?, ?, 'text', ?, 'delivered', ?)`
      ).run(generateId(), instanceIds[0], conv.phone, msg.content, msg.dir, msgTime)
    }
  }

  // Create sample orders
  const orderData = [
    { user: resellerId, uname: "Rahul Sharma", prod: 1, pname: "Pro Plan", amount: 2999 },
    { user: userIds[0], uname: "Priya Patel", prod: 0, pname: "Starter Plan", amount: 999 },
    { user: userIds[2], uname: "Sneha Gupta", prod: 3, pname: "Reseller Plan", amount: 19999 },
  ]

  for (const o of orderData) {
    db.prepare(
      `INSERT INTO orders (id, user_id, user_name, product_id, product_name, amount, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Completed', ?)`
    ).run(generateId(), o.user, o.uname, productIds[o.prod], o.pname, o.amount, ts)
  }

  // Create sample transactions
  const txnData = [
    { user: resellerId, uname: "Rahul Sharma", type: "Credit", amount: 2999, desc: "Pro Plan purchase" },
    { user: userIds[0], uname: "Priya Patel", type: "Credit", amount: 999, desc: "Starter Plan purchase" },
    { user: adminId, uname: "Admin", type: "Debit", amount: 500, desc: "Message usage charges" },
    { user: userIds[2], uname: "Sneha Gupta", type: "Credit", amount: 19999, desc: "Reseller Plan purchase" },
    { user: adminId, uname: "Admin", type: "Debit", amount: 1200, desc: "Broadcast charges" },
  ]

  for (const t of txnData) {
    db.prepare(
      `INSERT INTO transactions (id, user_id, user_name, type, amount, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(generateId(), t.user, t.uname, t.type, t.amount, t.desc, ts)
  }

  // Create sample recharges
  const rechargeData = [
    { user: resellerId, uname: "Rahul Sharma", amount: 2999, plan: "Pro Plan", method: "UPI" },
    { user: userIds[0], uname: "Priya Patel", amount: 999, plan: "Starter Plan", method: "Card" },
    { user: userIds[2], uname: "Sneha Gupta", amount: 19999, plan: "Reseller Plan", method: "UPI" },
  ]

  for (const r of rechargeData) {
    db.prepare(
      `INSERT INTO recharges (id, user_id, user_name, amount, plan, payment_method, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Success', ?)`
    ).run(generateId(), r.user, r.uname, r.amount, r.plan, r.method, ts)
  }

  console.log("Seed completed successfully!")
  console.log("\nLogin credentials:")
  console.log("  Admin:    +919994472344 / 919994472344")
  console.log("  Reseller: +919876543210 / password123")
  console.log("  User:     +918765432109 / password123")
}

seed().catch(console.error)
