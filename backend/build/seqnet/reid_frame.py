from glob import glob

import matplotlib.pyplot as plt
import torch
import torch.utils.data
from PIL import Image
from torchvision.transforms import functional as F
import cv2
torch.set_num_threads(torch.get_num_threads())

from defaults import get_default_cfg
from models.seqnet import SeqNet
import time

def visualize_result(img_path, detections, similarities):
    img = cv2.imread(img_path)

    for detection, sim in zip(detections, similarities):
        x1, y1, x2, y2 = detection
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)  # Convert coordinates to integers
        cv2.rectangle(img, (x1, y1), (x2, y2), (76, 175, 80), 3)  # BGR color, line thickness

        font = cv2.FONT_HERSHEY_SIMPLEX
        text = f'{sim:.2f}'
        
        # Specify a fixed width for the text rectangle
        text_width = 60  # Adjust this value to your desired width
        
        # Calculate the position for the text rectangle
        text_x1 = x1
        text_x2 = x1 + text_width
        text_y1 = y1 - 18
        text_y2 = y1
        
        # Draw a white rectangle as the background for the text
        cv2.rectangle(img, (text_x1, text_y1), (text_x2, text_y2), (255, 255, 255), thickness=cv2.FILLED)
        
        # Draw the text in white color
        cv2.putText(img, text, (x1 + 5, y1 - 18 + 25), font, 0.6, (76, 175, 80), 2)

    result_path = img_path.replace("gallery", "result")
    cv2.imwrite(result_path, img)
    print(f'saving {result_path}')


# //! Configuration
cfg = get_default_cfg()
cfg.merge_from_file("./exp_cuhk/config.yaml")
cfg.freeze()

device = "cpu"


print("creating model")
model = SeqNet(cfg)

#Loading modal
ckpt = torch.load("./exp_cuhk/epoch_19.pth", map_location=device)
model.load_state_dict(ckpt["model"], strict=False)
model.to(device)

# Evaluation Mode
model.eval()

# Loading Query Image
query_img = [F.to_tensor(Image.open("../uploads/query.jpg").convert("RGB")).to(device)]
query_target = [{"boxes": torch.tensor([[0, 0, 466, 943]]).to(device)}]
# Loading Gallery Images
gallery_img_paths = sorted(glob("../uploads/gallery-*.jpg"))

start_time_all=time.time()
#Inference Mode
with torch.inference_mode():
# with torch.no_grad():
    query_feat = model(query_img, query_target)[0]
    for gallery_img_path in gallery_img_paths:
        start_time_single = time.time()
        print(f"Processing {gallery_img_path}")
        gallery_img = [F.to_tensor(Image.open(gallery_img_path).convert("RGB")).to(device)]
        gallery_output = model(gallery_img)[0]
        detections = gallery_output["boxes"]
        gallery_feats = gallery_output["embeddings"]

        # Compute pairwise cosine similarities,
        # which equals to inner-products, as features are already L2-normed
        similarities = gallery_feats.mm(query_feat.view(-1, 1)).squeeze()
        if len(similarities.shape) == 0:
            similarities = similarities.unsqueeze(0)
        visual_time_start = time.time()
        visualize_result(gallery_img_path, detections.cpu().numpy(), similarities)
        visual_time_end = time.time()
        print(f"Time taken for a single visualization: {visual_time_end - visual_time_start:.2f} seconds")
        end_time_single = time.time()
        print(f"Time taken for a single prediction: {end_time_single - start_time_single:.2f} seconds")

end_time_all = time.time()
print(f"Time taken for all predictions: {end_time_all - start_time_all:.2f} seconds")



# query_img = [F.to_tensor(Image.open("../uploads/query.jpg").convert("RGB")).to(device)]
# query_target = [{"boxes": torch.tensor([[0, 0, 466, 943]]).to(device)}]

# query_feat = model(query_img, query_target)[0]