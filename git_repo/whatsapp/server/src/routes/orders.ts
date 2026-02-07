import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId, now, paginate } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/orders
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
    where += " AND (user_name LIKE ? OR product_name LIKE ? OR id LIKE ?)"
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM orders ${where}`).get(...params) as any).count
  const data = db.prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, lim, offset)

  res.json({ data, total, page: parseInt(page), limit: lim, total_pages: Math.ceil(total / lim) })
})

// POST /api/v1/orders
router.post("/", (req: AuthRequest, res: Response) => {
  const { product_id } = req.body
  if (!product_id) {
    res.status(400).json({ message: "Product ID is required" })
    return
  }

  const product = db.prepare("SELECT * FROM products WHERE id = ? AND is_active = 1").get(product_id) as any
  if (!product) {
    res.status(404).json({ message: "Product not found" })
    return
  }

  const user = db.prepare("SELECT name FROM users WHERE id = ?").get(req.user!.id) as any
  const id = generateId()
  const ts = now()

  db.prepare(
    `INSERT INTO orders (id, user_id, user_name, product_id, product_name, amount, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'Completed', ?)`
  ).run(id, req.user!.id, user.name, product_id, product.name, product.price, ts)

  // Add quota to user
  db.prepare("UPDATE users SET quota = quota + ?, updated_at = ? WHERE id = ?").run(product.quota, ts, req.user!.id)

  // Create transaction
  const txnId = generateId()
  db.prepare(
    `INSERT INTO transactions (id, user_id, user_name, type, amount, description, created_at)
     VALUES (?, ?, ?, 'Credit', ?, ?, ?)`
  ).run(txnId, req.user!.id, user.name, product.price, `${product.name} purchase`, ts)

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id)
  res.status(201).json(order)
})

export default router
