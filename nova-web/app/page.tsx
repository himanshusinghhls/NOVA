"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Home, Sliders, Camera, Star, Loader2, UploadCloud, Sun, Moon } from "lucide-react";
import Spline from "@splinetool/react-spline";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function NovaPlatform() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("Home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [manualForm, setManualForm] = useState({ gender: "unisex", age_group: "young_adult", occasion: "casual", skin_tone: "medium", style: "minimalist" });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingManual, setLoadingManual] = useState(false);

  const [visionPreview, setVisionPreview] = useState<string | null>(null);
  const [visionData, setVisionData] = useState<any>(null);
  const [loadingVision, setLoadingVision] = useState(false);

  const [fitPreview, setFitPreview] = useState<string | null>(null);
  const [fitData, setFitData] = useState<any>(null);
  const [loadingFit, setLoadingFit] = useState(false);

  const handleManualSubmit = async () => {
    setLoadingManual(true);
    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualForm),
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      alert("Failed to connect to NOVA API. Ensure backend is deployed and CORS is configured.");
    } finally {
      setLoadingManual(false);
    }
  };

  const handleVisionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVisionPreview(URL.createObjectURL(file));
    setLoadingVision(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/analyze-image`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("API Error");
      setVisionData(await res.json());
    } catch (err) {
      alert("Vision API error. Ensure Render backend is awake.");
    } finally {
      setLoadingVision(false);
    }
  };

  const handleFitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFitPreview(URL.createObjectURL(file));
    setLoadingFit(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/rate-outfit`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("API Error");
      setFitData(await res.json());
    } catch (err) {
      alert("Rating API error. Ensure Render backend is awake.");
    } finally {
      setLoadingFit(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen max-w-7xl mx-auto p-4 md:p-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
            <span className="text-white dark:text-black font-black text-xl tracking-tighter">N</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">NOVA.</h1>
        </div>

        <div className="flex space-x-1 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          {[
            { name: "Home", icon: Home },
            { name: "Style Engine", icon: Sliders },
            { name: "Vision Setup", icon: Camera },
            { name: "Fit Rater", icon: Star },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.name 
                  ? "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white shadow-sm" 
                  : "text-zinc-500 hover:text-black dark:hover:text-white"
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden md:inline">{tab.name}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:scale-105 transition-transform"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {activeTab === "Home" && (
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1]">
                The AI infrastructure <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">for modern styling.</span>
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                NOVA represents the next generation of fashion tech. Built on a decoupled microservices architecture, enabling real-time inferences for e-commerce and retail.
              </p>
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">⚡</div>
                  <div><p className="font-bold">FastAPI Engine</p><p className="text-sm text-zinc-500">Sub-millisecond vector retrieval.</p></div>
                </div>
                <div className="flex items-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">🧠</div>
                  <div><p className="font-bold">DeepFace & OpenCV</p><p className="text-sm text-zinc-500">Real-time demographic clustering.</p></div>
                </div>
              </div>
            </div>
            
            <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-zinc-100 dark:bg-zinc-900 relative">
               <Spline scene="https://prod.spline.design/iW5gB5h5D98B-Dcw/scene.splinecode" />
            </div>
          </div>
        )}

        {activeTab === "Style Engine" && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Inference Parameters</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(["gender", "age_group", "occasion", "skin_tone", "style"] as const).map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">{field.replace("_", " ")}</label>
                    <select
                      className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
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
                <button onClick={handleManualSubmit} disabled={loadingManual} className="bg-black dark:bg-white text-white dark:text-black font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all flex items-center shadow-lg">
                  {loadingManual ? <Loader2 className="animate-spin mr-2" size={18} /> : "Execute Query"}
                </button>
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group">
                    <div className="h-72 w-full overflow-hidden relative bg-zinc-100 dark:bg-zinc-950">
                      <img src={item.image_url} alt={item.item} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-black text-xl">{item.brand}</p>
                          <p className="text-zinc-500">{item.item}</p>
                        </div>
                        <span className="font-mono font-bold text-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">${item.price}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">{item.color}</span>
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">{item.style}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === "Vision Setup" || activeTab === "Fit Rater") && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group hover:border-blue-500 transition-colors">
              {(activeTab === "Vision Setup" && visionPreview) || (activeTab === "Fit Rater" && fitPreview) ? (
                <img src={activeTab === "Vision Setup" ? visionPreview! : fitPreview!} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upload Subject Imagery</h3>
                  <p className="text-zinc-500">Drag and drop or click to browse</p>
                </div>
              )}
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={activeTab === "Vision Setup" ? handleVisionUpload : handleFitUpload} />
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-center min-h-[500px]">
              {activeTab === "Vision Setup" ? (
                loadingVision ? (
                  <div className="flex flex-col items-center text-zinc-500"><Loader2 className="animate-spin mb-4 text-blue-500" size={40} /><p className="font-medium">Processing Vision Vectors...</p></div>
                ) : visionData ? (
                  <div className="space-y-8 animate-in fade-in">
                    <div>
                      <h3 className="text-2xl font-black mb-1">Vision Metrics</h3>
                      <p className="text-zinc-500">DeepFace analysis complete.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mb-1">Detected Gender</p>
                        <p className="text-3xl font-black capitalize">{visionData.gender || "N/A"}</p>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mb-1">Est. Age Bracket</p>
                        <p className="text-3xl font-black">{Math.round(visionData.age) || "N/A"}</p>
                      </div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mb-4">Dominant Palette Hex</p>
                      <div className="h-20 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono shadow-inner relative overflow-hidden" style={{ backgroundColor: visionData.dominant_color_hex }}>
                        <span className="bg-white/90 dark:bg-black/90 text-black dark:text-white px-4 py-2 rounded-lg font-bold shadow-lg backdrop-blur-sm">{visionData.dominant_color_hex}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-zinc-400"><Camera size={48} className="mx-auto mb-4 opacity-20" /><p>Awaiting vision data...</p></div>
                )
              ) : (
                loadingFit ? (
                  <div className="flex flex-col items-center text-zinc-500"><Loader2 className="animate-spin mb-4 text-purple-500" size={40} /><p className="font-medium">Calculating Aesthetics...</p></div>
                ) : fitData ? (
                  <div className="space-y-8 animate-in fade-in">
                    <div>
                      <h3 className="text-2xl font-black mb-1">OOTD Evaluation</h3>
                      <p className="text-zinc-500">Aesthetic heuristics processed.</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center relative overflow-hidden">
                      <h3 className="text-7xl font-black mb-4 tracking-tighter">{fitData.score}<span className="text-2xl text-zinc-400">/10</span></h3>
                      <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${(fitData.score / 10) * 100}%` }}></div>
                      </div>
                      <p className="text-lg font-medium italic">"{fitData.feedback}"</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-24 flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner flex items-end p-3" style={{ backgroundColor: fitData.color_1 }}><span className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs font-mono font-bold">{fitData.color_1}</span></div>
                      <div className="h-24 flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner flex items-end p-3" style={{ backgroundColor: fitData.color_2 }}><span className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs font-mono font-bold">{fitData.color_2}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-zinc-400"><Star size={48} className="mx-auto mb-4 opacity-20" /><p>Awaiting outfit data...</p></div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}