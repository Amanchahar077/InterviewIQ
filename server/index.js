import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import connectDb from "./config/connectDb.js"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import { createRateLimit } from "./middlewares/rateLimit.js"
import { allowedOrigins, isProduction, validateEnv } from "./config/env.js"

const app = express()

app.set("trust proxy", 1)

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("X-Frame-Options", "DENY")
    res.setHeader("Referrer-Policy", "no-referrer")
    res.setHeader("Permissions-Policy", "camera=(), geolocation=(), payment=(self), microphone=(self)")
    if (isProduction) {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    }
    next()
})

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without origin header (curl/postman/server-to-server).
            if (!origin) return callback(null, true)
            if (allowedOrigins.includes(origin)) return callback(null, true)
            return callback(new Error(`CORS blocked for origin: ${origin}`), false)
        },
        credentials: true,
    })
)

app.use(createRateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    const message = error.message || "Unexpected server error"
    const status = message.includes("Only PDF") || message.includes("File too large") ? 400 : 500
    res.status(status).json({ message })
})

const PORT = process.env.PORT || 6000

const startServer = async () => {
    try {
        validateEnv()
        await connectDb()
        app.listen(PORT , ()=>{
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error.message)
        process.exit(1)
    }
}

startServer()
