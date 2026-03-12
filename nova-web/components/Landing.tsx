"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Scan, Palette, Activity } from "lucide-react";
import { triggerHaptic } from "../utils/haptics";

export default function Landing({ onStart }: { onStart: () => void }) {
  const handleStart = () => {
    triggerHaptic();
    onStart();
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-12">
      <div className="relative w-full max-w-2xl h-[450px] flex items-center justify-center mb-8 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-64 h-80 md:w-80 md:h-[400px] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-zinc-900 z-10"
        >
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" 
            alt="AI Fashion Analysis" 
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
          />
          
          <motion.div 
            animate={{ top: ["-10%", "110%", "-10%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)] z-20"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <div className="flex items-center gap-2">
              <Scan size={16} className="text-blue-400" />
              <span className="font-mono text-xs font-bold text-blue-400 tracking-widest">SUBJECT SCANNED</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          animate={{ y: [-15, 10, -15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 -left-4 md:left-8 z-20 bg-black/40 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
        >
          <div className="p-2 bg-purple-500/20 rounded-xl text-purple-300"><Palette size={20} /></div>
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1.5">Extracted Palette</p>
            <div className="flex gap-1.5">
              <div className="w-5 h-5 rounded-full bg-[#1A1A1A] border border-white/20 shadow-inner"></div>
              <div className="w-5 h-5 rounded-full bg-[#E5E5E5] border border-white/20 shadow-inner"></div>
              <div className="w-5 h-5 rounded-full bg-[#8B5CF6] border border-white/20 shadow-inner"></div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [15, -10, 15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 -right-4 md:right-8 z-20 bg-black/40 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
        >
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-300"><Activity size={20} /></div>
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Aesthetic Match</p>
            <p className="text-xl font-black text-white">98.4%</p>
          </div>
        </motion.div>

      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center z-30 flex flex-col items-center mt-4"
      >
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-zinc-300 text-xs font-bold uppercase tracking-widest shadow-2xl mb-6 backdrop-blur-md">
          <Sparkles size={14} className="text-blue-400 animate-pulse" />
          <span>Nova Neural Architecture</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-6">
          The Future of <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Personal Styling.
          </span>
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10">
          Upload a photo or drop into the scanner. Our multimodal AI extracts your exact demographic vectors to curate a shoppable, hyper-personalized wardrobe.
        </p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-3 pointer-events-auto"
        >
          Initialize Engine <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
}