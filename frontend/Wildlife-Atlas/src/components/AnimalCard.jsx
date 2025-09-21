import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const API_RAW = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = API_RAW.endsWith("/") ? API_RAW.slice(0, -1) : API_RAW;
const PLACEHOLDER = "https://via.placeholder.com/400?text=No+Image";

function buildImgSrc(cardImage) {
  if (!cardImage) return PLACEHOLDER;
  if (/^(https?:)?\/\//i.test(cardImage) || cardImage.startsWith("data:")) return cardImage;
  if (cardImage.startsWith("/")) return `${API}${cardImage}`;
  return `${API}/${cardImage}`;
}

export default function AnimalCard({
  animal,
  index = 0,
  gradient = "bg-gradient-to-r from-emerald-600 via-green-500 to-amber-700",
  textColor = "text-white",
  buttonGradient = "bg-gradient-to-r from-amber-700 to-emerald-600",
}) {
  const imgSrc = buildImgSrc(animal.cardImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden relative group rounded-3xl border border-emerald-800/40 bg-emerald-900/60 backdrop-blur-sm shadow-lg transition-all duration-500 hover:-translate-y-2">
        {/* Animated glow border */}
        <motion.div
          className={`absolute inset-0 rounded-3xl p-[1px] ${gradient} opacity-40 blur-sm`}
          whileHover={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative rounded-3xl h-full w-full">
          {/* Image with overlay + zoom on hover */}
          <div className="relative overflow-hidden rounded-t-3xl">
            <motion.img
              src={imgSrc}
              alt={animal.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                if (e.currentTarget.src !== PLACEHOLDER)
                  e.currentTarget.src = PLACEHOLDER;
              }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>

          {/* Content */}
          <CardContent className="p-5">
            <h2
              className={`text-2xl font-bold mb-2 tracking-wide drop-shadow-sm ${textColor}`}
            >
              {animal.name}
            </h2>
            <p className="text-sm text-stone-200/90 line-clamp-2 mb-4">
              {animal.summary || "Без опис."}
            </p>

            <Link to={`/animals/${animal._id}`}>
              <Button
                className={`w-full text-white rounded-xl font-medium shadow hover:opacity-90 transition ${buttonGradient}`}
              >
                Детали
              </Button>
            </Link>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
