"use client"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Card from "../card/page"
import { RiImageAddLine } from "react-icons/ri"
import { useRef, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { setCustomImg, setSystemImg } from "@/app/services/api"
import Link from "next/link"
import { setUserData } from "@/app/redux/slices/userSlice"

export default function Customize() {

    const { userData,loading } = useSelector(state => state.user)
    const router = useRouter()
    const [frontendImg, setFrontendImg] = useState(null)
    const [backendImg, setBackendImg] = useState(null)
    const [selectedImg, setSelectedImg] = useState(null)
    const inputImage = useRef(null)
    const dispatch = useDispatch()


    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setFrontendImg(URL.createObjectURL(file))
        setBackendImg(file)
    }

    const handleSubmit = async () => {

        if (selectedImg === "input") {
            const form = new FormData()
            form.append("image", backendImg)

            const result = await setCustomImg(form)
           
            if (!result.success) {
                const msg = result.user_warning ? result.msg : "Failed to upload!"
                toast.error(msg)
                setFrontendImg(null)
                setBackendImg(null)
                return;
            }

            dispatch(setUserData(result.user))
            toast.success("Image updated successfully.")
            router.push("/components/customize2")
        }
        else {
            const result = await setSystemImg({ image_url: selectedImg })
         
            if (!result.success) {
                const msg = result.user_warning ? result.msg : "Failed to upload!"
                toast.error(msg)
                setFrontendImg(null)
                setBackendImg(null)
                return;
            }
            toast.success("Image updated successfully.")
            router.push("/components/customize2")

        }

    }
  useEffect(() => {

        if (!userData && !loading) {
            router.push("/components/signin")
        }
    }, [userData, router, loading])


 
    return (
        <div className="w-full min-h-screen bg-gradient-to-t from-[black]
        to-[#030353] flex justify-center items-center flex-col p-2">

           

            <h1 className="text-white text-[30px] text-center mb-[35px]">
                Select your <span className="text-blue-200">Assistant Image</span>
            </h1>

            <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap
        gap-[15px]">
                <Card selectedImg={selectedImg} setSelectedImg={setSelectedImg} image={"/image1.jpg"} />
                <Card selectedImg={selectedImg} setSelectedImg={setSelectedImg} image={"/image2.jpeg"} />
                <Card selectedImg={selectedImg} setSelectedImg={setSelectedImg} image={"/image3.jpg"} />
                <Card selectedImg={selectedImg} setSelectedImg={setSelectedImg} image={"/image4.jpg"} />
                <Card selectedImg={selectedImg} setSelectedImg={setSelectedImg} image={"/image5.png"} />
                <Card selectedImg={selectedImg} setSelectedImg={setSelectedImg} image={"/image6.jpg"} />
                <Card selectedImg={selectedImg} setSelectedImg={setSelectedImg} image={"/image7.jpg"} />

                {/* custom image */}
                <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2
        border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl
         hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white
         flex items-center justify-center         
          ${selectedImg == "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
                    onClick={() => {
                        inputImage.current.click();
                        setSelectedImg("input")
                    }}>

                    {!frontendImg ?
                        <RiImageAddLine className="text-white w-[25px] h-[25px]" /> :
                        <img src={frontendImg} className="h-full object-cover" />
                    }

                </div>
                <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} />
            </div>
            
           
            {selectedImg &&
                <button className="min-w-[150px] cursor-pointer h-[60px] mt-[30px] text-black font-semibold
                bg-white rounded-full text-[19px] mb-[30px] active:bg-gray-300"
                    onClick={handleSubmit}>Next</button>
            }

             <Link href="/components/customize2" className="text-blue-200  underline mt-2" >Want to change Assistant Name only ?</Link>
        </div>
    )
}
