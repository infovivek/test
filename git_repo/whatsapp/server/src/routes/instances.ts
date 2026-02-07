import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId, now, paginate, buildSearchClause } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/instances
router.get("/", (req: AuthRequest, res: Response) => {
  const { search = "", connection_status, webhook_status, page = "1", limit = "50" } = req.query as any
  const { offset, limit: lim } = paginate(parseInt(page), parseInt(limit))

  let where = "WHERE user_id = ?"
  const params: any[] = [req.user!.id]

  if (search) {
    const s = buildSearchClause(search, ["instance_name", "phone_number"])
    where += ` ${s.clause}`
    params.push(...s.params)
  }
  if (connection_status && connection_status !== "All") {
    where += " AND connection_status = ?"
    params.push(connection_status)
  }
  if (webhook_status && webhook_status !== "All") {
    where += " AND webhook_status = ?"
    params.push(webhook_status)
  }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM instances ${where}`).get(...params) as any).count
  const data = db.prepare(`SELECT * FROM instances ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, lim, offset)

  res.json({ data, total, page: parseInt(page), limit: lim, total_pages: Math.ceil(total / lim) })
})

// GET /api/v1/instances/:id
router.get("/:id", (req: AuthRequest, res: Response) => {
  const instance = db.prepare("SELECT * FROM instances WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id)
  if (!instance) {
    res.status(404).json({ message: "Instance not found" })
    return
  }
  res.json(instance)
})

// POST /api/v1/instances
router.post("/", (req: AuthRequest, res: Response) => {
  const { instance_name, webhook_url } = req.body
  if (!instance_name) {
    res.status(400).json({ message: "Instance name is required" })
    return
  }

  const id = generateId()
  const ts = now()

  db.prepare(
    `INSERT INTO instances (id, user_id, instance_name, webhook_url, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, req.user!.id, instance_name, webhook_url || "", ts, ts)

  const instance = db.prepare("SELECT * FROM instances WHERE id = ?").get(id)
  res.status(201).json(instance)
})

// PUT /api/v1/instances/:id
router.put("/:id", (req: AuthRequest, res: Response) => {
  const instance = db.prepare("SELECT * FROM instances WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id) as any
  if (!instance) {
    res.status(404).json({ message: "Instance not found" })
    return
  }

  const { instance_name, webhook_url, webhook_status } = req.body
  const ts = now()

  db.prepare(
    `UPDATE instances SET
      instance_name = COALESCE(?, instance_name),
      webhook_url = COALESCE(?, webhook_url),
      webhook_status = COALESCE(?, webhook_status),
      updated_at = ?
     WHERE id = ?`
  ).run(instance_name, webhook_url, webhook_status, ts, req.params.id)

  const updated = db.prepare("SELECT * FROM instances WHERE id = ?").get(req.params.id)
  res.json(updated)
})

// DELETE /api/v1/instances/:id
router.delete("/:id", (req: AuthRequest, res: Response) => {
  const instance = db.prepare("SELECT * FROM instances WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id)
  if (!instance) {
    res.status(404).json({ message: "Instance not found" })
    return
  }

  db.prepare("DELETE FROM messages WHERE instance_id = ?").run(req.params.id)
  db.prepare("DELETE FROM chatbots WHERE instance_id = ?").run(req.params.id)
  db.prepare("DELETE FROM instances WHERE id = ?").run(req.params.id)

  res.json({ message: "Instance deleted" })
})

// GET /api/v1/instances/:id/qr
router.get("/:id/qr", (req: AuthRequest, res: Response) => {
  const instance = db.prepare("SELECT * FROM instances WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id) as any
  if (!instance) {
    res.status(404).json({ message: "Instance not found" })
    return
  }
  res.json({ qr_code: instance.qr_code || "", instance_name: instance.instance_name })
})

export default router
