import React from "react";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";

import Home from "./pages/Home";
import LandAnimals from "./pages/LandAnimals";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kopno" element={<LandAnimals />} />
      </Routes>
    </Router>
  )
}

export default App;
