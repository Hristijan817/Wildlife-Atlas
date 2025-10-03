// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/auth";
import NavBar from "@/components/NavBar";

import Home from "@/pages/Home";
import HabitatPage from "@/pages/HabitatPage";
import AnimalDetails from "@/pages/AnimalDetails";
import AdminDashboard from "@/pages/AdminDashboard";
import AddAnimal from "@/pages/AddAnimal";
import LoginPage from "@/pages/LoginPage";
import AirAnimals from "./pages/AirAnimals";
import WaterAnimals from "./pages/WaterAnimals";
import LandAnimals from "./pages/LandAnimals";
import AnimalEdit from "./components/AnimalEdit";
import ComparePage from "@/pages/ComparePage";
import QuizPage from "@/pages/QuizPage";   // 🆕 Import QuizPage

// 🆕 Scroll reset helper
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => {
  return (
    <Router>
      <AuthProvider
        apiUrl={import.meta.env.VITE_API_URL || "http://localhost:5000"}
      >
        {/* Navbar always visible */}
        <NavBar />

        {/* ScrollToTop works silently in the background */}
        <ScrollToTop />

        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Habitat pages */}
          <Route path="/kopno" element={<LandAnimals habitat="kopno" />} />
          <Route path="/voda" element={<WaterAnimals habitat="voda" />} />
          <Route path="/vozduh" element={<AirAnimals habitat="vozduh" />} />

          {/* Compare Page */}
          <Route path="/compare" element={<ComparePage />} />

          {/* 🆕 Quiz Page */}
          <Route path="/quiz" element={<QuizPage />} />

          {/* Animal details */}
          <Route path="/animals/:id" element={<AnimalDetails />} />
          <Route
            path="/animals/:id/edit"
            element={
              <ProtectedRoute>
                <AnimalEdit />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute>
                <AddAnimal />
              </ProtectedRoute>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
