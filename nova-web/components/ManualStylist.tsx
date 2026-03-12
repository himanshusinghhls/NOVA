import { useState } from "react";
import { getRecommendations } from "../lib/api";

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
    <div className="glass p-8 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-6">Manual Override</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.keys(form).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{key.replace("_", " ")}</label>
            <select 
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-sm outline-none text-white"
              onChange={(e) => setForm({...form, [key]: e.target.value})}
            >
              {key === "gender" && ["unisex", "male", "female"].map(o => <option key={o}>{o}</option>)}
              {key === "age_group" && ["teen", "young_adult", "adult", "senior"].map(o => <option key={o}>{o}</option>)}
              {key === "occasion" && ["casual", "formal", "party", "sport"].map(o => <option key={o}>{o}</option>)}
              {key === "skin_tone" && ["fair", "medium", "dark", "olive"].map(o => <option key={o}>{o}</option>)}
              {key === "style" && ["minimalist", "vintage", "hypebeast", "elegant"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all mt-auto">
        {loading ? "Searching Vectors..." : "Execute Search"}
      </button>

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {results.slice(0, 2).map((item, i) => (
            <div key={i} className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
              <p className="font-bold">{item.brand}</p>
              <p className="text-xs text-slate-400">{item.item}</p>
              <a href={item.product_url} target="_blank" className="text-blue-400 text-xs mt-2 inline-block">Buy Now →</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}