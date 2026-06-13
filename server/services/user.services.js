import ApiError from "../utils/api.error.js"
import groqResponse from "../utils/groq.js"
import User from "../model/user.model.js"
import moment from "moment"
import uploadOnCloudinary from "../utils/uploadFile.js"

export const getCurrentUserService = async (userId) => {

    const user = await User.findById(userId).select("-password").lean()

    if (!user) {
        throw new ApiError(404, "User not found", true)
    }

    return user;
}

export const setCustomImgService = async (userId, image) => {

    if (!image) {
        throw new ApiError(404, "Please select an image!", true)
    }

    const user = await User.findById(userId).select("-password -email")

    if (!user) {
        throw new ApiError(404, "User not found", true)
    }

    const image_url = await uploadOnCloudinary(image)

    if (!image_url) {
        throw new ApiError(400, "Failed to upload!", true)
    }

    user.assistantImage = image_url;

    await user.save()
    return user;
}

export const setSystemImgService = async (userId, image_url) => {

    if (image_url.length == 0) {
        throw new ApiError(400, "Please select an image!", true)
    }
    const user = await User.findByIdAndUpdate(userId,
        { assistantImage: image_url },
        { returnDocument: "after" }
    ).select("-password -email").lean()

    if (!user) {
        throw new ApiError(404, "User not found", true)
    }

    return user
}

export const setAssistantNameService = async (userId, name) => {

    if (!name.trim()) {
        throw new ApiError(400, "Please enter a valid name.", true)
    }

    const user = await User.findByIdAndUpdate(userId,
        { assistantName: name.trim() },
        { returnDocument: "after" }
    ).select("-password -email").lean()

    if (!user) {
        throw new ApiError(404, "User not found", true)
    }

    return user
}


export const askToAssistantService = async (userId, command) => {

    const user = await User.findByIdAndUpdate(userId,
        { $push: { history: command } },
        { returnDocument: "after" }).lean()

    if (!user) {
        throw new ApiError(404, "User not found", true)
    }

    if (command.includes("date") && command.includes("today")) {
        return {
            type: "get_date",
            userInput: command,
            response: `Today's date is ${moment().format("YYYY-MM-DD")}`,
            user
        }
    }

    if (command.includes("time")  && command.includes("current")) {
        return {
            type: "get_time",
            userInput: command,
            response: `Current time is ${moment().format("hh:mm:A")}`,
            user
        };

    }

    if (command.includes("day")  && command.includes("today")) {
        return {
            type: "get_day",
            userInput: command,
            response: `Today is ${moment().format("dddd")}`,
            user
        }
    }

    if (command.includes("month")  && command.includes("current")) {
        return {
            type: "get_month",
            userInput: command,
            response: `It's month of ${moment().format("MMMM")}`,
            user
        }

    }

    const userName = user.name
    const assistantName = user.assistantName

    const result = await groqResponse(command, userName, assistantName)

    if (!result) {
        throw new ApiError(400, "Sorry, I can't understand!", true)
    }

    const groqResult = JSON.parse(result)

    const type = groqResult.type

    switch (type) {

        case "general":
        case "google_search":
        case "youtube_search":
        case "youtube_play":
        case "weather_show":
        case "calculator_open":
        case "instagram_open":
        case "youtube_open":
        case "facebook_open":
            return {
                type,
                userInput: groqResult.userInput,
                response: groqResult.response,
                user
            };
        default:
            return {
                response: "I didn't understand the command!",
            };
    }
}
