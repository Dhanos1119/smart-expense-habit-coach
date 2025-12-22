import joblib
import numpy as np

# Load saved artifacts
kmeans = joblib.load("model/kmeans_model.pkl")
scaler = joblib.load("model/scaler.pkl")
cluster_labels = joblib.load("model/cluster_labels.pkl")

# New habit features (example)
new_habit = np.array([[1, 5, 50, 3, 2]])
# [currentStreak, longestStreak, completionRate30, missCountLast7, daysSinceLastDone]

# Scale
scaled = scaler.transform(new_habit)

# Predict cluster
cluster_id = kmeans.predict(scaled)[0]
label = cluster_labels[cluster_id]

print("Predicted Cluster:", cluster_id)
print("Habit Type:", label)
