from glob import glob

import matplotlib.pyplot as plt
import torch
import torch.utils.data
from PIL import Image
from torchvision.transforms import functional as F

from defaults import get_default_cfg
from models.seqnet import SeqNet
import time

# //! Configuration
cfg = get_default_cfg()
cfg.merge_from_file("./exp_cuhk/config.yaml")
cfg.freeze()

# device = "cuda"

print("creating model")
model = SeqNet(cfg)

#Loading modal
ckpt = torch.load("./exp_cuhk/epoch_19.pth")
model.load_state_dict(ckpt["model"], strict=False)

# Evaluation Mode
model.eval()

# dummy input
# Create dummy inputs
query_img = [F.to_tensor(Image.open("../uploads/query.jpg").convert("RGB"))]  # Example query image
query_target = [{"boxes": torch.tensor([[0, 0, 466, 943]])}]  # Example query target
gallery_img = [F.to_tensor(Image.open("../uploads/gallery-1.jpg").convert("RGB"))]  # Example gallery image

dummy_input = (query_img, query_target, gallery_img)

torch.onnx.export(model, dummy_input, 'onnx_model.onnx', verbose=True)
print('export completed successfully')