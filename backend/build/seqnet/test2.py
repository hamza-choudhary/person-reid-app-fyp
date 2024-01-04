from glob import glob

import matplotlib.pyplot as plt
import torch
import torch.utils.data
from PIL import Image
from torchvision.transforms import functional as F

from defaults import get_default_cfg
from models.seqnet import SeqNet
import time
# from utils.utils import resume_from_ckpt
import onnxruntime as ort
import onnx

def visualize_result(img_path, detections, similarities):
    fig, ax = plt.subplots(figsize=(16, 9))
    ax.imshow(plt.imread(img_path))
    plt.axis("off")
    for detection, sim in zip(detections, similarities):
        x1, y1, x2, y2 = detection
        ax.add_patch(
            plt.Rectangle(
                (x1, y1), x2 - x1, y2 - y1, fill=False, edgecolor="#4CAF50", linewidth=3.5
            )
        )
        ax.add_patch(
            plt.Rectangle((x1, y1), x2 - x1, y2 - y1, fill=False, edgecolor="white", linewidth=1)
        )
        ax.text(
            x1 + 5,
            y1 - 18,
            "{:.2f}".format(sim),
            bbox=dict(facecolor="#4CAF50", linewidth=0),
            fontsize=20,
            color="white",
        )
    plt.tight_layout()
    result_path = img_path.replace("gallery", "result")
    fig.savefig(result_path)
    # plt.show()
    plt.close(fig)
    print(f'saving {result_path}')


ort_session = ort.InferenceSession("./person_reid.onnx", providers=["CPUExecutionProvider"])


# Loading Query Image
query_img = F.to_tensor(Image.open("../uploads/query.jpg").convert("RGB")).numpy()
query_target = torch.tensor([[0, 0, 466, 943]]).numpy()


# Create input feed dictionary
query_input_feed = {
    'query_image': query_img,  
    'query_target': query_target 
}


# Run inference
query_output = ort_session.run(["query_feat"], query_input_feed)
query_feat = query_output[0]

# Loading Gallery Images
gallery_img_paths = sorted(glob("../uploads/gallery-*.jpg"))

for gallery_img_path in gallery_img_paths:
    print(f"Processing {gallery_img_path}")
    
    # Loading gallery_img (assuming gallery_img_path is defined somewhere)
    gallery_img = F.to_tensor(Image.open(gallery_img_path).convert("RGB")).numpy()

    # Create input feed dictionary for gallery_img
    input_feed_gallery = {
        'gallery_image': gallery_img
    }

    # Run inference for gallery_img
    # gallery_output = ort_session.run(["detections"], input_feed_gallery)

    # Create dummy inputs for query_image and query_target
    dummy_query_img = torch.zeros((1, 3, 944, 467))  # Replace height and width with actual values
    dummy_query_target = torch.zeros((1, 4))  # Replace with the correct shape if needed

    # Run inference for gallery_img
  # Create a dictionary containing all inputs
    input_feed = {
        "gallery_image": gallery_img,
        "query_image": query_img,
        "query_target": query_target
    }

    # Run inference for gallery_img
    gallery_output = ort_session.run(["detections"], input_feed)


    detections = gallery_output["boxes"]
    gallery_feats = gallery_output["embeddings"]

    # Compute pairwise cosine similarities,
    # which equals to inner-products, as features are already L2-normed
    similarities = gallery_feats.mm(query_feat.view(-1, 1)).squeeze()

    visualize_result(gallery_img_path, detections.cpu().numpy(), similarities)
