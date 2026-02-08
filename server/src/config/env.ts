import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../../.env") })

export const env = {
  PORT: parseInt(process.env.PORT || "4000"),
  JWT_SECRET: process.env.JWT_SECRET || "default-secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  DB_PATH: process.env.DB_PATH || "./data/whatsapp.db",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
}
