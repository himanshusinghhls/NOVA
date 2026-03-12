import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NOVA | AI Style Engine",
  description: "Advanced AI infrastructure for personal styling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased selection:bg-blue-500/30 selection:text-white`}>
        <Providers>
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}