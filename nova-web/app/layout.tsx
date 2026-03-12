import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NOVA | AI Style Engine",
  description: "Advanced AI infrastructure for personal styling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased selection:bg-blue-500/30 selection:text-white`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          {children}
        </div>
      </body>
    </html>
  );
}