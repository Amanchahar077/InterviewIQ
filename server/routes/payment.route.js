import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { createOrder, getPaymentConfig, verifyPayment } from "../controllers/payment.controller.js"
import { createRateLimit } from "../middlewares/rateLimit.js"



const paymentRouter = express.Router()
const paymentLimiter = createRateLimit({ windowMs: 15 * 60 * 1000, max: 40 })

paymentRouter.get("/config" , getPaymentConfig )
paymentRouter.post("/order" , isAuth, paymentLimiter, createOrder )
paymentRouter.post("/verify" , isAuth, paymentLimiter, verifyPayment )


export default paymentRouter
