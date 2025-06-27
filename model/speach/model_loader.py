# model_loader.py

import torch
import torch.nn as nn
import numpy as np
import tensorflow as tf

# TimeDistributed layer (used in training)
class TimeDistributed(nn.Module):
    def __init__(self, module):
        super(TimeDistributed, self).__init__()
        self.module = module

    def forward(self, x):
        if len(x.size()) <= 2:
            return self.module(x)
        elif len(x.size()) == 3:
            x_reshape = x.contiguous().view(-1, x.size(2))
        elif len(x.size()) == 4:
            x_reshape = x.contiguous().view(-1, x.size(2), x.size(3))
        else:
            x_reshape = x.contiguous().view(-1, x.size(2), x.size(3), x.size(4))
        y = self.module(x_reshape)
        if len(x.size()) == 3:
            y = y.contiguous().view(x.size(0), -1, y.size(1))
        elif len(x.size()) == 4:
            y = y.contiguous().view(x.size(0), -1, y.size(1), y.size(2))
        else:
            y = y.contiguous().view(x.size(0), -1, y.size(1), y.size(2), y.size(3))
        return y

# Hybrid CNN + LSTM model from your notebook
class HybridModel(nn.Module):
    def __init__(self, num_emotions=8):
        super().__init__()
        self.conv2Dblock = nn.Sequential(
            TimeDistributed(nn.Conv2d(1, 16, kernel_size=3, stride=1, padding=1)),
            TimeDistributed(nn.BatchNorm2d(16)),
            TimeDistributed(nn.ReLU()),
            TimeDistributed(nn.MaxPool2d(kernel_size=2, stride=2)),
            TimeDistributed(nn.Dropout(0.4)),

            TimeDistributed(nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1)),
            TimeDistributed(nn.BatchNorm2d(32)),
            TimeDistributed(nn.ReLU()),
            TimeDistributed(nn.MaxPool2d(kernel_size=4, stride=4)),
            TimeDistributed(nn.Dropout(0.4)),

            TimeDistributed(nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)),
            TimeDistributed(nn.BatchNorm2d(64)),
            TimeDistributed(nn.ReLU()),
            TimeDistributed(nn.MaxPool2d(kernel_size=4, stride=4)),
            TimeDistributed(nn.Dropout(0.4)),

            TimeDistributed(nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1)),
            TimeDistributed(nn.BatchNorm2d(128)),
            TimeDistributed(nn.ReLU()),
            TimeDistributed(nn.MaxPool2d(kernel_size=4, stride=4)),
            TimeDistributed(nn.Dropout(0.4))
        )
        self.lstm = nn.LSTM(input_size=128, hidden_size=64, bidirectional=False, batch_first=True)
        self.dropout_lstm = nn.Dropout(0.3)
        self.out_linear = nn.Linear(64, num_emotions)

    def forward(self, x):
        x = self.conv2Dblock(x)
        x = torch.flatten(x, start_dim=2)
        x, _ = self.lstm(x)
        x = self.dropout_lstm(x)
        x = x[:, -1, :]
        logits = self.out_linear(x)
        return logits

# Load PyTorch model
def load_pytorch_model(path):
    model = HybridModel()
    state_dict = torch.load(path, map_location=torch.device('cpu'))
    if isinstance(state_dict, dict) and 'state_dict' in state_dict:
        state_dict = state_dict['state_dict']
    model.load_state_dict(state_dict)
    model.eval()
    return model

# TensorFlow model
def load_tf_model(path):
    return tf.keras.models.load_model(path)

# Predict using PyTorch model
def predict_pytorch(model, features):
    try:
        features = torch.tensor(features, dtype=torch.float32).unsqueeze(0).unsqueeze(1).unsqueeze(1)
        with torch.no_grad():
            outputs = model(features)
        return torch.argmax(outputs, dim=1).item()
    except Exception as e:
        print(f"[ERROR] PyTorch prediction failed: {e}")
        return -1

# Predict using TensorFlow model
def predict_tensorflow(model, features):
    try:
        features = np.expand_dims(features, axis=0)
        predictions = model.predict(features, verbose=0)
        return int(np.argmax(predictions, axis=1)[0])
    except Exception as e:
        print(f"[ERROR] TensorFlow prediction failed: {e}")
        return -1
