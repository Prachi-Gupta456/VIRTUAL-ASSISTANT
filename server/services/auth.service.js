import ApiError from "../utils/api.error.js"
import User from "../model/user.model.js"
import { generateAccessToken, generateRefreshToken } from "../utils/token.js"
import { redisClient } from "../config/redis.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const refreshTokenService = async (refresh_token) => {

    if (!refresh_token) {
        throw new ApiError(400, "Refresh token not found")
    }

    let decoded;

    try {
        decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token")
    }

    // get stored token
    const stored_token = await redisClient.get(`refresh:${decoded.userId}`)

    if (stored_token !== refresh_token) {
        throw new ApiError(401, "Refresh token reuse detected")
    }

    const user = await User.findById(decoded.userId)

    if (!user) {
        throw new ApiError(400, "User not found!")
    }

    // generate access token and refresh tokens
    const new_access_token = await generateAccessToken(user._id)
    const new_refresh_token = await generateRefreshToken(user._id)

    // store refresh token in redis
    await redisClient.setEx(`refresh:${user._id}`, 7 * 24 * 60 * 60, new_refresh_token)

    return {
        new_access_token, new_refresh_token
    }

}

export const signupService = async (name, email, password) => {

    if (!name || !email || !password) {
        throw new ApiError(400, "Missing required fields.", true)
    }

    // check whether user already exists 
    const user = await User.findOne({ email })

    if (user) {
        throw new ApiError(403, "User already exists.", true)
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must contain atleast 6 characters!", true)
    }
    // hash password
    const hashed_password = await bcrypt.hash(password, 10)

    // create new user
    const result = await User.create({ name, email, password: hashed_password })

    // set jwt token
    const refresh_token = generateRefreshToken(result._id)
    const access_token = generateAccessToken(result._id)

    // set refresh token in cache
    await redisClient.setEx(`refresh:${result._id}`, 7 * 24 * 60 * 60, refresh_token)

    return {
        access_token, refresh_token
    }
}

export const signinService = async (email, password) => {

    if (!email || !password) {
        throw new ApiError(400, "Missing required fields.", true)
    }

    // check whether user already exists 
    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found.", true)
    }

    // hash password
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw new ApiError(401, "Wrong Password", true)
    }

    // set jwt token
    const refresh_token = generateRefreshToken(user._id)
    const access_token = generateAccessToken(user._id)

    // set refresh token in cache
    await redisClient.setEx(`refresh:${user._id}`, 7 * 24 * 60 * 60, refresh_token)

    return {
        access_token, refresh_token
    }


}

export const logoutService = async (refresh_token) => {

    try {
         
        if (!refresh_token) return;

        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)

        //   remove from cache
        await redisClient.del(`refresh:${decoded.userId}`)

    } catch (error) {
        throw new ApiError(401, "Invalid refresh token")
    }

}