import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import tensorflow as tf

# TimeDistributed Layer
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

# Model 1: HybridModel (for other datasets)
class HybridModel(nn.Module):
    def __init__(self, num_emotions=8):
        super().__init__()
        self.conv2Dblock = nn.Sequential(
            TimeDistributed(nn.Conv2d(1, 16, 3, 1, 1)),
            TimeDistributed(nn.BatchNorm2d(16)),
            TimeDistributed(nn.ReLU()),
            TimeDistributed(nn.MaxPool2d(2)),
            TimeDistributed(nn.Dropout(0.4)),
            TimeDistributed(nn.Conv2d(16, 32, 3, 1, 1)),
            TimeDistributed(nn.BatchNorm2d(32)),
            TimeDistributed(nn.ReLU()),
            TimeDistributed(nn.MaxPool2d(4)),
            TimeDistributed(nn.Dropout(0.4)),
            TimeDistributed(nn.Conv2d(32, 64, 3, 1, 1)),
            TimeDistributed(nn.BatchNorm2d(64)),
            TimeDistributed(nn.ReLU()),
            TimeDistributed(nn.MaxPool2d(4)),
            TimeDistributed(nn.Dropout(0.4)),
            TimeDistributed(nn.Conv2d(64, 128, 3, 1, 1)),
            TimeDistributed(nn.BatchNorm2d(128)),
            TimeDistributed(nn.ReLU()),
            TimeDistributed(nn.MaxPool2d(4)),
            TimeDistributed(nn.Dropout(0.4)),
        )
        self.lstm = nn.LSTM(input_size=128, hidden_size=64, batch_first=True)
        self.dropout_lstm = nn.Dropout(0.3)
        self.out_linear = nn.Linear(64, num_emotions)

    def forward(self, x):
        x = self.conv2Dblock(x)
        x = torch.flatten(x, start_dim=2)
        x, _ = self.lstm(x)
        x = self.dropout_lstm(x)
        x = x[:, -1, :]
        return self.out_linear(x)

# Model 2: StackedCNNBiLSTM (for RAVDESS)
class StackedCNNBiLSTM(nn.Module):
    def __init__(self, num_emotions=8):
        super().__init__()
        self.conv2Dblock = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1),  # (1, 40, 100) → (16, 40, 100)
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2),  # (16, 40, 100) → (16, 20, 50)
            nn.Dropout(0.3),
            nn.Conv2d(16, 32, 3, padding=1),  # (16, 20, 50) → (32, 20, 50)
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),  # (32, 20, 50) → (32, 10, 25)
            nn.Dropout(0.3),
            nn.Conv2d(32, 64, 3, padding=1),  # (32, 10, 25) → (64, 10, 25)
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),  # (64, 10, 25) → (64, 5, 12)
            nn.Dropout(0.3),
            nn.Conv2d(64, 64, 3, padding=1),  # (64, 5, 12) → (64, 5, 12)
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d([5, 3], stride=[5, 3]),  # (64, 5, 12) → (64, 1, 4)
            nn.Dropout(0.3)
        )
        self.lstm_maxpool = nn.MaxPool2d(kernel_size=[2, 2], stride=[2, 2])  # (1, 40, 100) → (1, 20, 50)
        self.lstm = nn.LSTM(input_size=64, hidden_size=128, num_layers=1, bidirectional=True, batch_first=True)
        self.dropout_lstm = nn.Dropout(0.1)
        self.attention_linear = nn.Linear(256, 1)  # 256 = 2 * hidden_size
        self.out_linear = nn.Linear(256 + 256, num_emotions)  # 256 (conv: 64 * 1 * 4) + 256 (attention)
        self.dropout_linear = nn.Dropout(0)

    def forward(self, x):
        conv_embedding = self.conv2Dblock(x)  # (1, 64, 1, 4)
        conv_embedding = torch.flatten(conv_embedding, start_dim=1)  # 64 * 1 * 4 = 256
        x_reduced = self.lstm_maxpool(x)  # (1, 1, 40, 100) → (1, 1, 20, 50)
        x_reduced = torch.squeeze(x_reduced, 1)  # (1, 20, 50)
        x_reduced = x_reduced.permute(0, 2, 1)  # (1, 50, 20)
        # Pad to 64 features
        padding = torch.zeros(x_reduced.size(0), x_reduced.size(1), 64 - 20, device=x_reduced.device)  # (1, 50, 44)
        x_reduced = torch.cat([x_reduced, padding], dim=2)  # (1, 50, 20) → (1, 50, 64)
        lstm_embedding, _ = self.lstm(x_reduced)  # input_size=64
        lstm_embedding = self.dropout_lstm(lstm_embedding)
        T = lstm_embedding.shape[1]
        attention_weights = [self.attention_linear(lstm_embedding[:, t, :]) for t in range(T)]
        attention_weights_norm = F.softmax(torch.stack(attention_weights, -1), -1)
        attention = torch.bmm(attention_weights_norm, lstm_embedding).squeeze(1)  # (1, 256)
        complete_embedding = torch.cat([conv_embedding, attention], dim=1)  # (1, 256 + 256)
        output_logits = self.out_linear(complete_embedding)
        output_logits = self.dropout_linear(output_logits)
        return output_logits

