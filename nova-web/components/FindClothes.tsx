"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sliders, Loader2, Sparkles, AlertCircle, UploadCloud, ArrowRight } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { triggerHaptic } from "../utils/haptics";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function FindClothes() {
  const [inputMode, setInputMode] = useState<"photo" | "manual">("photo");
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [extractedTraits, setExtractedTraits] = useState<any>(null);
  
  const [manualForm, setManualForm] = useState({ 
    gender: "unisex", age_group: "young_adult", occasion: "casual", skin_tone: "medium", style: "minimalist" 
  });

  const processFile = async (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
    setLoading(true); setSysError(null); setRecommendations([]); setExtractedTraits(null);

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch(`${API_URL}/analyze-image`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Neural link severed.");
      setExtractedTraits(data.traits || {});
      setRecommendations(data.recommendations || []);
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

  const handleManualSearch = async () => {
    triggerHaptic();
    setLoading(true); setSysError(null); setExtractedTraits(manualForm);
    try {
      const res = await fetch(`${API_URL}/recommend`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(manualForm) });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Database query failed.");
      setRecommendations(data.results || []);
    } catch (err: any) {
      setSysError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-12 pb-24 relative">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 transition-colors duration-1000 ${loading ? 'bg-blue-600/20' : recommendations.length > 0 ? 'bg-purple-600/10' : 'bg-transparent'}`} />
      <div className="flex flex-col items-center text-center space-y-8">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Curate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Your Aesthetic.</span>
        </h2>

        <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex backdrop-blur-xl shadow-2xl">
          <button 
            onClick={() => { setInputMode("photo"); triggerHaptic(); }}
            className={`relative px-8 py-3 rounded-xl font-bold text-sm transition-colors ${inputMode === "photo" ? "text-white" : "text-zinc-500 hover:text-white"}`}
          >
            {inputMode === "photo" && <motion.div layoutId="active-tab" className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />}
            <span className="relative z-10 flex items-center gap-2"><Camera size={16}/> Vision AI</span>
          </button>
          <button 
            onClick={() => { setInputMode("manual"); triggerHaptic(); }}
            className={`relative px-8 py-3 rounded-xl font-bold text-sm transition-colors ${inputMode === "manual" ? "text-white" : "text-zinc-500 hover:text-white"}`}
          >
            {inputMode === "manual" && <motion.div layoutId="active-tab" className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />}
            <span className="relative z-10 flex items-center gap-2"><Sliders size={16}/> Manual Parameters</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sysError && (
          <motion.div key="error-alert" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <AlertCircle size={20} /><p className="text-sm font-bold">{sysError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {inputMode === "photo" ? (
          <motion.div 
            key="photo-mode"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div {...getRootProps()} className="outline-none cursor-pointer">
              <input {...getInputProps()} />
              <div 
                className={`relative overflow-hidden group rounded-[2rem] border-2 border-dashed transition-all duration-500 min-h-[350px] flex flex-col items-center justify-center bg-zinc-950/50 backdrop-blur-xl hover:scale-[1.01] active:scale-[0.99] ${isDragActive ? "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)]" : "border-white/10 hover:border-white/30"}`}
              >
                {!previewImage ? (
                  <div className="flex flex-col items-center text-center p-10 z-10 pointer-events-none">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <UploadCloud size={32} className="text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-2">Drop photo to initialize</p>
                    <p className="text-zinc-500 text-sm max-w-xs">Our Vision Model will extract your exact demographic and stylistic vectors.</p>
                  </div>
                ) : (
                  <div className="absolute inset-0 p-2">
                    <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-white/10 bg-black">
                      <img src={previewImage} className={`w-full h-full object-cover transition-all duration-700 ${loading ? "opacity-30 grayscale" : "opacity-100"}`} alt="User Input" />
                      
                      {loading && (
                        <>
                          <motion.div animate={{ top: ["-10%", "110%", "-10%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,1)] z-20" />
                          <div className="absolute inset-0 flex items-center justify-center z-30">
                            <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/30 flex items-center gap-3">
                              <Loader2 className="animate-spin text-blue-400" size={18}/>
                              <span className="text-xs font-mono font-bold text-blue-400 tracking-widest uppercase">Extracting Vectors...</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="manual-mode"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-zinc-950/80 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {Object.keys(manualForm).map((key) => (
                  <div key={key} className="flex flex-col space-y-2">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">{key.replace("_", " ")}</label>
                    <select 
                      className="bg-white/5 hover:bg-white/10 border border-white/10 focus:border-blue-500 rounded-xl p-3.5 text-sm text-white outline-none cursor-pointer transition-colors appearance-none" 
                      onChange={(e) => setManualForm({...manualForm, [key]: e.target.value})} 
                      value={(manualForm as any)[key]}
                    >
                      {key === "gender" && ["unisex", "male", "female"].map(o => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
                      {key === "age_group" && ["teen", "young_adult", "adult", "senior"].map(o => <option key={o} value={o} className="bg-zinc-900">{o.replace("_", " ")}</option>)}
                      {key === "occasion" && ["casual", "formal", "party", "sport", "streetwear"].map(o => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
                      {key === "skin_tone" && ["fair", "medium", "dark", "olive"].map(o => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
                      {key === "style" && ["minimalist", "vintage", "hypebeast", "elegant", "classic"].map(o => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleManualSearch} disabled={loading} 
                className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-zinc-200 transition-all flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {loading ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2 text-blue-600" size={18}/>} 
                {loading ? "Querying Database..." : "Generate Wardrobe"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {recommendations.length > 0 && !loading && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="pt-12 border-t border-white/5">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h3 className="text-3xl font-black text-white mb-2">Curated Matches</h3>
              <p className="text-zinc-500 text-sm">Cosine similarity scored against your profile.</p>
            </div>
            
            {extractedTraits && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(extractedTraits).map(([key, value]) => (
                  <span key={key} className="bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md text-zinc-400 backdrop-blur-md">
                    <span className="text-blue-400 mr-1">{key.substring(0,3)}:</span>{String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[300px]">
            {recommendations.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`group relative rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/30 transition-all duration-500 shadow-xl hover:shadow-2xl ${
                  idx === 0 ? "md:col-span-2 md:row-span-2" : 
                  idx === 3 ? "lg:col-span-2" : ""
                }`}
              >
                <img src={item.image_url} alt={item.item} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-blue-400 font-mono text-[10px] font-bold tracking-widest uppercase mb-1">{item.brand}</p>
                    <h4 className="text-xl font-bold text-white leading-tight mb-2 line-clamp-2">{item.item}</h4>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <span className="text-white font-black">${item.price}</span>
                      <a href={item.product_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      )}
    </motion.div>
  );
}