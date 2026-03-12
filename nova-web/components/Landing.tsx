"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { triggerHaptic } from "../utils/haptics";
import { useEffect, useState } from "react";

const TerminalCode = () => {
  const [typedCode, setTypedCode] = useState("");
  const codeLines = [
    "> INITIALIZING NOVA ENGINE...",
    "> EXTRACTING DEMOGRAPHIC VECTORS",
    "> [skin_tone] : MATCH_FOUND",
    "> [aesthetic] : PROCESSING...",
    "> CURATING WARDROBE DATABASE",
    "> READY."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      setTypedCode((prev) => prev + codeLines[currentLine] + "\n");
      currentLine++;
      if (currentLine >= codeLines.length) clearInterval(interval);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-grow py-6 font-mono text-xs md:text-sm text-blue-300/80 whitespace-pre-line overflow-hidden">
      {typedCode}
      <motion.span 
        animate={{ opacity: [0, 1, 0] }} 
        transition={{ duration: 1, repeat: Infinity }}
        className="inline-block w-2 h-4 bg-blue-400 ml-1 translate-y-1"
      />
    </div>
  );
};


export default function Landing({ onStart }: { onStart: () => void }) {
  const handleStart = () => {
    triggerHaptic();
    onStart();
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-4 md:pt-12">
      
      <div className="relative w-full max-w-md h-[350px] md:h-[400px] flex items-center justify-center mb-12 perspective-1000 pointer-events-none">
        
        <motion.div
          style={{ willChange: "transform" }}
          animate={{ scale: [1, 1.2, 1], rotateZ: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-[80px] opacity-40"
        />

        <motion.div
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
          animate={{ y: [-10, 10, -10], rotateX: [3, -3, 3], rotateY: [-3, 3, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full h-full bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden z-10"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Terminal size={14} />
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Nova_Core_v2.0</span>
            </div>
          </div>
          
          <TerminalCode />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50" />

          <motion.div
            style={{ willChange: "transform" }}
            animate={{ translateY: ["0px", "400px", "0px"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 top-0 h-[2px] bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] z-20 pointer-events-none"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-30 flex flex-col items-center mt-4"
      >
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-zinc-300 text-xs font-bold uppercase tracking-widest shadow-2xl mb-6 backdrop-blur-md">
          <Sparkles size={14} className="text-blue-400 animate-pulse" />
          <span>Intelligent Styling Matrix</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-6">
          The Future of <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Personal Styling.
          </span>
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 px-4">
          Upload a photo or drop into the scanner. Our multimodal AI extracts your exact demographic vectors to curate a shoppable, hyper-personalized wardrobe.
        </p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-shadow flex items-center gap-3"
        >
          Initialize Engine <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
}