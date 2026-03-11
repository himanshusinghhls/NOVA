import pandas as pd
import random
import os

def generate_synthetic_data(num_rows=1000):
    genders = ['male', 'female', 'unisex']
    age_groups = ['teen', 'young_adult', 'adult', 'senior']
    occasions = ['casual', 'formal', 'party', 'sport', 'streetwear', 'business_casual']
    skin_tones = ['fair', 'medium', 'dark', 'olive', 'brown']
    styles = ['minimalist', 'vintage', 'hypebeast', 'elegant', 'bohemian', 'classic']
    
    items = {
        'male': ['Denim Jacket', 'Navy Blazer', 'Chinos', 'Polo Shirt', 'Trench Coat'],
        'female': ['Red Dress', 'Evening Gown', 'Floral Skirt', 'Crop Top', 'Wide Leg Pants'],
        'unisex': ['Graphic T-Shirt', 'Hoodie', 'Sneakers', 'Beanie', 'Joggers']
    }
    
    colors = ['blue', 'black', 'red', 'white', 'navy', 'beige', 'olive', 'grey', 'pink']
    brands = ['Zara', 'H&M', 'Levis', 'Gucci', 'Nike', 'Adidas', 'Uniqlo', 'Prada']
    
    data = []
    for _ in range(num_rows):
        gender = random.choice(genders)
        item = random.choice(items[gender])
        color = random.choice(colors)
        brand = random.choice(brands)
        
        search_query = f"{color}+{brand}+{item}".replace(" ", "+").lower()
        real_buy_link = f"https://www.amazon.com/s?k={search_query}"

        hex_color = "000000" if color == "black" else "FFFFFF" if color == "white" else "0000FF" if color == "blue" else "FF0000" if color == "red" else "CCCCCC"
        image_url = f"https://dummyimage.com/400x600/{hex_color}/fff&text={item.replace(' ', '+')}"

        data.append({
            "gender": gender, 
            "age_group": random.choice(age_groups),
            "occasion": random.choice(occasions), 
            "skin_tone": random.choice(skin_tones),
            "style": random.choice(styles), 
            "item": item, 
            "brand": brand,
            "color": color, 
            "price": random.randint(20, 500),
            "image_url": image_url, 
            "product_url": real_buy_link
        })
        
    df = pd.DataFrame(data)
    os.makedirs("backend/data", exist_ok=True)
    df.to_csv("backend/data/fashion_dataset.csv", index=False)
    print(f"✅ Generated {num_rows} rows of data in backend/data/fashion_dataset.csv!")

if __name__ == "__main__":
    generate_synthetic_data()