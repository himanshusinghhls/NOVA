from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import gc
import json
import PIL.Image
import google.generativeai as genai
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "dummy")
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="NOVA Core Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE, "models", "model.pkl")

ml_cache = {"encoder": None, "data": None, "loaded": False}

class UserProfile(BaseModel):
    gender: str
    age_group: str
    occasion: str
    skin_tone: str
    style: str

def load_model():
    """Self-healing model loader that trains on-the-fly from the CSV file."""
    if not ml_cache["loaded"]:
        try:
            csv_path = os.path.join(BASE, "data", "fashion_dataset.csv")
            df = pd.read_csv(csv_path)
            encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
            encoder.fit(df[["gender", "age_group", "occasion", "skin_tone", "style"]])
            ml_cache["encoder"] = encoder
            ml_cache["data"] = df
            ml_cache["loaded"] = True
            print("✅ Successfully loaded and trained real dataset from CSV!")
            
        except Exception as e:
            print(f"CSV Load Error: {e}. Generating fallback database.")
            fallback_data = [{
                "gender": "unisex", "age_group": "young_adult", "occasion": "casual", "skin_tone": "medium", "style": "minimalist",
                "item": "Essential Default Jacket", "brand": "NOVA Basics", "color": "black", "price": 89,
                "image_url": "https://dummyimage.com/400x600/000000/ffffff&text=NOVA+Basics",
                "product_url": "https://amazon.com"
            }]
            df = pd.DataFrame(fallback_data)
            encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
            encoder.fit(df[["gender", "age_group", "occasion", "skin_tone", "style"]])
            
            ml_cache["encoder"] = encoder
            ml_cache["data"] = df
            ml_cache["loaded"] = True

def parse_gemini(text, default_payload):
    try:
        clean = text.replace("```json", "").replace("```", "").strip()
        start = clean.find('{')
        end = clean.rfind('}') + 1
        if start != -1 and end != 0:
            return json.loads(clean[start:end])
        return default_payload
    except:
        return default_payload

@app.get("/")
def health():
    return {"status": "NOVA engine online. Ironclad Fallback active."}

@app.post("/recommend")
def recommend(profile: UserProfile):
    load_model()
    user_df = pd.DataFrame([profile.dict()])
    user_vec = ml_cache["encoder"].transform(user_df)
    dataset_vecs = ml_cache["encoder"].transform(
        ml_cache["data"][["gender","age_group","occasion","skin_tone","style"]]
    )

    sim = cosine_similarity(user_vec, dataset_vecs)
    top = sim[0].argsort()[-6:][::-1]
    results = ml_cache["data"].iloc[top].to_dict("records")
    return {"results": results}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    path = f"temp_{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    default_traits = {"gender": "unisex", "age_group": "young_adult", "occasion": "casual", "skin_tone": "medium", "style": "minimalist"}

    try:
        img = PIL.Image.open(path)
        img.thumbnail((500, 500)) 
        
        vision_model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = """
        Analyze this person's physical traits. Return ONLY a valid JSON object.
        Keys: "gender" (male/female/unisex), "age_group" (teen/young_adult/adult/senior), "occasion" (casual/formal/party/sport), "skin_tone" (fair/medium/dark), "style" (minimalist/vintage/hypebeast/elegant).
        """
        response = vision_model.generate_content([prompt, img])
        traits = parse_gemini(response.text, default_traits)
        
    except Exception as e:
        print(f"API Error Caught: {e}. USING FALLBACK DATA.")
        traits = default_traits 

    finally:
        if os.path.exists(path):
            os.remove(path)
            gc.collect()

    for key in default_traits.keys():
        if key not in traits: traits[key] = default_traits[key]
    
    load_model()
    user_df = pd.DataFrame([traits])
    user_vec = ml_cache["encoder"].transform(user_df)
    dataset_vecs = ml_cache["encoder"].transform(ml_cache["data"][["gender","age_group","occasion","skin_tone","style"]])
    
    sim = cosine_similarity(user_vec, dataset_vecs)
    top = sim[0].argsort()[-6:][::-1]
    recommendations = ml_cache["data"].iloc[top].to_dict("records")

    return {"traits": traits, "recommendations": recommendations}

@app.post("/rate-outfit")
async def rate_outfit(file: UploadFile = File(...)):
    path = f"temp_fit_{file.filename}"
    with open(path,"wb") as f:
        f.write(await file.read())

    default_rating = {
        "overall": 8.5, 
        "color_harmony": 9.0, 
        "proportions": 8.0, 
        "trendiness": 8.5, 
        "feedback": "System fallback active. Please try again."
    }

    try:
        img = PIL.Image.open(path)
        img.thumbnail((500, 500))
        vision_model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = """
        Analyze this outfit. Return ONLY a valid JSON object.
        Keys: "overall" (float 1-10), "color_harmony" (float 1-10), "proportions" (float 1-10), "trendiness" (float 1-10), "feedback" (1 sentence advice).
        """
        
        response = vision_model.generate_content(
            [prompt, img],
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        
        if os.path.exists(path):
            os.remove(path)
            gc.collect()
            
        return data

    except Exception as e:
        print(f"API Error Caught: {e}")
        default_rating["feedback"] = f"Fallback active due to error: {str(e)}"
        
        if os.path.exists(path):
            os.remove(path)
            gc.collect()
            
        return default_rating