from fastapi import FastAPI, File, UploadFile, Form, HTTPException
import torch
import numpy as np
from model_loader import load_pytorch_model, predict_pytorch, load_tf_model, predict_tensorflow, StackedCNNBiLSTM, ParallelModel
import librosa
from pydub import AudioSegment
import os
from fastapi.middleware.cors import CORSMiddleware
import io
import tempfile
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173"
]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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
def convert_audio_to_wav(file):
    try:
        # print(f"converting {file_path} to wav format")
        audio = AudioSegment.from_file(file)
        wav_io = io.BytesIO()

        audio.export(wav_io, format="wav")
        wav_io.seek(0)
        print("Successfully converted file object to in-memory WAV data.")
        return wav_io
    except Exception as e:
        print(f"[ERROR] Audio conversion failed for {file}: {e}")
        return None
@app.post("/predict/")
# async def predict(file: UploadFile = File(...), dataset: str = Form(...)):
#     if dataset not in models:
#         raise HTTPException(status_code=400, detail=f"Invalid dataset: {dataset}. Choose from {list(models.keys())}")

#     temp_path = f"temp_{file.filename}"
#     print(f"file type: {file.content_type}")
    
#     if not file.content_type or file.content_type not in ["audio/wav", "audio/mp3", "audio/m4a", "audio/x-m4a"]:
#         raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .wav, .mp3, or .m4a file.")
#     if file.content_type not in ["audio/wav"]:
#         file = convert_audio_to_wav(file)

#     if not os.path.exists(temp_path):
#         raise HTTPException(status_code=500, detail="Temporary file creation failed")
#     try:
#         with open(temp_path, "wb") as f:
#             f.write(await file.read())
        
#         features = extract_features(temp_path, dataset)
#         if features is None:
#             raise HTTPException(status_code=500, detail="Feature extraction failed")
        
#         expected_shape = (188, 128) if dataset == "CREMA-D" else (100, 40) if dataset == "RAVDESS" else (100, 13)
#         if features.shape != expected_shape:
#             raise HTTPException(status_code=400, detail=f"Expected feature shape {expected_shape}, got {features.shape}")
        
#         if dataset == "EMODB":
#             prediction = predict_tensorflow(models[dataset], features)
#         else:
#             prediction = predict_pytorch(models[dataset], features, dataset)
        
#         if prediction == -1:
#             raise HTTPException(status_code=500, detail="Prediction failed")
        
#         emotion = emotion_map[dataset].get(prediction, "unknown")
#         return {"dataset": dataset, "emotion": emotion, "prediction": prediction}
#     except Exception as e:
#         print(f"[ERROR] Server error: {e}")
#         raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
#     finally:
#         if os.path.exists(temp_path):
#             os.remove(temp_path)
async def predict(file: UploadFile = File(...), dataset: str = Form(...)):
    # print(f"Received file: {file.filename} for dataset: {dataset}")
    if dataset not in models:
        raise HTTPException(status_code=400, detail=f"Invalid dataset: {dataset}. Choose from {list(models.keys())}")

    if not file.content_type or file.content_type not in ["audio/wav", "audio/mp3", "audio/m4a", "audio/x-m4a", "audio/webm"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .wav, .mp3, or .m4a file.")
    print(f"Received file: {file.filename} with content type: {file.content_type}")
    # Create a temporary file to work with. 'delete=False' is needed for Windows.
    temp_wav_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    
    try:
        # 1. Read the uploaded file's content into memory first
        contents = await file.read()

        # 2. Convert the in-memory content to a WAV file on disk
        audio = AudioSegment.from_file(io.BytesIO(contents))
        audio.export(temp_wav_file.name, format="wav")
        print(f"Successfully converted {file.filename} to temporary WAV file: {temp_wav_file.name}")
        # 3. Extract features from the saved temporary WAV file path
        features = extract_features(temp_wav_file.name, dataset)
        if features is None:
            raise HTTPException(status_code=500, detail="Feature extraction failed")

        # Your existing prediction logic follows...
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
        # Print the full error for debugging
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
        
    finally:
        # 4. Always clean up the temporary file
        temp_wav_file.close()
        os.unlink(temp_wav_file.name)