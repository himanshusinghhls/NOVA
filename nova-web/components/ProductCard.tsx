"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
import React from "react";

export default function ProductCard({ item, index }: { item: any, index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full perspective-1000"
    >
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-colors group flex flex-col h-full shadow-2xl backdrop-blur-sm">
        
        <div className="relative h-64 bg-zinc-900 overflow-hidden" style={{ transform: "translateZ(30px)" }}>
          <img src={item.image_url} alt={item.item} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
          
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10" style={{ transform: "translateZ(40px)" }}>
            <p className="font-mono font-bold text-white shadow-lg">${item.price}</p>
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow" style={{ transform: "translateZ(20px)" }}>
          <h4 className="font-black text-lg mb-1">{item.brand}</h4>
          <p className="text-sm text-zinc-400 mb-4">{item.item}</p>
          
          <div className="flex gap-2 mb-6">
            {["S", "M", "L", "XL"].map(size => (
              <span key={size} className="text-[10px] border border-white/10 px-2 py-1 rounded text-zinc-500 hover:text-white hover:border-white/50 transition-colors cursor-pointer">{size}</span>
            ))}
          </div>
          
          <a href={item.product_url} target="_blank" rel="noreferrer" className="mt-auto w-full bg-white hover:bg-blue-600 hover:text-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
            Buy Now <ExternalLink size={16} />
          </a>
        </div>

        <div className="absolute inset-0 pointer-events-none group-hover:bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
      </div>
    </motion.div>
  );
}