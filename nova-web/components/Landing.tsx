"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Spline from '@splinetool/react-spline';
import { triggerHaptic } from "../utils/haptics";

export default function Landing({ onStart }: { onStart: () => void }) {
  const handleStart = () => {
    triggerHaptic();
    onStart();
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden pt-12">
      
      <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center mb-12 cursor-grab active:cursor-grabbing">
        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full -z-10" />
        <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-30 flex flex-col items-center pointer-events-none"
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