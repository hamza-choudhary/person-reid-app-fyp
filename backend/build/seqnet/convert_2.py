from glob import glob

import matplotlib.pyplot as plt
import torch
import torch.utils.data
from PIL import Image
from torchvision.transforms import functional as F

from defaults import get_default_cfg
from models.seqnet import SeqNet
import time

cfg = get_default_cfg()
cfg.merge_from_file("./exp_cuhk/config.yaml")
cfg.freeze()

device = "cuda"

print("Creating model")
model = SeqNet(cfg)

ckpt = torch.load("./exp_cuhk/epoch_19.pth", map_location=device)
model.load_state_dict(ckpt["model"], strict=False)


model.eval()

# Define a function to export the model to ONNX
def export_to_onnx(model, filename):
    query_img = [F.to_tensor(Image.open("../uploads/query.jpg").convert("RGB"))]  # Example query image
    query_target = [{"boxes": torch.tensor([[0, 0, 466, 943]])}]  # Example query target
    gallery_img = [F.to_tensor(Image.open("../uploads/gallery-1.jpg").convert("RGB"))]  # Example gallery image


    # Export the model to ONNX
    torch.onnx.export(model, (query_img, query_target, gallery_img), filename, verbose=True,
                      input_names=["query_image", "query_target","gallery_image"],
                      output_names=["query_feat", "detections"],
                      dynamic_axes={"query_image": {0: "batch_size"},
                                    "query_target": {0: "batch_size"},
                                    "gallery_image": {0: "batch_size"},
                                    "query_feat": {0: "batch_size"},
                                    "detections": {0: "batch_size"},
                                    })

# Export the model to ONNX format
export_to_onnx(model, "person_reid_2.onnx")
print('export complete')