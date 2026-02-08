import { Router, Response } from "express"
import bcrypt from "bcryptjs"
import db from "../config/database.js"
import { authMiddleware, adminMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId, now, paginate } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/users
router.get("/", (req: AuthRequest, res: Response) => {
  const { search = "", page = "1", limit = "20" } = req.query as any
  const { offset, limit: lim } = paginate(parseInt(page), parseInt(limit))

  let where = "WHERE 1=1"
  const params: any[] = []

  // Non-admin users can only see users under them
  if (req.user!.role === "reseller") {
    where += " AND reseller_id = ?"
    params.push(req.user!.id)
  }

  if (search) {
    where += " AND (name LIKE ? OR mobile_number LIKE ?)"
    params.push(`%${search}%`, `%${search}%`)
  }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM users ${where}`).get(...params) as any).count
  const data = db.prepare(
    `SELECT id, name, mobile_number, role, login_status, quota, quota_used, validity, reseller_id, created_at
     FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, lim, offset)

  res.json({ data, total, page: parseInt(page), limit: lim, total_pages: Math.ceil(total / lim) })
})

// POST /api/v1/users
router.post("/", async (req: AuthRequest, res: Response) => {
  if (req.user!.role === "user") {
    res.status(403).json({ message: "Not authorized to create users" })
    return
  }

  const { name, mobile_number, password, role = "user", quota = 1000, validity } = req.body
  if (!name || !mobile_number || !password) {
    res.status(400).json({ message: "Name, mobile number, and password are required" })
    return
  }

  const cleanPhone = mobile_number.replace(/\s/g, "")
  const existing = db.prepare("SELECT id FROM users WHERE mobile_number = ?").get(cleanPhone)
  if (existing) {
    res.status(409).json({ message: "Mobile number already exists" })
    return
  }

  const id = generateId()
  const ts = now()
  const hashedPassword = await bcrypt.hash(password, 10)

  db.prepare(
    `INSERT INTO users (id, name, mobile_number, password, role, quota, validity, reseller_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name, cleanPhone, hashedPassword, role, quota, validity || "2025-12-31", req.user!.role === "reseller" ? req.user!.id : null, ts, ts)

  const user = db.prepare("SELECT id, name, mobile_number, role, login_status, quota, validity, created_at FROM users WHERE id = ?").get(id)
  res.status(201).json(user)
})

// PUT /api/v1/users/:id
router.put("/:id", async (req: AuthRequest, res: Response) => {
  const { name, role, login_status, quota, validity, password } = req.body
  const ts = now()

  let passwordUpdate = ""
  const params: any[] = [name, role, login_status, quota, validity, ts]

  if (password) {
    const hashed = await bcrypt.hash(password, 10)
    passwordUpdate = ", password = ?"
    params.push(hashed)
  }

  params.push(req.params.id)

  db.prepare(
    `UPDATE users SET
      name = COALESCE(?, name),
      role = COALESCE(?, role),
      login_status = COALESCE(?, login_status),
      quota = COALESCE(?, quota),
      validity = COALESCE(?, validity),
      updated_at = ?
      ${passwordUpdate}
     WHERE id = ?`
  ).run(...params)

  const user = db.prepare("SELECT id, name, mobile_number, role, login_status, quota, validity FROM users WHERE id = ?").get(req.params.id)
  res.json(user)
})

// DELETE /api/v1/users/:id
router.delete("/:id", adminMiddleware, (req: AuthRequest, res: Response) => {
  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id)
  res.json({ message: "User deleted" })
})

export default router
