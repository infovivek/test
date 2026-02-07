import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import db from "../config/database.js"

export interface AuthRequest extends Request {
  user?: { id: string; role: string; name: string; mobileNumber: string }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" })
    return
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string }
    const user = db.prepare("SELECT id, name, mobile_number, role FROM users WHERE id = ?").get(decoded.id) as any
    if (!user) {
      res.status(401).json({ message: "User not found" })
      return
    }
    req.user = { id: user.id, role: user.role, name: user.name, mobileNumber: user.mobile_number }
    next()
  } catch {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin access required" })
    return
  }
  next()
}
