"use client";

import { useState } from "react";
import { Scan, Loader2, UploadCloud, Camera, AlertCircle } from "lucide-react";

const API_URL = "https://nova-backend-neec.onrender.com";

export default function VisionSetup() {
  const [visionPreview, setVisionPreview] = useState<string | null>(null);
  const [visionData, setVisionData] = useState<any>(null);
  const [loadingVision, setLoadingVision] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const startProgress = () => {
    setProgress(10);
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + Math.random() * 15 : prev));
    }, 600);
    return interval;
  };

  const handleVisionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setVisionPreview(URL.createObjectURL(file));
    setLoadingVision(true);
    setSysError(null);
    setVisionData(null);
    
    const progInterval = startProgress();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/analyze-image`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("ML Engine crashed. The image might be too large, or the server is waking up.");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setVisionData(data);
      setProgress(100);
    } catch (err: any) {
      setSysError(err.message);
    } finally {
      clearInterval(progInterval);
      setLoadingVision(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-8">
      {loadingVision && (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 z-50">
          <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {sysError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="mr-3" size={24} />
          <p className="font-medium text-sm">{sysError}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className={`bg-white dark:bg-zinc-900 border-2 border-dashed ${loadingVision ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-zinc-300 dark:border-zinc-700'} rounded-[2rem] p-6 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden transition-all duration-300`}>
            {visionPreview ? (
              <>
                <img src={visionPreview} className="absolute inset-0 w-full h-full object-contain p-4 opacity-50 bg-zinc-100 dark:bg-black" />
                {loadingVision ? (
                  <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <Scan className="text-blue-500 animate-spin mb-4" size={48} />
                    <p className="text-blue-600 dark:text-blue-400 font-mono font-bold tracking-widest text-sm bg-white dark:bg-black px-4 py-2 rounded-lg shadow-xl border border-blue-500/30">
                      {Math.round(progress)}% EXTRACTING...
                    </p>
                  </div>
                ) : (
                  <div className="relative z-20 flex flex-col gap-3 w-full max-w-[200px] mt-auto">
                    <label className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center">
                      <Camera size={18} className="mr-2" /> Retake
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleVisionUpload} />
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
                  <label className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center hover:scale-105">
                    <Camera size={18} className="mr-2" /> Open Camera
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleVisionUpload} />
                  </label>
                  <label className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white w-full py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center hover:scale-105">
                    <UploadCloud size={18} className="mr-2" /> Upload File
                    <input type="file" accept="image/*" className="hidden" onChange={handleVisionUpload} />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm flex flex-col min-h-[500px]">
          {visionData && !loadingVision ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
              <div className="flex items-center space-x-2 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg w-max mb-2 border border-green-500/20">
                <span className="text-xs font-bold uppercase tracking-widest">DeepFace Pipeline Complete</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-[#0f0f11] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Detected Feature Set</p>
                  <p className="text-3xl font-black capitalize">{visionData.gender || "N/A"}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-[#0f0f11] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Confidence Age</p>
                  <p className="text-3xl font-black">{Math.round(visionData.age)} <span className="text-sm font-normal text-zinc-500">Yrs</span></p>
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-[#0f0f11] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">K-Means Multi-Color Extraction</p>
                <div className="flex gap-2">
                  {visionData.palette?.map((hex: string, i: number) => (
                    <div key={i} className="flex-1 h-20 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-end justify-center pb-2" style={{ backgroundColor: hex }}>
                      <span className="bg-white/90 dark:bg-black/80 text-black dark:text-white px-2 py-1 rounded text-[10px] font-mono font-bold">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="m-auto text-center text-zinc-400 max-w-sm"><Scan size={48} className="mx-auto mb-4 opacity-20" /><p className="text-sm">Upload an image to initiate DeepFace and OpenCV logic. Awaiting payload...</p></div>
          )}
        </div>
      </div>
    </div>
  );
}