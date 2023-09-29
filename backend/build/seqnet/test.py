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


ort_session = ort.InferenceSession("./onnx_model.onnx", providers=["CPUExecutionProvider"])

# Inference Mode
# with ort.Session(ort_session):



# Loading Query Image
# query_img = [F.to_tensor(Image.open("../uploads/query.jpg").convert("RGB"))] //1.0
# query_target = [{"boxes": torch.tensor([[0, 0, 466, 943]])}] //1.0
# Loading Gallery Images
gallery_img_paths = sorted(glob("../uploads/gallery-*.jpg"))

start_time_single = time.time()

query_img = [F.to_tensor(Image.open("../uploads/query.jpg").convert("RGB"))]
query_target = [{"boxes": torch.tensor([[0, 0, 466, 943]])}]
# Update to include the 'bbox' input
query_input = {"image.1": query_img, "bbox": query_target[0]["boxes"]}

# query_input = {"input_image": query_img, "input_target": query_target} //1.0
# Perform inference
query_output = ort_session.run(None, query_input)
query_feat = query_output[0]

for gallery_img_path in gallery_img_paths:
    print(f"Processing {gallery_img_path}")
    gallery_img = [F.to_tensor(Image.open(gallery_img_path).convert("RGB")).to(device)]
    
    gallery_input = {"input_gallery_image": gallery_img}

    # Perform inference
    onnx_outputx_gallery = ort_session.run(None, gallery_input)

    gallery_output = onnx_outputx_gallery[0]
    detections = gallery_output["boxes"]
    gallery_feats = gallery_output["embeddings"]

    # Compute pairwise cosine similarities,
    # which equals to inner-products, as features are already L2-normed
    similarities = gallery_feats.mm(query_feat.view(-1, 1)).squeeze()

    visualize_result(gallery_img_path, detections.cpu().numpy(), similarities)
    end_time_single = time.time()
    print(f"Time taken for a single prediction: {end_time_single - start_time_single:.2f} seconds")

end_time_all = time.time()
print(f"Time taken for all predictions: {end_time_all - start_time_single:.2f} seconds")
