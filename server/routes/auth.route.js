import express from "express"
import { googleAuth, logOut } from "../controllers/auth.controller.js"
import { createRateLimit } from "../middlewares/rateLimit.js"

const authRouter = express.Router()
const authLimiter = createRateLimit({ windowMs: 15 * 60 * 1000, max: 30 })


authRouter.post("/google", authLimiter, googleAuth)
authRouter.get("/logout",logOut)


export default authRouter
