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

/**
 * Reusable animal card
 * Props:
 *  - animal: the animal object
 *  - index: index for stagger animation
 *  - gradient: tailwind gradient class for prism border
 *  - textColor: tailwind text color for title
 *  - buttonGradient: tailwind gradient class for the button
 */
export default function AnimalCard({
  animal,
  index = 0,
  gradient = "bg-gradient-to-r from-slate-400 via-slate-300 to-slate-500",
  textColor = "text-slate-800",
  buttonGradient = "bg-gradient-to-r from-slate-600 to-slate-700",
}) {
  const imgSrc = buildImgSrc(animal.cardImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden relative group rounded-3xl border-2 border-transparent bg-white/30 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Prism/glass border */}
        <div className={`absolute inset-0 rounded-3xl p-[2px] ${gradient} opacity-70 group-hover:opacity-100 blur-sm`} />
        <div className="relative rounded-3xl h-full w-full bg-white/70 backdrop-blur-md">
          <img
            src={imgSrc}
            alt={animal.name}
            className="w-full h-48 object-cover rounded-t-3xl"
            onError={(e) => {
              if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
            }}
          />
          <CardContent className="p-5">
            <h2 className={`text-xl font-semibold mb-2 ${textColor}`}>{animal.name}</h2>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {animal.summary || "Без опис."}
            </p>
            <Link to={`/animals/${animal._id}`}>
              <Button className={`w-full text-white rounded-xl shadow hover:opacity-90 ${buttonGradient}`}>
                Детали
              </Button>
            </Link>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
