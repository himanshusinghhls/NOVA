import ProductCard from "./ProductCard"

export default function OutfitGrid({items}:any){

if(!items)return null

return(

<div className="grid md:grid-cols-3 gap-6 mt-8">

{items.map((item:any,i:number)=>(
<ProductCard key={i} item={item}/>
))}

</div>

)

}