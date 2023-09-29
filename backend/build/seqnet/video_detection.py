import argparse
import torch
from torchvision.transforms import functional as F
from defaults import get_default_cfg
from models.seqnet import SeqNet
import cv2
import io
import asyncio
import websockets
import json
import base64

# Function to send real-time results to WebSocket clients
async def send_results(frame_encoded, websocket, is_last_frame=False):
    try:
        # Encode the binary data as base64 and convert it to a string
        frame_base64 = base64.b64encode(frame_encoded).decode('utf-8')
        
        result_data = {
            "frame_encoded": frame_base64,
            "is_last_frame": is_last_frame,
        }
        await websocket.send(json.dumps(result_data))
    except websockets.exceptions.ConnectionClosedError:
        print("WebSocket connection closed by the client.")
    except Exception as e:
        print(f"Error sending results: {str(e)}")

async def main(args, websocket):
    cfg = get_default_cfg()
    if args.cfg_file:
        cfg.merge_from_file(args.cfg_file)
    cfg.merge_from_list(args.opts)
    cfg.freeze()

    device = "cpu"

    print("Creating model")
    model = SeqNet(cfg)
    model.to(device)
    model.eval()

    with torch.inference_mode():
        # Initialize video capture (you may need to specify the video source)
        cap = cv2.VideoCapture('../uploads/gallery.mp4')

        try:
            while True:
                # Capture a frame from the video
                ret, frame = cap.read()
                if not ret:
                    break

                # Convert the frame to a tensor and send it to the model
                gallery_img = [F.to_tensor(frame).to(device)]
                gallery_output = model(gallery_img)[0]
                detections = gallery_output["boxes"]

                # Encode the frame with bounding boxes as JPEG
                _, frame_encoded = cv2.imencode('.jpg', frame)

                # Send real-time results (frame_encoded) to WebSocket clients
                await send_results(frame_encoded.tobytes(), websocket)

            # Signal the end of video processing
            await send_results(b'', websocket, is_last_frame=True)
        except Exception as e:
            print(f"Error in main loop: {str(e)}")

        finally:
            # Release the video capture and close the window if needed
            cap.release()
            cv2.destroyAllWindows()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Perform person re-identification on a gallery video.")
    parser.add_argument("--cfg", dest="cfg_file", help="Path to configuration file.")
    parser.add_argument("--ckpt", required=True, help="Path to checkpoint to resume or evaluate.")
    parser.add_argument(
        "opts", nargs=argparse.REMAINDER, help="Modify config options using the command-line"
    )
    args = parser.parse_args()

    async def handle(websocket, path):
        await main(args, websocket)

    start_server = websockets.serve(handle, "localhost", 8765)  # Change to allow external connections

    print("WebSocket server is listening on ws://localhost:8765")

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
