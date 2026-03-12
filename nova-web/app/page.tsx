"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Sparkles, Camera, Sliders, Activity, Loader2 } from "lucide-react";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function NovaMaster() {
  const [activeTab, setActiveTab] = useState("vision");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [visionData, setVisionData] = useState<any>(null);
  const [visionPreview, setVisionPreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setVisionPreview(URL.createObjectURL(file));
    setLoading(true);
    setVisionData(null);

    const formData = new FormData();
    formData.append("file", file);
    
    const endpoint = activeTab === "vision" ? "analyze-image" : "rate-outfit";

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, { method: "POST", body: formData });
      const data = await res.json();
      setVisionData(data);
    } catch (err) {
      alert("AI Engine waking up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30">
      
      <motion.nav 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50"
      >
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <span className="text-white font-black text-xl tracking-tighter">N</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">NOVA<span className="text-blue-500">_</span></h1>
        </div>
        
        <div className="flex gap-2 glass-panel p-1.5 rounded-2xl">
          {["vision", "fit-rater"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setVisionData(null); setVisionPreview(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${
                activeTab === tab ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-white"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 pt-12 items-center min-h-[70vh]">
        
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="space-y-8 relative z-10"
        >
          <div className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-zinc-300 text-xs font-bold uppercase tracking-wider shadow-xl">
            <Sparkles size={14} className="text-blue-400" />
            <span>Gemini Vision Online</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white">
            {activeTab === "vision" ? "Extract your" : "Rate your"} <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              {activeTab === "vision" ? "Aesthetic." : "Daily Fit."}
            </span>
          </h2>
          
          <p className="text-lg text-zinc-400 max-w-xl">
            {activeTab === "vision" 
              ? "Upload a photo to extract your exact color palette, demographic baselines, and stylistic vectors using visual AI."
              : "Upload your outfit of the day. Our Gemini-powered engine will evaluate contrast, layering, and overall harmony."}
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-colors shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
            {loading ? "Processing..." : "Initialize Scanner"}
          </motion.button>
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="relative w-full h-[500px]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full -z-10"></div>
          
          <div className="glass-panel w-full h-full rounded-[3rem] p-8 relative overflow-hidden flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {visionPreview ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full h-full flex flex-col"
                >
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 bg-black/50 border border-white/10">
                    <img src={visionPreview} className="object-cover w-full h-full opacity-60" />
                    {loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/20 backdrop-blur-sm">
                        <Scan className="text-blue-400 animate-[spin_3s_linear_infinite]" size={40} />
                      </div>
                    )}
                  </div>
                  
                  {visionData && !loading && (
                    <div className="flex-grow flex flex-col justify-center">
                      {activeTab === "vision" ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-black/30 p-4 rounded-2xl border border-white/5"><p className="text-xs text-zinc-500 uppercase font-bold mb-1">Age</p><p className="text-2xl font-black text-white">{visionData.age}</p></div>
                            <div className="bg-black/30 p-4 rounded-2xl border border-white/5"><p className="text-xs text-zinc-500 uppercase font-bold mb-1">Gender</p><p className="text-2xl font-black text-white capitalize">{visionData.gender}</p></div>
                          </div>
                          <div className="flex gap-2 h-12">
                            {visionData.palette?.map((c: string) => (
                              <div key={c} className="flex-1 rounded-xl shadow-inner border border-white/10" style={{backgroundColor: c}}></div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center bg-black/30 p-6 rounded-3xl border border-white/5">
                          <h3 className="text-6xl font-black text-white mb-4">{visionData.score}<span className="text-2xl text-zinc-500">/10</span></h3>
                          <p className="text-zinc-300 font-medium italic">"{visionData.feedback}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center opacity-30"
                >
                  <Scan size={64} className="mb-6 text-blue-500" />
                  <p className="font-mono tracking-widest text-sm font-bold">AWAITING VISUAL PAYLOAD</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
}