import { createClient } from "redis"

export const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on("error", (error) => console.error("Redis error: ", error))

export const connectRedis = async () => {
    try {
        await redisClient.connect()
        console.log("Redis connected successfully.")
    } catch (error) {
        console.log("Redis connection falid : ", error.message)
        // console.error(error)
    }
}