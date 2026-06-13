"use client"
import { signin } from "@/app/services/api";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Register() {

    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pending, setPending] = useState(false)
    const router = useRouter()

    const clearForm = () => {
        setEmail("")
        setPassword("")
        setPending(false)
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!email || !password) {
            return toast.error("Please fill all the fields!")
        }

        setPending(true)
        const result = await signin({ email, password })

        if (!result.success) {
            const msg =  result.user_warning ? result.msg : "Network Error.."
            toast.error(msg)
            return clearForm()
        }

        toast.success(result.msg)
        clearForm()
        router.push("/components/dashboard")
    }

    return (
        <div className="w-full h-screen bg-cover flex justify-center
        items-center bg-[url('/signup_bg.jpg')]">

            {/* signup form */}

            <form onSubmit={handleSubmit} className="w-[90%] h-[600px] max-w-[500px] bg-[#00000062] justify-center
            backdrop-blur shadow-lg px-5 shadow-black flex flex-col items-center gap-5 p-5">

                <h1 className="text-white text-[30px] font-semibold mb-[30px]">
                    Sign In to <span className="text-blue-400">Virtual Assistant</span>
                </h1>

                {/* Email */}
                <input value={email} required type="email" placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[60px] outline-none border-2 border-white bg-transparent
                text-white  placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]" />

                {/* Password */}
                <div className="w-full h-[60px] border-2 relative border-white bg-transparent
                text-white rounded-full text-[18px]">

                    <input value={password} required type={showPassword ? "text" : "password"} placeholder="Enter your Password"
                        onChange={(e) => setPassword(e.target.value)} className="w-full h-full outline-none border-2 border-white bg-transparent
                    text-white  placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"/>

                    {!showPassword ? <IoEye className="cursor-pointer absolute top-[18px] right-5 text-white w-[25px] h-[25px]"
                        onClick={() => setShowPassword(prev => !prev)} /> :
                        <IoEyeOff className="cursor-pointer absolute top-[18px] right-5 text-white w-[25px] h-[25px]"
                            onClick={() => setShowPassword(prev => !prev)} />
                    }

                </div>


                <button disabled={pending} className="min-w-[150px] cursor-pointer h-[60px] mt-[30px] text-black font-semibold
                bg-white rounded-full text-[19px]">{pending ? <ClipLoader size={20} color="black" /> : "Sign In"}</button>

                <p className="text-white text-[18px]">Want to create an account ?
                    <Link href="/components/register" className="text-blue-400 cursor-pointer"> Sign Up</Link>
                </p>

            </form>
        </div>
    )
}