# Model 3: ParallelModel (for CREMA-D)
class ParallelModel(nn.Module):
    def __init__(self, num_emotions=6):
        super().__init__()
        self.conv2Dblock = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1),  # (1, 128, 188) → (16, 128, 188)
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2),  # (16, 128, 188) → (16, 64, 94)
            nn.Dropout(0.3),
            nn.Conv2d(16, 32, 3, padding=1),  # (16, 64, 94) → (32, 64, 94)
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(4),  # (32, 64, 94) → (32, 16, 23)
            nn.Dropout(0.3),
            nn.Conv2d(32, 64, 3, padding=1),  # (32, 16, 23) → (64, 16, 23)
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(4),  # (64, 16, 23) → (64, 4, 5)
            nn.Dropout(0.3),
            nn.Conv2d(64, 64, 3, padding=1),  # (64, 4, 5) → (64, 4, 5)
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(4),  # (64, 4, 5) → (64, 1, 1)
            nn.Dropout(0.3)
        )
        self.lstm_maxpool = nn.MaxPool2d(kernel_size=[2, 3], stride=[2, 3])  # (1, 128, 188) → (1, 64, 62)
        self.lstm = nn.LSTM(input_size=64, hidden_size=128, num_layers=1, bidirectional=True, batch_first=True)
        self.dropout_lstm = nn.Dropout(0.1)
        self.attention_linear = nn.Linear(256, 1)  # 256 = 2 * hidden_size
        self.out_linear = nn.Linear(64 + 256, num_emotions)  # 64 (conv: 64 * 1 * 1) + 256 (attention)
        self.dropout_linear = nn.Dropout(0)

    def forward(self, x):
        conv_embedding = self.conv2Dblock(x)  # (1, 64, 1, 1)
        conv_embedding = torch.flatten(conv_embedding, start_dim=1)  # 64 * 1 * 1 = 64
        x_reduced = self.lstm_maxpool(x)  # (1, 1, 128, 188) → (1, 1, 64, 62)
        x_reduced = torch.squeeze(x_reduced, 1)  # (1, 64, 62)
        x_reduced = x_reduced.permute(0, 2, 1)  # (1, 62, 64)
        lstm_embedding, _ = self.lstm(x_reduced)  # input_size=64
        lstm_embedding = self.dropout_lstm(lstm_embedding)
        T = lstm_embedding.shape[1]
        attention_weights = [self.attention_linear(lstm_embedding[:, t, :]) for t in range(T)]
        attention_weights_norm = F.softmax(torch.stack(attention_weights, -1), -1)
        attention = torch.bmm(attention_weights_norm, lstm_embedding).squeeze(1)  # (1, 256)
        complete_embedding = torch.cat([conv_embedding, attention], dim=1)  # (1, 64 + 256)
        output_logits = self.out_linear(complete_embedding)
        output_logits = self.dropout_linear(output_logits)
        output_softmax = F.softmax(output_logits, dim=1)
        return output_softmax

# Model Loaders
def load_pytorch_model(path, model_class, num_emotions, dataset):
    model = model_class(num_emotions=num_emotions)
    try:
        if dataset == "CREMA-D":
            dummy_input = torch.zeros((1, 1, 128, 188))
        elif dataset == "RAVDESS":
            dummy_input = torch.zeros((1, 1, 40, 100))
        else:
            dummy_input = torch.zeros((1, 100, 1, 40))
        with torch.no_grad():
            model(dummy_input)
    except Exception as e:
        print(f"[INFO] Dummy forward failed (may be okay): {e}")
    state_dict = torch.load(path, map_location=torch.device("cpu"), weights_only=True)
    if any(k.startswith("module.") for k in state_dict.keys()):
        state_dict = {k.replace("module.", ""): v for k, v in state_dict.items()}
    try:
        model.load_state_dict(state_dict, strict=True)
    except Exception as e:
        print(f"[ERROR] Failed to load state dict: {e}")
        raise
    model.eval()
    return model

def load_tf_model(path):
    return tf.keras.models.load_model(path)

# Prediction Wrappers
def predict_pytorch(model, features, dataset):
    try:
        features = torch.tensor(features, dtype=torch.float32)
        if isinstance(model, HybridModel):
            features = features.unsqueeze(0).unsqueeze(2)  # (T, F) → (1, T, 1, F)
        elif isinstance(model, (StackedCNNBiLSTM, ParallelModel)):
            if dataset == "CREMA-D":
                features = features.T.unsqueeze(0).unsqueeze(0)  # (188, 128) → (1, 1, 128, 188)
            else:  # RAVDESS
                features = features.T.unsqueeze(0).unsqueeze(0)  # (100, 40) → (1, 1, 40, 100)
        else:
            raise ValueError(f"Unsupported model type: {type(model)}")
        print(f"[DEBUG] Input shape to model: {features.shape}")
        with torch.no_grad():
            outputs = model(features)
        if isinstance(outputs, tuple):
            outputs = outputs[0]
        return torch.argmax(outputs, dim=1).item()
    except Exception as e:
        print(f"[ERROR] PyTorch prediction failed: {e}")
        return -1

def predict_tensorflow(model, features):
    try:
        features = np.expand_dims(features, axis=0)  # (T, F) → (1, T, F)
        predictions = model.predict(features, verbose=0)
        return int(np.argmax(predictions, axis=1)[0])
    except Exception as e:
        print(f"[ERROR] TensorFlow prediction failed: {e}")
        return -1