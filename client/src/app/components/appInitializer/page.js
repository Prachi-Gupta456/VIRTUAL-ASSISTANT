"use client"
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import { usePathname } from "next/navigation"

export default function AppInitializer() {
    
    const pathname = usePathname()
    const isAuth = pathname.startsWith("/components/signin") || pathname.startsWith("/components/register");

    useGetCurrentUser(isAuth)
    return null;
}