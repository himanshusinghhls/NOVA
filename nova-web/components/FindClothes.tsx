"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sliders, Loader2, Sparkles, AlertTriangle, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import ProductCard from "./ProductCard";
import { triggerHaptic } from "../utils/haptics";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function FindClothes() {
  const [inputMode, setInputMode] = useState("photo"); 
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [extractedTraits, setExtractedTraits] = useState<any>(null);
  const [manualForm, setManualForm] = useState({ gender: "unisex", age_group: "young_adult", occasion: "casual", skin_tone: "medium", style: "minimalist" });

  const processFile = async (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
    setLoading(true); setSysError(null); setRecommendations([]); setExtractedTraits(null);

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch(`${API_URL}/analyze-image`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Server failed to process image.");
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
      if (!res.ok || data.error) throw new Error(data.error || "Database error");
      setRecommendations(data.results || []);
    } catch (err: any) {
      setSysError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      {sysError && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={20} /><p className="text-sm font-bold">{sysError}</p>
        </motion.div>
      )}

      <div className="text-center max-w-2xl mx-auto space-y-6">
        <h2 className="text-5xl font-black tracking-tighter text-white">Curate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Wardrobe.</span></h2>
        
        <div className="flex justify-center gap-4 mt-6">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setInputMode("photo"); triggerHaptic(); }} className={`px-6 py-3 rounded-xl font-bold transition-all border ${inputMode === "photo" ? "bg-blue-600 border-blue-500 text-white" : "bg-transparent border-white/10 text-zinc-400 hover:bg-white/5"}`}><Camera className="inline mr-2" size={18}/> Use Photo</motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setInputMode("manual"); triggerHaptic(); }} className={`px-6 py-3 rounded-xl font-bold transition-all border ${inputMode === "manual" ? "bg-blue-600 border-blue-500 text-white" : "bg-transparent border-white/10 text-zinc-400 hover:bg-white/5"}`}><Sliders className="inline mr-2" size={18}/> Manual Search</motion.button>
        </div>

        <div className="mt-8">
          {inputMode === "photo" ? (
            <div {...getRootProps()} className="outline-none cursor-pointer">
              <input {...getInputProps()} />
              <motion.div 
                animate={{ scale: isDragActive ? 1.02 : 1, borderColor: isDragActive ? "rgba(59,130,246,0.8)" : "rgba(255,255,255,0.1)" }}
                className={`bg-white/5 border-2 border-dashed p-10 rounded-[2rem] backdrop-blur-sm transition-colors flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden ${isDragActive ? "bg-blue-500/10" : ""}`}
              >
                {!previewImage ? (
                  <div className="flex flex-col items-center pointer-events-none">
                    <UploadCloud size={60} className={`mb-4 ${isDragActive ? "text-blue-400" : "text-zinc-500"}`} />
                    <p className="text-xl font-bold mb-2">{isDragActive ? "Drop to initialize scan..." : "Drag & Drop Image Here"}</p>
                    <p className="text-zinc-500 text-sm">or click to browse local files</p>
                  </div>
                ) : (
                  <div className="w-full max-w-sm h-72 bg-black/80 rounded-2xl overflow-hidden relative shadow-2xl p-2 border border-white/10">
                    <img src={previewImage} className={`w-full h-full object-contain rounded-xl transition-all duration-700 ${loading ? "opacity-50 grayscale" : "opacity-100"}`} alt="Input" />
                    
                    <AnimatePresence>
                      {loading && (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 z-20 pointer-events-none rounded-xl overflow-hidden"
                        >
                          <motion.div 
                            animate={{ top: ["-10%", "110%", "-10%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_30px_rgba(96,165,250,1)]"
                          />
                          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="bg-black/60 px-4 py-2 rounded-full border border-blue-500/30 flex items-center gap-2">
                              <Loader2 className="animate-spin text-blue-400" size={16}/>
                              <span className="text-xs font-mono font-bold text-blue-400 tracking-widest">EXTRACTING VECTORS</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm text-left space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.keys(manualForm).map((key) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">{key.replace("_", " ")}</label>
                    <select className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none cursor-pointer" onChange={(e) => setManualForm({...manualForm, [key]: e.target.value})} value={(manualForm as any)[key]}>
                      {key === "gender" && ["unisex", "male", "female"].map(o => <option key={o}>{o}</option>)}
                      {key === "age_group" && ["teen", "young_adult", "adult", "senior"].map(o => <option key={o}>{o}</option>)}
                      {key === "occasion" && ["casual", "formal", "party", "sport"].map(o => <option key={o}>{o}</option>)}
                      {key === "skin_tone" && ["fair", "medium", "dark", "olive"].map(o => <option key={o}>{o}</option>)}
                      {key === "style" && ["minimalist", "vintage", "hypebeast", "elegant"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleManualSearch} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                {loading ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2"/>} {loading ? "Searching Database..." : "Find Clothes"}
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {Array.isArray(recommendations) && recommendations.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-3xl font-black">Your Curated Fits</h3>
            {extractedTraits && (
              <div className="hidden md:flex gap-2">
                <span className="bg-white/10 border border-white/20 text-xs px-3 py-1 rounded-full text-zinc-300 capitalize">{extractedTraits.style || "Style"}</span>
                <span className="bg-white/10 border border-white/20 text-xs px-3 py-1 rounded-full text-zinc-300 capitalize">{extractedTraits.occasion || "Occasion"}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 perspective-1000">
            {recommendations.map((item, idx) => <ProductCard key={idx} item={item} index={idx} />)}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}