import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-white to-sky-50 py-12 px-6 relative overflow-hidden">
      {/* Decorative floating circles */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-sky-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" />

      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-500 drop-shadow-sm">
        🌬️ Животни во Воздух
      </h1>

      {/* Search */}
      <div className="max-w-md mx-auto mb-12">
        <Input
          type="text"
          placeholder="Пребарај птици и животни во воздухот..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="backdrop-blur-md bg-white/40 border border-sky-200/50 shadow-lg rounded-2xl"
        />
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {filtered.map((animal, index) => (
          <motion.div
            key={animal._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden relative group rounded-3xl border-2 border-transparent bg-white/30 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              {/* Prism/glass border */}
              <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-sky-400 via-pink-300 to-indigo-400 opacity-70 group-hover:opacity-100 blur-sm" />
              <div className="relative rounded-3xl h-full w-full bg-white/70 backdrop-blur-md">
                <img
                  src={animal.cardImage || "https://via.placeholder.com/400"}
                  alt={animal.name}
                  className="w-full h-48 object-cover rounded-t-3xl"
                />
                <CardContent className="p-5">
                  <h2 className="text-xl font-semibold text-sky-800 mb-2">
                    {animal.name}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {animal.summary || "Без опис."}
                  </p>
                  <Link to={`/animals/${animal._id}`}>
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl shadow hover:opacity-90">
                      Детали
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-600 mt-12">
          Нема додадени животни во оваа категорија.
        </p>
      )}
    </div>
  );
}
