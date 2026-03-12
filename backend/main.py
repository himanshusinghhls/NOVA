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

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "dummy_key")
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

@app.get("/")
def health():
    return {"status": "NOVA routing engine online. Gemini API active."}

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
    path = f"temp_{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    try:
        img = PIL.Image.open(path)
        prompt = """
        Analyze this person's style. Return ONLY a raw JSON object with these exact keys:
        "age" (integer estimate),
        "gender" (string: "male", "female", or "unisex"),
        "palette" (array of exactly 3 hex color codes dominant in the image)
        """
        response = vision_model.generate_content([prompt, img])
        raw_text = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(raw_text)
    except Exception as e:
        return {"error": str(e), "age": 25, "gender": "unisex", "palette": ["#000000", "#555555", "#aaaaaa"]}
    finally:
        os.remove(path)
        gc.collect()

@app.post("/rate-outfit")
async def rate_outfit(file: UploadFile = File(...)):
    path = f"temp_fit_{file.filename}"
    with open(path,"wb") as f:
        f.write(await file.read())

    try:
        img = PIL.Image.open(path)
        prompt = """
        Analyze this outfit. Return ONLY a raw JSON object with these exact keys:
        "score" (float out of 10.0 based on color harmony, layering, and texture),
        "feedback" (a short, 1-sentence professional fashion critique)
        """
        response = vision_model.generate_content([prompt, img])
        raw_text = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(raw_text)
    except Exception as e:
        return {"error": str(e), "score": 7.0, "feedback": "Solid baseline outfit."}
    finally:
        os.remove(path)
        gc.collect()