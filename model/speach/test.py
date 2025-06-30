import requests

url = "http://localhost:8000/predict/"
file_path = r"c:\Users\Dell 452\Downloads\mixkit-woman-hilarious-laughing-410.wav"

try:
    with open(file_path, "rb") as audio_file:
        response = requests.post(
            url,
            files={"file": ("mixkit-woman-hilarious-laughing-410", audio_file, "audio/wav")},
            data={"dataset": "CREMA-D"}
        )
    print(f"Status Code: {response.status_code}")
    print(f"Response Text: {response.text}")
    try:
        print(response.json())
    except requests.exceptions.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
except Exception as e:
    print(f"Request failed: {e}")