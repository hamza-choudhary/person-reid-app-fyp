import Webcam from "react-webcam";

const CameraModule = () => {
  const videoConstraints = {
    facingMode: "user",
    mirrored: true,
  };
  return (
    <Webcam
      videoConstraints={videoConstraints}
      style={{ width: "100%", borderRadius: "10px", height: "100%" }}
    />
  );
};

export default CameraModule;
