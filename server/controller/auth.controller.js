import { logoutService, refreshTokenService, signinService, signupService } from "../services/auth.service.js"

export const refreshToken = async (req, resp, next) => {

    const { refresh_token } = req.cookies

    const { new_access_token, new_refresh_token } = await refreshTokenService(refresh_token)

    // set tokens in cookie
    resp.cookie("access_token", new_access_token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000

    })

    resp.cookie("refresh_token", new_refresh_token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // return response
    resp.status(200).json({
        success: true,
        msg: "Token refreshed successfully.",
    })
}

export const signup = async (req, resp, next) => {
    try {
        const { name, email, password } = req.body

        const { access_token, refresh_token } = await signupService(name, email, password)

        // set tokens in cookie
        resp.cookie("access_token", access_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 15 * 60 * 1000

        })

        resp.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // return response
        resp.status(201).json({
            success: true,
            msg: "User is registered successfully",
        })

    } catch (error) {
        next(error)
    }
}

export const signin = async (req, resp, next) => {
    try {
        const { email, password } = req.body

        const { access_token, refresh_token } = await signinService(email, password)

        // set tokens in cookie
        resp.cookie("access_token", access_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 15 * 60 * 1000

        })

        resp.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // return response
        resp.status(201).json({
            success: true,
            msg: "Logged in successfully.",
        })

    } catch (error) {
        next(error)
    }
}

export const logout = async (req, resp, next) => {

    try {

        const { refresh_token } = req.cookies

        await logoutService(refresh_token)

        // reomve tokens from cookie
        resp.clearCookie("access_token", {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        })

        resp.clearCookie("refresh_token", {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        })

        // return response
        resp.status(200).json({
            success: true,
            msg: "Logged out successfully.",
        })

    } catch (error) {
        next(error)
    }
}
