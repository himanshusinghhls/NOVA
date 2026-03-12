"use client"

import {motion} from "framer-motion"

export default function Hero(){

return(

<div className="text-center pt-20">

<motion.h1
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:0.6}}
className="text-5xl font-bold">

Nova AI Stylist

</motion.h1>

<p className="mt-4 text-gray-300">

Discover outfits perfectly tailored to your style, skin tone and occasion.

</p>

</div>

)

}