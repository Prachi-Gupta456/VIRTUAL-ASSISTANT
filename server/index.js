import "dotenv/config"
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 1100

const start = async () => {

    // connect Database
    await connectDB()

    // connect cache db
    await connectRedis()

    app.listen(PORT, () => console.log(`Server is running on PORT : ${PORT}`))
}

await start();