import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { env } from "./config/env.js"
import { initDatabase } from "./config/database.js"

import authRoutes from "./routes/auth.js"
import instanceRoutes from "./routes/instances.js"
import messageRoutes from "./routes/messages.js"
import broadcastRoutes from "./routes/broadcasts.js"
import chatbotRoutes from "./routes/chatbots.js"
import userRoutes from "./routes/users.js"
import productRoutes from "./routes/products.js"
import orderRoutes from "./routes/orders.js"
import transactionRoutes from "./routes/transactions.js"
import rechargeRoutes from "./routes/recharges.js"
import reportRoutes from "./routes/reports.js"
import settingsRoutes from "./routes/settings.js"
import contactRoutes from "./routes/contacts.js"

const app = express()

// Middleware
app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(morgan("dev"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Initialize database
initDatabase()

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/instances", instanceRoutes)
app.use("/api/v1/messages", messageRoutes)
app.use("/api/v1/broadcasts", broadcastRoutes)
app.use("/api/v1/chatbots", chatbotRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/transactions", transactionRoutes)
app.use("/api/v1/recharges", rechargeRoutes)
app.use("/api/v1/reports", reportRoutes)
app.use("/api/v1/settings", settingsRoutes)
app.use("/api/v1/contacts", contactRoutes)

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Start server
app.listen(env.PORT, () => {
  console.log(`\n  WhatsApp API Server running on http://localhost:${env.PORT}`)
  console.log(`  API Base: http://localhost:${env.PORT}/api/v1`)
  console.log(`  Health:   http://localhost:${env.PORT}/api/health\n`)
})

export default app
