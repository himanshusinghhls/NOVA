import { Scan } from "lucide-react";

export default function Hero() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[50vh]">
      <div className="space-y-8 relative z-10">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Gemini Vision Engine Active
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
          AI-Powered <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Visual Intelligence.
          </span>
        </h2>
        
        <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
          Curate your perfect wardrobe using visual AI. Upload your fit, extract your color palette, and let the engine find your aesthetic.
        </p>
      </div>
      
      <div className="relative h-[400px] w-full flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] border border-white/5 overflow-hidden glass">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-80 h-80 border border-zinc-700 rounded-full animate-[spin_20s_linear_infinite] border-dashed"></div>
          <div className="absolute w-56 h-56 border border-blue-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full backdrop-blur-3xl border border-blue-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <div className="w-12 h-12 bg-blue-500 rounded-full animate-pulse shadow-[0_0_40px_rgba(59,130,246,0.6)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}