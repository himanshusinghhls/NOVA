"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Home, Camera, Sliders, Scan, Activity, Loader2, UploadCloud, Sun, Moon, CheckCircle2, Terminal } from "lucide-react";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function NovaPlatform() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("Home");
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => setMounted(true), []);

  const addLog = (msg: string) => setLogs((prev) => [...prev.slice(-4), msg]);
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
    addLog("Initializing Vector Space Search...");
    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualForm),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      addLog(`Success: Retrieved ${data.recommendations.length} optimum matches.`);
    } catch (err) {
      addLog("ERROR: Engine connection failed.");
    } finally {
      setLoadingManual(false);
    }
  };

  const handleVisionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVisionPreview(URL.createObjectURL(file));
    setLoadingVision(true);
    addLog("Injecting image payload to DeepFace pipeline...");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/analyze-image`, { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      setVisionData(await res.json());
      addLog("DeepFace & KMeans clustering complete.");
    } catch (err) {
      addLog("ERROR: Vision extraction failed.");
    } finally {
      setLoadingVision(false);
    }
  };

  const handleFitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFitPreview(URL.createObjectURL(file));
    setLoadingFit(true);
    addLog("Running OpenCV Canny Edge computations...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/rate-outfit`, { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      setFitData(await res.json());
      addLog("Aesthetic heuristics successfully calculated.");
    } catch (err) {
      addLog("ERROR: Rating matrix failed.");
    } finally {
      setLoadingFit(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0c] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-xl tracking-tighter">N</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">NOVA<span className="text-blue-500">_</span></h1>
          </div>

          <div className="flex space-x-1 bg-white dark:bg-zinc-900/50 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800/50">
            {[
              { name: "Home", icon: Home },
              { name: "Style Engine", icon: Sliders },
              { name: "Vision Setup", icon: Scan },
              { name: "Fit Rater", icon: Activity },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.name 
                    ? "bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-zinc-500 hover:text-black dark:hover:text-white"
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden md:inline">{tab.name}</span>
              </button>
            ))}
          </div>

          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:scale-105 transition-transform">
            {theme === "dark" ? <Sun size={20} className="text-zinc-400" /> : <Moon size={20} className="text-zinc-600" />}
          </button>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === "Home" && (
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
              <div className="space-y-8 relative z-10">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
                  Core Engine v3.1 Online
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
                  AI-Powered <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">Visual Intelligence.</span>
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                  NOVA is a professional computer vision pipeline utilizing OpenCV edge detection and DeepFace neural networks to decode fashion context.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setActiveTab("Vision Setup")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center cursor-pointer">
                    Initialize Scanner <Scan className="ml-2" size={18} />
                  </button>
                </div>
              </div>
              
              <div className="relative h-[500px] w-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-[3rem] border border-zinc-200 dark:border-zinc-800/50 overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-96 h-96 border border-zinc-300 dark:border-zinc-800 rounded-full animate-[spin_20s_linear_infinite] border-dashed"></div>
                  <div className="absolute w-72 h-72 border border-blue-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                  <div className="absolute w-48 h-48 bg-blue-500/5 rounded-full backdrop-blur-3xl border border-blue-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                    <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse shadow-[0_0_40px_rgba(59,130,246,0.6)]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Style Engine" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center"><Sliders className="mr-2 text-blue-500" /> Vector Database Parameters</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {(["gender", "age_group", "occasion", "skin_tone", "style"] as const).map((field) => (
                    <div key={field} className="flex flex-col">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">{field.replace("_", " ")}</label>
                      <select
                        className="bg-zinc-50 dark:bg-[#0f0f11] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer font-medium"
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
                  <button onClick={handleManualSubmit} disabled={loadingManual} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-500/20 cursor-pointer">
                    {loadingManual ? <Loader2 className="animate-spin mr-2" size={18} /> : <Scan className="mr-2" size={18} />} {loadingManual ? "Searching Vectors..." : "Execute Search"}
                  </button>
                </div>
              </div>

              {recommendations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  {recommendations.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-blue-500/50 transition-colors flex flex-col">
                      <div className="h-64 w-full relative bg-zinc-100 dark:bg-[#0f0f11] overflow-hidden">
                        <img src={item.image_url} alt={item.item} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur text-xs font-mono font-bold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700">${item.price}</div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <p className="font-black text-xl mb-1">{item.brand}</p>
                        <p className="text-zinc-500 text-sm mb-4">{item.item}</p>
                        <div className="flex gap-2 mb-6">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md">{item.color}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md">{item.style}</span>
                        </div>
                        <a href={item.product_url} target="_blank" rel="noopener noreferrer" className="mt-auto w-full text-center bg-zinc-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-md">
                          Buy Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(activeTab === "Vision Setup" || activeTab === "Fit Rater") && (
            <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              
              <div className="lg:col-span-2">
                <div className={`bg-white dark:bg-zinc-900 border-2 border-dashed ${loadingVision || loadingFit ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-zinc-300 dark:border-zinc-700'} rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden transition-all duration-300`}>
                  
                  {(activeTab === "Vision Setup" && visionPreview) || (activeTab === "Fit Rater" && fitPreview) ? (
                    <>
                      <img src={activeTab === "Vision Setup" ? visionPreview! : fitPreview!} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                      {(loadingVision || loadingFit) ? (
                        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                          <Scan className="text-white animate-spin mb-4" size={48} />
                          <p className="text-white font-mono font-bold tracking-widest text-sm bg-black/50 px-4 py-2 rounded-lg">EXTRACTING VECTORS...</p>
                        </div>
                      ) : (
                        <div className="relative z-20 flex flex-col gap-3">
                           <label className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center">
                            <Camera size={18} className="mr-2" /> Retake Photo
                            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={activeTab === "Vision Setup" ? handleVisionUpload : handleFitUpload} />
                          </label>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center z-10 w-full">
                      <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                        <Camera size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-6">Initialize Image Data</h3>
                      
                      <div className="flex flex-col gap-3 w-full max-w-[200px] mx-auto">
                        <label className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center hover:scale-105 active:scale-95">
                          <Camera size={18} className="mr-2" /> Open Camera
                          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={activeTab === "Vision Setup" ? handleVisionUpload : handleFitUpload} />
                        </label>

                        <label className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white w-full py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors shadow-sm flex items-center justify-center hover:scale-105 active:scale-95">
                          <UploadCloud size={18} className="mr-2" /> Upload Gallery
                          <input type="file" accept="image/*" className="hidden" onChange={activeTab === "Vision Setup" ? handleVisionUpload : handleFitUpload} />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm flex flex-col min-h-[500px] relative">
                
                {activeTab === "Vision Setup" ? (
                  visionData && !loadingVision ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                      <div className="flex items-center space-x-2 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg w-max mb-2 border border-green-500/20">
                        <span className="text-xs font-bold uppercase tracking-widest">DeepFace Pipeline Complete</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-50 dark:bg-[#0f0f11] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Detected Feature Set</p>
                          <p className="text-3xl font-black capitalize text-zinc-900 dark:text-zinc-100">{visionData.gender || "N/A"}</p>
                        </div>
                        <div className="bg-zinc-50 dark:bg-[#0f0f11] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Confidence Age</p>
                          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{Math.round(visionData.age)} <span className="text-sm font-normal text-zinc-500">Yrs</span></p>
                        </div>
                      </div>

                      <div className="bg-zinc-50 dark:bg-[#0f0f11] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">K-Means Multi-Color Extraction</p>
                        <div className="flex gap-2">
                          {visionData.palette?.map((hex: string, i: number) => (
                            <div key={i} className="flex-1 h-20 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-inner flex items-end justify-center pb-2" style={{ backgroundColor: hex }}>
                              <span className="bg-white/90 dark:bg-black/80 text-black dark:text-white px-2 py-1 rounded text-[10px] font-mono font-bold backdrop-blur">{hex}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                     <div className="m-auto text-center text-zinc-400 max-w-sm"><Scan size={48} className="mx-auto mb-4 opacity-20" /><p className="text-sm">Awaiting image payload to initiate DeepFace and OpenCV color clustering pipeline.</p></div>
                  )
                ) : (
                  fitData && !loadingFit ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 h-full flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-purple-500 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
                          <Activity size={16} /><span className="text-xs font-bold uppercase tracking-widest">Canny Edge Heuristics Complete</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Edge Density</p>
                          <p className="text-lg font-mono font-bold text-zinc-400">{fitData.edge_density}%</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-[#0f0f11] dark:to-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center relative overflow-hidden shadow-inner">
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Aesthetic Math Score</p>
                        <h3 className="text-8xl font-black mb-6 tracking-tighter text-zinc-900 dark:text-white">{fitData.score}<span className="text-3xl text-zinc-400">/10</span></h3>
                        
                        <div className="inline-block bg-white dark:bg-black px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium mb-4 shadow-sm">
                          {fitData.texture_profile}
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 font-medium italic">"{fitData.feedback}"</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="h-16 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-3 relative overflow-hidden" style={{ backgroundColor: fitData.color_1 }}>
                            <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></span>
                            <span className="relative text-white px-2 py-1 rounded text-xs font-mono font-bold tracking-widest z-10">BASE TONE</span>
                          </div>
                          <div className="h-16 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-3 relative overflow-hidden" style={{ backgroundColor: fitData.color_2 }}>
                            <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></span>
                            <span className="relative text-white px-2 py-1 rounded text-xs font-mono font-bold tracking-widest z-10">ACCENT</span>
                          </div>
                      </div>
                    </div>
                  ) : (
                    <div className="m-auto text-center text-zinc-400 max-w-sm"><Activity size={48} className="mx-auto mb-4 opacity-20" /><p className="text-sm">Awaiting outfit payload to calculate edge-density heuristics and contrast mapping.</p></div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}