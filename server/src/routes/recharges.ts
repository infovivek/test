import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId, now, paginate } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/recharges
router.get("/", (req: AuthRequest, res: Response) => {
  const { search = "", page = "1", limit = "20" } = req.query as any
  const { offset, limit: lim } = paginate(parseInt(page), parseInt(limit))

  let where = "WHERE 1=1"
  const params: any[] = []

  if (req.user!.role === "user") {
    where += " AND user_id = ?"
    params.push(req.user!.id)
  }

  if (search) {
    where += " AND (user_name LIKE ? OR plan LIKE ?)"
    params.push(`%${search}%`, `%${search}%`)
  }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM recharges ${where}`).get(...params) as any).count
  const data = db.prepare(`SELECT * FROM recharges ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, lim, offset)

  res.json({ data, total, page: parseInt(page), limit: lim, total_pages: Math.ceil(total / lim) })
})

// POST /api/v1/recharges
router.post("/", (req: AuthRequest, res: Response) => {
  const { amount, plan, payment_method } = req.body
  if (!amount) {
    res.status(400).json({ message: "Amount is required" })
    return
  }

  const user = db.prepare("SELECT name FROM users WHERE id = ?").get(req.user!.id) as any
  const id = generateId()
  const ts = now()

  db.prepare(
    `INSERT INTO recharges (id, user_id, user_name, amount, plan, payment_method, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'Success', ?)`
  ).run(id, req.user!.id, user.name, amount, plan || "Wallet Top-up", payment_method || "UPI", ts)

  // Add quota
  db.prepare("UPDATE users SET quota = quota + ?, updated_at = ? WHERE id = ?").run(Math.floor(amount / 1), ts, req.user!.id)

  // Create transaction
  const txnId = generateId()
  db.prepare(
    `INSERT INTO transactions (id, user_id, user_name, type, amount, description, created_at)
     VALUES (?, ?, ?, 'Credit', ?, ?, ?)`
  ).run(txnId, req.user!.id, user.name, amount, `Recharge: ${plan || "Wallet Top-up"}`, ts)

  const recharge = db.prepare("SELECT * FROM recharges WHERE id = ?").get(id)
  res.status(201).json(recharge)
})

export default router
