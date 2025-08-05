// src/pages/LandAnimals.js
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AnimateIn from "@/components/AnimateIn";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { PawPrint, Search, Mountain, Trees, Sun } from "lucide-react";
import NavBar from "@/components/NavBar";

/* ---------------------- Fancy, glassy search input ---------------------- */
function FancySearch({ value, onChange, onClear, inputRef }) {
  return (
    <div ref={inputRef} className="group relative w-full">
      {/* soft gradient glow border */}
      <div className="absolute -inset-[1px] rounded-xl opacity-70 bg-gradient-to-r from-emerald-300 via-lime-300 to-amber-200 blur-sm group-focus-within:opacity-100 transition" />
      {/* glass container */}
      <div className="relative z-[1] rounded-xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm">
        <div className="flex items-center px-3">
          {/* icon */}
          <Search className="w-4 h-4 text-emerald-700/70 mr-2" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Пребарај по име (пр. Лав, Волк, Камелеон)"
            className="flex-1 bg-transparent h-10 outline-none text-sm placeholder:text-gray-400"
          />
          {/* clear */}
          {value?.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="ml-2 rounded-md px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-white/60 transition"
              aria-label="Исчисти"
            >
              Исчисти
            </button>
          )}
          {/* keyboard hint */}
          <span className="ml-2 hidden md:inline-flex items-center gap-1 text-[11px] text-gray-500">
            <kbd className="rounded border bg-white/70 px-1">/</kbd> за фокус
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Page ---------------------------------- */
export default function LandAnimals() {
  // purely visual placeholders (no API)
  const placeholders = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    title: ["Лав", "Волк", "Гепард", "Јелен", "Камелеон", "Пума", "Лисица", "Панда", "Мечка"][i % 9],
  }));

  // visual-only filters
  const [q, setQ] = useState("");
  const [diet, setDiet] = useState("all");
  const [family, setFamily] = useState("all");

  // "/" to focus search
  const searchWrapRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        searchWrapRef.current?.querySelector("input")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50 via-emerald-50 to-lime-50 text-gray-800">
      <NavBar />
      {/* ---------------------------- HERO ---------------------------- */}
      <section
        className="relative h-[56vh] bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/src/assets/images/land-hero.jpg')" }}
      >
        {/* Dark gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/25" />

        {/* Floating leaves ON TOP of the hero */}
        <img
          src="/src/assets/images/leaf-left.png"
          alt="" aria-hidden
          className="pointer-events-none select-none hidden md:block absolute top-10 left-6 w-24 opacity-80 [animation:float_9s_ease-in-out_infinite] z-20"
        />
        <img
          src="/src/assets/images/leaf-right.png"
          alt="" aria-hidden
          className="pointer-events-none select-none hidden md:block absolute top-24 right-6 w-24 opacity-80 [animation:float_8s_ease-in-out_infinite] z-20"
        />

        {/* Hero text */}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Копнени Животни
          </motion.h1>
          <motion.p
            className="mt-3 text-white/90 max-w-2xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Естетска демонстрација со тематски дизајн за копно—без API, фокус на изглед и движење.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Button variant="secondary" className="flex items-center gap-2">
              <PawPrint className="w-4 h-4" /> Истражи визуел
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            >
              Погледни примери
            </Button>
          </motion.div>
        </div>

        {/* Wavy divider */}
        <div className="absolute -bottom-[1px] left-0 right-0 overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-[calc(130%)] -ml-[15%] h-[60px] text-emerald-50">
            <path d="M0,0V46.29c47.31,22,98.76,29.05,148.89,17.39C230,49,284,8.41,339.33,1.35,411-8,484,27.76,556,43.63c70,15.43,141,9.35,211-11.08,63-18.62,127-46.28,190-29.2,59,16.1,117,74.25,176,96V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* ---------------------- FEATURE TILES ------------------------ */}
      <section className="max-w-6xl mx-auto px-4 pt-10">
  <div className="grid sm:grid-cols-3 gap-4">
    {[
      {
        title: "Шуми",
        caption: "Мешани и тропски",
        img: "/src/assets/images/forest-card.jpg",
        icon: <Trees className="w-5 h-5" />,
      },
      {
        title: "Планини",
        caption: "Алпски и високопланински",
        img: "/src/assets/images/mountain-card.jpg",
        icon: <Mountain className="w-5 h-5" />,
      },
      {
        title: "Пустини",
        caption: "Сахара, Гоби, Калахари",
        img: "/src/assets/images/desert-card.jpg",
        icon: <Sun className="w-5 h-5" />,
      },
    ].map((f, i) => (
      <AnimateIn key={i} delay={i * 0.12}>
        <Card
          className="relative h-40 md:h-48 overflow-hidden group border shadow-sm bg-cover bg-center"
          style={{ backgroundImage: `url('${f.img}')` }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />

          {/* Content overlay */}
          <CardContent className="relative z-10 flex flex-col justify-end h-full p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="rounded-full bg-white/80 backdrop-blur-sm p-2 text-emerald-700 shadow-sm">
                {f.icon}
              </div>
              <p className="font-semibold text-white drop-shadow">{f.title}</p>
            </div>
            <p className="text-xs text-white/90 drop-shadow">{f.caption}</p>
          </CardContent>
        </Card>
      </AnimateIn>
    ))}
  </div>
</section>


      {/* -------------------- GLASS FILTER BAR ----------------------- */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="rounded-2xl bg-white/65 backdrop-blur-md border shadow-sm p-4 ring-1 ring-white/60">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* FancySearch (left) */}
            <div className="md:w-1/2">
              <FancySearch
                value={q}
                onChange={setQ}
                onClear={() => setQ("")}
                inputRef={searchWrapRef}
              />
            </div>

            {/* Selects (right) */}
            <div className="flex gap-3 md:flex-1">
              <Select value={diet} onValueChange={setDiet}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Исхрана" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Сите исхрани</SelectItem>
                  <SelectItem value="herbivore">Тревојад</SelectItem>
                  <SelectItem value="carnivore">Месојад</SelectItem>
                  <SelectItem value="omnivore">Сештојад</SelectItem>
                </SelectContent>
              </Select>
              <Select value={family} onValueChange={setFamily}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Фамилија" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Сите фамилии</SelectItem>
                  <SelectItem value="felidae">Felidae</SelectItem>
                  <SelectItem value="canidae">Canidae</SelectItem>
                  <SelectItem value="ursidae">Ursidae</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="md:w-auto">Филтри</Button>
          </div>

          <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
            <Badge variant="secondary">9</Badge> визуелни примероци (placeholder-и)
          </div>
        </div>
      </section>

      {/* --------- CARDS SECTION with land-texture BACKGROUND -------- */}
      <section
        className="relative mt-10"
        style={{
          backgroundImage: "url('/src/assets/images/land-texture.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* very soft tint to unify the grid visually */}
        <div className="absolute inset-0 bg-emerald-900/5" />

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {placeholders.map((p, idx) => (
  <AnimateIn key={p.id} delay={(idx % 6) * 0.06}>
    <div className="relative rounded-xl group">
      {/* Gradient border layer (hidden until hover) */}
      <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-70 bg-gradient-to-r from-emerald-300 via-lime-300 to-amber-200 blur-sm transition-opacity duration-300 pointer-events-none" />

      {/* Actual card */}
      <Card className="relative z-10 bg-white/65 backdrop-blur-md border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{p.title}</p>
            <span className="text-xs text-emerald-700 bg-emerald-100 rounded-full px-2 py-[2px]">
              копно
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Ова е пример-картичка за изглед.</p>
          <div className="mt-3 flex items-center justify-between">
            <Button size="sm" variant="outline">Детали</Button>
            <Button size="sm" variant="ghost" className="opacity-80 hover:opacity-100">
              <PawPrint className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AnimateIn>
))}


          </div>
        </div>
      </section>

      {/* ---------------------- DID YOU KNOW ------------------------- */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <AnimateIn>
          <Card className="bg-gradient-to-r from-emerald-50 to-lime-50 border-emerald-100">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">Дали знаеше?</h3>
              <p className="text-gray-600">
                Повеќето пустински животни се активни ноќе за да избегнат големи дневни температури и да ја зачуваат водата.
              </p>
            </CardContent>
          </Card>
        </AnimateIn>
      </section>

      <div className="h-10" />
    </div>
  );
}
