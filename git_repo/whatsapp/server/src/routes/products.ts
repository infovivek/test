import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId, now } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/products
router.get("/", (_req: AuthRequest, res: Response) => {
  const data = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all()
  res.json({ data })
})

// POST /api/v1/products
router.post("/", (req: AuthRequest, res: Response) => {
  const { name, description, price, quota, validity_days = 30 } = req.body
  if (!name || price === undefined) {
    res.status(400).json({ message: "Name and price are required" })
    return
  }

  const id = generateId()
  db.prepare(
    `INSERT INTO products (id, name, description, price, quota, validity_days, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name, description || "", price, quota || 0, validity_days, now())

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  res.status(201).json(product)
})

// PUT /api/v1/products/:id
router.put("/:id", (req: AuthRequest, res: Response) => {
  const { name, description, price, quota, validity_days, is_active } = req.body
  db.prepare(
    `UPDATE products SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      quota = COALESCE(?, quota),
      validity_days = COALESCE(?, validity_days),
      is_active = COALESCE(?, is_active)
     WHERE id = ?`
  ).run(name, description, price, quota, validity_days, is_active !== undefined ? (is_active ? 1 : 0) : null, req.params.id)

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id)
  res.json(product)
})

// DELETE /api/v1/products/:id
router.delete("/:id", (req: AuthRequest, res: Response) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id)
  res.json({ message: "Product deleted" })
})

export default router
