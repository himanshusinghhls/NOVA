export default function ProductCard({ item }: any) {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl p-5 rounded-3xl border border-zinc-800 shadow-2xl hover:border-blue-500/50 transition-all group flex flex-col h-full">
      
      <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-5 bg-zinc-950">
        <img 
          src={item.image_url} 
          alt={item.item}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-700">
          <p className="font-mono font-bold text-white">${item.price}</p>
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="font-black text-xl text-white mb-1">{item.brand}</h3>
        <p className="text-sm text-zinc-400 mb-6 font-medium">{item.item}</p>
      </div>

      <div className="mt-auto">
        <a 
          href={item.product_url} 
          target="_blank"
          rel="noreferrer"
          className="w-full bg-white hover:bg-zinc-200 text-black font-black py-3.5 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
        >
          Buy Now →
        </a>
      </div>

    </div>
  );
}