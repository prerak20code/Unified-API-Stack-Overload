from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil

from features import extract_features
from model_loader import (
    load_pytorch_model,
    load_tf_model,
    predict_pytorch,
    predict_tensorflow
)

app = FastAPI(title="Speech Emotion Recognition API")

# -----------------------
# Load models at startup
# -----------------------
models = {
    "RAVDESS": load_pytorch_model("Saved_models/RAVDESS/cnn_lstm_model.pt"),
    "CREMA-D": load_pytorch_model("Saved_models/CREMA-D/cnn_lstm_parallel_model.pt"),
    "EMODB": load_tf_model("Saved_models/EMODB/LSTM_emodb.h5")
}

# -----------------------
# Emotion Label Map
# -----------------------
emotion_map = {
    0: "neutral", 1: "calm", 2: "happy", 3: "sad",
    4: "angry", 5: "fearful", 6: "disgust", 7: "surprised"
}

@app.get("/")
def index():
    return {"message": "✅ Speech Emotion Recognition API is running."}


@app.post("/predict/")
async def predict(dataset: str = Form(...), file: UploadFile = File(...)):
    # Validate dataset name
    if dataset not in models:
        raise HTTPException(status_code=400, detail="❌ Invalid dataset. Choose from RAVDESS, CREMA-D, EMODB")

    # Validate file type
    if not file.filename.endswith(('.wav', '.mp3')):
        raise HTTPException(status_code=400, detail="❌ Only .wav and .mp3 files are supported.")

    # Save uploaded file temporarily
    temp_path = f"temp_audio_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract features
    features = extract_features(temp_path)
    os.remove(temp_path)

    if features is None:
        raise HTTPException(status_code=500, detail="❌ Feature extraction failed.")

    # Get model
    model = models[dataset]

    # Predict
    if dataset == "EMODB":
        label = predict_tensorflow(model, features)
    else:
        label = predict_pytorch(model, features)

    # Map label to emotion
    emotion = emotion_map.get(label, f"label_{label}")
    return JSONResponse(content={"dataset": dataset, "emotion": emotion})
