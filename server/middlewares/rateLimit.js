const stores = new Map()

export const createRateLimit = ({ windowMs, max, message = "Too many requests. Please try again later." }) => {
    return (req, res, next) => {
        const now = Date.now()
        const key = `${req.ip || req.socket.remoteAddress || "unknown"}:${req.baseUrl}:${req.path}`
        const entry = stores.get(key) || { count: 0, resetAt: now + windowMs }

        if (entry.resetAt <= now) {
            entry.count = 0
            entry.resetAt = now + windowMs
        }

        entry.count += 1
        stores.set(key, entry)

        if (entry.count > max) {
            return res.status(429).json({ message })
        }

        next()
    }
}
