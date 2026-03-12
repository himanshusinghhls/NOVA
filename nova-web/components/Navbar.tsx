"use client";
import { motion } from "framer-motion";

interface NavbarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

export default function Navbar({ activeFeature, setActiveFeature }: NavbarProps) {
  return (
    <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveFeature("home")}>
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform">
          <span className="text-white font-black text-xl tracking-tighter">N</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">NOVA<span className="text-blue-500">_</span></h1>
      </div>
      
      <div className="flex gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
        {["home", "find-clothes", "rate-outfit"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveFeature(tab)} 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all relative capitalize ${activeFeature === tab ? "text-white" : "text-zinc-500 hover:text-white"}`}
          >
            {activeFeature === tab && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/10 rounded-xl -z-10" />}
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>
    </nav>
  );
}