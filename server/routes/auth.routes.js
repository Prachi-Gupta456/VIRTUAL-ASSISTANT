import express from "express"
import { logout, refreshToken, signin, signup } from "../controller/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/signup",signup)
authRouter.post("/signin",signin)
authRouter.post("/refresh-token",refreshToken)
authRouter.post("/logout",logout)

export default authRouter;
