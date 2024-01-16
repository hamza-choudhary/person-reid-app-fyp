import base64
from tkinter.tix import Tree
import cv2
import sys
import time
import torch
import json
import torch.utils.data
import numpy as np
from PIL import Image
from torchvision.transforms import functional as F
import imageio

from defaults import get_default_cfg
from models.seqnet import SeqNet

# Set the number of threads for PyTorch
torch.set_num_threads(torch.get_num_threads())

input_str = sys.stdin.read()
data = json.loads(input_str)

query_img_filename = data['queryImage']
name_of_person = data['name']
gallery_video_name = data['galleryVideo']
output_video_path = ''
# Function to encode frame to base64
def send_frame_to_node(frame):
    success, buffer = cv2.imencode('.jpg', frame)
    if success:
        frame_bytes = buffer.tobytes()
        frame_base64 = base64.b64encode(frame_bytes).decode('utf-8')
        print(f"FRAME_DATA:{frame_base64}", flush=True)
        # sys.stdout.flush()

# Function to visualize results
def visualize_result(img, detections, similarities):

    #if ERROR:
    # if img_tensor.is_cuda:
    #     img_tensor = img_tensor.cpu()
        
    # # Convert from PyTorch to numpy, and from CHW to HWC format for cv2
    # img = img_tensor.numpy().transpose(1, 2, 0)
    # # Convert from RGB to BGR as PyTorch tensor is in RGB format
    # img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

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

    send_frame_to_node(img)
    return img

def main():
    # Configuration
    cfg = get_default_cfg()
    cfg.merge_from_file("./exp_cuhk/config.yaml")
    cfg.freeze()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("Creating model", flush=True)
    model = SeqNet(cfg)

    # Load model
    ckpt = torch.load("./exp_cuhk/epoch_19.pth", map_location=device)
    model.load_state_dict(ckpt["model"], strict=False)
    model.to(device)
    model.eval()

    # Load Query Image
    query_img = [F.to_tensor(Image.open(f"../uploads/query/{query_img_filename}").convert("RGB")).to(device)]
    query_target = [{"boxes": torch.tensor([[0, 0, 466, 943]]).to(device)}]

    # Gallery video capture
    vid = cv2.VideoCapture(f"../uploads/gallery/{gallery_video_name}")
    start_time_all = time.time()
    processed_frames = []

    with torch.inference_mode():
        # Query features
        query_feat = model(query_img, query_target)[0]

        frame_no = 0
        try:
            while True:
                ret, frame = vid.read()
                if not ret:
                    break
                if frame is None:
                    continue
                
                original_height, original_width, _ = frame.shape
                new_height = original_height + (16 - original_height % 16)
                new_width = original_width + (16 - original_width % 16)
                frame = cv2.resize(frame, (new_width, new_height))

                start_time_single = time.time()
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                gallery_img = [F.to_tensor(frame_rgb).to(device)]
                gallery_output = model(gallery_img)[0]

                detections = gallery_output["boxes"]
                gallery_feats = gallery_output["embeddings"]
                similarities = gallery_feats.mm(query_feat.view(-1, 1)).squeeze()
                similarities = similarities.unsqueeze(0) if len(similarities.shape) == 0 else similarities
                
                max_similarity = torch.max(similarities)
                # Dont save results if max score is less than this threshold
                if max_similarity > 0.1:
                    visual_time_start = time.time()
                    processed_frame = visualize_result(frame, detections.cpu().numpy(), similarities)
                    processed_frames.append(processed_frame)
                    visual_time_end = time.time()
                    print(f"Time taken for a single visualization: {visual_time_end - visual_time_start:.2f} seconds", flush=True)

                frame_no += 1

                end_time_single = time.time()
                print(f"Time for frame {frame_no}: {end_time_single - start_time_single:.2f} seconds", flush=True)

        except Exception as e:
            print(f"Error in main loop: {str(e)}", flush=True)
        finally:
            vid.release()
            cv2.destroyAllWindows()

            # Write frames to video
            if processed_frames:
                # height, width, _ = processed_frames[0].shape
                # fourcc = cv2.VideoWriter_fourcc(*'MP4V')
                output_video_path = '../uploads/results/output_video.mp4'
                with imageio.get_writer(output_video_path, fps=20) as video_writer:
                    for frame in processed_frames:
                        video_writer.append_data(frame)
                # video_writer = cv2.VideoWriter(output_video_path, fourcc, 20.0, (width, height))
                # for frame in processed_frames:
                #     video_writer.write(frame)

                # video_writer.release()
                    # print(f"OUTPUT_VIDEO_PATH:{output_video_path}")
                    # sys.stdout.flush()

    end_time_all = time.time()
    print(f"Total time: {end_time_all - start_time_all:.2f} seconds", flush=True)
    print(f"OUTPUT_VIDEO_PATH:{output_video_path}", flush=True)
if __name__ == "__main__":
    main()
