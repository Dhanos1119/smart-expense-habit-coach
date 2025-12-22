from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Load saved model artifacts
kmeans = joblib.load("model/kmeans_model.pkl")
scaler = joblib.load("model/scaler.pkl")
cluster_labels = joblib.load("model/cluster_labels.pkl")

app = FastAPI(title="Habit ML Service")

# -----------------------------
# Request schema
# -----------------------------
class HabitFeatures(BaseModel):
    currentStreak: int
    longestStreak: int
    completionRate30: float
    missCountLast7: int
    daysSinceLastDone: int


# -----------------------------
# Prediction endpoint
# -----------------------------
@app.post("/predict")
def predict_habit(features: HabitFeatures):
    data = np.array([[
        features.currentStreak,
        features.longestStreak,
        features.completionRate30,
        features.missCountLast7,
        features.daysSinceLastDone
    ]])

    scaled = scaler.transform(data)
    cluster_id = int(kmeans.predict(scaled)[0])
    label = cluster_labels[cluster_id]

    return {
        "clusterId": cluster_id,
        "habitType": label
    }
