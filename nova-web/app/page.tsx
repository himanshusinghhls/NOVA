"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import FindClothes from "../components/FindClothes";
import RateOutfit from "../components/RateOutfit";
import { AnimatePresence, motion } from "framer-motion";

export default function NovaMaster() {
  const [activeFeature, setActiveFeature] = useState("home");

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative selection:bg-blue-500/30 pb-20">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <Navbar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />

      <div className="max-w-7xl mx-auto px-6 mt-4">
        <AnimatePresence mode="wait">
          {activeFeature === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Landing onStart={() => setActiveFeature("find-clothes")} />
            </motion.div>
          )}
          {activeFeature === "find-clothes" && (
            <motion.div key="clothes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <FindClothes />
            </motion.div>
          )}
          {activeFeature === "rate-outfit" && (
            <motion.div key="rate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <RateOutfit />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}