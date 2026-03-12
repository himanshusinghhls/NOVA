export default function ProductCard({ item }: any) {
  return (
    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-colors group">
      <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4">
        <img 
          src={item.image_url} 
          alt={item.item}
          className="object-cover w-full h-full opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
        />
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
          <p className="font-mono font-bold text-xs text-white">${item.price}</p>
        </div>
      </div>
      <h3 className="font-bold text-sm text-white mb-1 truncate">{item.brand}</h3>
      <p className="text-xs text-zinc-400 mb-4 truncate">{item.item}</p>
      <a 
        href={item.product_url} 
        target="_blank"
        rel="noreferrer"
        className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-bold py-2 rounded-lg text-center transition-colors block border border-blue-500/30"
      >
        Buy Now
      </a>
    </div>
  );
}