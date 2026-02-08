import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId, now } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/contacts
router.get("/", (req: AuthRequest, res: Response) => {
  const { search = "" } = req.query as any
  let where = "WHERE user_id = ?"
  const params: any[] = [req.user!.id]

  if (search) {
    where += " AND (name LIKE ? OR phone_number LIKE ?)"
    params.push(`%${search}%`, `%${search}%`)
  }

  const data = db.prepare(`SELECT * FROM contacts ${where} ORDER BY created_at DESC`).all(...params)
  res.json({ data })
})

// POST /api/v1/contacts
router.post("/", (req: AuthRequest, res: Response) => {
  const { name, phone_number, tags } = req.body
  if (!name || !phone_number) {
    res.status(400).json({ message: "Name and phone number are required" })
    return
  }

  const id = generateId()
  db.prepare(
    `INSERT INTO contacts (id, user_id, name, phone_number, tags, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, req.user!.id, name, phone_number.replace(/\s/g, ""), JSON.stringify(tags || []), now())

  const contact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(id)
  res.status(201).json(contact)
})

// DELETE /api/v1/contacts/:id
router.delete("/:id", (req: AuthRequest, res: Response) => {
  db.prepare("DELETE FROM contacts WHERE id = ? AND user_id = ?").run(req.params.id, req.user!.id)
  res.json({ message: "Contact deleted" })
})

export default router
