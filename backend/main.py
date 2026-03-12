from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os
import cv2
import numpy as np
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

model = None
encoder = None
data = None

class UserProfile(BaseModel):
    gender: str
    age_group: str
    occasion: str
    skin_tone: str
    style: str

@app.on_event("startup")
def load_model():
    global model, encoder, data

    with open(MODEL_PATH, "rb") as f:
        model_data = pickle.load(f)

    encoder = model_data["encoder"]
    data = model_data["data"]

@app.get("/")
def health():
    return {"status": "NOVA backend running"}

@app.post("/recommend")
def recommend(profile: UserProfile):

    user_df = pd.DataFrame([profile.dict()])

    user_vec = encoder.transform(user_df)

    dataset_vecs = encoder.transform(
        data[["gender","age_group","occasion","skin_tone","style"]]
    )

    sim = cosine_similarity(user_vec, dataset_vecs)

    top = sim[0].argsort()[-6:][::-1]

    results = data.iloc[top].to_dict("records")

    return {"results": results}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):

    path = f"temp_{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    img = cv2.imread(path)

    img = cv2.resize(img,(200,200))

    pixels = img.reshape((-1,3))

    kmeans = KMeans(n_clusters=3).fit(pixels)

    colors = [
        '#%02x%02x%02x' % tuple(c.astype(int))
        for c in kmeans.cluster_centers_
    ]

    os.remove(path)

    return {
        "age": 25,
        "gender": "male",
        "palette": colors
    }

@app.post("/rate-outfit")
async def rate_outfit(file: UploadFile = File(...)):

    path = f"temp_{file.filename}"

    with open(path,"wb") as f:
        f.write(await file.read())

    img = cv2.imread(path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    edges = cv2.Canny(gray,50,150)

    density = np.sum(edges>0)/(edges.shape[0]*edges.shape[1])

    score = round(6 + density*10,1)

    os.remove(path)

    return {
        "score": score,
        "feedback": "Balanced outfit" if score>7 else "Try more contrast"
    }