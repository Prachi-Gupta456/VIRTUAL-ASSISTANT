import {
    getCurrentUserService, setCustomImgService,
    setAssistantNameService, setSystemImgService,
    askToAssistantService
} from "../services/user.services.js"

export const getCurrentUser = async (req, resp, next) => {

    try {
        const userId = req.userId

        const user = await getCurrentUserService(userId)

        resp.status(200).json({
            success: true,
            msg: "Current user fetched.",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const setCustomImg = async (req, resp, next) => {

    try {
        const userId = req.userId
        const user = await setCustomImgService(userId, req.file)

        resp.status(200).json({
            success: true,
            msg: "Image uploaded successfully.",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const setSystemImg = async (req, resp, next) => {

    try {
        const userId = req.userId
        const { image_url } = req.body

        const user = await setSystemImgService(userId, image_url)

        resp.status(200).json({
            success: true,
            msg: "Image uploaded successfully.",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const setAssistantName = async (req, resp, next) => {

    try {
        const userId = req.userId
        const { name } = req.body

        const user = await setAssistantNameService(userId, name)

        resp.status(200).json({
            success: true,
            msg: "Assistant name set successfully.",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const askToAssistant = async (req, resp, next) => {

    try {
        const userId = req.userId
        const {command} = req.body
        
         const data = await askToAssistantService(userId,command)

        resp.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}
