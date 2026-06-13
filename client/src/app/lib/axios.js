import axios from "axios"
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

const api = axios.create({
    baseURL: BACKEND_API_URL,
    withCredentials: true
})

api.interceptors.response.use((response)=>response,

    // If request fails
    async (error)=>{
        const originalRequest = error.config

        if (error.response?.status === 401 &&
            error.response?.data?.expired &&
            error.response?.data?.msg==="Access token expired" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                await axios.post(`${BACKEND_API_URL}/api/auth/refresh-token`,{},{withCredentials:true})
                return api(originalRequest)
            } catch (refreshError) {
                window.location.href = "/components/signin"
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api;