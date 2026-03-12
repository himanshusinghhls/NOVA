"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, Loader2, AlertTriangle } from "lucide-react";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function RateOutfit() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);
  const [fitRating, setFitRating] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPreviewImage(URL.createObjectURL(file));
    setLoading(true); setSysError(null); setFitRating(null);

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch(`${API_URL}/rate-outfit`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Server failed to rate outfit.");
      setFitRating(data);
    } catch (err: any) {
      setSysError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center space-y-12">
      {sysError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={20} /><p className="text-sm font-bold">{sysError}</p>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-5xl font-black tracking-tighter text-white">Rate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Outfit.</span></h2>
        <p className="text-zinc-400 max-w-xl mx-auto">Upload a mirror selfie or outfit picture. Our styling engine will break down your color harmony, proportions, and trendiness.</p>
        
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm mt-8 flex flex-col items-center">
          <button onClick={() => fileInputRef.current?.click()} disabled={loading} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-purple-700 transition-all flex items-center shadow-[0_0_30px_rgba(147,51,234,0.3)]">
            {loading ? <Loader2 className="animate-spin mr-2"/> : <Activity className="mr-2"/>} {loading ? "Calculating Score..." : "Upload Fit for Rating"}
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>
      </div>

      {previewImage && fitRating && (
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white/5 border border-white/10 rounded-[3rem] p-8 text-left">
          <div className="rounded-2xl overflow-hidden border border-white/10 relative h-[400px]">
            <img src={previewImage} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          
          <div className="space-y-8">
            <div>
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Overall Aesthetic</p>
              <h3 className="text-7xl font-black text-white">{fitRating.overall || 0}<span className="text-2xl text-zinc-500">/10</span></h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-400">Color Harmony</span><span className="text-white">{fitRating.color_harmony || 0}/10</span></div>
                <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-blue-400 h-2 rounded-full" style={{width: `${((fitRating.color_harmony || 0)/10)*100}%`}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-400">Proportions & Fit</span><span className="text-white">{fitRating.proportions || 0}/10</span></div>
                <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-purple-400 h-2 rounded-full" style={{width: `${((fitRating.proportions || 0)/10)*100}%`}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-400">Trendiness</span><span className="text-white">{fitRating.trendiness || 0}/10</span></div>
                <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-pink-400 h-2 rounded-full" style={{width: `${((fitRating.trendiness || 0)/10)*100}%`}}></div></div>
              </div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl">
              <p className="text-sm text-purple-200 font-medium leading-relaxed italic">"{fitRating.feedback || "Good outfit."}"</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}