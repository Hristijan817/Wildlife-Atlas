import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AnimalCard from "@/components/AnimalCard";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AirAnimals() {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/api/animals?habitat=vozduh`)
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
    <div className="relative min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 text-sky-900 overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center py-16"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-sky-700 via-sky-500 to-cyan-600 bg-clip-text text-transparent drop-shadow-md">
          Животни во Воздух
        </h1>
        <p className="text-lg text-sky-800 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
          Запознајте ги животните што го населуваат небесниот простор.
        </p>
      </motion.div>

      {/* Animated Divider */}
      <motion.div
        className="max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent my-12"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Search Bar */}
      <div className="relative z-10 max-w-md mx-auto mb-12">
        <Input
          type="text"
          placeholder="🔍 Пребарај животни во воздух..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="backdrop-blur-md bg-sky-100/70 border border-sky-300 text-sky-900 placeholder:text-sky-600 shadow-lg rounded-2xl focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Animated Divider */}
      <motion.div
        className="max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent my-12"
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
            gradient="bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-300"
            textColor="text-sky-900"
            buttonGradient="bg-gradient-to-r from-sky-500 to-cyan-600"
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="relative z-10 text-center text-sky-700 mt-12">
          Нема додадени животни во оваа категорија.
        </p>
      )}
    </div>
  );
}
