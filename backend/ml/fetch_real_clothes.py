import requests
import pandas as pd
import random
import os
import time

RAPIDAPI_KEY = "4cad559951msh09243f22611abb1p1d1d59jsn3a11a0a7ee91"
RAPIDAPI_HOST = "asos2.p.rapidapi.com"

def determine_traits(item_name, search_term):
    """Smart tagging based on the clothing item's name and the search term used"""
    name = item_name.lower()
    term = search_term.lower()
    
    if any(word in name for word in ['suit', 'blazer', 'trousers', 'tie', 'formal']): occasion = 'formal'
    elif any(word in name for word in ['jogger', 'track', 'sport', 'gym', 'active']): occasion = 'sport'
    elif any(word in name for word in ['dress', 'sequin', 'party', 'heels', 'club']): occasion = 'party'
    elif any(word in name for word in ['oversized', 'cargo', 'hoodie', 'street']): occasion = 'streetwear'
    else: occasion = 'casual'
    
    if 'vintage' in term or 'retro' in name: style = 'vintage'
    elif occasion == 'streetwear' or 'hype' in term: style = 'hypebeast'
    elif occasion == 'formal' or 'elegant' in term: style = 'elegant'
    elif 'basic' in name or 'plain' in name: style = 'minimalist'
    else: style = 'classic'
    colors = ['black', 'white', 'red', 'blue', 'green', 'navy', 'beige', 'grey', 'pink', 'brown', 'olive']
    found_color = next((c for c in colors if c in name), 'mixed')
    return occasion, style, found_color

def fetch_and_build_dataset():
    print("🚀 Booting up NOVA Data Engine...")
    search_queries = [
        {"gender": "female", "q": "women dresses party"},
        {"gender": "female", "q": "women streetwear oversized"},
        {"gender": "female", "q": "women formal blazer"},
        {"gender": "male", "q": "men streetwear graphic"},
        {"gender": "male", "q": "men formal suit"},
        {"gender": "unisex", "q": "unisex vintage hoodie"}
    ]
    all_products = []
    
    for query in search_queries:
        gender = query["gender"]
        search_term = query["q"]
        print(f"\n🔍 Searching ASOS for: '{search_term}'...")
        for offset in [0, 48]:
            url = "https://asos2.p.rapidapi.com/products/v2/list"
            querystring = {
                "store": "US", "offset": str(offset), "limit": "48", 
                "country": "US", "currency": "USD", "lang": "en-US",
                "q": search_term
            }
            headers = {"x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": RAPIDAPI_HOST}
            
            try:
                response = requests.get(url, headers=headers, params=querystring)
                data = response.json()
                items = data.get('products', [])
                if not items:
                    continue
                print(f"   ✅ Page {int(offset/48) + 1}: Fetched {len(items)} items")
                for item in items:
                    name = item.get('name', 'Unknown Item')
                    occasion, style, color = determine_traits(name, search_term)
                    product = {
                        "gender": gender,
                        "age_group": random.choice(['teen', 'young_adult', 'adult', 'senior']),
                        "occasion": occasion,
                        "skin_tone": random.choice(['fair', 'medium', 'dark', 'olive', 'brown']),
                        "style": style,
                        "item": name[:45] + "..." if len(name) > 45 else name,
                        "brand": item.get('brandName', 'ASOS'),
                        "color": color,
                        "price": item.get('price', {}).get('current', {}).get('value', 45.0),
                        "image_url": "https://" + item.get('imageUrl', '').replace('https://', ''),
                        "product_url": "https://www.asos.com/" + item.get('url', '')
                    }
                    all_products.append(product)
                time.sleep(1)
            except Exception as e:
                print(f"   ❌ Error fetching page: {e}")

    df = pd.DataFrame(all_products)
    df.drop_duplicates(subset=['item', 'brand'], inplace=True)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, "fashion_dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"\n🎉 SUCCESS! Database compiled with {len(df)} diverse, real-world products.")

if __name__ == "__main__":
    fetch_and_build_dataset()