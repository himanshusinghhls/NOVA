import os
import gc
import traceback

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"  
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"   
os.environ["TF_FORCE_GPU_ALLOW_GROWTH"] = "true" 

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import pickle

app = FastAPI(title="NOVA Core Engine", version="5.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "model.pkl")

ml_cache = {"encoder": None, "data": None, "loaded": False}

class UserProfile(BaseModel):
    gender: str
    age_group: str
    occasion: str
    skin_tone: str
    style: str

@app.get("/")
def health_check():
    return {"status": "NOVA AI Engine Online"}

@app.post("/recommend")
def get_recommendations(profile: UserProfile):
    if not ml_cache["loaded"]:
        try:
            import pandas as pd
            from sklearn.preprocessing import OneHotEncoder
            with open(MODEL_PATH, "rb") as f:
                model_data = pickle.load(f)
            ml_cache["encoder"] = model_data["encoder"]
            ml_cache["data"] = model_data["data"]
            ml_cache["loaded"] = True
        except Exception as e:
            print("DB Load Error:", traceback.format_exc())
            raise HTTPException(status_code=500, detail="Database unpickling failed. Check server logs.")
            
    try:
        import pandas as pd
        from sklearn.metrics.pairwise import cosine_similarity
        
        user_df = pd.DataFrame([profile.dict()])
        user_vec = ml_cache["encoder"].transform(user_df)
        dataset_vecs = ml_cache["encoder"].transform(ml_cache["data"][["gender", "age_group", "occasion", "skin_tone", "style"]])
        
        sim = cosine_similarity(user_vec, dataset_vecs)
        top_indices = sim[0].argsort()[-6:][::-1]
        
        results = ml_cache["data"].iloc[top_indices].to_dict(orient="records")
        
        del user_df, user_vec, dataset_vecs, sim, top_indices
        gc.collect()
        
        return {"recommendations": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    temp_path = f"temp_vision_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    results = {"age": 24, "gender": "male", "palette": ["#000000", "#555555", "#aaaaaa"]}
    
    try:
        import cv2
        import numpy as np
        from sklearn.cluster import KMeans
        
        img = cv2.imread(temp_path)
        if img is None: raise ValueError("Invalid image")
        height, width = img.shape[:2]
        new_width = 200 
        new_height = int((new_width / width) * height)
        img_resized = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
        cv2.imwrite(temp_path, img_resized)
        
        try:
            from deepface import DeepFace
            df_result = DeepFace.analyze(img_path=temp_path, actions=['age', 'gender'], enforce_detection=False, detector_backend='opencv')
            if isinstance(df_result, list): df_result = df_result[0]
            results["age"] = df_result.get("age", 24)
            results["gender"] = "male" if df_result.get("dominant_gender", "Man").lower() in ["man", "male"] else "female"
        except Exception as deepface_error:
            print(f"DeepFace OOM Bypassed: {deepface_error}")
        
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
        pixels = img_rgb.reshape((-1, 3))
        kmeans = KMeans(n_clusters=3, random_state=42, n_init=10).fit(pixels)
        
        counts = np.bincount(kmeans.labels_)
        sorted_indices = np.argsort(counts)[::-1]
        results["palette"] = ['#%02x%02x%02x' % tuple(kmeans.cluster_centers_[idx].astype(int)) for idx in sorted_indices]
        
        del img, img_resized, img_rgb, pixels, kmeans
        
    except Exception as e:
        results["error"] = str(e)
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)
        gc.collect() 
            
    return results

@app.post("/rate-outfit")
async def rate_outfit(file: UploadFile = File(...)):
    temp_path = f"temp_fit_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        import cv2
        import numpy as np
        from sklearn.cluster import KMeans
        
        img = cv2.imread(temp_path)
        if img is None: raise ValueError("Invalid image")
        height, width = img.shape[:2]
        new_width = 200 
        new_height = int((new_width / width) * height)
        img_resized = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
        
        gray = cv2.cvtColor(img_resized, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 50, 150)
        
        edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
        
        texture_profile = "Balanced / Subtle Textures"
        texture_bonus = 1.0
        if edge_density < 0.03:
            texture_profile = "Minimalist / Solid Blocks"
            texture_bonus = 0.5
        elif edge_density >= 0.08:
            texture_profile = "High Complexity / Heavy Patterns"
            texture_bonus = 0.2 
            
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
        kmeans = KMeans(n_clusters=2, random_state=42, n_init=10).fit(img_rgb.reshape((-1, 3)))
        centers = kmeans.cluster_centers_
        contrast = np.linalg.norm(centers[0] - centers[1])
        
        base_score = 6.5
        contrast_bonus = min(contrast / 50.0, 2.5) 
        final_score = round(min(base_score + contrast_bonus + texture_bonus, 9.8), 1)
        
        del img, img_resized, gray, blurred, edges, img_rgb, kmeans
        
        return {
            "score": final_score,
            "texture_profile": texture_profile,
            "edge_density": round(float(edge_density * 100), 2),
            "color_1": '#%02x%02x%02x' % tuple(centers[0].astype(int)),
            "color_2": '#%02x%02x%02x' % tuple(centers[1].astype(int)),
            "feedback": f"Outfit detected as {texture_profile}." if final_score > 8 else "Consider adjusting contrast."
        }
    except Exception as e:
        return {"error": str(e), "score": 7.0, "feedback": "System adjusting to baseline."}
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)
        gc.collect()