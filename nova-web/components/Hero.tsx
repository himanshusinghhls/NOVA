export default function Hero() {
  return (
    <div className="py-20 text-center">
      <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 glass">
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
        NOVA Core Engine v6.0 Online
      </div>
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white">
        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Stylist.</span>
      </h1>
      <p className="text-xl text-slate-400 max-w-2xl mx-auto">
        Upload your photo or manually select your traits. NOVA uses deep learning to curate the perfect wardrobe.
      </p>
    </div>
  );
}