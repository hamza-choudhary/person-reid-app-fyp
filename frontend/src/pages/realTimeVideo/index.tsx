import React, { useEffect, useState } from "react";

const VideoStream = () => {
  const [videoStream, setVideoStream] = useState(null);
  const [isConnectionClosed, setIsConnectionClosed] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8765');

    socket.onmessage = (event) => {
        // Handle incoming messages
    };

    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
            console.error(`WebSocket connection died`);
        }
        setIsConnectionClosed(true);
    };

    socket.onerror = (error) => {
        console.error(`WebSocket error: ${error.message}`);
        setIsConnectionClosed(true);
    };

    return () => {
        socket.close();
    };
}, []);


  return (
    <div>
      {videoStream && !isConnectionClosed && (
        <img src={videoStream} className="w-96 h-96" alt="Live Stream" />
      )}
      {isConnectionClosed && <p>Connection closed by the server.</p>}
    </div>
  );
};

export default VideoStream;
