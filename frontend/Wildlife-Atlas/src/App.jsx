import React from "react";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";

import Home from "./pages/Home";
import LandAnimals from "./pages/LandAnimals";
import AirAnimals from "./pages/AirAnimals";
import WaterAnimals from "./pages/WaterAnimals";
import AdminAnimals from "@/pages/AdminAnimals";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kopno" element={<LandAnimals />} />
        <Route path="/vozduh" element={<AirAnimals />} />
        <Route path="/voda" element={<WaterAnimals />} />
        <Route path="/admin/animals" element={<AdminAnimals />} />
      </Routes>
    </Router>
  )
}

export default App;
