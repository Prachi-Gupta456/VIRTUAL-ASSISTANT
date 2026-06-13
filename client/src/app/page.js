"use client"

import { useSelector } from "react-redux"
import Dashboard from "./components/dashboard/page"
import Register from "./components/register/page"

export default function Home() {

  const { userData } = useSelector(state => state.user)

  return (
    <div>

      {userData ? <Dashboard /> : <Register />}

    </div>
  )
}
