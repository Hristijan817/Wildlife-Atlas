// src/pages/QuizPage.jsx
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Lightbulb, Target, TrendingUp, Award, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Custom Confetti Component
function CustomConfetti({ active }) {
  if (!active) return null;
  
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            backgroundColor: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)]
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 100, 
            opacity: 0,
            rotate: p.rotation
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay,
            ease: "easeIn"
          }}
        />
      ))}
    </div>
  );
}

export default function QuizPage() {
  const [allAnimals, setAllAnimals] = useState([]);
  const [target, setTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [winner, setWinner] = useState(false);
  const [hints, setHints] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const inputRef = useRef(null);

  // Habitat label mapping
  const habitatLabels = {
    kopno: 'Kopno',
    voda: 'Voda',
    vozduh: 'Vozduh'
  };

  // Load animals once
  useEffect(() => {
    fetch(`${API}/api/animals`)
      .then((res) => res.json())
      .then((data) => {
        setAllAnimals(data);
        setTarget(data[Math.floor(Math.random() * data.length)]);
      })
      .catch((err) => console.error("Error loading animals:", err));
  }, []);

  const handleGuess = (animal) => {
    if (!target || guesses.find((g) => g._id === animal._id)) return;

    const newGuesses = [...guesses, animal];
    setGuesses(newGuesses);
    setSearch("");

    // Focus back on input
    setTimeout(() => inputRef.current?.focus(), 100);

    // Check win
    if (animal._id === target._id) {
      setTimeout(() => {
        setWinner(true);
        setShowConfetti(true);
        
        // Update stats
        const newGamesPlayed = gamesPlayed + 1;
        const newGamesWon = gamesWon + 1;
        const newStreak = currentStreak + 1;
        const newBest = Math.max(bestStreak, newStreak);
        
        setGamesPlayed(newGamesPlayed);
        setGamesWon(newGamesWon);
        setCurrentStreak(newStreak);
        setBestStreak(newBest);
        
        setTimeout(() => setShowConfetti(false), 4000);
      }, 500);
    } else {
      // Handle hints
      const wrongGuesses = newGuesses.filter((g) => g._id !== target._id).length;

      if (wrongGuesses === 3 && !hints.includes("habitat")) {
        setHints([...hints, "habitat"]);
      } else if (wrongGuesses === 5 && !hints.includes("firstLetter")) {
        setHints([...hints, "firstLetter"]);
      } else if (wrongGuesses === 7 && !hints.includes("family")) {
        setHints([...hints, "family"]);
      }
    }
  };

  const checkMatch = (guessValue, targetValue) => {
    if (!guessValue || !targetValue) return "text-slate-400";
    return guessValue.toLowerCase() === targetValue.toLowerCase()
      ? "bg-green-700/60 text-green-300 font-bold"
      : "bg-red-800/40 text-red-300";
  };

  const filtered = allAnimals.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const resetGame = () => {
    setGuesses([]);
    setWinner(false);
    setHints([]);
    setTarget(allAnimals[Math.floor(Math.random() * allAnimals.length)]);
    setSearch("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const giveUp = () => {
    if (window.confirm("Are you sure you want to give up and see the answer?")) {
      setWinner(true);
      
      // Update stats (loss)
      const newGamesPlayed = gamesPlayed + 1;
      setGamesPlayed(newGamesPlayed);
      setCurrentStreak(0);
    }
  };

  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 sm:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <CustomConfetti active={showConfetti} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Guess the Animal
              </h1>
              <p className="text-slate-400">Can you identify the mystery animal?</p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-cyan-400">{gamesPlayed}</div>
                <div className="text-xs text-slate-400">Played</div>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-emerald-400">{winRate}%</div>
                <div className="text-xs text-slate-400">Win Rate</div>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-amber-400">{currentStreak}</div>
                <div className="text-xs text-slate-400">Streak</div>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-purple-400">{bestStreak}</div>
                <div className="text-xs text-slate-400">Best</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="🔍 Type an animal name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800/80 backdrop-blur-sm border-slate-700 text-white text-lg py-6 pl-6 pr-32 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 transition-all"
              disabled={winner}
              autoFocus
            />
            {!winner && guesses.length > 0 && (
              <Button
                onClick={giveUp}
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                Give Up
              </Button>
            )}
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {search && !winner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-20"
              >
                {filtered.map((animal) => (
                  <motion.div
                    key={animal._id}
                    onClick={() => handleGuess(animal)}
                    whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.6)" }}
                    className="flex items-center gap-4 p-3 cursor-pointer transition border-b border-slate-800 last:border-b-0"
                  >
                    <img
                      src={
                        animal.cardImage?.startsWith("http")
                          ? animal.cardImage
                          : `${API}${animal.cardImage}`
                      }
                      alt={animal.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-600"
                    />
                    <div>
                      <p className="font-medium">{animal.name}</p>
                      <p className="text-xs text-slate-400">{animal.family}</p>
                    </div>
                  </motion.div>
                ))}
                {filtered.length === 0 && (
                  <p className="p-4 text-center text-slate-400">No animals found</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress Indicator */}
        {guesses.length > 0 && !winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Attempts: {guesses.length}
              </span>
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Hints: {hints.length}/3
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((guesses.length / 10) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Hints */}
        <AnimatePresence>
          {hints.length > 0 && target && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-cyan-300">
                  <Lightbulb className="w-6 h-6" />
                  Hints
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {hints.includes("habitat") && (
                      <motion.div
                        key="habitat"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl"
                      >
                        <span className="text-2xl">🌍</span>
                        <div>
                          <span className="text-slate-400">Habitat: </span>
                          <span className="font-bold text-emerald-300">
                            {habitatLabels[target.habitat] || target.habitat}
                          </span>
                        </div>
                      </motion.div>
                    )}
                    {hints.includes("firstLetter") && (
                      <motion.div
                        key="firstLetter"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl"
                      >
                        <span className="text-2xl">🔤</span>
                        <div>
                          <span className="text-slate-400">First letter: </span>
                          <span className="font-bold text-cyan-300 text-2xl">
                            {target.name[0].toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                    )}
                    {hints.includes("family") && (
                      <motion.div
                        key="family"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl"
                      >
                        <span className="text-2xl">🧬</span>
                        <div>
                          <span className="text-slate-400">Family: </span>
                          <span className="font-bold text-purple-300">{target.family}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guess Table */}
        <AnimatePresence>
          {guesses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-x-auto rounded-2xl border border-slate-700 shadow-2xl"
            >
              <table className="w-full bg-slate-900/50 backdrop-blur-sm">
                <thead className="bg-slate-800/80 text-slate-300">
                  <tr>
                    <th className="p-4 text-left font-semibold">Animal</th>
                    <th className="p-4 text-left font-semibold">Family</th>
                    <th className="p-4 text-left font-semibold">Habitat</th>
                    <th className="p-4 text-left font-semibold">Lifespan</th>
                    <th className="p-4 text-left font-semibold">Diet</th>
                    <th className="p-4 text-left font-semibold">Prey</th>
                    <th className="p-4 text-left font-semibold">Predators</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {[...guesses].reverse().map((g, idx) => (
                      <motion.tr
                        key={g._id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                g.cardImage?.startsWith("http")
                                  ? g.cardImage
                                  : `${API}${g.cardImage}`
                              }
                              alt={g.name}
                              className="w-12 h-12 rounded-lg border border-slate-600 object-cover"
                            />
                            <span className="font-medium">{g.name}</span>
                          </div>
                        </td>
                        <td className={`p-4 rounded-lg ${checkMatch(g.family, target?.family)}`}>
                          {g.family || "—"}
                        </td>
                        <td className={`p-4 rounded-lg ${checkMatch(g.habitat, target?.habitat)}`}>
                          {habitatLabels[g.habitat] || g.habitat || "—"}
                        </td>
                        <td className={`p-4 rounded-lg ${checkMatch(g.lifespan, target?.lifespan)}`}>
                          {g.lifespan || "—"}
                        </td>
                        <td className={`p-4 rounded-lg ${checkMatch(g.diet, target?.diet)}`}>
                          {g.diet || "—"}
                        </td>
                        <td className={`p-4 rounded-lg ${checkMatch(g.prey, target?.prey)}`}>
                          {g.prey || "—"}
                        </td>
                        <td className={`p-4 rounded-lg ${checkMatch(g.predators, target?.predators)}`}>
                          {g.predators || "—"}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Winner Modal */}
        <AnimatePresence>
          {winner && target && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl border border-slate-700 max-w-md w-full"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/50"
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {guesses[guesses.length - 1]?._id === target._id ? "Congratulations!" : "Game Over"}
                </h2>

                <img
                  src={
                    target.cardImage?.startsWith("http")
                      ? target.cardImage
                      : `${API}${target.cardImage}`
                  }
                  alt={target.name}
                  className="w-48 h-48 object-cover rounded-2xl border-2 border-slate-600 mx-auto mb-6 shadow-xl"
                />

                <p className="text-lg text-slate-300 mb-2">
                  The animal was{" "}
                  <span className="font-bold text-white text-xl">{target.name}</span>
                </p>

                {guesses[guesses.length - 1]?._id === target._id && (
                  <div className="flex gap-4 justify-center mb-6 text-sm">
                    <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                      <div className="text-emerald-400 font-bold">{guesses.length}</div>
                      <div className="text-slate-400">Guesses</div>
                    </div>
                    <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                      <div className="text-cyan-400 font-bold">{hints.length}</div>
                      <div className="text-slate-400">Hints Used</div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}