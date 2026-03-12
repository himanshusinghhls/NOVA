"use client"

import Hero from "../components/Hero"
import UploadStylist from "../components/UploadStylist"
import ManualStylist from "../components/ManualStylist"
import ChatStylist from "../components/ChatStylist"
import Navbar from "../components/Navbar"

export default function Home(){
  return(
    <div className="min-h-screen">
      <Navbar />
      <div className="px-6 max-w-7xl mx-auto pb-20">
        <Hero/>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <UploadStylist/>
          <ManualStylist/>
        </div>
        <div className="mt-8">
          <ChatStylist/>
        </div>
      </div>
    </div>
  )
}