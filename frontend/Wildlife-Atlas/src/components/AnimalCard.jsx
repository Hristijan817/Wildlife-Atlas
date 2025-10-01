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
      // Remove if already in compare list
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
      <Card className="overflow-hidden relative group h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Animated gradient border */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${habitatConfig.color} opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500`}
        />

        {/* Floating habitat badge */}
        <div className="absolute top-4 left-4 z-20">
          <motion.div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${habitatConfig.bgColor} backdrop-blur-sm border border-gray-600/30`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <span className="text-sm">{habitatConfig.icon}</span>
            <span className={`text-xs font-medium ${habitatConfig.textColor} uppercase tracking-wider`}>
              {animal.habitat}
            </span>
          </motion.div>
        </div>

        <div className="relative h-full flex flex-col">
          {/* Image Section */}
          <div className="relative overflow-hidden h-48">
            <motion.img
              src={imgSrc}
              alt={animal.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.currentTarget.src !== PLACEHOLDER)
                  e.currentTarget.src = PLACEHOLDER;
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-60" />
          </div>

          {/* Content Section */}
          <CardContent className="flex-1 flex flex-col p-6 space-y-4">
            {/* Title */}
            <motion.h2
              className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300 leading-tight"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              {animal.name}
            </motion.h2>

            {/* Summary */}
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
              {animal.summary || "Без опис."}
            </p>

            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-2">
              {animal.type && (
                <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/30">
                  {animal.type}
                </span>
              )}
              {animal.size && (
                <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/30">
                  {animal.size}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              <Link to={`/animals/${animal._id}`} className="flex-1">
                <Button
                  className={`w-full bg-gradient-to-r ${habitatConfig.color} text-white font-semibold rounded-xl py-3 
                             hover:opacity-90 hover:shadow-lg transition-all duration-300 
                             group-hover:shadow-2xl group-hover:scale-[1.02]`}
                >
                  <motion.span
                    className="flex items-center justify-center gap-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Детали
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.div>
                  </motion.span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1 border-cyan-400 text-cyan-300 hover:bg-cyan-600/20 rounded-xl"
                onClick={handleCompare}
              >
                Спореди
              </Button>
            </div>
          </CardContent>
        </div>

        {/* Subtle corner decoration */}
        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5">
          <div className={`w-full h-full bg-gradient-to-tl ${habitatConfig.color} rounded-tl-full`} />
        </div>
      </Card>
    </motion.div>
  );
}
