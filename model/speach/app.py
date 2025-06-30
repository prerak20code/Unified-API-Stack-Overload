from fastapi import FastAPI, File, UploadFile, Form, HTTPException
import torch
import numpy as np
from model_loader import load_pytorch_model, predict_pytorch, load_tf_model, predict_tensorflow, StackedCNNBiLSTM, ParallelModel
import librosa
import os

app = FastAPI()

# Emotion mapping
emotion_map = {
    "RAVDESS": {
        1: "neutral", 2: "calm", 3: "happy", 4: "sad",
        5: "angry", 6: "fearful", 7: "disgust", 0: "surprised"
    },
    "CREMA-D": {
        0: "disgust", 1: "happy", 2: "sad", 3: "neutral",
        4: "fear", 5: "angry"
    },
    "EMODB": {
        0: "anger", 1: "boredom", 2: "disgust", 3: "fear",
        4: "happy", 5: "sad", 6: "neutral"
    }
}

# Load models
models = {
    "RAVDESS": load_pytorch_model("Saved_models/RAVDESS/cnn_lstm_parallel_model.pt", StackedCNNBiLSTM, 8, "RAVDESS"),
    "CREMA-D": load_pytorch_model("Saved_models/CREMA-D/cnn_lstm_parallel_model.pt", ParallelModel, 6, "CREMA-D"),
    "EMODB": load_tf_model("Saved_models/EMODB/LSTM_emodb.h5")
}

def extract_features(file_path, dataset, sample_rate=48000, n_mfcc=40, n_frames=100):
    try:
        audio, sr = librosa.load(file_path, sr=sample_rate)
        if dataset == "RAVDESS":
            max_samples = int(3 * sample_rate)  # 3 seconds
            if len(audio) > max_samples:
                audio = audio[:max_samples]
        elif dataset == "CREMA-D":
            n_mfcc = 128
            n_frames = 188
            max_samples = int(4 * sample_rate)  # 4 seconds
            if len(audio) > max_samples:
                audio = audio[:max_samples]
        elif dataset == "EMODB":
            n_mfcc = 13  # EMODB model expects 13 MFCC features
            n_frames = 100
            max_samples = int(3 * sample_rate)  # Assume 3 seconds, adjust if needed
            if len(audio) > max_samples:
                audio = audio[:max_samples]
        
        hop_length = int(len(audio) / (n_frames - 1)) if len(audio) > n_frames else 512
        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=sr,
            n_mfcc=n_mfcc,
            n_fft=2048,
            hop_length=hop_length,
            win_length=2048
        )
        print(f"[DEBUG] MFCC shape before processing: {mfcc.shape}")
        if mfcc.shape[1] > n_frames:
            mfcc = mfcc[:, :n_frames]
        elif mfcc.shape[1] < n_frames:
            padding = np.zeros((n_mfcc, n_frames - mfcc.shape[1]))
            mfcc = np.hstack((mfcc, padding))
        
        print(f"[DEBUG] Final MFCC shape: {mfcc.T.shape}")
        return mfcc.T
    except Exception as e:
        print(f"[ERROR] Feature extraction failed for {file_path}: {e}")
        return None

@app.post("/predict/")
async def predict(file: UploadFile = File(...), dataset: str = Form(...)):
    if dataset not in models:
        raise HTTPException(status_code=400, detail=f"Invalid dataset: {dataset}. Choose from {list(models.keys())}")
    
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        
        features = extract_features(temp_path, dataset)
        if features is None:
            raise HTTPException(status_code=500, detail="Feature extraction failed")
        
        expected_shape = (188, 128) if dataset == "CREMA-D" else (100, 40) if dataset == "RAVDESS" else (100, 13)
        if features.shape != expected_shape:
            raise HTTPException(status_code=400, detail=f"Expected feature shape {expected_shape}, got {features.shape}")
        
        if dataset == "EMODB":
            prediction = predict_tensorflow(models[dataset], features)
        else:
            prediction = predict_pytorch(models[dataset], features, dataset)
        
        if prediction == -1:
            raise HTTPException(status_code=500, detail="Prediction failed")
        
        emotion = emotion_map[dataset].get(prediction, "unknown")
        return {"dataset": dataset, "emotion": emotion, "prediction": prediction}
    except Exception as e:
        print(f"[ERROR] Server error: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)