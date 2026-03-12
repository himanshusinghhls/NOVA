"use client"

import {useState} from "react"

export default function ChatStylist(){

const[msg,setMsg]=useState("")
const[chat,setChat]=useState<string[]>([])

function send(){

setChat([...chat,"You: "+msg,"AI: Try neutral tones with minimal layers."])

setMsg("")

}

return(

<div className="glass p-6">

<h2 className="text-xl font-bold mb-4">
AI Style Chat
</h2>

<div className="h-40 overflow-y-auto text-sm mb-2">

{chat.map((c,i)=>(
<p key={i}>{c}</p>
))}

</div>

<input
value={msg}
onChange={(e)=>setMsg(e.target.value)}
className="bg-black p-2 w-full"
/>

<button
onClick={send}
className="bg-green-500 px-4 py-2 mt-2 rounded"
>

Ask Stylist

</button>

</div>

)

}