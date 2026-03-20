import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getcurrentUser } from "../controllers/user.controller.js";


const userRouter = express.Router();

userRouter.get("/current-user",isAuth,getcurrentUser)

export default userRouter;
