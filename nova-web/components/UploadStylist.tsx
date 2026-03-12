import { useState, useRef } from "react";
import { analyzeImage } from "../lib/api";

export default function UploadStylist() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const result = await analyzeImage(file);
      setData(result);
    } catch (err) {
      alert("Analysis failed. Backend might be restarting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
      {loading ? (
        <div className="animate-pulse text-blue-400 font-mono tracking-widest">EXTRACTING VECTORS...</div>
      ) : data ? (
        <div className="w-full text-left">
          <h2 className="text-2xl font-bold mb-4">Vision Results</h2>
          <p className="text-slate-300">Est. Age: <span className="text-white font-bold">{data.age}</span></p>
          <p className="text-slate-300">Gender: <span className="text-white font-bold capitalize">{data.gender}</span></p>
          <div className="mt-4 flex gap-2">
            {data.palette?.map((c: string) => (
              <div key={c} className="h-12 flex-1 rounded-lg shadow-inner" style={{backgroundColor: c}}></div>
            ))}
          </div>
          <button onClick={() => setData(null)} className="mt-6 text-sm text-slate-400 hover:text-white">Reset Scanner</button>
        </div>
      ) : (
        <>
          <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400 text-2xl">📷</div>
          <h2 className="text-2xl font-bold mb-2">Initialize Scanner</h2>
          <p className="text-slate-400 text-sm mb-6">Take a photo or upload to extract traits</p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Open Camera
            </button>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleUpload} 
            />
          </div>
        </>
      )}
    </div>
  );
}