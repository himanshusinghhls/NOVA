import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NOVA | AI Style Engine",
  description: "Advanced AI infrastructure for personal styling. Powered by DeepFace and OpenCV.",
  keywords: ["AI Stylist", "Computer Vision", "Machine Learning", "Fashion Tech", "Next.js"],
  authors: [{ name: "Himanshu Singh" }],
  openGraph: {
    title: "NOVA | Core AI Engine",
    description: "Real-time demographic clustering and aesthetic heuristics.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased bg-zinc-50 dark:bg-[#0a0a0c] text-zinc-900 dark:text-zinc-50 transition-colors duration-300 selection:bg-blue-500/30 selection:text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}