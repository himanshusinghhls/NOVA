from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import cv2
import numpy as np
import gc
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans

app = FastAPI(title="Nova AI Engine")

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
        model_data = joblib.load(MODEL_PATH)
        ml_cache["encoder"] = model_data["encoder"]
        ml_cache["data"] = model_data["data"]
        ml_cache["loaded"] = True

@app.get("/")
def health():
    return {"status": "NOVA backend running, memory safe mode."}

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
        img = cv2.imread(path)
        img = cv2.resize(img, (150, 150))
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        pixels = img_rgb.reshape((-1, 3))

        kmeans = KMeans(n_clusters=3, n_init=5).fit(pixels)
        colors = ['#%02x%02x%02x' % tuple(c.astype(int)) for c in kmeans.cluster_centers_]

        del img, img_rgb, pixels, kmeans
        return {"age": 25, "gender": "unisex", "palette": colors}
    finally:
        os.remove(path)
        gc.collect()

@app.post("/rate-outfit")
async def rate_outfit(file: UploadFile = File(...)):
    path = f"temp_fit_{file.filename}"
    with open(path,"wb") as f:
        f.write(await file.read())

    try:
        img = cv2.imread(path)
        img = cv2.resize(img, (200, 200))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)

        density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
        score = round(min(6 + density * 15, 9.8), 1)

        del img, gray, edges
        return {"score": score, "feedback": "Balanced outfit geometry." if score > 7 else "Try adding more contrast or layers."}
    finally:
        os.remove(path)
        gc.collect()