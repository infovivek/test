import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { generateId } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/settings
router.get("/", (req: AuthRequest, res: Response) => {
  const rows = db.prepare("SELECT key, value FROM settings WHERE user_id = ?").all(req.user!.id) as any[]
  const settings: Record<string, string> = {}
  for (const row of rows) {
    settings[row.key] = row.value
  }
  res.json(settings)
})

// PUT /api/v1/settings
router.put("/", (req: AuthRequest, res: Response) => {
  const entries = Object.entries(req.body)
  const upsert = db.prepare(
    `INSERT INTO settings (id, user_id, key, value) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value`
  )

  const txn = db.transaction(() => {
    for (const [key, value] of entries) {
      upsert.run(generateId(), req.user!.id, key, String(value))
    }
  })
  txn()

  res.json({ message: "Settings saved" })
})

// GET /api/v1/whitelabel/me
router.get("/whitelabel", (req: AuthRequest, res: Response) => {
  const rows = db.prepare("SELECT key, value FROM settings WHERE user_id = ? AND key LIKE 'wl_%'").all(req.user!.id) as any[]
  const whitelabel: Record<string, string> = {}
  for (const row of rows) {
    whitelabel[row.key.replace("wl_", "")] = row.value
  }
  res.json(whitelabel)
})

// PUT /api/v1/whitelabel/me
router.put("/whitelabel", (req: AuthRequest, res: Response) => {
  const entries = Object.entries(req.body)
  const upsert = db.prepare(
    `INSERT INTO settings (id, user_id, key, value) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value`
  )

  const txn = db.transaction(() => {
    for (const [key, value] of entries) {
      upsert.run(generateId(), req.user!.id, `wl_${key}`, String(value))
    }
  })
  txn()

  res.json({ message: "White-label settings saved" })
})

export default router
