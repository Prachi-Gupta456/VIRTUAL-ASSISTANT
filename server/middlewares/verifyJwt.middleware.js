import jwt from "jsonwebtoken"
import ApiError from "../utils/api.error.js"


export const verifyJwtToken = async (req, resp, next) => {

    try {
        const { access_token } = req.cookies

        if (!access_token) {
            return resp.status(401).json({
                success: false,
                expired: true,
                msg: "Access token expired"
            })
        }

        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)

        if (!decoded.userId) {
            throw new ApiError(401, "Invalid token")
        }

        req.userId = decoded.userId
        next()

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return resp.status(401).json({
                success: false,
                expired: true,
                msg: "Access token expired"
            })
        }
        next(error)
    }
}

export default verifyJwtToken;