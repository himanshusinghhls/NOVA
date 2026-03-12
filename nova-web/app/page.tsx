"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import FindClothes from "../components/FindClothes";
import RateOutfit from "../components/RateOutfit";

export default function NovaMaster() {
  const [activeFeature, setActiveFeature] = useState("find-clothes");

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative selection:bg-blue-500/30 pb-20">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <Navbar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {activeFeature === "find-clothes" ? <FindClothes /> : <RateOutfit />}
      </div>
      
    </div>
  );
}