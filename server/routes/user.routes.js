import express from "express"
import {
    askToAssistant,
    getCurrentUser, setAssistantName,
    setCustomImg, setSystemImg
} from "../controller/user.controller.js";
import verifyJwt from "../middlewares/verifyJwt.middleware.js"
import upload from "../middlewares/multer.middleware.js";

const userRouter = express.Router()

userRouter.get("/current-user", verifyJwt, getCurrentUser)
userRouter.post("/set-custom-img", verifyJwt, upload.single("image"), setCustomImg)
userRouter.post("/set-system-img", verifyJwt, setSystemImg)
userRouter.post("/set-assistant-name", verifyJwt, setAssistantName)
userRouter.post("/ask-to-assistant", verifyJwt, askToAssistant)


export default userRouter;
