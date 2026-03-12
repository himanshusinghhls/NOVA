import { ExternalLink } from "lucide-react";

export default function ProductCard({ item }: { item: any }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-colors group flex flex-col">
      <div className="relative h-64 bg-zinc-900 overflow-hidden">
        <img src={item.image_url} alt={item.item} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
          <p className="font-mono font-bold text-white">${item.price}</p>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h4 className="font-black text-lg mb-1">{item.brand}</h4>
        <p className="text-sm text-zinc-400 mb-4">{item.item}</p>
        <div className="flex gap-2 mb-6">
          {["S", "M", "L", "XL"].map(size => (
            <span key={size} className="text-[10px] border border-white/10 px-2 py-1 rounded text-zinc-500">{size}</span>
          ))}
        </div>
        <a href={item.product_url} target="_blank" rel="noreferrer" className="mt-auto w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
          Buy Now <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}