"use client"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { setAssistantName } from "@/app/services/api"
import { setUserData } from "@/app/redux/slices/userSlice"

export default function Customize() {

    const { userData, loading } = useSelector(state => state.user)
    const router = useRouter()
    const [name, setName] = useState(userData?.assistantName || "")
    const dispatch = useDispatch()

    const handleAssistantName = async () => {

        const result = await setAssistantName({ name })

        if (!result.success) {
            const msg = result.user_warning ? result.msg : "Failed to set!"
            toast.error(msg)
            setName("")
            return;
        }
         dispatch(setUserData(result.user))
        router.push("/")
    }

    useEffect(() => {

        if (!userData && !loading) {
            router.push("/components/signin")
        }
    }, [userData, router, loading])

    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-[black]
        to-[#030353] flex justify-center items-center flex-col">


            <h1 className="text-white text-[30px] text-center mb-[35px]">
                Enter your <span className="text-blue-200">Assistant Name</span>
            </h1>

            {/* Name */}
            <input value={name} required type="text" placeholder="eg. Siri"
                className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent
                text-white  placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
                onChange={(e) => setName(e.target.value)} />


            {/* button */}
            {name.length > 0 && <button className="min-w-[300px] cursor-pointer h-[60px] mt-[30px] text-black font-semibold
                bg-white rounded-full text-[19px]"
                onClick={handleAssistantName}>Create Your Assistant</button>
            }

        </div>
    )
}
