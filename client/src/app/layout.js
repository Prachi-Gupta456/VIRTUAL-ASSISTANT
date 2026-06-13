import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./redux/reduxProvider";
import AppInitializer from "./components/appInitializer/page";
import { ToastContainer } from "react-toastify";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Virtual AI Assistant",
  description: "Voice-enabled AI virtual assistant powered by AI",
  keywords: [
    "AI Assistant",
    "Voice Assistant",
    "Virtual Assistant"
  ]
}


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>

      <body className="min-h-full flex flex-col">

        <ReduxProvider>
          <AppInitializer />
           <ToastContainer/>
          {children}
        </ReduxProvider>
       
      </body>
    </html>
  );
}
