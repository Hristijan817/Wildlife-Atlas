// src/pages/WaterAnimals.jsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AnimalCard from "@/components/AnimalCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3x3, LayoutGrid, SlidersHorizontal, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function WaterAnimals() {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dietFilter, setDietFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/animals?habitat=voda`)
      .then((res) => res.json())
      .then((data) => {
        const featured = Array.isArray(data)
          ? data.filter((a) => a.featured !== false)
          : [];
        setAnimals(featured);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching animals:", err);
        setLoading(false);
      });
  }, []);

  // Filtering + sorting
  const filtered = animals
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    .filter((a) => {
      if (dietFilter === "all") return true;
      return a.diet?.toLowerCase().includes(dietFilter.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "lifespan") {
        const aLife = parseInt(a.lifespan) || 0;
        const bLife = parseInt(b.lifespan) || 0;
        return bLife - aLife;
      }
      return 0;
    });

  // Unique diet types
  const dietTypes = ["all", ...new Set(animals.map((a) => a.diet).filter(Boolean))];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-cyan-900/60 to-slate-950"></div>
        <motion.img
          src="/wateranimals-hero.jpg"
          alt="Water Animals Background"
          className="w-full h-full object-cover opacity-90"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-transparent to-slate-950/95" />

        {/* Floating bubbles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-cyan-300/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center pt-20 pb-12 px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-4 px-6 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full backdrop-blur-sm"
        >
          <span className="text-cyan-300 text-sm font-semibold tracking-wider">
            🌊 ВОДНИ ЖИВОТНИ
          </span>
        </motion.div>

        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
          Животни во Вода
        </h1>

        <p className="text-xl text-cyan-100/90 max-w-3xl mx-auto leading-relaxed mb-8 drop-shadow-lg">
          Откријте го светот на водните животни и нивната уникатна разновидност – од коралните рифови до длабоките океани.
        </p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-8 flex-wrap"
        >
          <div className="bg-cyan-800/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-cyan-500/30">
            <div className="text-3xl font-bold text-sky-300">{animals.length}</div>
            <div className="text-sm text-cyan-200">Видови</div>
          </div>
          <div className="bg-cyan-800/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-cyan-500/30">
            <div className="text-3xl font-bold text-sky-300">{filtered.length}</div>
            <div className="text-sm text-cyan-200">Прикажани</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Control Bar */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-slate-950/80 border-b border-cyan-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
              <Input
                type="text"
                placeholder="Пребарај животни..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 backdrop-blur-md bg-cyan-900/30 border border-cyan-400/50 text-white placeholder:text-cyan-200/60 shadow-lg rounded-xl focus:ring-2 focus:ring-sky-400 h-12"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3 items-center">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-cyan-900/40 border border-cyan-400/30 rounded-xl text-cyan-100 cursor-pointer hover:bg-cyan-900/60 transition-colors backdrop-blur-sm"
              >
                <option value="name">Име</option>
                <option value="lifespan">Животен век</option>
              </select>

              {/* Filter Toggle */}
              <Button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`${filterOpen ? "bg-cyan-600" : "bg-cyan-900/40"} hover:bg-cyan-600 border border-cyan-400/30 backdrop-blur-sm`}
              >
                <SlidersHorizontal size={18} className="mr-2" />
                Филтер
              </Button>

              {/* View mode */}
              <div className="flex gap-2 bg-cyan-900/40 border border-cyan-400/30 rounded-xl p-1 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-cyan-600 text-white" : "text-cyan-300 hover:text-white"
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "compact" ? "bg-cyan-600 text-white" : "text-cyan-300 hover:text-white"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-cyan-500/20">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-cyan-300 text-sm font-semibold mr-2">Исхрана:</span>
                    {dietTypes.map((diet) => (
                      <button
                        key={diet}
                        onClick={() => setDietFilter(diet)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          dietFilter === diet
                            ? "bg-sky-400 text-slate-900"
                            : "bg-cyan-800/40 text-cyan-200 hover:bg-cyan-700/60"
                        }`}
                      >
                        {diet === "all" ? "Сите" : diet}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-500/30 border-t-sky-400 rounded-full"
          />
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <motion.div
          layout
          className={`relative z-10 max-w-7xl mx-auto px-4 py-12 grid gap-8 ${
            viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((animal, index) => (
              <motion.div
                key={animal._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AnimalCard
                  animal={animal}
                  index={index}
                  gradient="bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-400"
                  textColor="text-white"
                  buttonGradient="bg-gradient-to-r from-cyan-500 to-sky-600"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center py-20"
        >
          <div className="bg-cyan-800/20 backdrop-blur-md border border-cyan-400/30 rounded-3xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-cyan-200 mb-2">Нема резултати</h3>
            <p className="text-cyan-300/80 mb-6">Пробајте со различни критериуми за пребарување</p>
            <Button
              onClick={() => {
                setSearch("");
                setDietFilter("all");
              }}
              className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white"
            >
              Ресетирај филтри
            </Button>
          </div>
        </motion.div>
      )}

      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-sky-500 to-cyan-500 text-white p-4 rounded-full shadow-2xl hover:shadow-sky-500/50 transition-all hover:scale-110 z-30"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}
