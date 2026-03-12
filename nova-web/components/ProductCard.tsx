export default function ProductCard({item}:any){

return(

<div className="glass p-4">

<img
src={item.image_url}
className="rounded-lg mb-3"
/>

<h3 className="font-semibold">{item.item}</h3>

<p className="text-sm text-gray-300">
${item.price}
</p>

<a
href={item.product_url}
target="_blank"
className="mt-2 inline-block text-blue-400"
>

Buy Now

</a>

</div>

)

}