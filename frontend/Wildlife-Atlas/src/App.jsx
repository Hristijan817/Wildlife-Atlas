import React from "react";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";

import Home from "./pages/Home";
import LandAnimals from "./pages/LandAnimals";
import AirAnimals from "./pages/AirAnimals";
import WaterAnimals from "./pages/WaterAnimals";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kopno" element={<LandAnimals />} />
        <Route path="/vozduh" element={<AirAnimals />} />
        <Route path="/voda" element={<WaterAnimals />} />
      </Routes>
    </Router>
  )
}

export default App;
