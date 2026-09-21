from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import pandas as pd

app = FastAPI(title="AURA++ ML Anomaly Detection API")

# Global model variable
model = None

@app.on_event("startup")
def load_model():
    global model
    model_path = os.path.join(os.path.dirname(__file__), "models/isolation_forest.joblib")
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print(f"Model loaded from {model_path}")
    else:
        print(f"Warning: Model not found at {model_path}. Please run train.py first.")

class Features(BaseModel):
    login_attempts: int
    failed_logins: int
    session_duration: float
    pages_accessed: int
    tickets_viewed: int
    tickets_booked: int
    events_viewed: int
    events_created: int
    total_actions: int
    requests_per_minute: float

@app.post("/predict")
def predict_anomaly(features: Features):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded. Train the model first.")

    # Convert features to DataFrame matching the training data format
    input_data = pd.DataFrame([features.dict()])
    
    # Predict (-1 is anomaly, 1 is normal)
    prediction = model.predict(input_data)[0]
    
    # Get anomaly score (lower is more anomalous)
    score = model.decision_function(input_data)[0]

    is_anomaly = bool(prediction == -1)
    status = "anomalous" if is_anomaly else "normal"

    return {
        "prediction": status,
        "is_anomaly": is_anomaly,
        "anomaly_score": round(float(score), 4)
    }

@app.get("/")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}
