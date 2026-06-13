import api from "../lib/axios.js"
import axios from "axios"
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

const getErrorMessage = (error) => {

    return (error.response?.data.msg || error.message || "Server Error.Try again later!")
}

export const register = async (data) => {

    try {
        const response = await axios.post(`${BACKEND_API_URL}/api/auth/signup`, data, { withCredentials: true })
        return response.data
    } catch (error) {
        console.log("Signup Api Error: ", error.message)
        return {
            success: false,
            msg: getErrorMessage(error),
            user_warning: error.response?.data?.user_warning
        }
    }
}

export const signin = async (data) => {

    try {
        const response = await axios.post(`${BACKEND_API_URL}/api/auth/signin`, data, { withCredentials: true })
        return response.data
    } catch (error) {
        console.log("Signin Api Error: ", error.message)
        return {
            success: false,
            msg: getErrorMessage(error),
            user_warning: error.response?.data?.user_warning
        }
    }
}

export const logout = async () => {

    try {
        const response = await axios.get(`${BACKEND_API_URL}/api/auth/logout`, { withCredentials: true })
        return response.data
    } catch (error) {
        console.log("Logout Api Error: ", error.message)
        return {
            success: false,
            msg: getErrorMessage(error),
            user_warning: error.response?.data?.user_warning
        }
    }
}

export const getCurrentUser = async () => {

    try {
        const response = await api.get("/api/user/current-user")
        return response.data
    } catch (error) {
        console.log("Current User Api Error: ", error.message)
        return {
            success: false,
            msg: getErrorMessage(error),
            user_warning: error.response?.data?.user_warning
        }
    }
}

export const setCustomImg = async (data) => {

    try {
        const response = await api.post("/api/user/set-custom-img", data)
        return response.data
    } catch (error) {
        console.log("Custom Image Api Error: ", error.message)
        return {
            success: false,
            msg: getErrorMessage(error),
            user_warning: error.response?.data?.user_warning
        }
    }
}

export const setSystemImg = async (data) => {

    try {
        const response = await api.post("/api/user/set-system-img", data)
        return response.data
    } catch (error) {
        console.log("System Image Api Error: ", error.message)
        return {
            success: false,
            msg: getErrorMessage(error),
            user_warning: error.response?.data?.user_warning
        }
    }
}

export const setAssistantName = async (data) => {

    try {
        const response = await api.post("/api/user/set-assistant-name", data)
        return response.data
    } catch (error) {
        console.log("Assistant Name Api Error: ", error.message)
        return {
            success: false,
            msg: getErrorMessage(error),
            user_warning: error.response?.data?.user_warning
        }
    }
}

export const getGroqResponse = async (data) => {

    try {
        const response = await api.post("/api/user/ask-to-assistant", data)
        return response.data
    } catch (error) {
        console.log("Groq Response Api Error: ", error.message)
        return {
            success: false,
            msg: getErrorMessage(error),
            user_warning: error.response?.data?.user_warning
        }
    }
}
