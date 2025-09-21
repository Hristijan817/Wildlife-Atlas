import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AnimalCard from "@/components/AnimalCard";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function WaterAnimals() {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/api/animals?habitat=voda`)
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
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background image behind everything */}
      <div className="absolute inset-0 -z-10">
        <img
          src='/wateranimals-hero.jpg'
          alt="Water Animals Background"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/60 to-cyan-950/90" />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center py-16"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
          Животни во Вода
        </h1>
        <p className="text-lg text-cyan-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Откријте го светот на водните животни и нивната уникатна разновидност.
        </p>
      </motion.div>

      {/* Animated Divider */}
      <motion.div
        className="max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent my-12"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Search Bar */}
      <div className="relative z-10 max-w-md mx-auto mb-12">
        <Input
          type="text"
          placeholder="🔍 Пребарај животни во вода..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="backdrop-blur-md bg-blue-800/30 border border-cyan-400/50 text-white placeholder:text-cyan-200 shadow-lg rounded-2xl focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6 pb-20">
        {filtered.map((animal, index) => (
          <AnimalCard
            key={animal._id}
            animal={animal}
            index={index}
            gradient="bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-400"
            textColor="text-white"
            buttonGradient="bg-gradient-to-r from-cyan-500 to-sky-600"
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="relative z-10 text-center text-cyan-200 mt-12">
          Нема додадени животни во оваа категорија.
        </p>
      )}
    </div>
  );
}
