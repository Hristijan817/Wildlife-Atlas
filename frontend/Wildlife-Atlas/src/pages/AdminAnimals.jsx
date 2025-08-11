// src/pages/AdminAnimals.jsx
import { useEffect, useMemo, useState } from "react";
import NavBar from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimateIn from "@/components/AnimateIn";

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || ""; // set in .env

const HABITATS = [
  { value: "", label: "Сите живеалишта" },
  { value: "vozduh", label: "Воздух" },
  { value: "kopno", label: "Копно" },
  { value: "voda", label: "Вода" },
];

const DIETS = [
  { value: "", label: "—" },
  { value: "herbivore", label: "Тревојад" },
  { value: "carnivore", label: "Месојад" },
  { value: "omnivore", label: "Сештојад" },
];

export default function AdminAnimals() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [habitatFilter, setHabitatFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // current doc being edited or null

  // form state (add/edit share)
  const [form, setForm] = useState({
    name: "",
    habitat: "",
    family: "",
    lifespan: "",
    prey: "",
    predators: "",
    diet: "",
    origin: "",
    sound: ""
  });

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    "x-admin-key": ADMIN_KEY
  }), []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (habitatFilter) params.set("habitat", habitatFilter);
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/animals?${params.toString()}`, { headers });
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [habitatFilter, q]);

  const resetForm = () => {
    setForm({
      name: "",
      habitat: "",
      family: "",
      lifespan: "",
      prey: "",
      predators: "",
      diet: "",
      origin: "",
      sound: ""
    });
    setEditing(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      prey: form.prey,           // backend accepts "a, b" or array
      predators: form.predators, // same
    };

    const url = editing ? `/api/admin/animals/${editing._id}` : "/api/admin/animals";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      resetForm();
      fetchList();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err?.message || "Грешка при зачувување");
    }
  };

  const onEdit = (doc) => {
    setEditing(doc);
    setForm({
      name: doc.name || "",
      habitat: doc.habitat || "",
      family: doc.family || "",
      lifespan: doc.lifespan || "",
      prey: Array.isArray(doc.prey) ? doc.prey.join(", ") : (doc.prey || ""),
      predators: Array.isArray(doc.predators) ? doc.predators.join(", ") : (doc.predators || ""),
      diet: doc.diet || "",
      origin: doc.origin || "",
      sound: doc.sound || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!confirm("Сигурно избриши?")) return;
    const res = await fetch(`/api/admin/animals/${id}`, {
      method: "DELETE",
      headers
    });
    if (res.ok) {
      fetchList();
    } else {
      alert("Неуспешно бришење");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <NavBar />

      {/* Form */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <AnimateIn>
          <Card className="bg-white/70 backdrop-blur-md border">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-4">{editing ? "Уреди Животно" : "Додај Животно"}</h1>
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Име" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />
                <Select value={form.habitat} onValueChange={v=>setForm(f=>({...f, habitat:v}))}>
                  <SelectTrigger><SelectValue placeholder="Живеалиште" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vozduh">Воздух</SelectItem>
                    <SelectItem value="kopno">Копно</SelectItem>
                    <SelectItem value="voda">Вода</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Фамилија" value={form.family} onChange={e=>setForm(f=>({...f, family:e.target.value}))} />
                <Input placeholder="Животен век" value={form.lifespan} onChange={e=>setForm(f=>({...f, lifespan:e.target.value}))} />
                <Input placeholder="Плен (оддели со запирка)" value={form.prey} onChange={e=>setForm(f=>({...f, prey:e.target.value}))} />
                <Input placeholder="Предатори (оддели со запирка)" value={form.predators} onChange={e=>setForm(f=>({...f, predators:e.target.value}))} />
                <Select value={form.diet} onValueChange={v=>setForm(f=>({...f, diet:v}))}>
                  <SelectTrigger><SelectValue placeholder="Исхрана" /></SelectTrigger>
                  <SelectContent>
                    {DIETS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Потекло" value={form.origin} onChange={e=>setForm(f=>({...f, origin:e.target.value}))} />
                <Input placeholder="Звук (URL)" value={form.sound} onChange={e=>setForm(f=>({...f, sound:e.target.value}))} />
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit">{editing ? "Зачувај" : "Додади"}</Button>
                  {editing && <Button type="button" variant="outline" onClick={resetForm}>Откажи</Button>}
                </div>
              </form>
            </CardContent>
          </Card>
        </AnimateIn>
      </section>

      {/* Filters + Table */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-4">
          <div className="md:w-1/3">
            <Input placeholder="Пребарувај по име..." value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <div className="md:w-1/3">
            <Select value={habitatFilter} onValueChange={setHabitatFilter}>
              <SelectTrigger><SelectValue placeholder="Филтер по живеалиште" /></SelectTrigger>
              <SelectContent>
                {HABITATS.map(h => <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:w-1/3 flex gap-2">
            <Button variant="outline" onClick={fetchList}>Освежи</Button>
          </div>
        </div>

        <Card className="bg-white/70 backdrop-blur-md border">
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="px-4 py-2">Име</th>
                  <th className="px-4 py-2">Живеалиште</th>
                  <th className="px-4 py-2">Фамилија</th>
                  <th className="px-4 py-2">Исхрана</th>
                  <th className="px-4 py-2">Акции</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td className="px-4 py-3 text-gray-500" colSpan={5}>Вчитување...</td></tr>
                )}
                {!loading && list.length === 0 && (
                  <tr><td className="px-4 py-3 text-gray-500" colSpan={5}>Нема резултати</td></tr>
                )}
                {!loading && list.map(a => (
                  <tr key={a._id} className="border-t">
                    <td className="px-4 py-3">{a.name}</td>
                    <td className="px-4 py-3">{a.habitat}</td>
                    <td className="px-4 py-3">{a.family || "—"}</td>
                    <td className="px-4 py-3">{a.diet || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(a)}>Уреди</Button>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(a._id)}>Избриши</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
