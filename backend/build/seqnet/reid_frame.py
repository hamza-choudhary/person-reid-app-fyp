import json
import sys
import torch
import torch.utils.data
from PIL import Image
from torchvision.transforms import functional as F
import cv2
from defaults import get_default_cfg
from models.seqnet import SeqNet
import time
import os
import numpy as np

torch.set_num_threads(torch.get_num_threads())

input_str = sys.stdin.read()
data = json.loads(input_str)

query_img_filename = data['queryImage']
name_of_person = data['name']
gallery_images_names = data['galleryImages']

def visualize_result(img_tensor, detections, similarities, img_path):

    if img_tensor.is_cuda:
        img_tensor = img_tensor.cpu()
        
    # Convert from PyTorch to numpy, and from CHW to HWC format for cv2
    img = img_tensor.numpy().transpose(1, 2, 0)
    # Convert from RGB to BGR as PyTorch tensor is in RGB format
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # Scale pixel values from 0-1 to 0-255
    if img.max() <= 1:
        img = (img * 255).astype(np.uint8)

    # Find the index of the highest similarity score
    highest_score_index = torch.argmax(similarities).item()

    # Loop through detections and similarities to draw the boxes and similarity scores
    for i, (detection, sim) in enumerate(zip(detections, similarities)):
        x1, y1, x2, y2 = map(int, detection)
        color = (0, 0, 255)
        if i == highest_score_index: 
            # put name of person
            cv2.putText(img, name_of_person, (x1 + 5, y1 - 35), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            color = (0, 255, 0) # green
        # Draw the rectangle
        cv2.rectangle(img, (x1, y1), (x2, y2), color, 4)
        # Put the similarity score text
        cv2.putText(img, "{:.2f}".format(sim), (x1 + 5, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, color, 2)

        # Replace 'gallery' with 'results' in the path
        result_path = img_path.replace("gallery", "results")
        # Extract the image name from the path and prepend 'result-' to the image name
        image_name = img_path.split('/')[-1]  # Get the last part of the path
        result_image_name = "result-" + image_name
        # Modify result_path to include the new image name
        result_path = result_path.replace(image_name, result_image_name)
        # Save the image
        cv2.imwrite(result_path, img)
        print(result_image_name, flush=True)

# //! Configuration
cfg = get_default_cfg()
cfg.merge_from_file("./exp_cuhk/config.yaml")
cfg.freeze()

device = "cuda" if torch.cuda.is_available() else "cpu"

print("creating model", flush=True)
model = SeqNet(cfg)

#Loading modal
ckpt = torch.load("./exp_cuhk/epoch_19.pth", map_location=device)
model.load_state_dict(ckpt["model"], strict=False)
model.to(device)

# Evaluation Mode
model.eval()

# Loading Query Image
query_img = [F.to_tensor(Image.open(f"../uploads/query/{query_img_filename}").convert("RGB")).to(device)]
query_target = [{"boxes": torch.tensor([[0, 0, 466, 943]]).to(device)}]

# Loading Gallery Images
gallery_img_tensors = []
gallery_folder_path = "../uploads/gallery/"
gallery_img_paths = [
    os.path.join(gallery_folder_path, img_name)
    for img_name in gallery_images_names
    if os.path.exists(os.path.join(gallery_folder_path, img_name))
]

for gallery_img_path in gallery_img_paths:
    image = Image.open(gallery_img_path).convert("RGB")
    img_tensor = F.to_tensor(image).to(device)  # Convert image to tensor and send to device
    gallery_img_tensors.append(img_tensor)

start_time_all=time.time()
#Inference Mode
with torch.inference_mode():
    query_feat = model(query_img, query_target)[0] # [big 2d matrix of features nos]
    for gallery_img_tensor, gallery_img_path in zip(gallery_img_tensors, gallery_img_paths):
        start_time_single = time.time()
        # print(f"Processing {gallery_img_path}", flush=True)
        gallery_img = [gallery_img_tensor]
        gallery_output = model(gallery_img)[0]
        detections = gallery_output["boxes"]
        gallery_feats = gallery_output["embeddings"] # [big 2d matrix of features nos]
        # print(f'\n==========embeddings=========\n{gallery_output["embeddings"]}\n')
        # Compute pairwise cosine similarities,
        # which equals to inner-products, as features are already L2-normed
        similarities = gallery_feats.mm(query_feat.view(-1, 1)).squeeze()
        if len(similarities.shape) == 0:
            similarities = similarities.unsqueeze(0)
        # print(f"\n==========similarities============\n{similarities}")
        max_similarity = torch.max(similarities)
        # Dont save results if max score is less than this threshold
        if max_similarity > 0.4:
            visual_time_start = time.time()
            visualize_result(gallery_img_tensor, detections.cpu().numpy(), similarities, gallery_img_path)
            visual_time_end = time.time()
            print(f"Time taken for a single visualization: {visual_time_end - visual_time_start:.2f} seconds", flush=True)

        end_time_single = time.time()
        print(f"Time taken for a single prediction: {end_time_single - start_time_single:.2f} seconds", flush=True)

end_time_all = time.time()
print(f"Time taken for all predictions: {end_time_all - start_time_all:.2f} seconds", flush=True)

