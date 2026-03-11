"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Home, Sliders, Scan, Activity, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Style Engine", path: "/style-engine", icon: Sliders },
    { name: "Vision Setup", path: "/vision", icon: Scan },
    { name: "Fit Rater", path: "/fit-rater", icon: Activity },
  ];

  if (!mounted) return null;

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-black text-xl tracking-tighter">N</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">NOVA<span className="text-blue-500">_</span></h1>
      </Link>

      <nav className="flex space-x-1 bg-white dark:bg-zinc-900/50 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800/50">
        {navLinks.map((link) => (
          <Link key={link.name} href={link.path} className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            pathname === link.path ? "bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-zinc-500 hover:text-black dark:hover:text-white"
          }`}>
            <link.icon size={16} />
            <span className="hidden md:inline">{link.name}</span>
          </Link>
        ))}
      </nav>

      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:scale-105 transition-transform text-zinc-900 dark:text-zinc-100">
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}