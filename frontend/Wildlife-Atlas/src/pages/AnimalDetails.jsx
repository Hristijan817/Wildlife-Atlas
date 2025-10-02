// src/pages/AnimalDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useApi } from "@/services/api";
import { motion } from "framer-motion";
import {
  Leaf,
  Ruler,
  MapPin,
  BookOpen,
  Play,
  Star,
  Users,
  HeartPulse,
  Utensils,
} from "lucide-react";

export default function AnimalDetails() {
  const { id } = useParams();
  const { get, del } = useApi();
  const getRef = useRef(get);
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getRef.current = get;
  }, [get]);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const res = await getRef.current(`/api/animals/${id}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`Failed to fetch animal (${res.status})`);
        const data = await res.json();
        setAnimal(data);
      } catch (err) {
        if (err.name !== "AbortError") setAnimal(null);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    const res = await del(`/api/animals/${id}`);
    if (res.ok) navigate("/");
    else {
      const errMsg = await res.json().catch(() => ({}));
      alert(errMsg.message || "Failed to delete");
    }
  };

  const videoRenderers = useMemo(() => {
    const isEmbed = (url = "") =>
      /^(https?:)?\/\/(www\.)?(youtube\.com|youtu\.be|player\.vimeo\.com)/i.test(
        url
      );
    const isFile = (url = "") =>
      /\.(mp4|webm|ogg)(\?|#|$)/i.test(url) || url.startsWith("/uploads/");
    return { isEmbed, isFile };
  }, []);

  if (loading) return <p className="p-6 text-gray-400">Loading...</p>;
  if (!animal) return <p className="p-6 text-red-400">Animal not found.</p>;

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
<div className="relative w-full flex items-center overflow-hidden">
  <div className="relative w-full">
    <img
      src={
        animal.cardImage
          ? animal.cardImage.startsWith("http")
            ? animal.cardImage
            : `${API}${animal.cardImage}`
          : "/public/kopno-bg.jpg"
      }
      alt={animal.name}
      className="w-full h-auto min-h-[300px] max-h-[600px] object-cover"
    />

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-gray-950" />

    {/* Content Overlay */}
    <div className="absolute inset-0 flex items-end pb-8">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 container mx-auto px-6"
      >
        <div className="relative max-w-2xl">
          {/* Background blur card */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20" />

          {/* Main content */}
          <div className="relative p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-2xl">
                  {animal.name}
                </h1>

                {/* Accent line under title */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-full shadow-lg shadow-yellow-400/30"
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Summary */}
            {animal.summary && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-lg text-gray-200 leading-relaxed font-light drop-shadow-lg line-clamp-2"
              >
                {animal.summary}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</div>


      {/* Content */}
      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Enhanced Metadata Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { 
                staggerChildren: 0.12,
                delayChildren: 0.2
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            {
              label: "Classification",
              value: animal.type,
              icon: Leaf,
              gradient: "from-emerald-500/20 via-emerald-600/30 to-teal-700/40",
              borderGlow: "shadow-emerald-500/20",
              iconBg: "bg-emerald-500/20",
              iconGlow: "shadow-lg shadow-emerald-500/30",
              accentColor: "text-emerald-300",
              hoverGlow: "hover:shadow-emerald-500/30"
            },
            {
              label: "Size",
              value: animal.size,
              icon: Ruler,
              gradient: "from-amber-500/20 via-orange-600/30 to-yellow-700/40",
              borderGlow: "shadow-amber-500/20",
              iconBg: "bg-amber-500/20",
              iconGlow: "shadow-lg shadow-amber-500/30",
              accentColor: "text-amber-300",
              hoverGlow: "hover:shadow-amber-500/30"
            },
            {
              label: "Habitat",
              value: animal.habitat,
              icon: MapPin,
              gradient: "from-sky-500/20 via-blue-600/30 to-cyan-700/40",
              borderGlow: "shadow-sky-500/20",
              iconBg: "bg-sky-500/20",
              iconGlow: "shadow-lg shadow-sky-500/30",
              accentColor: "text-sky-300",
              hoverGlow: "hover:shadow-sky-500/30"
            },
            {
              label: "Family",
              value: animal.family,
              icon: Users,
              gradient: "from-indigo-500/20 via-purple-600/30 to-violet-700/40",
              borderGlow: "shadow-indigo-500/20",
              iconBg: "bg-indigo-500/20",
              iconGlow: "shadow-lg shadow-indigo-500/30",
              accentColor: "text-indigo-300",
              hoverGlow: "hover:shadow-indigo-500/30"
            },
            {
              label: "Lifespan",
              value: animal.lifespan,
              icon: HeartPulse,
              gradient: "from-rose-500/20 via-pink-600/30 to-red-700/40",
              borderGlow: "shadow-rose-500/20",
              iconBg: "bg-rose-500/20",
              iconGlow: "shadow-lg shadow-rose-500/30",
              accentColor: "text-rose-300",
              hoverGlow: "hover:shadow-rose-500/30"
            },
            {
              label: "Diet",
              value: animal.diet,
              icon: Utensils,
              gradient: "from-orange-500/20 via-red-600/30 to-pink-700/40",
              borderGlow: "shadow-orange-500/20",
              iconBg: "bg-orange-500/20",
              iconGlow: "shadow-lg shadow-orange-500/30",
              accentColor: "text-orange-300",
              hoverGlow: "hover:shadow-orange-500/30"
            },
          ].map(({ label, value, icon: Icon, gradient, borderGlow, iconBg, iconGlow, accentColor, hoverGlow }, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 100,
                    damping: 15 
                  }
                },
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className={`group relative p-8 rounded-3xl shadow-2xl ${borderGlow} ${hoverGlow}
                          bg-gradient-to-br ${gradient} backdrop-blur-xl
                          border border-white/10 hover:border-white/20
                          transition-all duration-500 ease-out
                          before:absolute before:inset-0 before:rounded-3xl 
                          before:bg-gradient-to-br before:from-white/5 before:to-transparent
                          before:opacity-0 before:transition-opacity before:duration-300
                          hover:before:opacity-100 overflow-hidden`}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform -translate-x-12 translate-y-12" />
              </div>

              <div className="relative z-10">
                {/* Icon and Label Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      className={`p-4 rounded-2xl ${iconBg} ${iconGlow} backdrop-blur-sm
                                 border border-white/20 group-hover:border-white/30 transition-all duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white drop-shadow-md" />
                    </motion.div>
                    <div>
                      <h5 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1 
                                   group-hover:text-gray-300 transition-colors duration-300">
                        {label}
                      </h5>
                      <div className={`h-0.5 w-8 ${accentColor.replace('text-', 'bg-')} rounded-full 
                                     group-hover:w-12 transition-all duration-500`} />
                    </div>
                  </div>
                  
                  {/* Decorative corner accent */}
                  <div className={`w-3 h-3 rounded-full ${accentColor.replace('text-', 'bg-')} opacity-60
                                 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300`} />
                </div>

                {/* Value */}
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-white leading-tight tracking-wide 
                               group-hover:text-white/95 transition-colors duration-300 drop-shadow-md">
                    {value || "—"}
                  </p>
                  
                  {/* Subtle animated underline */}
                  <motion.div 
                    className={`h-0.5 ${accentColor.replace('text-', 'bg-')} rounded-full opacity-0 
                               group-hover:opacity-60 transition-all duration-500`}
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  />
                </div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 ${accentColor.replace('text-', 'bg-')} rounded-full`}
                      style={{
                        left: `${20 + i * 25}%`,
                        top: `${30 + i * 15}%`,
                      }}
                      animate={{
                        y: [-5, -15, -5],
                        opacity: [0.4, 0.8, 0.4],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced About Section */}
        {animal.description && (
          <motion.section 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group/section relative bg-gray-900/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl 
                       border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden
                       before:absolute before:inset-0 before:rounded-3xl 
                       before:bg-gradient-to-br before:from-white/5 before:to-transparent
                       before:opacity-0 before:transition-opacity before:duration-300
                       hover:before:opacity-100"
          >
            {/* Sophisticated background pattern */}
            <div className="absolute inset-0 opacity-5 group-hover/section:opacity-10 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl transform -translate-x-24 -translate-y-24" />
              <div className="absolute bottom-0 right-0 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl transform translate-x-18 translate-y-18" />
              <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            </div>

            <div className="relative z-10">
              {/* Premium Header */}
              <div className="flex items-start justify-between mb-10">
                <div className="flex items-center gap-5">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="p-4 rounded-2xl bg-emerald-500/20 shadow-lg shadow-emerald-500/30 backdrop-blur-sm
                               border border-white/20 group-hover/section:border-white/30 transition-all duration-300"
                  >
                    <BookOpen className="w-8 h-8 text-white drop-shadow-md" />
                  </motion.div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 
                                  bg-clip-text text-transparent drop-shadow-sm mb-2">
                      About
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 w-12 bg-emerald-400 rounded-full 
                                     group-hover/section:w-16 transition-all duration-500" />
                      <p className="text-gray-400 text-sm font-medium">
                        Learn more about {animal.name}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative corner accent */}
                <div className="w-4 h-4 rounded-full bg-emerald-400 opacity-60
                               group-hover/section:opacity-100 group-hover/section:scale-125 transition-all duration-300 shadow-lg shadow-emerald-400/50" />
              </div>

              {/* Enhanced Content Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative"
              >
                {/* Content with enhanced typography */}
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/50 
                               backdrop-blur-sm border border-white/10 hover:border-white/15 transition-all duration-500
                               shadow-lg group-hover/section:shadow-emerald-500/10 group-hover/section:shadow-2xl
                               before:absolute before:inset-0 before:rounded-2xl 
                               before:bg-gradient-to-br before:from-white/3 before:to-transparent
                               before:opacity-0 before:transition-opacity before:duration-300
                               group-hover/section:before:opacity-100"
                >
                  {/* Floating quote decoration */}
                  <div className="absolute top-4 left-4 w-8 h-8 opacity-20 group-hover/section:opacity-30 transition-opacity duration-500">
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                      <div className="text-white text-lg font-bold">"</div>
                    </div>
                  </div>

                  {/* Enhanced description text */}
                  <div className="relative pl-12">
                    <p className="text-lg leading-relaxed font-light text-gray-200 group-hover/section:text-gray-100 
                                 transition-colors duration-500 tracking-wide"
                       style={{ 
                         textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                         lineHeight: '1.8'
                       }}
                    >
                      {animal.description}
                    </p>

                    {/* Subtle accent line */}
                    <motion.div 
                      className="mt-6 h-0.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-transparent rounded-full 
                                 opacity-0 group-hover/section:opacity-60 transition-all duration-700"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>

                  {/* Floating particles effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-700">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                        style={{
                          right: `${15 + i * 25}%`,
                          top: `${20 + i * 15}%`,
                        }}
                        animate={{
                          y: [-4, -12, -4],
                          opacity: [0.3, 0.7, 0.3],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2.5 + i * 0.5,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  {/* Corner decorative elements */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-emerald-400/40 group-hover/section:bg-emerald-400/60"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Premium reading progress indicator */}
                <motion.div 
                  className="mt-6 flex items-center justify-center gap-2 opacity-0 group-hover/section:opacity-100 transition-all duration-500"
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1, duration: 0.4 }}
                >
                  <div className="w-1 h-1 rounded-full bg-emerald-400/60" />
                  <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-emerald-400/60 to-cyan-400/60" />
                  <div className="w-1 h-1 rounded-full bg-cyan-400/60" />
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Enhanced Gallery */}
        {animal.images?.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group/section relative bg-gray-900/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl 
                       border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden
                       before:absolute before:inset-0 before:rounded-3xl 
                       before:bg-gradient-to-br before:from-white/5 before:to-transparent
                       before:opacity-0 before:transition-opacity before:duration-300
                       hover:before:opacity-100"
          >
            {/* Sophisticated background pattern */}
            <div className="absolute inset-0 opacity-5 group-hover/section:opacity-10 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl transform translate-x-24 -translate-y-24" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl transform -translate-x-18 translate-y-18" />
              <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full blur-xl transform -translate-x-12 -translate-y-12" />
            </div>

            <div className="relative z-10">
              {/* Premium Header */}
              <div className="flex items-start justify-between mb-10">
                <div className="flex items-center gap-5">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="p-4 rounded-2xl bg-sky-500/20 shadow-lg shadow-sky-500/30 backdrop-blur-sm
                               border border-white/20 group-hover/section:border-white/30 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-300 rounded-lg flex items-center justify-center shadow-md">
                      <div className="w-4 h-4 bg-white/90 rounded-sm" />
                    </div>
                  </motion.div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400 
                                  bg-clip-text text-transparent drop-shadow-sm mb-2">
                      Gallery
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 w-12 bg-sky-400 rounded-full 
                                     group-hover/section:w-16 transition-all duration-500" />
                      <p className="text-gray-400 text-sm font-medium">
                        {animal.images.length} {animal.images.length === 1 ? 'image' : 'images'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative corner accent */}
                <div className="w-4 h-4 rounded-full bg-sky-400 opacity-60
                               group-hover/section:opacity-100 group-hover/section:scale-125 transition-all duration-300 shadow-lg shadow-sky-400/50" />
              </div>

              {/* Enhanced Image Grid */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
                  }
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {animal.images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 40, scale: 0.9 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { 
                          type: "spring", 
                          stiffness: 100, 
                          damping: 15 
                        }
                      }
                    }}
                    whileHover={{ 
                      y: -10,
                      scale: 1.03,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    className="group relative overflow-hidden rounded-2xl shadow-2xl
                               bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm
                               border border-white/10 hover:border-white/20 transition-all duration-500
                               hover:shadow-sky-500/20 hover:shadow-2xl
                               before:absolute before:inset-0 before:rounded-2xl 
                               before:bg-gradient-to-br before:from-white/5 before:to-transparent
                               before:opacity-0 before:transition-opacity before:duration-300
                               hover:before:opacity-100"
                  >
                    {/* Image container with aspect ratio */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <motion.img
                        src={img}
                        alt={`${animal.name} - Image ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Premium gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                                     opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        {[...Array(2)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-sky-400 rounded-full"
                            style={{
                              left: `${30 + i * 40}%`,
                              top: `${25 + i * 20}%`,
                            }}
                            animate={{
                              y: [-3, -12, -3],
                              opacity: [0.4, 0.8, 0.4],
                              scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                              duration: 2 + i * 0.5,
                              repeat: Infinity,
                              delay: i * 0.3,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Enhanced hover details */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 
                                   transition-all duration-500"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold drop-shadow-lg tracking-wide">
                            Image {idx + 1}
                          </p>
                          <div className="w-2 h-2 rounded-full bg-sky-400 shadow-lg shadow-sky-400/50" />
                        </div>
                        <motion.div 
                          className="h-0.5 bg-sky-400 rounded-full mt-2 opacity-60"
                          initial={{ width: "0%" }}
                          whileHover={{ width: "100%" }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        />
                      </motion.div>

                      {/* Decorative corner accent */}
                      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-sky-400/80 
                                     opacity-0 group-hover:opacity-100 transition-all duration-500 
                                     group-hover:scale-125 shadow-lg shadow-sky-400/50" />
                      
                      {/* Sophisticated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                   -skew-x-12 opacity-0 group-hover:opacity-100"
                        initial={{ x: "-100%" }}
                        whileHover={{ 
                          x: "200%",
                          transition: { duration: 1, delay: 0.2, ease: "easeInOut" }
                        }}
                      />
                    </div>

                    {/* Premium bottom accent */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-400 
                                 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg shadow-sky-400/50"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Enhanced Videos Section */}
        {animal.videos?.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="group/section relative bg-gray-900/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl 
                       border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden
                       before:absolute before:inset-0 before:rounded-3xl 
                       before:bg-gradient-to-br before:from-white/5 before:to-transparent
                       before:opacity-0 before:transition-opacity before:duration-300
                       hover:before:opacity-100"
          >
            {/* Sophisticated background pattern */}
            <div className="absolute inset-0 opacity-5 group-hover/section:opacity-10 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl transform translate-x-24 -translate-y-24" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-lime-500/20 rounded-full blur-2xl transform -translate-x-18 translate-y-18" />
              <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            </div>

            <div className="relative z-10">
              {/* Premium Header */}
              <div className="flex items-start justify-between mb-10">
                <div className="flex items-center gap-5">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="p-4 rounded-2xl bg-emerald-500/20 shadow-lg shadow-emerald-500/30 backdrop-blur-sm
                               border border-white/20 group-hover/section:border-white/30 transition-all duration-300"
                  >
                    <Play className="w-8 h-8 text-white drop-shadow-md" />
                  </motion.div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-lime-300 to-green-400 
                                  bg-clip-text text-transparent drop-shadow-sm mb-2">
                      Videos
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 w-12 bg-emerald-400 rounded-full 
                                     group-hover/section:w-16 transition-all duration-500" />
                      <p className="text-gray-400 text-sm font-medium">
                        {animal.videos.length} {animal.videos.length === 1 ? 'video' : 'videos'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative corner accent */}
                <div className="w-4 h-4 rounded-full bg-emerald-400 opacity-60
                               group-hover/section:opacity-100 group-hover/section:scale-125 transition-all duration-300 shadow-lg shadow-emerald-400/50" />
              </div>

              {/* Enhanced Video Grid */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                  }
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {animal.videos.map((vid, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 40, scale: 0.95 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { 
                          type: "spring", 
                          stiffness: 100, 
                          damping: 15 
                        }
                      }
                    }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    className="group relative rounded-2xl shadow-2xl overflow-hidden
                               bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm
                               border border-white/10 hover:border-white/20 transition-all duration-500
                               hover:shadow-emerald-500/20 hover:shadow-2xl
                               before:absolute before:inset-0 before:rounded-2xl 
                               before:bg-gradient-to-br before:from-white/5 before:to-transparent
                               before:opacity-0 before:transition-opacity before:duration-300
                               hover:before:opacity-100"
                  >
                    {/* Video Container */}
                    <div className="relative aspect-video bg-gray-950 rounded-2xl overflow-hidden">
                      {/* Video Element */}
                      <div className="absolute inset-0">
                        {videoRenderers.isEmbed(vid) ? (
                          <iframe 
                            src={vid} 
                            className="w-full h-full border-0" 
                            allowFullScreen 
                            loading="lazy"
                          />
                        ) : videoRenderers.isFile(vid) ? (
                          <video 
                            src={vid} 
                            controls 
                            className="w-full h-full object-cover" 
                            preload="metadata"
                          />
                        ) : (
                          <iframe 
                            src={vid} 
                            className="w-full h-full border-0" 
                            allowFullScreen 
                            loading="lazy"
                          />
                        )}
                      </div>

                      {/* Premium overlay effects */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Subtle gradient border overlay */}
                        <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-500" />
                        
                        {/* Corner play indicator */}
                        <motion.div
                          className="absolute top-4 right-4 p-2 rounded-xl bg-emerald-500/20 backdrop-blur-sm
                                     border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500
                                     shadow-lg shadow-emerald-500/20"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Play className="w-4 h-4 text-white drop-shadow-sm" />
                        </motion.div>

                        {/* Floating particles effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          {[...Array(2)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                              style={{
                                left: `${20 + i * 50}%`,
                                bottom: `${20 + i * 15}%`,
                              }}
                              animate={{
                                y: [-3, -10, -3],
                                opacity: [0.4, 0.8, 0.4],
                                scale: [0.8, 1.2, 0.8],
                              }}
                              transition={{
                                duration: 2 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>

                        {/* Sophisticated shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                     -skew-x-12 opacity-0 group-hover:opacity-100 rounded-2xl"
                          initial={{ x: "-100%" }}
                          whileHover={{ 
                            x: "200%",
                            transition: { duration: 1.2, delay: 0.1, ease: "easeInOut" }
                          }}
                        />
                      </div>
                    </div>

                    {/* Video Info Bar */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent
                                 opacity-0 group-hover:opacity-100 transition-all duration-500"
                      initial={{ y: 20 }}
                      whileHover={{ y: 0 }}
                    >
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
                          <span className="text-sm font-semibold tracking-wide drop-shadow-lg">
                            Video {idx + 1}
                          </span>
                        </div>
                        <motion.div 
                          className="h-0.5 bg-emerald-400 rounded-full opacity-60 flex-1 ml-4"
                          initial={{ width: "0%" }}
                          whileHover={{ width: "100%" }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        />
                      </div>
                    </motion.div>

                    {/* Premium accent border */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-400 
                                 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg shadow-emerald-400/50 rounded-b-2xl"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Publications */}
        {animal.publications?.length > 0 && (
          <section className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-10 shadow-lg border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-sky-400 to-emerald-300 bg-clip-text text-transparent">
              <BookOpen className="w-7 h-7" /> Did You Know?
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {animal.publications.map((pub, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-950 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition"
                >
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-emerald-300 hover:underline font-medium"
                    >
                      {pub.title}
                    </a>
                  ) : (
                    <p className="text-gray-200 text-lg">{pub.title}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        
      </div>
    </div>
  );
}