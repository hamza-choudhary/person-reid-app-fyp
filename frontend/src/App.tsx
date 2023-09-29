import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import "react-toastify/dist/ReactToastify.css";
import Camera from "./pages/Camera";
import UploadImage from "./pages/UploadImage";
import RealTimeVideo from "./pages/realTimeVideo";

function App() {
  return (
    <>
    {/* <RealTimeVideo/> */}
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Auth />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/upload-image" element={<UploadImage />} />
      </Routes>
    </>
  );
}

export default App;
