import whisper
from google.colab import files
from IPython.display import display, HTML
uploaded = files.upload()  # Upload sample_audio.wav
filename = list(uploaded.keys())[0]

model = whisper.load_model("base")
result = model.transcribe(filename)
print("Transcription:")
display(HTML(f"<div style='white-space:pre-wrap'>{result['text']}</div>"))

