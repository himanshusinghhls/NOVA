from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

app = FastAPI(title="NOVA Core Engine", version="3.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "model.pkl")

encoder = None
df = None

print(f"Loading Vector Space from {MODEL_PATH}...")
try:
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            ml_model = pickle.load(f)
        encoder = ml_model["encoder"]
        df = ml_model["data"]
        print("✅ Vector space loaded.")
except Exception as e:
    print(f"⚠️ Model load error: {e}")

class UserProfile(BaseModel):
    gender: str
    age_group: str
    occasion: str
    skin_tone: str
    style: str

@app.get("/")
def read_root():
    return {"status": "NOVA AI Engine Online"}

@app.post("/recommend")
def get_recommendations(profile: UserProfile):
    if encoder is None or df is None:
        raise HTTPException(status_code=500, detail="Vector space offline.")
        
    user_df = pd.DataFrame([profile.dict()])
    user_vec = encoder.transform(user_df)
    dataset_vecs = encoder.transform(df[["gender", "age_group", "occasion", "skin_tone", "style"]])
    
    sim = cosine_similarity(user_vec, dataset_vecs)
    top_indices = sim[0].argsort()[-6:][::-1]
    
    return {"recommendations": df.iloc[top_indices].to_dict(orient="records")}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """Advanced Vision: Extracts demographics and a full 3-color palette."""
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    results = {"age": 25, "gender": "unisex", "palette": ["#000000", "#555555", "#aaaaaa"]}
    
    try:
        img = cv2.imread(temp_path)
        height, width = img.shape[:2]
        new_width = 300 
        new_height = int((new_width / width) * height)
        img_resized = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
        cv2.imwrite(temp_path, img_resized)

        df_result = DeepFace.analyze(img_path=temp_path, actions=['age', 'gender'], enforce_detection=False, detector_backend='opencv')
        if isinstance(df_result, list): df_result = df_result[0]
        results["age"] = df_result.get("age", 25)
        results["gender"] = "male" if df_result.get("dominant_gender", "Man").lower() in ["man", "male"] else "female"
        
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
        pixels = img_rgb.reshape((-1, 3))
        
        kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
        kmeans.fit(pixels)
        
        counts = np.bincount(kmeans.labels_)
        sorted_indices = np.argsort(counts)[::-1]
        
        palette = []
        for idx in sorted_indices:
            color = kmeans.cluster_centers_[idx]
            palette.append('#%02x%02x%02x' % tuple(color.astype(int)))
            
        results["palette"] = palette
        
    except Exception as e:
        results["error"] = str(e)
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)
            
    return results

@app.post("/rate-outfit")
async def rate_outfit(file: UploadFile = File(...)):
    """Pro CV Logic: Uses Canny Edge Detection to calculate pattern complexity."""
    temp_path = f"temp_ootd_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        img = cv2.imread(temp_path)
        height, width = img.shape[:2]
        new_width = 300 
        new_height = int((new_width / width) * height)
        img_resized = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
        
        gray = cv2.cvtColor(img_resized, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 50, 150)
        
        edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
        
        if edge_density < 0.03:
            texture_profile = "Minimalist / Solid Blocks"
            texture_bonus = 0.5
        elif edge_density < 0.08:
            texture_profile = "Balanced / Subtle Textures"
            texture_bonus = 1.0
        else:
            texture_profile = "High Complexity / Heavy Patterns"
            texture_bonus = 0.2 
            
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
        kmeans = KMeans(n_clusters=2, random_state=42, n_init=10).fit(img_rgb.reshape((-1, 3)))
        centers = kmeans.cluster_centers_
        contrast = np.linalg.norm(centers[0] - centers[1])
        
        base_score = 6.5
        contrast_bonus = min(contrast / 50.0, 2.5) 
        final_score = round(base_score + contrast_bonus + texture_bonus, 1)
        final_score = min(final_score, 9.8)
        
        return {
            "score": final_score,
            "texture_profile": texture_profile,
            "edge_density": round(float(edge_density * 100), 2),
            "color_1": '#%02x%02x%02x' % tuple(centers[0].astype(int)),
            "color_2": '#%02x%02x%02x' % tuple(centers[1].astype(int)),
            "feedback": f"Outfit detected as {texture_profile}. Great color harmony." if final_score > 8 else "Consider adjusting contrast or balancing patterns."
        }
    except Exception as e:
        return {"error": str(e), "score": 7.0, "feedback": "Solid baseline."}
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)