import { Router, Request, Response } from "express"
import bcrypt from "bcryptjs"
import db from "../config/database.js"
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js"
import { generateId, now } from "../utils/helpers.js"
import { authMiddleware, AuthRequest } from "../middleware/auth.js"

const router = Router()

// POST /api/v1/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, mobileNumber, password, confirmPassword } = req.body

    if (!name || !mobileNumber || !password) {
      res.status(400).json({ message: "Name, mobile number and password are required" })
      return
    }
    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" })
      return
    }

    const cleanPhone = mobileNumber.replace(/\s/g, "")
    const existing = db.prepare("SELECT id FROM users WHERE mobile_number = ?").get(cleanPhone)
    if (existing) {
      res.status(409).json({ message: "Mobile number already registered" })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = generateId()
    const ts = now()

    db.prepare(
      `INSERT INTO users (id, name, mobile_number, password, role, quota, validity, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'user', 1000, ?, ?, ?)`
    ).run(id, name, cleanPhone, hashedPassword, "2025-12-31", ts, ts)

    const user = { id, name, mobileNumber: cleanPhone, role: "user" }
    const tokens = generateTokens({ id, role: "user" })

    res.status(201).json({ tokens, user })
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Registration failed" })
  }
})

// POST /api/v1/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { mobileNumber, password } = req.body

    if (!mobileNumber || !password) {
      res.status(400).json({ message: "Mobile number and password are required" })
      return
    }

    const cleanPhone = mobileNumber.replace(/\s/g, "")
    const user = db.prepare("SELECT * FROM users WHERE mobile_number = ?").get(cleanPhone) as any

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" })
      return
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ message: "Invalid credentials" })
      return
    }

    if (user.login_status === "Inactive") {
      res.status(403).json({ message: "Account is inactive. Contact admin." })
      return
    }

    const tokens = generateTokens({ id: user.id, role: user.role })

    res.json({
      tokens,
      user: {
        id: user.id,
        name: user.name,
        mobileNumber: user.mobile_number,
        role: user.role,
        email: user.email,
      },
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Login failed" })
  }
})

// POST /api/v1/auth/refresh
router.post("/refresh", (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body
    if (!refresh_token) {
      res.status(400).json({ message: "Refresh token required" })
      return
    }

    const decoded = verifyRefreshToken(refresh_token)
    const user = db.prepare("SELECT id, role FROM users WHERE id = ?").get(decoded.id) as any
    if (!user) {
      res.status(401).json({ message: "User not found" })
      return
    }

    const tokens = generateTokens({ id: user.id, role: user.role })
    res.json(tokens)
  } catch {
    res.status(401).json({ message: "Invalid refresh token" })
  }
})

// GET /api/v1/auth/me
router.get("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  const user = db.prepare("SELECT id, name, mobile_number, role, email, quota, quota_used, validity, created_at FROM users WHERE id = ?").get(req.user!.id) as any
  if (!user) {
    res.status(404).json({ message: "User not found" })
    return
  }
  res.json({
    ...user,
    mobileNumber: user.mobile_number,
  })
})

// POST /api/v1/auth/forgot-password
router.post("/forgot-password", (req: Request, res: Response) => {
  const { mobileNumber } = req.body
  // In production, send OTP/SMS. For now, just acknowledge.
  res.json({ message: "Password reset instructions sent to your phone." })
})

export default router
