"use client";
import Link from "next/link";
import { Home, Sliders, Scan, Activity } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center py-8 gap-6 relative z-10 max-w-7xl mx-auto px-4 md:px-8">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
          <span className="text-white font-black text-xl tracking-tighter">N</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">NOVA<span className="text-blue-500">_</span></h1>
      </Link>

      <nav className="flex space-x-1 glass p-1.5 rounded-2xl">
        {[
          { name: "Home", icon: Home },
          { name: "Style Engine", icon: Sliders },
          { name: "Vision", icon: Scan },
        ].map((link) => (
          <button key={link.name} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-zinc-400 hover:text-white hover:bg-white/5">
            <link.icon size={16} />
            <span className="hidden md:inline">{link.name}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}