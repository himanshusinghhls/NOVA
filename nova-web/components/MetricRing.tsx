"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MetricRingProps {
  score: number;
  label: string;
  icon: ReactNode;
  colorHex: string;
  delay?: number;
}

export default function MetricRing({ score, label, icon, colorHex, delay = 0 }: MetricRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
      <div 
        className="absolute inset-0 opacity-20 blur-xl transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: colorHex }}
      />

      <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
        </svg>

        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <motion.circle 
            cx="50" cy="50" r={radius} 
            stroke={colorHex} 
            strokeWidth="8" 
            fill="none" 
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
            className="drop-shadow-lg"
          />
        </svg>

        <div className="relative z-10" style={{ color: colorHex }}>
          {icon}
        </div>
      </div>

      <div className="text-center relative z-10">
        <p className="text-white font-black text-2xl leading-none mb-1">{score}<span className="text-zinc-500 text-sm">/10</span></p>
        <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{label}</p>
      </div>
    </div>
  );
}