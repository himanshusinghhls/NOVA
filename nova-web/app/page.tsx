"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sliders, Activity, Loader2, Sparkles, ExternalLink } from "lucide-react";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function NovaMaster() {
  const [activeFeature, setActiveFeature] = useState("find-clothes");
  const [inputMode, setInputMode] = useState("photo"); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [extractedTraits, setExtractedTraits] = useState<any>(null);
  const [manualForm, setManualForm] = useState({ gender: "unisex", age_group: "young_adult", occasion: "casual", skin_tone: "medium", style: "minimalist" });
  const [fitRating, setFitRating] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPreviewImage(URL.createObjectURL(file));
    setLoading(true);
    setRecommendations([]);
    setExtractedTraits(null);
    setFitRating(null);

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      if (activeFeature === "find-clothes") {
        const res = await fetch(`${API_URL}/analyze-image`, { method: "POST", body: formData });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setExtractedTraits(data.traits);
        setRecommendations(data.recommendations);
      } else {
        const res = await fetch(`${API_URL}/rate-outfit`, { method: "POST", body: formData });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setFitRating(data);
      }
    } catch (err) {
      alert("AI Engine error or waking up. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async () => {
    setLoading(true);
    setExtractedTraits(manualForm);
    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(manualForm)
      });
      const data = await res.json();
      setRecommendations(data.results);
    } catch (err) {
      alert("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative selection:bg-blue-500/30 pb-20">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl tracking-tighter">N</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">NOVA<span className="text-blue-500">_</span></h1>
        </div>
        
        <div className="flex gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
          <button onClick={() => { setActiveFeature("find-clothes"); setPreviewImage(null); }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFeature === "find-clothes" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}>Get Clothes</button>
          <button onClick={() => { setActiveFeature("rate-outfit"); setPreviewImage(null); }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFeature === "rate-outfit" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}>Rate Outfit</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        
        {activeFeature === "find-clothes" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            
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
                    <button onClick={() => fileInputRef.current?.click()} className="bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-zinc-200 transition-all flex items-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
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
                    <button onClick={handleManualSearch} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center">
                      {loading ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2"/>} {loading ? "Searching Database..." : "Find Clothes"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {recommendations.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16">
                <div className="flex justify-between items-end mb-8">
                  <h3 className="text-3xl font-black">Your Curated Fits</h3>
                  {extractedTraits && (
                    <div className="hidden md:flex gap-2">
                      <span className="bg-white/10 text-xs px-3 py-1 rounded-full text-zinc-300 capitalize">{extractedTraits.style}</span>
                      <span className="bg-white/10 text-xs px-3 py-1 rounded-full text-zinc-300 capitalize">{extractedTraits.occasion}</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recommendations.map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-colors group flex flex-col">
                      <div className="relative h-64 bg-zinc-900 overflow-hidden">
                        <img src={item.image_url} alt={item.item} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                          <p className="font-mono font-bold text-white">${item.price}</p>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h4 className="font-black text-lg mb-1">{item.brand}</h4>
                        <p className="text-sm text-zinc-400 mb-4">{item.item}</p>
                        <div className="flex gap-2 mb-6">
                          {["S", "M", "L", "XL"].map(size => (
                            <span key={size} className="text-[10px] border border-white/10 px-2 py-1 rounded text-zinc-500">{size}</span>
                          ))}
                        </div>
                        <a href={item.product_url} target="_blank" rel="noreferrer" className="mt-auto w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                          Buy Now <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeFeature === "rate-outfit" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center space-y-12">
            
            <div className="space-y-6">
              <h2 className="text-5xl font-black tracking-tighter text-white">Rate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Outfit.</span></h2>
              <p className="text-zinc-400 max-w-xl mx-auto">Upload a mirror selfie or outfit picture. Our styling engine will break down your color harmony, proportions, and trendiness.</p>
              
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm mt-8 flex flex-col items-center">
                <button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-purple-700 transition-all flex items-center shadow-[0_0_30px_rgba(147,51,234,0.3)]">
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
                    <h3 className="text-7xl font-black text-white">{fitRating.overall}<span className="text-2xl text-zinc-500">/10</span></h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-400">Color Harmony</span><span className="text-white">{fitRating.color_harmony}/10</span></div>
                      <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-blue-400 h-2 rounded-full" style={{width: `${(fitRating.color_harmony/10)*100}%`}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-400">Proportions & Fit</span><span className="text-white">{fitRating.proportions}/10</span></div>
                      <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-purple-400 h-2 rounded-full" style={{width: `${(fitRating.proportions/10)*100}%`}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-400">Trendiness</span><span className="text-white">{fitRating.trendiness}/10</span></div>
                      <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-pink-400 h-2 rounded-full" style={{width: `${(fitRating.trendiness/10)*100}%`}}></div></div>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl">
                    <p className="text-sm text-purple-200 font-medium leading-relaxed italic">"{fitRating.feedback}"</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}