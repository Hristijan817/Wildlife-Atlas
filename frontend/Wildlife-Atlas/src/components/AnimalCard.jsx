// src/components/AnimalCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const API_RAW = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = API_RAW.endsWith("/") ? API_RAW.slice(0, -1) : API_RAW;
const PLACEHOLDER = "https://via.placeholder.com/400?text=No+Image";

// Habitat icons and colors mapping
const HABITAT_CONFIG = {
  kopno: { 
    icon: "🌲", 
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-200"
  },
  voda: { 
    icon: "🌊", 
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-200"
  },
  vozduh: { 
    icon: "🪶", 
    color: "from-sky-500 to-indigo-600",
    bgColor: "bg-sky-500/20",
    textColor: "text-sky-200"
  }
};

function buildImgSrc(cardImage) {
  if (!cardImage) return PLACEHOLDER;
  if (/^(https?:)?\/\//i.test(cardImage) || cardImage.startsWith("data:")) return cardImage;
  if (cardImage.startsWith("/")) return `${API}${cardImage}`;
  return `${API}/${cardImage}`;
}

export default function AnimalCard({ animal, index = 0 }) {
  const imgSrc = buildImgSrc(animal.cardImage);
  const habitatConfig = HABITAT_CONFIG[animal.habitat] || HABITAT_CONFIG.kopno;
  const navigate = useNavigate();

  const handleCompare = () => {
    let stored = JSON.parse(localStorage.getItem("compareList")) || [];
    if (stored.some((a) => a._id === animal._id)) {
      stored = stored.filter((a) => a._id !== animal._id);
    } else {
      if (stored.length >= 3) {
        alert("Можете да споредите најмногу 3 животни!");
        return;
      }
      stored.push(animal);
    }
    localStorage.setItem("compareList", JSON.stringify(stored));
    navigate("/compare");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="overflow-hidden relative group h-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Animated gradient border on hover */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${habitatConfig.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        <div className="relative h-full flex flex-col">
          {/* Image Section - Takes most of the space */}
          <div className="relative overflow-hidden h-80">
            <motion.img
              src={imgSrc}
              alt={animal.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.currentTarget.src !== PLACEHOLDER)
                  e.currentTarget.src = PLACEHOLDER;
              }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Strong gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
            
            {/* Name overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.h2
                className="text-3xl font-bold text-white drop-shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {animal.name}
              </motion.h2>
            </div>

            {/* Subtle habitat indicator */}
            <div className="absolute top-4 right-4">
              <motion.div 
                className={`w-10 h-10 rounded-full ${habitatConfig.bgColor} backdrop-blur-md border border-gray-600/30 flex items-center justify-center`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-lg">{habitatConfig.icon}</span>
              </motion.div>
            </div>
          </div>

          {/* Compact Action Buttons */}
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Link to={`/animals/${animal._id}`} className="flex-1">
                <Button
                  className={`w-full bg-gradient-to-r ${habitatConfig.color} text-white font-semibold rounded-xl py-3 
                             hover:opacity-90 hover:shadow-lg transition-all duration-300`}
                >
                  <motion.span
                    className="flex items-center justify-center gap-2"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    Детали
                    <span className="text-sm">→</span>
                  </motion.span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 rounded-xl py-3 font-semibold transition-all duration-300"
                onClick={handleCompare}
              >
                Спореди
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}