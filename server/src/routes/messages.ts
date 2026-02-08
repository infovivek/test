import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId, now } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// POST /api/v1/messages/send-text
router.post("/send-text", (req: AuthRequest, res: Response) => {
  const { instance_name, phone, message } = req.body
  if (!instance_name || !phone || !message) {
    res.status(400).json({ message: "instance_name, phone, and message are required" })
    return
  }

  const instance = db.prepare("SELECT * FROM instances WHERE instance_name = ? AND user_id = ?").get(instance_name, req.user!.id) as any
  if (!instance) {
    res.status(404).json({ message: "Instance not found" })
    return
  }

  const id = generateId()
  const ts = now()

  db.prepare(
    `INSERT INTO messages (id, instance_id, contact_phone, content, type, direction, status, timestamp)
     VALUES (?, ?, ?, ?, 'text', 'outgoing', 'sent', ?)`
  ).run(id, instance.id, phone.replace(/\s/g, ""), message, ts)

  // Decrement quota
  db.prepare("UPDATE users SET quota_used = quota_used + 1, updated_at = ? WHERE id = ?").run(ts, req.user!.id)

  // Check chatbot triggers
  checkChatbotTrigger(instance.id, phone, message)

  res.json({ id, status: "sent", timestamp: ts })
})

// POST /api/v1/messages/send-media
router.post("/send-media", (req: AuthRequest, res: Response) => {
  const { instance_name, phone, media_url, caption, type = "image" } = req.body
  if (!instance_name || !phone || !media_url) {
    res.status(400).json({ message: "instance_name, phone, and media_url are required" })
    return
  }

  const instance = db.prepare("SELECT * FROM instances WHERE instance_name = ? AND user_id = ?").get(instance_name, req.user!.id) as any
  if (!instance) {
    res.status(404).json({ message: "Instance not found" })
    return
  }

  const id = generateId()
  const ts = now()

  db.prepare(
    `INSERT INTO messages (id, instance_id, contact_phone, content, type, direction, status, media_url, timestamp)
     VALUES (?, ?, ?, ?, ?, 'outgoing', 'sent', ?, ?)`
  ).run(id, instance.id, phone.replace(/\s/g, ""), caption || "", type, media_url, ts)

  db.prepare("UPDATE users SET quota_used = quota_used + 1, updated_at = ? WHERE id = ?").run(ts, req.user!.id)

  res.json({ id, status: "sent", timestamp: ts })
})

// GET /api/v1/messages/conversations/:instanceId
router.get("/conversations/:instanceId", (req: AuthRequest, res: Response) => {
  const instance = db.prepare("SELECT * FROM instances WHERE id = ? AND user_id = ?").get(req.params.instanceId, req.user!.id)
  if (!instance) {
    res.status(404).json({ message: "Instance not found" })
    return
  }

  const conversations = db.prepare(`
    SELECT contact_phone,
           MAX(content) as last_message,
           MAX(timestamp) as last_message_time,
           SUM(CASE WHEN direction = 'incoming' AND status != 'read' THEN 1 ELSE 0 END) as unread_count
    FROM messages
    WHERE instance_id = ?
    GROUP BY contact_phone
    ORDER BY last_message_time DESC
  `).all(req.params.instanceId)

  res.json({ data: conversations })
})

// GET /api/v1/messages/chat/:instanceId/:phone
router.get("/chat/:instanceId/:phone", (req: AuthRequest, res: Response) => {
  const { page = "1", limit = "50" } = req.query as any
  const offset = (parseInt(page) - 1) * parseInt(limit)

  const messages = db.prepare(`
    SELECT * FROM messages
    WHERE instance_id = ? AND contact_phone = ?
    ORDER BY timestamp ASC
    LIMIT ? OFFSET ?
  `).all(req.params.instanceId, req.params.phone, parseInt(limit), offset)

  res.json({ data: messages })
})

function checkChatbotTrigger(instanceId: string, phone: string, message: string) {
  const bots = db.prepare("SELECT * FROM chatbots WHERE instance_id = ? AND is_active = 1").all(instanceId) as any[]
  for (const bot of bots) {
    if (message.toLowerCase().includes(bot.trigger_keyword.toLowerCase())) {
      const id = generateId()
      const ts = now()
      db.prepare(
        `INSERT INTO messages (id, instance_id, contact_phone, content, type, direction, status, timestamp)
         VALUES (?, ?, ?, ?, 'text', 'outgoing', 'sent', ?)`
      ).run(id, instanceId, phone, bot.response_message, ts)
    }
  }
}

export default router
