import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto"
import mongoose from "mongoose";

export const getPaymentConfig = async (req,res) => {
    if (!process.env.RAZORPAY_KEY_ID) {
      return res.status(500).json({ message: "Razorpay key id is not configured" });
    }

    return res.status(200).json({ keyId: process.env.RAZORPAY_KEY_ID });
}

export const createOrder = async (req,res) => {
    try {
        const {planId} = req.body;
        const plans = {
          basic: { amount: 100, credits: 150 },
          pro: { amount: 500, credits: 650 },
        };
        const plan = plans[planId];

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
          return res.status(500).json({ message: "Razorpay credentials are not configured" });
        }

        if (!plan) {
          return res.status(400).json({ message: "Invalid plan data" });
        }

        if (!mongoose.Types.ObjectId.isValid(req.userId)) {
          return res.status(401).json({ message: "Invalid login session. Please log in again." });
        }

        const user = await User.findById(req.userId).select("_id");

        if (!user) {
          return res.status(404).json({ message: "User not found. Please log in again." });
        }

        const options = {
          amount: plan.amount * 100, // convert to paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options)

        await Payment.create({
          userId: user._id,
          planId,
          amount: plan.amount,
          credits: plan.credits,
          razorpayOrderId: order.id,
          status: "created",
        });

        return res.json(order);

    
    } catch (error) {
         const providerMessage =
          error.error?.description ||
          error.error?.reason ||
          error.error?.field ||
          error.message ||
          "Unknown Razorpay error";

         console.error("Razorpay order error:", error.error || error);
         return res.status(500).json({message:`failed to create Razorpay order: ${providerMessage}`})
    }
}


export const verifyPayment = async (req,res) => {
    try {
        const {razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature} = req.body

      const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

     const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.userId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "paid") {
      const user = await User.findById(payment.userId);
      return res.json({ success: true, message: "Already processed", user });
    }

    // Update payment record
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    // Add credits to user
    const updatedUser = await User.findByIdAndUpdate(payment.userId, {
      $inc: { credits: payment.credits }
    },{new:true});

    res.json({
      success: true,
      message: "Payment verified and credits added",
      user: updatedUser,
    });

    } catch (error) {
         return res.status(500).json({message:`failed to verify Razorpay payment ${error}`})
    }
}
