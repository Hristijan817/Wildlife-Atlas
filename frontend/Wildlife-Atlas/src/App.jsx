import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/auth";


import NavBar from "@/components/NavBar";

import Home from "./pages/Home";
import LandAnimals from "./pages/LandAnimals";
import AirAnimals from "./pages/AirAnimals";
import WaterAnimals from "./pages/WaterAnimals";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <Router>
      
        <AuthProvider apiUrl={import.meta.env.VITE_API_URL || "http://localhost:5000"}>
          {/* NavBar (contains ThemeToggle) */}
          <NavBar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kopno" element={<LandAnimals />} />
            <Route path="/vozduh" element={<AirAnimals />} />
            <Route path="/voda" element={<WaterAnimals />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      
    </Router>
  );
};

export default App;
