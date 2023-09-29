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


# //! Configuration
cfg = get_default_cfg()
cfg.merge_from_file("./exp_cuhk/config.yaml")
cfg.freeze()

device = "cuda"

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

start_time_single = time.time()
#Inference Mode
with torch.inference_mode():
# with torch.no_grad():
    query_feat = model(query_img, query_target)[0]
    for gallery_img_path in gallery_img_paths:
        print(f"Processing {gallery_img_path}")
        gallery_img = [F.to_tensor(Image.open(gallery_img_path).convert("RGB")).to(device)]
        gallery_output = model(gallery_img)[0]
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



# query_img = [F.to_tensor(Image.open("../uploads/query.jpg").convert("RGB")).to(device)]
# query_target = [{"boxes": torch.tensor([[0, 0, 466, 943]]).to(device)}]

# query_feat = model(query_img, query_target)[0]