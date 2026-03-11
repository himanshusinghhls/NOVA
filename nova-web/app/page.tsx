import { Scan } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
            Core Engine v4.0 Online
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
            AI-Powered <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">Visual Intelligence.</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
            NOVA is a professional computer vision pipeline utilizing OpenCV edge detection and DeepFace neural networks to decode fashion context.
          </p>
          <div className="flex gap-4">
            <Link href="/vision" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center cursor-pointer">
              Initialize Scanner <Scan className="ml-2" size={18} />
            </Link>
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
    </main>
  );
}