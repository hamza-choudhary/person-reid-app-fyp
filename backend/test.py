import cv2
import asyncio
import websockets
import base64

async def send_video_frames(websocket, path):
    # Open the video file (replace 'video.mp4' with your video file)
    cap = cv2.VideoCapture('input.mp4')

    try:
        while True:
            # Read a frame from the video
            ret, frame = cap.read()
            if not ret:
                break

            # Encode the frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = base64.b64encode(buffer).decode('utf-8')

            # Send the frame to the React application
            await websocket.send(frame_bytes)
    except websockets.exceptions.ConnectionClosedError:
        print("WebSocket connection closed by the client.")
    finally:
        cap.release()

print("WebSocket server is listening on ws://localhost:8765")
start_server = websockets.serve(send_video_frames, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
