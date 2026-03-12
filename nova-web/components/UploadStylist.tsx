import { useState, useRef } from "react";
import { analyzeImage } from "../lib/api";
import { Camera, Scan } from "lucide-react";

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
    <div className="glass p-8 rounded-[2rem] flex flex-col items-center justify-center text-center min-h-[450px] relative overflow-hidden group">
      {loading ? (
        <div className="flex flex-col items-center">
          <Scan className="text-blue-500 animate-spin mb-4" size={48} />
          <p className="text-blue-400 font-mono font-bold tracking-widest text-sm bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/30">
            EXTRACTING VECTORS...
          </p>
        </div>
      ) : data ? (
        <div className="w-full text-left animate-in fade-in">
          <h2 className="text-2xl font-black mb-6 flex items-center"><Scan className="mr-2 text-blue-500"/> Vision Results</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Est. Age</p>
              <p className="text-3xl font-black">{data.age}</p>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Gender</p>
              <p className="text-3xl font-black capitalize">{data.gender}</p>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Dominant Palette</p>
          <div className="flex gap-2">
            {data.palette?.map((c: string) => (
              <div key={c} className="h-16 flex-1 rounded-xl shadow-inner border border-white/10 flex items-end p-2" style={{backgroundColor: c}}>
                 <span className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-mono font-bold">{c}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setData(null)} className="mt-8 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all border border-white/10">Reset Scanner</button>
        </div>
      ) : (
        <>
          <div className="h-20 w-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
            <Camera size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Initialize Scanner</h2>
          <p className="text-zinc-400 text-sm mb-8">Take a photo or upload to extract stylistic traits</p>
          
          <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center">
            <Camera className="mr-2" size={18} /> Open Camera
          </button>
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleUpload} />
        </>
      )}
    </div>
  );
}