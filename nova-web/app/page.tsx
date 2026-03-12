"use client";

import Hero from "../components/Hero";
import UploadStylist from "../components/UploadStylist";
import ManualStylist from "../components/ManualStylist";
import ChatStylist from "../components/ChatStylist";

export default function Home() {
  return (
    <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Hero />
      
      <div className="grid lg:grid-cols-2 gap-8 mt-12">
        <UploadStylist />
        <ManualStylist />
      </div>
      
      <div className="mt-8">
        <ChatStylist />
      </div>
    </main>
  );
}