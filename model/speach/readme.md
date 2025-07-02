# Speech Emotion Recognition API

A FastAPI-based REST API for detecting emotions in audio files using deep learning models trained on multiple datasets.

## 🎯 Overview

This API provides emotion recognition capabilities for audio files using three different pre-trained models:
- **RAVDESS**: Actor-based emotional speech dataset (8 emotions)
- **CREMA-D**: Crowdsourced emotional multimodal actors dataset (6 emotions)
- **EMODB**: Berlin Database of Emotional Speech (7 emotions)

## 🚀 Quick Start

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the server:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```
for windows(if above doesnt work):
```pwsh
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Usage

**Basic Request:**
```bash
curl -X POST "http://localhost:8000/predict/" \
  -F "file=@sample_audio.wav" \
  -F "dataset=RAVDESS"
```

**Python Example:**
```python
import requests

url = "http://localhost:8000/predict/"
files = {"file": open("audio.wav", "rb")}
data = {"dataset": "RAVDESS"}

response = requests.post(url, files=files, data=data)
print(response.json())
```

## 📊 Supported Models & Emotions

### RAVDESS Dataset
- **Emotions**: neutral, calm, happy, sad, angry, fearful, disgust, surprised
- **Model**: Stacked CNN-BiLSTM with attention mechanism
- **Input Shape**: (100, 40) - 100 time frames, 40 MFCC features
- **Duration**: ~3 seconds optimal

### CREMA-D Dataset
- **Emotions**: disgust, happy, sad, neutral, fear, angry
- **Model**: Parallel CNN-LSTM architecture
- **Input Shape**: (188, 128) - 188 time frames, 128 MFCC features
- **Duration**: ~4 seconds optimal

### EMODB Dataset
- **Emotions**: anger, boredom, disgust, fear, happy, sad, neutral
- **Model**: TensorFlow LSTM
- **Input Shape**: (100, 13) - 100 time frames, 13 MFCC features
- **Duration**: ~3 seconds optimal

## 🔧 API Endpoints

### POST /predict/

**Parameters:**
- `file` (UploadFile): Audio file (WAV, MP3, FLAC)
- `dataset` (str): Model to use ("RAVDESS", "CREMA-D", "EMODB")

**Response:**
```json
{
  "dataset": "RAVDESS",
  "emotion": "happy",
  "prediction": 3
}
```

**Error Responses:**
- `400`: Invalid dataset or file format
- `500`: Processing error or model failure

## 🎵 Audio Requirements

- **Supported Formats**: WAV, MP3, FLAC, M4A
- **Sample Rate**: Automatically resampled to 48kHz
- **Channels**: Mono (stereo files converted automatically)
- **Duration**: 2-5 seconds recommended
- **Quality**: Clear speech without background noise

## 🏗️ Architecture

### Model Components

1. **Feature Extraction**: MFCC (Mel-Frequency Cepstral Coefficients)
2. **CNN Layers**: Convolutional feature extraction
3. **LSTM/BiLSTM**: Temporal sequence modeling
4. **Attention Mechanism**: Focus on relevant time segments
5. **Dense Layers**: Final emotion classification

### File Structure
```
speach/
├── app.py              # FastAPI main application
├── model_loader.py     # Model definitions and loaders
├── features.py         # Audio feature extraction
├── requirements.txt    # Python dependencies
├── readme.md          # This documentation
├── .gitignore         # Git ignore rules
└── Saved_models/      # Pre-trained model files
    ├── RAVDESS/
    ├── CREMA-D/
    └── EMODB/
```

## 🔬 Technical Details

### Feature Extraction Parameters

- **MFCC Coefficients**: 13-128 (dataset dependent)
- **Window Size**: 2048 samples
- **Hop Length**: Adaptive based on audio length
- **Preprocessing**: Normalization and padding

### Model Architectures

**StackedCNNBiLSTM (RAVDESS):**
- 4 CNN layers with batch normalization
- Bidirectional LSTM (128 hidden units)
- Attention mechanism for temporal focus
- Dropout regularization (0.1-0.3)

**ParallelModel (CREMA-D):**
- Parallel CNN and LSTM processing
- Feature fusion with attention
- Softmax output layer

**LSTM Model (EMODB):**
- TensorFlow/Keras implementation
- Simple LSTM architecture
- Dense output layer

## 🚨 Error Handling

The API includes comprehensive error handling for:
- Invalid file formats
- Corrupted audio files
- Model loading failures
- Feature extraction errors
- Memory limitations

## 📈 Performance

- **Inference Time**: ~1-3 seconds per audio file
- **Memory Usage**: ~500MB-1GB (model dependent)
- **Accuracy**: 70-85% (varies by dataset and audio quality)

## 🔧 Development

### Adding New Models

1. Define model architecture in `model_loader.py`
2. Add emotion mapping in `app.py`
3. Update feature extraction parameters
4. Test with sample audio files

### Testing

```bash
# Test with sample audio
curl -X POST "http://localhost:8000/predict/" \
  -F "file=@test_audio.wav" \
  -F "dataset=RAVDESS"
```

## 📝 Dependencies

- **FastAPI**: Web framework
- **uvicorn**: ASGI server
- **torch**: PyTorch deep learning
- **tensorflow**: TensorFlow models
- **librosa**: Audio processing
- **numpy**: Numerical computing
- **soundfile**: Audio I/O
- **pydub**: Audio manipulation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request

## 📄 License

This project is part of the DIC Unified API Stack initiative.
