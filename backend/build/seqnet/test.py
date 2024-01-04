
import cv2

#gallery video capture
vid = cv2.VideoCapture("../uploads/gallery.mp4")


frame_no=0
#cv loop
try:
    while True:
        # Capture a frame from the video
        ret, frame = vid.read()
        if not ret:
            print('return happen')
            break
        if frame is None:
            print(f'emptyframe is {frame_no}')
            continue  # Skip empty frames
        
        print(f'reading frame is {frame_no}')
        frame_no += 1 # incrementing frame

except Exception as e:
    print(f"Error in main loop: {str(e)}")
finally:
        # Release the video capture and close the window if needed
    vid.release()
    cv2.destroyAllWindows()
