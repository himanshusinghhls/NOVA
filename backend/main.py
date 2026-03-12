from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import gc
import json
import re
import PIL.Image
import google.generativeai as genai
from sklearn.metrics.pairwise import cosine_similarity

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "dummy")
genai.configure(api_key=GEMINI_API_KEY)
vision_model = genai.GenerativeModel('gemini-1.5-flash')

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
    if not ml_cache["loaded"]:
        try:
            model_data = joblib.load(MODEL_PATH)
            ml_cache["encoder"] = model_data["encoder"]
            ml_cache["data"] = model_data["data"]
            ml_cache["loaded"] = True
        except Exception:
            raise HTTPException(status_code=500, detail="Database initializing...")

def clean_json(text):
    """Removes Markdown formatting from Gemini responses to prevent JSON errors."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match: return match.group(0)
    return text

@app.get("/")
def health():
    return {"status": "NOVA engine online."}

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
    
    del user_df, user_vec, dataset_vecs, sim
    gc.collect()
    return {"results": results}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """FEATURE 1: Extracts traits from photo and immediately returns clothing recommendations."""
    path = f"temp_{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    try:
        img = PIL.Image.open(path)
        prompt = """
        Analyze this person's physical traits and current vibe. Return ONLY a valid JSON object with NO markdown.
        You must use these exact keys and choose ONE of the allowed values for each:
        "gender" (male, female, unisex)
        "age_group" (teen, young_adult, adult, senior)
        "occasion" (casual, formal, party, sport, streetwear)
        "skin_tone" (fair, medium, dark, olive, brown)
        "style" (minimalist, vintage, hypebeast, elegant, classic)
        """
        response = vision_model.generate_content([prompt, img])
        traits = json.loads(clean_json(response.text))
        
        load_model()
        user_df = pd.DataFrame([traits])
        user_vec = ml_cache["encoder"].transform(user_df)
        dataset_vecs = ml_cache["encoder"].transform(ml_cache["data"][["gender","age_group","occasion","skin_tone","style"]])
        
        sim = cosine_similarity(user_vec, dataset_vecs)
        top = sim[0].argsort()[-6:][::-1]
        recommendations = ml_cache["data"].iloc[top].to_dict("records")

        return {"traits": traits, "recommendations": recommendations}
        
    except Exception as e:
        return {"error": str(e)}
    finally:
        os.remove(path)
        gc.collect()

@app.post("/rate-outfit")
async def rate_outfit(file: UploadFile = File(...)):
    """FEATURE 2: Rates the outfit on multiple specific aspects."""
    path = f"temp_fit_{file.filename}"
    with open(path,"wb") as f:
        f.write(await file.read())

    try:
        img = PIL.Image.open(path)
        prompt = """
        Analyze this outfit. Return ONLY a valid JSON object with NO markdown.
        Keys required:
        "overall" (float 1.0 to 10.0),
        "color_harmony" (float 1.0 to 10.0),
        "proportions" (float 1.0 to 10.0),
        "trendiness" (float 1.0 to 10.0),
        "feedback" (2 sentences of professional styling advice on how to improve the fit)
        """
        response = vision_model.generate_content([prompt, img])
        data = json.loads(clean_json(response.text))
        return data
    except Exception as e:
        return {"error": str(e)}
    finally:
        os.remove(path)
        gc.collect()