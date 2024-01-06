
import "./App.css";
import { ThemeProvider } from "@mui/material";
import theme from "./utility/theme";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import Gallery from "./pages/MyGallery";
import Inference from "./pages/Inference";
import QueryPage from "./pages/Query";
import Auth from "./pages/Auth";
import AboutUs from "./pages/AboutUs";
import Galleries from "./pages/Galleries";
import Gallery from "./pages/Galleries/Gallery";
// import FileDropZone from "./pages/Test";
// import YourFormComponent from "./pages/Test";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Galleries />} />
          <Route path="/gallery/:galleryId" element={<Gallery />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/inference" element={<Inference />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about-us" element={<AboutUs />} />
          {/* <Route path="/test" element={<GalleryV2 />} /> */}
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
