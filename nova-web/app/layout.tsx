import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NOVA | AI Style Engine",
  description: "Advanced AI infrastructure for personal styling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased bg-zinc-50 dark:bg-[#0a0a0c] text-zinc-900 dark:text-zinc-50 transition-colors duration-300`}>
        <Providers>
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}