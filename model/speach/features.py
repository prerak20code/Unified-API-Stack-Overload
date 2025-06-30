# features.py
# import librosa
# import numpy as np

# def extract_features(file_path):
#     try:
#         audio, sample_rate = librosa.load(file_path, sr=22050)
#         mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
#         mfccs = mfccs.T  # shape: (T, 40)
#         return mfccs
#     except Exception as e:
#         print(f"[ERROR] Failed to extract features from {file_path}: {e}")
#         return None

import librosa
import numpy as np

def extract_features(file_path, dataset, sample_rate=48000, n_mfcc=40, n_frames=100):
    try:
        audio, sr = librosa.load(file_path, sr=sample_rate)
        if dataset == "CREMA-D":
            n_mfcc = 128
            n_frames = 188
            hop_length = 512  # Standard hop length for CREMA-D
        else:  # RAVDESS
            n_mfcc = 40
            n_frames = 100
            hop_length = int(len(audio) / (n_frames - 1)) if len(audio) > n_frames else 512  # Adjust hop length to get ~100 frames

        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=sr,
            n_mfcc=n_mfcc,
            n_fft=2048,
            hop_length=hop_length,
            win_length=2048
        )
        # Ensure exact number of frames
        if mfcc.shape[1] > n_frames:
            mfcc = mfcc[:, :n_frames]
        elif mfcc.shape[1] < n_frames:
            padding = np.zeros((n_mfcc, n_frames - mfcc.shape[1]))
            mfcc = np.hstack((mfcc, padding))
        
        return mfcc.T  # Shape: (100, 40) for RAVDESS, (188, 128) for CREMA-D
    except Exception as e:
        print(f"[ERROR] Feature extraction failed for {file_path}: {e}")
        return None