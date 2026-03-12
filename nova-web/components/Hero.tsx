export default function Hero() {
  return (
    <div className="py-24 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full -z-10"></div>
      
      <div className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-zinc-300 text-xs font-bold uppercase tracking-wider mb-8 shadow-xl">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        Gemini Vision Engine Active
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white leading-tight">
        Next-Gen <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          AI Styling.
        </span>
      </h1>
      
      <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium">
        Curate your perfect wardrobe using visual intelligence. Upload your fit, extract your color palette, and let the engine find your aesthetic.
      </p>
    </div>
  );
}