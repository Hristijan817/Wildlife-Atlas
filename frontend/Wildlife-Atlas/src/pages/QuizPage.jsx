// src/pages/QuizPage.jsx
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Lightbulb, Target, TrendingUp, Award, X, ChevronUp, ChevronDown, Flame, Zap, Clock, Share2, BookOpen, Play, Pause } from "lucide-react";

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

// Toast Notification Component
function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Info Modal Component
function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Како да играш</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4 text-slate-300">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">🎯 Цел</h3>
            <p>Погоди ја мистериозната животна со споредување на карактеристиките!</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">🎮 Начин на игра</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Внеси име на животно и избери го од паѓачкото мени</li>
              <li>Спореди ги атрибутите со мистериозната животна</li>
              <li><span className="bg-green-600 px-2 py-1 rounded">Зелена</span> значи точно совпаѓање</li>
              <li><span className="bg-amber-600 px-2 py-1 rounded">Портокалова со стрелки</span> значи блиску (повисоко/пониско)</li>
              <li><span className="bg-slate-700 px-2 py-1 rounded">Сива</span> значи нема совпаѓање</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">💡 Помош</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>По 3 погрешни обиди: Откриен живеалиште</li>
              <li>По 5 погрешни обиди: Откриена прва буква</li>
              <li>По 7 погрешни обиди: Откриено семејство</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">🏆 Достигнувања</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Совршено: Погоди на прв обид</li>
              <li>Неверојатно: Под 3 обиди</li>
              <li>Гради серии за специјални награди!</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 py-6 text-lg font-semibold"
        >
          Разбрав!
        </Button>
      </motion.div>
    </motion.div>
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
  const [toast, setToast] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const inputRef = useRef(null);

  // Habitat label mapping
  const habitatLabels = {
    kopno: 'Копно',
    voda: 'Вода',
    vozduh: 'Воздух'
  };

  // Timer for game duration
  useEffect(() => {
    if (startTime && !winner && !isPaused) {
      const interval = setInterval(() => {
        setGameTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, winner, isPaused]);

  // Load animals once
  useEffect(() => {
    fetch(`${API}/api/animals`)
      .then((res) => res.json())
      .then((data) => {
        setAllAnimals(data);
        const randomAnimal = data[Math.floor(Math.random() * data.length)];
        setTarget(randomAnimal);
      })
      .catch((err) => console.error("Грешка при вчитување на животни:", err));
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setIsPaused(false);
    setStartTime(Date.now() - (gameTime * 1000));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const togglePause = () => {
    if (isPaused) {
      setStartTime(Date.now() - (gameTime * 1000));
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const handleGuess = (animal) => {
    if (!gameStarted) {
      setToast({ message: "Кликни ЗАПОЧНИ за да ја започнеш играта!", type: "error" });
      return;
    }
    
    if (!target || guesses.find((g) => g._id === animal._id)) {
      setToast({ message: "Веќе ја погоди оваа животна!", type: "error" });
      return;
    }

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
        
        // Achievement toasts
        if (newGuesses.length === 1) {
          setTimeout(() => setToast({ message: "🎯 СОВРШЕНО! Прв обид!", type: "success" }), 1000);
        } else if (newGuesses.length <= 3) {
          setTimeout(() => setToast({ message: "🌟 Неверојатно! Под 3 обиди!", type: "success" }), 1000);
        }
        
        if (newStreak === 5) {
          setTimeout(() => setToast({ message: "🔥 5 ПОБЕДИ ВО НИЗ!", type: "success" }), 1500);
        } else if (newStreak === 10) {
          setTimeout(() => setToast({ message: "⚡ 10 ПОБЕДИ ВО НИЗ! НЕВЕРОЈАТНО!", type: "success" }), 1500);
        }
        
        setTimeout(() => setShowConfetti(false), 4000);
      }, 500);
    } else {
      // Handle hints
      const wrongGuesses = newGuesses.filter((g) => g._id !== target._id).length;

      if (wrongGuesses === 3 && !hints.includes("habitat")) {
        setHints([...hints, "habitat"]);
        setToast({ message: "💡 Помош отклучена: Откриено живеалиште!", type: "info" });
      } else if (wrongGuesses === 5 && !hints.includes("firstLetter")) {
        setHints([...hints, "firstLetter"]);
        setToast({ message: "💡 Помош отклучена: Откриена прва буква!", type: "info" });
      } else if (wrongGuesses === 7 && !hints.includes("family")) {
        setHints([...hints, "family"]);
        setToast({ message: "💡 Помош отклучена: Откриено семејство!", type: "info" });
      }
    }
  };

  const checkMatch = (guessValue, targetValue) => {
    if (!guessValue || !targetValue) return "text-slate-400";
    return guessValue.toLowerCase() === targetValue.toLowerCase()
      ? "bg-green-600/80 text-white font-bold"
      : "bg-slate-700/60 text-slate-200";
  };

  const compareNumeric = (guessValue, targetValue) => {
    if (!guessValue || !targetValue) return { match: "none", arrow: null };
    
    const guessNum = parseInt(guessValue);
    const targetNum = parseInt(targetValue);
    
    if (isNaN(guessNum) || isNaN(targetNum)) {
      return { 
        match: guessValue.toLowerCase() === targetValue.toLowerCase() ? "exact" : "none",
        arrow: null 
      };
    }
    
    if (guessNum === targetNum) return { match: "exact", arrow: null };
    if (guessNum < targetNum) return { match: "close", arrow: "up" };
    return { match: "close", arrow: "down" };
  };

  const getNumericClassName = (comparison) => {
    if (comparison.match === "exact") return "bg-green-600/80 text-white font-bold";
    if (comparison.match === "close") return "bg-amber-600/60 text-white font-semibold";
    return "bg-slate-700/60 text-slate-200";
  };

  const filtered = allAnimals.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) &&
    !guesses.find((g) => g._id === a._id)
  );

  const resetGame = () => {
    setGuesses([]);
    setWinner(false);
    setHints([]);
    setGameTime(0);
    setIsPaused(true);
    setGameStarted(false);
    setTarget(allAnimals[Math.floor(Math.random() * allAnimals.length)]);
    setSearch("");
    setStartTime(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const giveUp = () => {
    if (window.confirm("Дали си сигурен дека сакаш да се откажеш и да го видиш одговорот?")) {
      setWinner(true);
      
      // Update stats (loss)
      const newGamesPlayed = gamesPlayed + 1;
      setGamesPlayed(newGamesPlayed);
      setCurrentStreak(0);
      setToast({ message: "Повеќе среќа следниот пат!", type: "info" });
    }
  };

  const shareResults = () => {
    const resultsText = `🐾 Погоди го Животното 🐾\n${winner && guesses[guesses.length - 1]?._id === target._id ? '✅' : '❌'} ${guesses.length} обиди | ${hints.length} помош | ${gameTime}с\nСерија: ${currentStreak} 🔥`;
    
    if (navigator.share) {
      navigator.share({ text: resultsText });
    } else {
      navigator.clipboard.writeText(resultsText);
      setToast({ message: "Резултатите се копирани!", type: "success" });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Погоди го Животното
                </h1>
                <Button
                  onClick={() => setShowInfoModal(true)}
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <BookOpen className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-slate-400">Можеш ли да ја идентификуваш мистериозната животна?</p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2 text-center cursor-pointer"
              >
                <div className="text-2xl font-bold text-cyan-400">{gamesPlayed}</div>
                <div className="text-xs text-slate-400">Играни</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2 text-center cursor-pointer"
              >
                <div className="text-2xl font-bold text-emerald-400">{winRate}%</div>
                <div className="text-xs text-slate-400">Победи</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2 text-center cursor-pointer relative"
              >
                <div className="text-2xl font-bold text-amber-400 flex items-center gap-1 justify-center">
                  {currentStreak}
                  {currentStreak > 0 && <Flame className="w-4 h-4" />}
                </div>
                <div className="text-xs text-slate-400">Серија</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2 text-center cursor-pointer"
              >
                <div className="text-2xl font-bold text-purple-400">{bestStreak}</div>
                <div className="text-xs text-slate-400">Најдобра</div>
              </motion.div>
            </div>
          </div>

          {/* Game Timer */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono">{formatTime(gameTime)}</span>
            </div>
            
            {!gameStarted ? (
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                ЗАПОЧНИ
              </Button>
            ) : (
              <Button
                onClick={togglePause}
                variant="ghost"
                className="bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-white px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2"
                disabled={winner}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Продолжи
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Пауза
                  </>
                )}
              </Button>
            )}
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
              placeholder="🔍 Внеси име на животно..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800/80 backdrop-blur-sm border-slate-700 text-white text-lg py-6 pl-6 pr-32 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 transition-all"
              disabled={winner || !gameStarted || isPaused}
              autoFocus
            />
            {!winner && guesses.length > 0 && (
              <Button
                onClick={giveUp}
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                Откажи се
              </Button>
            )}
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {search && !winner && gameStarted && !isPaused && (
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
                  <p className="p-4 text-center text-slate-400">Не се најдени животни</p>
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
                Обиди: {guesses.length}
              </span>
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Помош: {hints.length}/3
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
                  Помош
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
                          <span className="text-slate-400">Живеалиште: </span>
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
                          <span className="text-slate-400">Прва буква: </span>
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
                          <span className="text-slate-400">Семејство: </span>
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
              className="overflow-x-auto rounded-2xl border border-slate-700 shadow-2xl mb-8"
            >
              <div className="min-w-max">
                <table className="w-full bg-slate-900/50 backdrop-blur-sm">
                  <thead className="bg-slate-800/80">
                    <tr>
                      <th className="p-3 text-center font-semibold text-slate-300 text-sm uppercase tracking-wider">Животно</th>
                      <th className="p-3 text-center font-semibold text-slate-300 text-sm uppercase tracking-wider">Семејство</th>
                      <th className="p-3 text-center font-semibold text-slate-300 text-sm uppercase tracking-wider">Живеалиште</th>
                      <th className="p-3 text-center font-semibold text-slate-300 text-sm uppercase tracking-wider">Животен век</th>
                      <th className="p-3 text-center font-semibold text-slate-300 text-sm uppercase tracking-wider">Исхрана</th>
                      <th className="p-3 text-center font-semibold text-slate-300 text-sm uppercase tracking-wider">Плен</th>
                      <th className="p-3 text-center font-semibold text-slate-300 text-sm uppercase tracking-wider">Предатори</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {[...guesses].reverse().map((g, idx) => {
                        const lifespanComparison = compareNumeric(g.lifespan, target?.lifespan);
                        
                        return (
                          <motion.tr
                            key={g._id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="border-t border-slate-800"
                          >
                            <td className="p-2">
                              <motion.div 
                                className="flex flex-col items-center gap-2 bg-slate-800/60 rounded-xl p-3 min-w-[120px]"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <img
                                  src={
                                    g.cardImage?.startsWith("http")
                                      ? g.cardImage
                                      : `${API}${g.cardImage}`
                                  }
                                  alt={g.name}
                                  className="w-16 h-16 rounded-lg border-2 border-slate-600 object-cover shadow-lg"
                                />
                                <span className="font-semibold text-sm text-center">{g.name}</span>
                              </motion.div>
                            </td>
                            <td className="p-2">
                              <div className={`rounded-xl p-4 text-center min-w-[100px] transition-all ${checkMatch(g.family, target?.family)}`}>
                                <div className="font-medium text-sm break-words">{g.family || "—"}</div>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className={`rounded-xl p-4 text-center min-w-[100px] transition-all ${checkMatch(g.habitat, target?.habitat)}`}>
                                <div className="font-medium text-sm break-words">{habitatLabels[g.habitat] || g.habitat || "—"}</div>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className={`rounded-xl p-4 text-center min-w-[100px] transition-all relative ${getNumericClassName(lifespanComparison)}`}>
                                <div className="font-medium text-sm break-words">{g.lifespan || "—"}</div>
                                {lifespanComparison.arrow && (
                                  <motion.div
                                    initial={{ opacity: 0, y: lifespanComparison.arrow === "up" ? 10 : -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                  >
                                    {lifespanComparison.arrow === "up" ? (
                                      <ChevronUp className="w-8 h-8 absolute right-2 top-1/2 -translate-y-1/2" />
                                    ) : (
                                      <ChevronDown className="w-8 h-8 absolute right-2 top-1/2 -translate-y-1/2" />
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className={`rounded-xl p-4 text-center min-w-[100px] transition-all ${checkMatch(g.diet, target?.diet)}`}>
                                <div className="font-medium text-sm break-words">{g.diet || "—"}</div>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className={`rounded-xl p-4 text-center min-w-[120px] max-w-[200px] transition-all ${checkMatch(g.prey, target?.prey)}`}>
                                <div className="font-medium text-xs break-words whitespace-normal leading-relaxed">{g.prey || "—"}</div>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className={`rounded-xl p-4 text-center min-w-[120px] max-w-[200px] transition-all ${checkMatch(g.predators, target?.predators)}`}>
                                <div className="font-medium text-xs break-words whitespace-normal leading-relaxed">{g.predators || "—"}</div>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
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
                  {guesses[guesses.length - 1]?._id === target._id ? "Честитки!" : "Крај на играта"}
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
                  Животното беше{" "}
                  <span className="font-bold text-white text-xl">{target.name}</span>
                </p>

                {guesses[guesses.length - 1]?._id === target._id && (
                  <div className="flex gap-4 justify-center mb-6 text-sm flex-wrap">
                    <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                      <div className="text-emerald-400 font-bold">{guesses.length}</div>
                      <div className="text-slate-400">Обиди</div>
                    </div>
                    <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                      <div className="text-cyan-400 font-bold">{hints.length}</div>
                      <div className="text-slate-400">Помош</div>
                    </div>
                    <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                      <div className="text-purple-400 font-bold">{formatTime(gameTime)}</div>
                      <div className="text-slate-400">Време</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={shareResults}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-6 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Сподели
                  </Button>
                  <Button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-8 py-6 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Играј повторно
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}