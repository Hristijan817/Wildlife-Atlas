import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import AnimalCard from "@/components/AnimalCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function WaterAnimals() {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/api/animals?habitat=voda`)
      .then((res) => res.json())
      .then((data) => {
        const featured = Array.isArray(data) ? data.filter((a) => a.featured !== false) : [];
        setAnimals(featured);
      })
      .catch((err) => console.error("Error fetching animals:", err));
  }, []);

  const filtered = useMemo(
    () => animals.filter((a) => a.name?.toLowerCase().includes(search.toLowerCase())),
    [animals, search]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-200 via-white to-blue-100 py-12 px-6 relative overflow-hidden">
      {/* Decorative bubbles */}
      <div className="absolute top-28 left-16 w-36 h-36 bg-cyan-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-24 right-16 w-60 h-60 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />

      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 drop-shadow-sm">
        🌊 Животни во Вода
      </h1>

      {/* Search */}
      <div className="max-w-md mx-auto mb-12">
        <Input
          type="text"
          placeholder="Пребарај водни животни..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="backdrop-blur-md bg-white/40 border border-blue-200/50 shadow-lg rounded-2xl"
        />
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {filtered.map((animal, index) => (
          <AnimalCard
            key={animal._id}
            animal={animal}
            index={index}
            gradient="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500"
            textColor="text-blue-800"
            buttonGradient="bg-gradient-to-r from-cyan-500 to-blue-600"
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-600 mt-12">
          Нема додадени животни во оваа категорија.
        </p>
      )}
    </div>
  );
}
