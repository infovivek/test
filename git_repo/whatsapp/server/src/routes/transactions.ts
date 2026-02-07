import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { paginate } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/transactions
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
    where += " AND (user_name LIKE ? OR description LIKE ? OR id LIKE ?)"
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM transactions ${where}`).get(...params) as any).count
  const data = db.prepare(`SELECT * FROM transactions ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, lim, offset)

  res.json({ data, total, page: parseInt(page), limit: lim, total_pages: Math.ceil(total / lim) })
})

export default router
