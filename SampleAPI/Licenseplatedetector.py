import cv2
from open_image_models import LicensePlateDetector
from google.colab.patches import cv2_imshow

# Load the image as a NumPy array (BGR format by default)
image = cv2.imread("/download.png")

# Initialize the License Plate Detector with YOLOv9 model
lp_detector = LicensePlateDetector(
    detection_model="yolo-v9-t-256-license-plate-end2end"
)

# Display predictions (internally runs predict and overlays bounding boxes)
image_with_preds = lp_detector.display_predictions(image)

# Convert BGR to RGB for correct color display in Colab
image_rgb = cv2.cvtColor(image_with_preds, cv2.COLOR_BGR2RGB)

# Show the result in Google Colab
cv2_imshow(image_rgb)
