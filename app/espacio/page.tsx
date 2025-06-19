"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Login from "@/components/espacio/login"


export default function espacio() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      {/* Header */}
      <Header />

      <Login />
    
      <Footer/>
    </div>
  )
}

