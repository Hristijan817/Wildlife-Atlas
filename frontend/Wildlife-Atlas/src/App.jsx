import React from "react";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";

import Home from "./pages/Home";
import LandAnimals from "./pages/LandAnimals";
import AirAnimals from "./pages/AirAnimals";
import WaterAnimals from "./pages/WaterAnimals";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kopno" element={<LandAnimals />} />
        <Route path="/vozduh" element={<AirAnimals />} />
        <Route path="/voda" element={<WaterAnimals />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App;
