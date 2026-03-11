"use client";

import { useState } from "react";
import { Sliders, Loader2, Scan, AlertCircle } from "lucide-react";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function StyleEngine() {
  const [manualForm, setManualForm] = useState({ gender: "unisex", age_group: "young_adult", occasion: "casual", skin_tone: "medium", style: "minimalist" });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingManual, setLoadingManual] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);

  const handleManualSubmit = async () => {
    setLoadingManual(true);
    setSysError(null);
    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualForm),
      });
      if (!res.ok) throw new Error("Database initializing. Please try again in 10 seconds.");
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      setSysError(err.message);
    } finally {
      setLoadingManual(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 pt-8">
      {sysError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="mr-3" size={24} />
          <p className="font-medium text-sm">{sysError}</p>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <h3 className="text-xl font-bold mb-6 flex items-center"><Sliders className="mr-2 text-blue-500" /> Vector Database Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(["gender", "age_group", "occasion", "skin_tone", "style"] as const).map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">{field.replace("_", " ")}</label>
              <select
                className="bg-zinc-50 dark:bg-[#0f0f11] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={(manualForm as any)[field]}
                onChange={(e) => setManualForm({ ...manualForm, [field]: e.target.value })}
              >
                {field === "gender" && ["unisex", "male", "female"].map(o => <option key={o} value={o}>{o}</option>)}
                {field === "age_group" && ["teen", "young_adult", "adult", "senior"].map(o => <option key={o} value={o}>{o}</option>)}
                {field === "occasion" && ["casual", "formal", "party", "sport", "streetwear"].map(o => <option key={o} value={o}>{o}</option>)}
                {field === "skin_tone" && ["fair", "medium", "dark", "olive", "brown"].map(o => <option key={o} value={o}>{o}</option>)}
                {field === "style" && ["minimalist", "vintage", "hypebeast", "elegant", "classic"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button onClick={handleManualSubmit} disabled={loadingManual} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg">
            {loadingManual ? <Loader2 className="animate-spin mr-2" size={18} /> : <Scan className="mr-2" size={18} />} Execute Search
          </button>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col hover:border-blue-500/50 transition-colors">
              <div className="h-64 w-full relative bg-zinc-100 dark:bg-[#0f0f11]">
                <img src={item.image_url} alt={item.item} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur text-xs font-mono font-bold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700">${item.price}</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="font-black text-xl mb-1">{item.brand}</p>
                <p className="text-zinc-500 text-sm mb-4">{item.item}</p>
                <a href={item.product_url} target="_blank" rel="noopener noreferrer" className="mt-auto w-full text-center bg-zinc-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform">Buy Now</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}