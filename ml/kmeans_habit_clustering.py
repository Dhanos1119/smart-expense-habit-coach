import numpy as np
import pandas as pd
import joblib
import os
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# -----------------------------
# 1. SAMPLE FEATURE DATA
# (Replace this with real data from backend later)
# -----------------------------
data = [
    {
        "currentStreak": 0,
        "longestStreak": 3,
        "completionRate30": 35,
        "missCountLast7": 5,
        "daysSinceLastDone": 4,
    },
    {
        "currentStreak": 4,
        "longestStreak": 10,
        "completionRate30": 85,
        "missCountLast7": 0,
        "daysSinceLastDone": 0,
    },
    {
        "currentStreak": 1,
        "longestStreak": 5,
        "completionRate30": 55,
        "missCountLast7": 2,
        "daysSinceLastDone": 1,
    },
    {
        "currentStreak": 0,
        "longestStreak": 2,
        "completionRate30": 25,
        "missCountLast7": 6,
        "daysSinceLastDone": 6,
    },
]

df = pd.DataFrame(data)

# -----------------------------
# 2. SCALE FEATURES
# -----------------------------
features = df.values
scaler = StandardScaler()
X_scaled = scaler.fit_transform(features)

# -----------------------------
# 3. TRAIN KMEANS
# -----------------------------
kmeans = KMeans(
    n_clusters=3,
    random_state=42,
    n_init=10
)
clusters = kmeans.fit_predict(X_scaled)

df["clusterId"] = clusters

# -----------------------------
# 4. LABEL CLUSTERS (MANUAL & EXPLAINABLE)
# -----------------------------
cluster_labels = {}

for cluster_id in sorted(df["clusterId"].unique()):
    cluster_data = df[df["clusterId"] == cluster_id]

    avg_completion = cluster_data["completionRate30"].mean()
    avg_streak = cluster_data["currentStreak"].mean()

    if avg_completion >= 70 and avg_streak >= 3:
        label = "STRONG"
    elif avg_completion >= 45:
        label = "UNSTABLE"
    else:
        label = "AT_RISK"

    cluster_labels[cluster_id] = label

df["clusterLabel"] = df["clusterId"].map(cluster_labels)

# -----------------------------
# 5. OUTPUT
# -----------------------------
print("\n=== CLUSTERED HABITS ===\n")
print(df)

print("\n=== CLUSTER MEANINGS ===\n")
for cid, lbl in cluster_labels.items():
    print(f"Cluster {cid} → {lbl}")

# -----------------------------
# 6. SAVE MODEL & SCALER
# -----------------------------
os.makedirs("model", exist_ok=True)

joblib.dump(kmeans, "model/kmeans_model.pkl")
joblib.dump(scaler, "model/scaler.pkl")
joblib.dump(cluster_labels, "model/cluster_labels.pkl")

print("\nModel and scaler saved successfully ✅")