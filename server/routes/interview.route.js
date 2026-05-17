import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { analyzeResume, finishInterview, generateQuestion, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js"
import { createRateLimit } from "../middlewares/rateLimit.js"




const interviewRouter = express.Router()
const aiLimiter = createRateLimit({ windowMs: 15 * 60 * 1000, max: 25 })

interviewRouter.post("/resume", isAuth, aiLimiter, upload.single("resume"), analyzeResume)
interviewRouter.post("/generate-questions", isAuth, aiLimiter, generateQuestion)
interviewRouter.post("/submit-answer", isAuth, aiLimiter, submitAnswer)
interviewRouter.post("/finish",isAuth,finishInterview)

interviewRouter.get("/get-interview",isAuth,getMyInterviews)
interviewRouter.get("/report/:id",isAuth,getInterviewReport)



export default interviewRouter
