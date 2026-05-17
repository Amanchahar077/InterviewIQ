const parseList = (value = "") =>
    value
        .split(",")
        .map((item) => item.trim().replace(/^"|"$/g, ""))
        .filter(Boolean)

const requiredEnv = [
    "MONGODB_URL",
    "JWT_SECRET",
    "OPENROUTER_API_KEY",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
]

export const isProduction = process.env.NODE_ENV === "production"

export const allowedOrigins = parseList(
    process.env.CLIENT_URLS ||
    "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174"
)

export const validateEnv = () => {
    const missing = requiredEnv.filter((key) => !process.env[key])

    if (isProduction && !process.env.CLIENT_URLS) {
        missing.push("CLIENT_URLS")
    }

    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
    }

    if (isProduction) {
        const localOrigins = allowedOrigins.filter((origin) =>
            /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
        )

        if (localOrigins.length) {
            throw new Error("CLIENT_URLS must use your deployed frontend URL in production, not localhost.")
        }
    }
}
