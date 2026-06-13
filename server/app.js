import cookieParser from "cookie-parser"
import express, { urlencoded } from "express"
import errorMiddleware from "./middlewares/error.middleware.js"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"


const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", (req, resp) => {
    resp.send("Backend is running...")
})

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)

app.use(errorMiddleware)

export default app;