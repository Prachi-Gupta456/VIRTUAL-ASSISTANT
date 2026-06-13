"use client"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getGroqResponse, logout } from "@/app/services/api"
import { IoMenu } from "react-icons/io5"
import { RxCross1 } from "react-icons/rx"
import { setUserData } from "@/app/redux/slices/userSlice"

export default function Dashboard() {

  const { userData, loading } = useSelector(state => state.user)
  const router = useRouter()
  const dispatch = useDispatch()
  const userDataRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const speakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [assistantText, setAssistantText] = useState("")
  const [userText, setUserText] = useState("")
  const [showMenu, setShowMenu] = useState(false)

  const handleLogOut = async () => {

    const result = await logout()
    if (!result.success) {
      const msg = result.user_warning ? result.msg : "Failed to set!"
      toast.error(msg)
      return;
    }
    toast.success(result.msg)
    dispatch(setUserData(null))
    router.push("/components/signin")
  }

  const startRecognition = () => {
    try {
      recognitionRef.current?.start()
    } catch (error) {
      if (!error.message.includes("start")) {
        console.error("Recognition Error: ", error)
      }
    }
  }

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)

    utterence.lang = 'hi-IN'
    const voices = window.speechSynthesis.getVoices();

    const hindiVoice = voices.find(v => v.lang === 'hi-IN')

    if (hindiVoice) {
      utterence.voice = hindiVoice
    }
    speakingRef.current = true

    utterence.onend = () => {
      setAssistantText("")
      speakingRef.current = false
      startRecognition()
    }

    window.speechSynthesis.speak(utterence)
  }

  const handleCommand = (data) => {

    const { type, userInput, response } = data;

    speak(response)

    if (type === "google_search") {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
    if (type === "youtube_open") {
      window.open(`https://www.youtube.com/`, '_blank');
    }

    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

  }

  useEffect(() => {

    if (!userData && !loading) {
      router.push("/components/register")
      return
    }
    userDataRef.current = userData;
  }, [userData, loading, router])


  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition();

    recognition.continuous = true;

    recognition.lang = 'en-US'

    // update refs
    recognitionRef.current = recognition

    isRecognizingRef.current = false

    const safeRecognition = () => {

      if (!speakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          console.log("Recognition requested to start")
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Start Error: ", error)
          }
        }
      }
    };

    recognition.onstart = () => {
      console.log("Recognition started")
      isRecognizingRef.current = true
    };

    recognition.onend = () => {
      console.log("Recognition ended")
      isRecognizingRef.current = false;
    }

    if (!speakingRef.current) {
      setTimeout(() => {
        safeRecognition()
      }, 1000);
    }

    recognition.onerror = (event) => {
      console.warn("Recognition Error: ", event.error)
      isRecognizingRef.current = false
  
      if (
        event.error !== "not-allowed" &&
        event.error !== "service-not-allowed" &&
        event.error !== "aborted" &&
        !speakingRef.current
      ) {
        setTimeout(safeRecognition, 1000);
      }
    }



    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
     
      const assistantName = userDataRef.current?.assistantName?.toLowerCase()

      if (assistantName && transcript.toLowerCase().includes(assistantName)) {

        setAssistantText("")
        setUserText(transcript)

        recognition.stop()
        isRecognizingRef.current = false

        const result = await getGroqResponse({ command: transcript })
        console.log(result)

        // set assistant text
        setUserText("")
        setAssistantText(result.data.response)

        if (result.data.user) {
          dispatch(setUserData(result.data.user))
        }
        handleCommand(result.data)

      }
    }


    const fallback = setInterval(() => {
      if (!speakingRef.current && !isRecognizingRef.current) {
        safeRecognition()
      }
    }, 10000)

    // -------------
    safeRecognition();


    return () => {
      recognition.stop()
     
      isRecognizingRef.current = false;
      clearInterval(fallback)
    }


  }, [])

  return (
    <div className="w-full h-screen bg-gradient-to-t from-[black]
      to-[#02023d] flex justify-center items-center flex-col gap-[15px]">

      {/* Hamburger menu */}
      {!showMenu ? <IoMenu onClick={() => setShowMenu(true)} className="lg:hidden cursor-pointer text-white absolute top-5 right-5
        w-[25px] h-[25px]"/> :

        <div
          className="lg:hidden fixed top-0 left-0 z-50 w-full h-screen
  flex flex-col bg-[#00000035] backdrop-blur-lg"
        >
          {/* Cross Icon */}
          <RxCross1
            onClick={() => setShowMenu(false)}
            className="cursor-pointer text-white absolute top-5 right-5 w-[25px] h-[25px]"
          />

          {/* Buttons */}
          <div className="w-full flex flex-col gap-4 p-3 pt-16">
            <button
              className="w-full h-[60px] cursor-pointer text-white font-semibold
      bg-[#00000035] border rounded-full text-[19px]
      active:bg-white active:text-black"
              onClick={() => router.push("/components/customize")}
            >
              Customize Your Assistant
            </button>

            <button
              className="w-full h-[60px] cursor-pointer text-white font-semibold
      bg-[#00000035] border rounded-full text-[19px]
      active:bg-white active:text-black"
              onClick={handleLogOut}
            >
              Log Out
            </button>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-400" />

          {/* History Heading */}
          <h1 className="text-white font-semibold text-[20px] px-4 py-3">
            History
          </h1>

          {/* History List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {userData?.history?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {userData.history.map((his, index) => (
                  <div
                    key={index}
                    className="text-white text-[18px] break-words border-b border-white/10 pb-2"
                  >
                    {his}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-300 text-[16px]">
                No history yet
              </div>
            )}
          </div>
        </div>
      }
      {/* --------------- */}


      {/* customize buttons */}
      <button className="lg:block hidden min-w-[150px] cursor-pointer h-[60px] mt-[30px] text-white font-semibold
         absolute bg-[#00000035] border rounded-full text-[19px] top-5 right-5 p-4 " onClick={() => router.push("/components/customize")}>Customize Your Assistant</button>

      <button className="lg:block hidden lg:min-w-[150px] cursor-pointer lg:h-[50px] mt-[30px] text-white font-semibold
         absolute  rounded-full text-[19px] top-25 right-5 p-2 bg-[#00000035] border" onClick={handleLogOut}>Log Out</button>

      {/* ------- */}
      <div className="w-[300px] h-[360px] flex justify-center items-center overflow-hidden
        rounded-4xl shadow-lg">
        {userData?.assistantImage && <img src={userData.assistantImage} alt="Assistant Image" className="h-full
          object-cover"/>}

      </div>

      <h1 className="text-white font-semibold text-[18px]">I'm {userData?.assistantName || "Give me a name!"}</h1>

      {!assistantText ? <img src="/user_voice.gif" alt="user_voice_gif"
        className="w-[200px]" /> :
        <img src="/assistant_voice.gif" alt="asisttant_voice_gif"
          className="w-[200px]" />
      }

      <h1 className="text-white text-wrap font-semibold text-[18px]">{userText ? userText : assistantText ? assistantText : null}</h1>

    </div>
  )
}
