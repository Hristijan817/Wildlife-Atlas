// src/pages/ComparePage.jsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Trash2, Info, PlusCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ComparePage() {
  const [selected, setSelected] = useState([]);
  const [allAnimals, setAllAnimals] = useState([]);
  const [search, setSearch] = useState("");
  const [habitat, setHabitat] = useState("all");

  useEffect(() => {
    fetch(`${API}/api/animals`)
      .then((res) => res.json())
      .then((data) => {
        setAllAnimals(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Грешка при вчитување на животни:", err));

    const stored = JSON.parse(localStorage.getItem("compareList")) || [];
    setSelected(stored);
  }, []);

  const saveSelected = (list) => {
    setSelected(list);
    localStorage.setItem("compareList", JSON.stringify(list));
  };

  const clearAll = () => saveSelected([]);
  const removeAnimal = (id) => saveSelected(selected.filter((a) => a._id !== id));

  const addAnimal = (animal) => {
    if (selected.some((a) => a._id === animal._id)) return;
    if (selected.length >= 3) {
      alert("Можете да споредите до 3 животни!");
      return;
    }
    saveSelected([...selected, animal]);
    setSearch("");
  };

  const attributes = [
    { key: "family", label: "Семејство", icon: "🧬" },
    { key: "habitat", label: "Живеалиште", icon: "🌍" },
    { key: "lifespan", label: "Животен век", icon: "⏳" },
    { key: "diet", label: "Исхрана", icon: "🍖" },
    { key: "prey", label: "Плен", icon: "🎯" },
    { key: "predators", label: "Предатори", icon: "⚠️" },
  ];

  const filteredAnimals = allAnimals.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesHabitat = habitat === "all" ? true : a.habitat?.toLowerCase() === habitat;
    return matchesSearch && matchesHabitat;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => (window.location.href = "/")}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2" size={18} />
                Назад
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Спореди Животни
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {selected.length} {selected.length === 1 ? "животно" : "животни"} избрани
                </p>
              </div>
            </div>
            {selected.length > 0 && (
              <Button
                variant="destructive"
                onClick={clearAll}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30"
              >
                <Trash2 className="mr-2" size={16} />
                Избриши се
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Animal */}
        <div className="mb-8 bg-slate-900/60 p-4 rounded-xl border border-slate-800 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <PlusCircle size={20} className="text-cyan-400" />
            Додади животно за споредба
          </h2>

          <Input
            placeholder="Пребарај животни..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 mb-3"
          />

          {/* Habitat chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { value: "all", label: "Сите" },
              { value: "kopno", label: "Копно" },
              { value: "voda", label: "Вода" },
              { value: "vozduh", label: "Воздух" },
            ].map((h) => (
              <button
                key={h.value}
                onClick={() => setHabitat(h.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  habitat === h.value
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>

          {search && (
            <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
              {filteredAnimals.length > 0 ? (
                filteredAnimals.map((animal) => {
                  const alreadySelected = selected.some((a) => a._id === animal._id);
                  return (
                    <div
                      key={animal._id}
                      onClick={() => !alreadySelected && addAnimal(animal)}
                      className={`flex items-center gap-3 p-2 rounded-lg transition ${
                        alreadySelected
                          ? "bg-slate-800/50 opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:bg-slate-700/50"
                      }`}
                    >
                      <img
                        src={animal.cardImage}
                        alt={animal.name}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-white">{animal.name}</p>
                        <p className="text-slate-400 text-sm">{animal.family}</p>
                      </div>
                      {alreadySelected && <Check className="text-green-400" size={18} />}
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 text-sm">Не се најдени животни.</p>
              )}
            </div>
          )}
        </div>

        {/* Comparison Content */}
        {selected.length > 0 ? (
          <div className="space-y-6">
            {/* Animal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {selected.map((animal) => (
                <div
                  key={animal._id}
                  className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <button
                    onClick={() => removeAnimal(animal._id)}
                    className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <XCircle size={20} />
                  </button>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={animal.cardImage}
                      alt={animal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-gradient-to-t from-slate-900 to-transparent">
                    <h3 className="text-xl font-bold text-white">{animal.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{animal.family}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {attributes.map((attr, idx) => (
                      <tr
                        key={attr.key}
                        className={`border-b border-slate-800 transition-colors ${
                          idx % 2 === 0 ? "bg-slate-900/30" : "bg-slate-800/30"
                        } hover:bg-slate-700/30`}
                      >
                        <td className="p-4 sm:p-6 font-semibold text-slate-300 bg-slate-900/80 sticky left-0 z-10 border-r border-slate-800 min-w-[140px]">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{attr.icon}</span>
                            <span className="text-sm sm:text-base">{attr.label}</span>
                          </div>
                        </td>
                        {selected.map((animal) => (
                          <td
                            key={animal._id}
                            className="p-4 sm:p-6 text-slate-200 text-sm sm:text-base min-w-[200px]"
                          >
                            {/* Special render for prey & predators */}
                            {["prey", "predators"].includes(attr.key) ? (
                              animal[attr.key] ? (
                                <ul className="list-disc list-inside text-slate-300">
                                  {animal[attr.key]
                                    .split(",")
                                    .map((item, i) => (
                                      <li key={i}>{item.trim()}</li>
                                    ))}
                                </ul>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )
                            ) : attr.key === "summary" ? (
                              <div className="text-slate-300 leading-relaxed">
                                {animal[attr.key] || "-"}
                              </div>
                            ) : (
                              <div className="font-medium">
                                {animal[attr.key] || <span className="text-slate-600">-</span>}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info Footer */}
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 flex items-start gap-3">
              <Info className="text-blue-400 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-slate-300 text-sm">
                Користи го пребарувањето и филтрите за живеалишта погоре за да додадеш животни директно. 
                Кликни на <XCircle className="inline" size={16} /> копчето на било која картичка за да ја отстраниш.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="bg-slate-800/50 rounded-full p-8 mb-6 border-4 border-slate-700/50">
              <img
                src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                alt="Нема избор"
                className="w-24 h-24 opacity-60"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-3">
              Нема животни за споредба
            </h2>
            <p className="text-slate-400 mb-6 max-w-md">
              Започни со додавање на животни користејќи го пребарувањето и филтрите погоре или со истражување на живеалиштата.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-900/30 px-8 py-6 text-lg"
            >
              <ArrowLeft className="mr-2" size={20} />
              Истражи живеалишта
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}