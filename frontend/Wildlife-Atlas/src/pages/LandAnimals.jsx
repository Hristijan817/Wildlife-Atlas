import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AnimalCard from "@/components/AnimalCard";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LandAnimals() {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/api/animals?habitat=kopno`)
      .then((res) => res.json())
      .then((data) => {
        const featured = Array.isArray(data)
          ? data.filter((a) => a.featured !== false)
          : [];
        setAnimals(featured);
      })
      .catch((err) => console.error("Error fetching animals:", err));
  }, []);

  const filtered = animals.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center py-16"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-lime-300 via-emerald-100 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
          Животни на Копно
        </h1>
        <p className="text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Истражете ја разновидноста на животните што живеат на копно.
        </p>
      </motion.div>

      {/* Animated Divider */}
      <motion.div
        className="max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent my-12"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Search Bar */}
      <div className="relative z-10 max-w-md mx-auto mb-12">
        <Input
          type="text"
          placeholder="🔍 Пребарај животни на копно..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="backdrop-blur-md bg-emerald-700/30 border border-emerald-400/50 text-white placeholder:text-emerald-200 shadow-lg rounded-2xl focus:ring-2 focus:ring-lime-400"
        />
      </div>

      {/* Animated Divider */}
      <motion.div
        className="max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent my-12"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Cards Grid */}
      <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6 pb-20">
        {filtered.map((animal, index) => (
          <AnimalCard
            key={animal._id}
            animal={animal}
            index={index}
            gradient="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400"
            textColor="text-white"
            buttonGradient="bg-gradient-to-r from-emerald-500 to-green-600"
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="relative z-10 text-center text-emerald-200 mt-12">
          Нема додадени животни во оваа категорија.
        </p>
      )}
    </div>
  );
}
