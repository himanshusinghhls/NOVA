"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Loader2, AlertTriangle, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { triggerHaptic } from "../utils/haptics";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function RateOutfit() {
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);
  const [fitRating, setFitRating] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
    setLoading(true); setSysError(null); setFitRating(null);

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch(`${API_URL}/rate-outfit`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Server failed to rate outfit.");
      setFitRating(data);
      triggerHaptic();
    } catch (err: any) {
      setSysError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      triggerHaptic();
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto text-center space-y-12">
      {sysError && (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={20} /><p className="text-sm font-bold">{sysError}</p>
        </motion.div>
      )}

      <div className="space-y-6">
        <h2 className="text-5xl font-black tracking-tighter text-white">Rate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Outfit.</span></h2>
        <p className="text-zinc-400 max-w-xl mx-auto">Upload a mirror selfie or outfit picture. Our styling engine will break down your color harmony, proportions, and trendiness.</p>
        
        <div {...getRootProps()} className="outline-none cursor-pointer mt-8">
          <input {...getInputProps()} />
          <motion.div 
            animate={{ scale: isDragActive ? 1.02 : 1, borderColor: isDragActive ? "rgba(168,85,247,0.8)" : "rgba(255,255,255,0.1)" }}
            className={`bg-white/5 border-2 border-dashed p-8 rounded-[2rem] backdrop-blur-sm flex flex-col items-center justify-center min-h-[250px] transition-colors ${isDragActive ? "bg-purple-500/10" : ""}`}
          >
            <UploadCloud size={60} className={`mb-4 ${isDragActive ? "text-purple-400" : "text-zinc-500"}`} />
            <p className="text-xl font-bold mb-2">{isDragActive ? "Drop to analyze fit..." : "Drag & Drop Image Here"}</p>
            <p className="text-zinc-500 text-sm">or click to browse local files</p>
          </motion.div>
        </div>
      </div>

      {(previewImage || fitRating) && (
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white/5 border border-white/10 rounded-[3rem] p-8 text-left">
          
          <div className="rounded-3xl overflow-hidden border border-white/10 relative h-[450px] bg-black/80 p-2 shadow-2xl">
            <img src={previewImage!} className={`w-full h-full object-contain rounded-2xl transition-all duration-700 ${loading ? "opacity-50 grayscale" : "opacity-100"}`} alt="Outfit Preview" />
            
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 pointer-events-none rounded-3xl overflow-hidden">
                  <motion.div 
                    animate={{ top: ["-10%", "110%", "-10%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-purple-400 shadow-[0_0_40px_rgba(192,132,252,1)]"
                  />
                  <div className="absolute inset-0 bg-purple-500/10 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-black/60 px-6 py-3 rounded-full border border-purple-500/30 flex items-center gap-2">
                      <Loader2 className="animate-spin text-purple-400" size={18}/>
                      <span className="text-sm font-mono font-bold text-purple-400 tracking-widest">CALCULATING METRICS</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="space-y-8">
            <div>
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Overall Aesthetic</p>
              <h3 className="text-7xl font-black text-white">{fitRating ? fitRating.overall : "0.0"}<span className="text-2xl text-zinc-500">/10</span></h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-400">Color Harmony</span><span className="text-white">{fitRating ? fitRating.color_harmony : 0}/10</span></div>
                <div className="w-full bg-white/10 rounded-full h-2"><motion.div initial={{ width: 0 }} animate={{ width: fitRating ? `${(fitRating.color_harmony/10)*100}%` : "0%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="bg-blue-400 h-2 rounded-full"></motion.div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-400">Proportions & Fit</span><span className="text-white">{fitRating ? fitRating.proportions : 0}/10</span></div>
                <div className="w-full bg-white/10 rounded-full h-2"><motion.div initial={{ width: 0 }} animate={{ width: fitRating ? `${(fitRating.proportions/10)*100}%` : "0%" }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} className="bg-purple-400 h-2 rounded-full"></motion.div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-400">Trendiness</span><span className="text-white">{fitRating ? fitRating.trendiness : 0}/10</span></div>
                <div className="w-full bg-white/10 rounded-full h-2"><motion.div initial={{ width: 0 }} animate={{ width: fitRating ? `${(fitRating.trendiness/10)*100}%` : "0%" }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }} className="bg-pink-400 h-2 rounded-full"></motion.div></div>
              </div>
            </div>
            
            <AnimatePresence>
              {fitRating && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl">
                  <p className="text-sm text-purple-200 font-medium leading-relaxed italic">"{fitRating.feedback}"</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}