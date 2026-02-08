import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

export function generateTokens(payload: { id: string; role: string }) {
  const access_token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  })
  const refresh_token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  })
  return { access_token, refresh_token }
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; role: string }
}
