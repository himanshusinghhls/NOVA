import pandas as pd
import joblib
import os
from sklearn.preprocessing import OneHotEncoder

print("Training ML Model...")

BASE = os.path.dirname(__file__)

DATA_PATH = os.path.join(BASE, "../data/fashion_dataset.csv")
MODEL_PATH = os.path.join(BASE, "../models/model.pkl")

df = pd.read_csv(DATA_PATH)

features = df[["gender","age_group","occasion","skin_tone","style"]]

encoder = OneHotEncoder()

encoder.fit(features)

model_data = {
    "encoder": encoder,
    "data": df
}

joblib.dump(model_data, MODEL_PATH)

print("Model saved to:", MODEL_PATH)