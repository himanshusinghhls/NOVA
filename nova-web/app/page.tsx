"use client"

import Hero from "../components/Hero"
import UploadStylist from "../components/UploadStylist"
import ManualStylist from "../components/ManualStylist"
import ChatStylist from "../components/ChatStylist"

export default function Home(){

return(

<div className="min-h-screen px-6">

<Hero/>

<div className="grid md:grid-cols-2 gap-8 mt-16">

<UploadStylist/>

<ManualStylist/>

</div>

<div className="mt-20">

<ChatStylist/>

</div>

</div>

)

}