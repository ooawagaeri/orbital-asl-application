"""
with_camera.py
Used to conduct basic testing on generated model
"""


import torch
import joblib
import numpy as np
import cv2
import custom_CNN


# Hand capture area
def hand_area(img):
    area = img[100:324, 100:324]
    area = cv2.resize(area, (224, 224))
    return area


# Load label & model
lb = joblib.load('output/lb_alpha.pkl')
model = custom_CNN.CustomCNN().cuda()
model.load_state_dict(torch.load('output/model_alpha.pth'))
print(model)
print('Loading model...')

# Capture webcam
cap = cv2.VideoCapture(1)
if not cap.isOpened():
    print('Error while trying to open camera. Please check again...')

frame_width = int(cap.get(3))
frame_height = int(cap.get(4))
# Setting codec and record camera
#out = cv2.VideoWriter('output/asl.mp4', cv2.VideoWriter_fourcc(*'mp4v'), 30, (frame_width, frame_height))

# Read until end of video
while cap.isOpened():
    ret, frame = cap.read()  # Each frame of video

    cv2.rectangle(frame, (100, 100), (324, 324), (20, 34, 255), 2)  # Draw on camera, hand box
    image = hand_area(frame)

    image = np.transpose(image, (2, 0, 1)).astype(np.float32)
    image = torch.tensor(image, dtype=torch.float).cuda()
    image = image.unsqueeze(0)

    outputs = model(image)
    _, prediction = torch.max(outputs.data, 1)

    cv2.putText(frame, lb.classes_[prediction], (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
    cv2.imshow('image', frame)
    # Save camera recording
    #out.write(frame)

    if cv2.waitKey(27) & 0xFF == ord('q'):  # `Q` to exit
        break

# Closes camera, frames and video windows
cap.release()
cv2.destroyAllWindows()