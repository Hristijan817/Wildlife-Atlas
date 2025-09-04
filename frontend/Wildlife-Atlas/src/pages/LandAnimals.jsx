import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AnimalCard from "@/components/AnimalCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LandAnimals() {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/api/animals?habitat=kopno`)
      .then((res) => res.json())
      .then((data) => {
        const featured = Array.isArray(data) ? data.filter((a) => a.featured !== false) : [];
        setAnimals(featured);
      })
      .catch((err) => console.error("Error fetching animals:", err));
  }, []);

  const filtered = animals.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-white to-emerald-100 py-12 px-6 relative overflow-hidden">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500 drop-shadow-sm">
        🌱 Животни на Копно
      </h1>

      {/* Search */}
      <div className="max-w-md mx-auto mb-12">
        <Input
          type="text"
          placeholder="Пребарај животни на копно..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="backdrop-blur-md bg-white/40 border border-green-200/50 shadow-lg rounded-2xl"
        />
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {filtered.map((animal, index) => (
          <AnimalCard
            key={animal._id}
            animal={animal}
            index={index}
            gradient="bg-gradient-to-r from-green-500 via-lime-300 to-emerald-500"
            textColor="text-green-800"
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
