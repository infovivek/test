import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId, now } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/chatbots
router.get("/", (req: AuthRequest, res: Response) => {
  const data = db.prepare("SELECT * FROM chatbots WHERE user_id = ? ORDER BY created_at DESC").all(req.user!.id)
  res.json({ data })
})

// POST /api/v1/chatbots
router.post("/", (req: AuthRequest, res: Response) => {
  const { name, instance_name, trigger_keyword, response_message } = req.body
  if (!name || !instance_name || !trigger_keyword || !response_message) {
    res.status(400).json({ message: "All fields are required" })
    return
  }

  const instance = db.prepare("SELECT * FROM instances WHERE instance_name = ? AND user_id = ?").get(instance_name, req.user!.id) as any
  if (!instance) {
    res.status(404).json({ message: "Instance not found" })
    return
  }

  const id = generateId()
  db.prepare(
    `INSERT INTO chatbots (id, user_id, instance_id, instance_name, name, trigger_keyword, response_message, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, req.user!.id, instance.id, instance_name, name, trigger_keyword, response_message, now())

  const bot = db.prepare("SELECT * FROM chatbots WHERE id = ?").get(id)
  res.status(201).json(bot)
})

// PUT /api/v1/chatbots/:id
router.put("/:id", (req: AuthRequest, res: Response) => {
  const bot = db.prepare("SELECT * FROM chatbots WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id)
  if (!bot) {
    res.status(404).json({ message: "Chatbot not found" })
    return
  }

  const { name, trigger_keyword, response_message, is_active } = req.body
  db.prepare(
    `UPDATE chatbots SET
      name = COALESCE(?, name),
      trigger_keyword = COALESCE(?, trigger_keyword),
      response_message = COALESCE(?, response_message),
      is_active = COALESCE(?, is_active)
     WHERE id = ?`
  ).run(name, trigger_keyword, response_message, is_active !== undefined ? (is_active ? 1 : 0) : null, req.params.id)

  const updated = db.prepare("SELECT * FROM chatbots WHERE id = ?").get(req.params.id)
  res.json(updated)
})

// DELETE /api/v1/chatbots/:id
router.delete("/:id", (req: AuthRequest, res: Response) => {
  const bot = db.prepare("SELECT * FROM chatbots WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id)
  if (!bot) {
    res.status(404).json({ message: "Chatbot not found" })
    return
  }
  db.prepare("DELETE FROM chatbots WHERE id = ?").run(req.params.id)
  res.json({ message: "Chatbot deleted" })
})

export default router
