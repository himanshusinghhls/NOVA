"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Sliders, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import ProductCard from "./ProductCard";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function FindClothes() {
  const [inputMode, setInputMode] = useState("photo"); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [extractedTraits, setExtractedTraits] = useState<any>(null);
  const [manualForm, setManualForm] = useState({ gender: "unisex", age_group: "young_adult", occasion: "casual", skin_tone: "medium", style: "minimalist" });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
    } catch (err: any) {
      setSysError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async () => {
    setLoading(true); setSysError(null); setExtractedTraits(manualForm);
    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(manualForm)
      });
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
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={20} /><p className="text-sm font-bold">{sysError}</p>
        </div>
      )}

      <div className="text-center max-w-2xl mx-auto space-y-6">
        <h2 className="text-5xl font-black tracking-tighter text-white">Curate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Wardrobe.</span></h2>
        <p className="text-zinc-400">Let AI find the perfect clothes for you based on your photo, or manually enter your preferred aesthetic.</p>
        
        <div className="flex justify-center gap-4">
          <button onClick={() => setInputMode("photo")} className={`px-6 py-3 rounded-xl font-bold transition-all border ${inputMode === "photo" ? "bg-blue-600 border-blue-500 text-white" : "bg-transparent border-white/10 text-zinc-400 hover:bg-white/5"}`}><Camera className="inline mr-2" size={18}/> Use Photo</button>
          <button onClick={() => setInputMode("manual")} className={`px-6 py-3 rounded-xl font-bold transition-all border ${inputMode === "manual" ? "bg-blue-600 border-blue-500 text-white" : "bg-transparent border-white/10 text-zinc-400 hover:bg-white/5"}`}><Sliders className="inline mr-2" size={18}/> Manual Search</button>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm mt-8">
          {inputMode === "photo" ? (
            <div className="flex flex-col items-center">
              <button onClick={() => fileInputRef.current?.click()} disabled={loading} className="bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-zinc-200 transition-all flex items-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                {loading ? <Loader2 className="animate-spin mr-2"/> : <Camera className="mr-2"/>} {loading ? "Analyzing Photo..." : "Upload Photo to Search"}
              </button>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              {previewImage && <img src={previewImage} className="mt-6 w-32 h-32 object-cover rounded-xl border border-white/20" />}
            </div>
          ) : (
            <div className="text-left space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.keys(manualForm).map((key) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">{key.replace("_", " ")}</label>
                    <select className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none" onChange={(e) => setManualForm({...manualForm, [key]: e.target.value})} value={(manualForm as any)[key]}>
                      {key === "gender" && ["unisex", "male", "female"].map(o => <option key={o}>{o}</option>)}
                      {key === "age_group" && ["teen", "young_adult", "adult", "senior"].map(o => <option key={o}>{o}</option>)}
                      {key === "occasion" && ["casual", "formal", "party", "sport"].map(o => <option key={o}>{o}</option>)}
                      {key === "skin_tone" && ["fair", "medium", "dark", "olive"].map(o => <option key={o}>{o}</option>)}
                      {key === "style" && ["minimalist", "vintage", "hypebeast", "elegant"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <button onClick={handleManualSearch} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2"/>} {loading ? "Searching Database..." : "Find Clothes"}
              </button>
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
                <span className="bg-white/10 text-xs px-3 py-1 rounded-full text-zinc-300 capitalize">{extractedTraits.style || "Style"}</span>
                <span className="bg-white/10 text-xs px-3 py-1 rounded-full text-zinc-300 capitalize">{extractedTraits.occasion || "Occasion"}</span>
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