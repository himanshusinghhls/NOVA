from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import pandas as pd
import pickle
import cv2
import numpy as np
import shutil
import os
from deepface import DeepFace
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="NOVA Backend", version="2.0")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "model.pkl")

encoder = None
df = None

print(f"Loading ML Models from {MODEL_PATH}...")
try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
    with open(MODEL_PATH, "rb") as f:
        ml_model = pickle.load(f)
    encoder = ml_model["encoder"]
    df = ml_model["data"]
    print("✅ Models loaded into memory successfully.")
except Exception as e:
    print(f"⚠️ CRITICAL ERROR loading model: {e}")

class UserProfile(BaseModel):
    gender: str
    age_group: str
    occasion: str
    skin_tone: str
    style: str

@app.get("/")
def read_root():
    return {"status": "NOVA Backend Engine is online."}

@app.post("/recommend")
def get_recommendations(profile: UserProfile):
    if encoder is None or df is None:
        raise HTTPException(status_code=500, detail="ML Model not loaded on server.")
        
    user_df = pd.DataFrame([profile.dict()])
    user_vec = encoder.transform(user_df)
    
    dataset_features = df[["gender", "age_group", "occasion", "skin_tone", "style"]]
    dataset_vecs = encoder.transform(dataset_features)
    
    sim = cosine_similarity(user_vec, dataset_vecs)
    top_indices = sim[0].argsort()[-6:][::-1]
    
    recs = df.iloc[top_indices].to_dict(orient="records")
    return {"recommendations": recs}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    results = {"age": 25, "gender": "unisex", "dominant_color_hex": "#000000"}
    
    try:
        df_result = DeepFace.analyze(img_path=temp_path, actions=['age', 'gender'], enforce_detection=False)
        if isinstance(df_result, list): df_result = df_result[0]
            
        results["age"] = df_result.get("age", 25)
        dom_gender = df_result.get("dominant_gender", "Man").lower()
        results["gender"] = "male" if dom_gender in ["man", "male"] else "female"
        
        img = cv2.imread(temp_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (50, 50))
        pixels = img.reshape((-1, 3))
        
        kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
        kmeans.fit(pixels)
        counts = np.bincount(kmeans.labels_)
        dominant_color = kmeans.cluster_centers_[np.argmax(counts)]
        results["dominant_color_hex"] = '#%02x%02x%02x' % tuple(dominant_color.astype(int))
        
    except Exception as e:
        results["error"] = str(e)
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)
            
    return results

@app.post("/rate-outfit")
async def rate_outfit(file: UploadFile = File(...)):
    """A heuristic endpoint to rate an outfit based on color variance and contrast."""
    temp_path = f"temp_ootd_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        img = cv2.imread(temp_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_small = cv2.resize(img, (100, 100))
        pixels = img_small.reshape((-1, 3))
        
        kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
        kmeans.fit(pixels)
        centers = kmeans.cluster_centers_
        
        diff = np.linalg.norm(centers[0] - centers[1])
        
        base_score = 6.0
        contrast_bonus = min(diff / 50.0, 3.5)
        final_score = round(base_score + contrast_bonus, 1)
        
        hex1 = '#%02x%02x%02x' % tuple(centers[0].astype(int))
        hex2 = '#%02x%02x%02x' % tuple(centers[1].astype(int))
        
        feedback = "Solid coordination."
        if diff < 30:
            feedback = "Very monochromatic. Try adding a pop of contrasting color via accessories."
        elif diff > 150:
            feedback = "High contrast outfit! Very bold and streetwear-appropriate."
            
        return {
            "score": final_score,
            "color_1": hex1,
            "color_2": hex2,
            "feedback": feedback
        }
    except Exception as e:
        return {"error": str(e), "score": 7.0, "feedback": "Could not analyze. Looking good though!"}
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)