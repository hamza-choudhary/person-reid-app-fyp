import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ThemeProvider } from "@mui/material";
import theme from "./utility/theme";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Inference from "./pages/Inference";
import QueryPage from "./pages/Query";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/inference" element={<Inference />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
