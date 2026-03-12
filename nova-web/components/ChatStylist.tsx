import { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function ChatStylist() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  function send() {
    if (!msg.trim()) return;
    setChat([...chat, `You: ${msg}`, "AI: Based on your query, I recommend neutral tones with minimal layers to balance the aesthetic."]);
    setMsg("");
  }

  return (
    <div className="glass p-8 rounded-[2rem] flex flex-col border border-white/5">
      <h2 className="text-2xl font-black mb-6 flex items-center"><MessageSquare className="mr-2 text-blue-500"/> AI Style Chat</h2>
      
      <div className="h-48 overflow-y-auto mb-4 p-4 bg-black/20 rounded-xl border border-white/5 flex flex-col gap-3">
        {chat.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center my-auto italic">Ask the stylist for layering advice or color matching...</p>
        ) : (
          chat.map((c, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm max-w-[80%] ${c.startsWith("You:") ? "bg-blue-600/20 text-blue-100 self-end ml-auto" : "bg-white/5 text-zinc-300 self-start"}`}>
              {c}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="e.g. What shoes go well with an olive jacket?"
          className="bg-black/40 border border-white/10 p-4 rounded-xl w-full text-sm outline-none focus:border-blue-500 transition-colors text-white"
        />
        <button onClick={send} className="bg-blue-600 px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors text-white">
          Ask
        </button>
      </div>
    </div>
  );
}