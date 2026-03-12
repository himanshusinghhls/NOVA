"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Sparkles, Camera, Activity, Loader2, ArrowRight } from "lucide-react";

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
      alert("AI Engine is waking up. Please try again in 10 seconds.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative selection:bg-blue-500/30">
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-10 mix-blend-overlay"></div>

      <motion.nav 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-50"
      >
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-black text-2xl tracking-tighter">N</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">NOVA<span className="text-blue-500">_</span></h1>
        </div>
        
        <div className="flex gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl shadow-2xl">
          {["vision", "fit-rater"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setVisionData(null); setVisionPreview(null); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize relative ${
                activeTab === tab ? "text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {activeTab === tab && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl -z-10" />
              )}
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 pt-12 items-center min-h-[75vh]">
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 space-y-8 relative z-10"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Sparkles size={14} className="animate-pulse" />
            <span>Gemini AI Core Active</span>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            {activeTab === "vision" ? "Define" : "Rate"} <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              {activeTab === "vision" ? "Your Look." : "Your Fit."}
            </span>
          </h2>
          
          <p className="text-lg text-zinc-400 max-w-md font-medium leading-relaxed">
            {activeTab === "vision" 
              ? "Upload a photo. Our neural engine will extract your exact color palette, demographic baselines, and stylistic vectors instantly."
              : "Upload your outfit. The Gemini engine evaluates contrast, layering, and harmony to score your daily aesthetic."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black px-8 py-4 rounded-2xl font-black transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 text-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
              {loading ? "Analyzing..." : "Initialize Scanner"}
            </motion.button>
          </div>
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="lg:col-span-7 w-full h-[600px] perspective-1000"
        >
          <div className="w-full h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Visual Processing Unit</p>
            </div>

            <div className="flex-grow relative bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6">
              <AnimatePresence mode="wait">
                
                {!visionPreview && !loading && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center text-center opacity-40"
                  >
                    <Scan size={80} className="mb-6 text-blue-500" />
                    <p className="font-mono tracking-widest text-sm font-bold">AWAITING VISUAL PAYLOAD</p>
                  </motion.div>
                )}

                {visionPreview && loading && (
                  <motion.div key="loading" className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                    <div className="relative w-full h-full">
                      <img src={visionPreview} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Scan className="text-blue-500 animate-[spin_3s_linear_infinite] mb-6" size={64} />
                        <div className="bg-blue-500/20 border border-blue-500/30 px-6 py-2 rounded-full backdrop-blur-md">
                          <p className="font-mono font-bold tracking-widest text-blue-400 text-sm flex items-center gap-2">
                            <Loader2 className="animate-spin" size={14}/> EXTRACTING VECTORS
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {visionData && !loading && (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-full flex flex-col gap-4 relative z-30"
                  >
                    <div className="h-40 w-full rounded-2xl overflow-hidden relative border border-white/10 shadow-lg">
                      <img src={visionPreview!} className="object-cover w-full h-full opacity-80" />
                      <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-widest backdrop-blur-md flex items-center">
                        <Activity size={12} className="mr-2" /> ANALYSIS COMPLETE
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col justify-center">
                      {activeTab === "vision" ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Estimated Age</p>
                              <p className="text-4xl font-black text-white">{visionData.age}</p>
                            </div>
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Dominant Gender</p>
                              <p className="text-4xl font-black text-white capitalize">{visionData.gender}</p>
                            </div>
                          </div>
                          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3">Extracted Color Palette</p>
                            <div className="flex gap-3 h-14">
                              {visionData.palette?.map((hex: string) => (
                                <div key={hex} className="flex-1 rounded-xl shadow-inner border border-white/20 flex items-end p-2" style={{backgroundColor: hex}}>
                                  <span className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-mono font-bold text-white">{hex}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center bg-gradient-to-br from-white/10 to-transparent p-8 rounded-3xl border border-white/10 backdrop-blur-md h-full flex flex-col justify-center">
                          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-4">Aesthetic Harmony Score</p>
                          <h3 className="text-8xl font-black text-white mb-6 drop-shadow-2xl">{visionData.score}<span className="text-3xl text-zinc-500">/10</span></h3>
                          <div className="inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 px-6 py-3 rounded-2xl font-medium italic text-sm mx-auto">
                            "{visionData.feedback}"
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}