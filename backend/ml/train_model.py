import pandas as pd
import pickle
import os
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity

print("Training ML Model...")
df = pd.read_csv("backend/data/fashion_dataset.csv")

features = df[["gender", "age_group", "occasion", "skin_tone", "style"]]
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X = encoder.fit_transform(features)

similarity = cosine_similarity(X)

model = {
    "similarity": similarity,
    "encoder": encoder,
    "data": df
}

os.makedirs("backend/models", exist_ok=True)
with open("backend/models/model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved successfully to backend/models/model.pkl!")