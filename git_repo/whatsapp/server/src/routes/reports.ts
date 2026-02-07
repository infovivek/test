import { Router, Response } from "express"
import db from "../config/database.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"
import { paginate } from "../utils/helpers.js"

const router = Router()
router.use(authMiddleware)

// GET /api/v1/reports/delivery
router.get("/delivery", (req: AuthRequest, res: Response) => {
  const { search = "", status, date_from, date_to, page = "1", limit = "50" } = req.query as any
  const { offset, limit: lim } = paginate(parseInt(page), parseInt(limit))

  let where = "WHERE m.instance_id IN (SELECT id FROM instances WHERE user_id = ?)"
  const params: any[] = [req.user!.id]

  if (search) {
    where += " AND (m.contact_phone LIKE ? OR i.instance_name LIKE ?)"
    params.push(`%${search}%`, `%${search}%`)
  }
  if (status && status !== "All") {
    where += " AND m.status = ?"
    params.push(status.toLowerCase())
  }
  if (date_from) { where += " AND m.timestamp >= ?"; params.push(date_from) }
  if (date_to) { where += " AND m.timestamp <= ?"; params.push(date_to + " 23:59:59") }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM messages m JOIN instances i ON m.instance_id = i.id ${where}`).get(...params) as any).count
  const data = db.prepare(
    `SELECT m.id, m.contact_phone as phone, i.instance_name as instance, m.type, m.status, m.timestamp
     FROM messages m JOIN instances i ON m.instance_id = i.id
     ${where} ORDER BY m.timestamp DESC LIMIT ? OFFSET ?`
  ).all(...params, lim, offset)

  res.json({ data, total, page: parseInt(page), limit: lim })
})

// GET /api/v1/reports/inbox
router.get("/inbox", (req: AuthRequest, res: Response) => {
  const { search = "", page = "1", limit = "50" } = req.query as any
  const { offset, limit: lim } = paginate(parseInt(page), parseInt(limit))

  let where = "WHERE m.instance_id IN (SELECT id FROM instances WHERE user_id = ?)"
  const params: any[] = [req.user!.id]

  if (search) {
    where += " AND (m.contact_phone LIKE ? OR m.content LIKE ?)"
    params.push(`%${search}%`, `%${search}%`)
  }

  const data = db.prepare(
    `SELECT m.id, m.contact_phone as phone, i.instance_name as instance, m.content as message, m.direction, m.timestamp
     FROM messages m JOIN instances i ON m.instance_id = i.id
     ${where} ORDER BY m.timestamp DESC LIMIT ? OFFSET ?`
  ).all(...params, lim, offset)

  res.json({ data })
})

// GET /api/v1/reports/queue
router.get("/queue", (req: AuthRequest, res: Response) => {
  const data = db.prepare(
    `SELECT m.id, m.contact_phone as phone, i.instance_name as instance, m.content as message, m.status, m.timestamp as created
     FROM messages m JOIN instances i ON m.instance_id = i.id
     WHERE m.status = 'pending' AND i.user_id = ?
     ORDER BY m.timestamp ASC`
  ).all(req.user!.id)

  res.json({ data })
})

// GET /api/v1/reports/connection
router.get("/connection", (req: AuthRequest, res: Response) => {
  const data = db.prepare(
    `SELECT id, instance_name as instance, phone_number as phone, connection_status as status,
            updated_at as last_connected
     FROM instances WHERE user_id = ? ORDER BY updated_at DESC`
  ).all(req.user!.id)

  res.json({ data })
})

// GET /api/v1/reports/expiry
router.get("/expiry", (req: AuthRequest, res: Response) => {
  let where = "WHERE 1=1"
  const params: any[] = []

  if (req.user!.role === "user") {
    where += " AND id = ?"
    params.push(req.user!.id)
  }

  const data = db.prepare(
    `SELECT id, name as user, quota, quota_used as used, validity,
            CASE
              WHEN validity < datetime('now') THEN 'Expired'
              WHEN validity < datetime('now', '+7 days') THEN 'Expiring Soon'
              ELSE 'Active'
            END as status
     FROM users ${where} ORDER BY validity ASC`
  ).all(...params)

  res.json({ data })
})

// GET /api/v1/reports/today-usage
router.get("/today-usage", (req: AuthRequest, res: Response) => {
  const today = new Date().toISOString().split("T")[0]

  const data = db.prepare(`
    SELECT u.name as user, i.instance_name as instance,
           COUNT(CASE WHEN m.direction = 'outgoing' THEN 1 END) as sent,
           COUNT(CASE WHEN m.status = 'delivered' THEN 1 END) as delivered,
           COUNT(CASE WHEN m.status = 'failed' THEN 1 END) as failed,
           MAX(m.timestamp) as last_active
    FROM messages m
    JOIN instances i ON m.instance_id = i.id
    JOIN users u ON i.user_id = u.id
    WHERE m.timestamp >= ? AND i.user_id = ?
    GROUP BY u.id, i.id
    ORDER BY last_active DESC
  `).all(today, req.user!.id)

  const stats = db.prepare(`
    SELECT
      COUNT(CASE WHEN direction = 'outgoing' THEN 1 END) as total_sent,
      COUNT(CASE WHEN status = 'delivered' THEN 1 END) as total_delivered,
      COUNT(CASE WHEN status = 'failed' THEN 1 END) as total_failed,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as total_queue
    FROM messages
    WHERE timestamp >= ? AND instance_id IN (SELECT id FROM instances WHERE user_id = ?)
  `).get(today, req.user!.id)

  res.json({ data, stats })
})

export default router
