import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./section/home";
import PhotoStrip from "./section/preview"; 
import Photobooth from "./section/photobooth";
import PhotoPreview from "./section/preview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo-strip" element={<PhotoStrip />} />
        <Route path="/photobooth" element={<Photobooth />} />
        <Route path="/preview" element={<PhotoPreview />} />

      </Routes>
    </Router>
  );
}

export default App;
