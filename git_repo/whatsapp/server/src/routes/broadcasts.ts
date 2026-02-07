import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId, now, paginate } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/broadcasts
router.get("/", (req: AuthRequest, res: Response) => {
  const { search = "", page = "1", limit = "20" } = req.query as any
  const { offset, limit: lim } = paginate(parseInt(page), parseInt(limit))

  let where = "WHERE user_id = ?"
  const params: any[] = [req.user!.id]

  if (search) {
    where += " AND (name LIKE ? OR instance_name LIKE ?)"
    params.push(`%${search}%`, `%${search}%`)
  }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM broadcasts ${where}`).get(...params) as any).count
  const data = db.prepare(`SELECT * FROM broadcasts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, lim, offset)

  res.json({ data, total, page: parseInt(page), limit: lim, total_pages: Math.ceil(total / lim) })
})

// POST /api/v1/broadcasts
router.post("/", (req: AuthRequest, res: Response) => {
  const { name, instance_name, message_type = "text", message_content, media_url, recipients = [], scheduled_at } = req.body

  if (!name || !instance_name || !message_content) {
    res.status(400).json({ message: "name, instance_name, and message_content are required" })
    return
  }

  const instance = db.prepare("SELECT * FROM instances WHERE instance_name = ? AND user_id = ?").get(instance_name, req.user!.id) as any
  if (!instance) {
    res.status(404).json({ message: "Instance not found" })
    return
  }

  const id = generateId()
  const ts = now()
  const status = scheduled_at ? "Scheduled" : "Pending"
  const recipientList = Array.isArray(recipients) ? recipients : []

  db.prepare(
    `INSERT INTO broadcasts (id, user_id, name, instance_id, instance_name, status, total_recipients, message_type, message_content, media_url, recipients, scheduled_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, req.user!.id, name, instance.id, instance_name, status, recipientList.length, message_type, message_content, media_url || "", JSON.stringify(recipientList), scheduled_at || null, ts, ts)

  // Process broadcast asynchronously (simulate)
  if (!scheduled_at) {
    processBroadcast(id, instance.id, recipientList, message_content, message_type, req.user!.id)
  }

  const broadcast = db.prepare("SELECT * FROM broadcasts WHERE id = ?").get(id)
  res.status(201).json(broadcast)
})

// GET /api/v1/broadcasts/:id
router.get("/:id", (req: AuthRequest, res: Response) => {
  const broadcast = db.prepare("SELECT * FROM broadcasts WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id)
  if (!broadcast) {
    res.status(404).json({ message: "Broadcast not found" })
    return
  }
  res.json(broadcast)
})

// DELETE /api/v1/broadcasts/:id
router.delete("/:id", (req: AuthRequest, res: Response) => {
  const broadcast = db.prepare("SELECT * FROM broadcasts WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id)
  if (!broadcast) {
    res.status(404).json({ message: "Broadcast not found" })
    return
  }
  db.prepare("DELETE FROM broadcasts WHERE id = ?").run(req.params.id)
  res.json({ message: "Broadcast deleted" })
})

async function processBroadcast(broadcastId: string, instanceId: string, recipients: string[], content: string, type: string, userId: string) {
  db.prepare("UPDATE broadcasts SET status = 'Processing', updated_at = ? WHERE id = ?").run(now(), broadcastId)

  let sent = 0, delivered = 0, failed = 0

  for (const phone of recipients) {
    try {
      const msgId = generateId()
      const ts = now()
      db.prepare(
        `INSERT INTO messages (id, instance_id, contact_phone, content, type, direction, status, timestamp)
         VALUES (?, ?, ?, ?, ?, 'outgoing', 'delivered', ?)`
      ).run(msgId, instanceId, phone.replace(/\s/g, ""), content, type, ts)
      sent++
      delivered++
    } catch {
      failed++
    }
  }

  db.prepare("UPDATE users SET quota_used = quota_used + ?, updated_at = ? WHERE id = ?").run(sent, now(), userId)

  db.prepare(
    `UPDATE broadcasts SET status = 'Completed', sent_count = ?, delivered_count = ?, failed_count = ?, updated_at = ? WHERE id = ?`
  ).run(sent, delivered, failed, now(), broadcastId)
}

export default router
