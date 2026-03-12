import { useState } from "react";
import { getRecommendations } from "../lib/api";
import ProductCard from "./ProductCard";
import { Sliders, Loader2 } from "lucide-react";

export default function ManualStylist() {
  const [form, setForm] = useState({ gender: "unisex", age_group: "young_adult", occasion: "casual", skin_tone: "medium", style: "minimalist" });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await getRecommendations(form);
      setResults(data.results || []);
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-[2rem] flex flex-col h-full min-h-[450px]">
      <h2 className="text-2xl font-black mb-6 flex items-center"><Sliders className="mr-2 text-blue-500"/> Vector Database Parameters</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {Object.keys(form).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">{key.replace("_", " ")}</label>
            <select 
              className="bg-black/40 border border-white/5 rounded-xl p-3 text-sm outline-none text-white focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
              onChange={(e) => setForm({...form, [key]: e.target.value})}
            >
              {key === "gender" && ["unisex", "male", "female"].map(o => <option key={o} value={o}>{o}</option>)}
              {key === "age_group" && ["teen", "young_adult", "adult", "senior"].map(o => <option key={o} value={o}>{o}</option>)}
              {key === "occasion" && ["casual", "formal", "party", "sport"].map(o => <option key={o} value={o}>{o}</option>)}
              {key === "skin_tone" && ["fair", "medium", "dark", "olive"].map(o => <option key={o} value={o}>{o}</option>)}
              {key === "style" && ["minimalist", "vintage", "hypebeast", "elegant"].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
      
      <button onClick={handleSubmit} disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-all mt-auto flex items-center justify-center">
        {loading ? <Loader2 className="animate-spin mr-2" /> : <Sliders className="mr-2" size={18} />}
        {loading ? "Searching Vectors..." : "Execute Search"}
      </button>

      {results.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 animate-in fade-in">
          {results.slice(0, 2).map((item, i) => (
            <ProductCard key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}