// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "../services/api";
import { Info, Image as ImageIcon, Video, BookOpen, Star } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const HABITATS = [
  { value: "", label: "Habitat" },
  { value: "kopno", label: "Kopno" },
  { value: "voda", label: "Voda" },
  { value: "vozduh", label: "Vozduh" },
];

export default function AdminDashboard() {
  const { get, post, put, del } = useApi();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "",
    size: "",
    habitat: "",
    family: "",
    lifespan: "",
    diet: "",
    description: "",
    summary: "",
    publications: "",
    featured: true,
  });

  const [editingId, setEditingId] = useState(null);

  const [cardFile, setCardFile] = useState(null);
  const [cardPreview, setCardPreview] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoNames, setVideoNames] = useState([]);

  async function fetchAnimals() {
    try {
      const res = await get("/api/animals");
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch {
      setList([]);
    }
  }

  useEffect(() => {
    fetchAnimals();
  }, []);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function onChangeHabitat(e) {
    setForm((prev) => ({ ...prev, habitat: e.target.value }));
  }

  function onChangeCardFile(e) {
    const f = e.target.files?.[0] || null;
    setCardFile(f);
    setCardPreview(f ? URL.createObjectURL(f) : "");
  }

  function onChangeImageFiles(e) {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  }

  function onChangeVideoFiles(e) {
    const files = Array.from(e.target.files || []);
    setVideoFiles(files);
    setVideoNames(files.map((f) => f.name));
  }

  function validate() {
    if (!form.name.trim()) return "Name is required.";
    if (!["kopno", "voda", "vozduh"].includes(form.habitat)) {
      return "Habitat must be one of: kopno, voda, vozduh.";
    }
    return "";
  }

  function resetForm() {
    setForm({
      name: "",
      type: "",
      size: "",
      habitat: "",
      family: "",
      lifespan: "",
      diet: "",
      description: "",
      summary: "",
      publications: "",
      featured: true,
    });
    setEditingId(null);
    setCardFile(null);
    setCardPreview("");
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFiles([]);
    setVideoNames([]);
  }

  function onEdit(animal) {
    const publications = animal.publications 
      ? animal.publications.map(p => `${p.title}${p.url ? '|' + p.url : ''}`).join('\n')
      : '';
    
    setForm({
      name: animal.name || "",
      type: animal.type || "",
      size: animal.size || "",
      habitat: animal.habitat || "",
      family: animal.family || "",
      lifespan: animal.lifespan || "",
      diet: animal.diet || "",
      description: animal.description || "",
      summary: animal.summary || "",
      publications: publications,
      featured: animal.featured !== false,
    });
    
    setEditingId(animal._id);
    
    // Set existing card image preview if available
    if (animal.cardImage) {
      const imgSrc = animal.cardImage.startsWith("http")
        ? animal.cardImage
        : `${API}${animal.cardImage}`;
      setCardPreview(imgSrc);
    }
    
    // Clear file inputs since we can't pre-populate file inputs
    setCardFile(null);
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFiles([]);
    setVideoNames([]);
  }

  function onCancelEdit() {
    resetForm();
  }

  async function onCreate(e) {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("habitat", form.habitat);
      if (form.type) fd.append("type", form.type.trim());
      if (form.size) fd.append("size", form.size.trim());
      if (form.family) fd.append("family", form.family.trim());
      if (form.lifespan) fd.append("lifespan", form.lifespan.trim());
      if (form.diet) fd.append("diet", form.diet.trim());
      if (form.description) fd.append("description", form.description.trim());
      if (form.summary) fd.append("summary", form.summary.trim());
      fd.append("featured", String(!!form.featured));

      if (form.publications) {
        const pubs = form.publications
          .split("\n")
          .map((line) => {
            const [title, url] = line.split("|").map((s) => s.trim());
            return title ? { title, url: url || "" } : null;
          })
          .filter(Boolean);
        fd.append("publications", JSON.stringify(pubs));
      }

      if (cardFile) fd.append("cardImage", cardFile);
      imageFiles.forEach((f) => fd.append("images", f));
      videoFiles.forEach((f) => fd.append("videos", f));

      let res;
      if (editingId) {
        res = await put(`/api/animals/${editingId}`, fd);
      } else {
        res = await post("/api/animals", fd);
      }

      if (!res.ok) {
        const msg = await safeMessage(res);
        throw new Error(msg || `${editingId ? 'Update' : 'Create'} failed (${res.status})`);
      }

      await fetchAnimals();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this animal?")) return;
    try {
      const res = await del(`/api/animals/${id}`);
      if (!res.ok) {
        const msg = await safeMessage(res);
        throw new Error(msg || "Delete failed");
      }
      setList((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  // Quick stats
  const totalAnimals = list.length;
  const featuredCount = list.filter((a) => a.featured !== false).length;
  const habitatsCovered = new Set(list.map((a) => a.habitat)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-blue-200 p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent drop-shadow-md">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/70 backdrop-blur-sm shadow-md p-4 text-center">
            <p className="text-sm text-gray-500">Total Animals</p>
            <p className="text-2xl font-bold text-slate-800">{totalAnimals}</p>
          </div>
          <div className="rounded-2xl bg-white/70 backdrop-blur-sm shadow-md p-4 text-center">
            <p className="text-sm text-gray-500">Featured</p>
            <p className="text-2xl font-bold text-yellow-600">{featuredCount}</p>
          </div>
          <div className="rounded-2xl bg-white/70 backdrop-blur-sm shadow-md p-4 text-center">
            <p className="text-sm text-gray-500">Habitats Covered</p>
            <p className="text-2xl font-bold text-sky-600">{habitatsCovered}</p>
          </div>
        </div>

        {/* Add Animal Form */}
        <Card className="shadow-lg hover:shadow-xl transition rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800 bg-gradient-to-r from-sky-100 to-transparent px-3 py-2 rounded-lg">
                <Info className="w-6 h-6 text-sky-600" /> {editingId ? 'Edit Animal' : 'Add New Animal'}
              </h2>
              {editingId && (
                <Button 
                  onClick={onCancelEdit}
                  variant="outline"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel Edit
                </Button>
              )}
            </div>

            {error && (
              <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={onCreate} className="space-y-8">
              {/* Section: Basic Info */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-medium text-slate-700 border-b pb-1">
                  <Info className="w-5 h-5 text-sky-500" /> Basic Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input name="name" value={form.name} onChange={onChange} placeholder="Name" required />
                  <select
                    name="habitat"
                    value={form.habitat}
                    onChange={onChangeHabitat}
                    className="h-10 rounded-md border px-3 text-sm"
                    required
                  >
                    {HABITATS.map((h) => (
                      <option key={h.value} value={h.value} disabled={h.value === ""}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                  <Input name="type" value={form.type} onChange={onChange} placeholder="Type (optional)" />
                  <Input name="size" value={form.size} onChange={onChange} placeholder="Size (optional)" />
                  <Input name="family" value={form.family} onChange={onChange} placeholder="Family (optional)" />
                  <Input name="lifespan" value={form.lifespan} onChange={onChange} placeholder="Lifespan (optional)" />
                  <Input name="diet" value={form.diet} onChange={onChange} placeholder="Diet (optional)" />
                  <Input name="description" value={form.description} onChange={onChange} placeholder="Description (optional)" />
                </div>
              </div>

              {/* Section: Media */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-medium text-slate-700 border-b pb-1">
                  <ImageIcon className="w-5 h-5 text-sky-500" /> Media Uploads
                </h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Card image</label>
                  <input type="file" accept="image/*" onChange={onChangeCardFile} className="block w-full rounded-md border p-2 text-sm" />
                  {cardPreview && <img src={cardPreview} alt="preview" className="mt-2 h-40 w-auto rounded-md border object-cover" />}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Additional Images</label>
                  <input type="file" accept="image/*" multiple onChange={onChangeImageFiles} className="block w-full rounded-md border p-2 text-sm" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviews.map((src, i) => (
                      <img key={i} src={src} alt={`img-${i}`} className="h-24 w-24 object-cover rounded border" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Video className="w-4 h-4 text-sky-500" /> Videos
                  </label>
                  <input type="file" accept="video/*" multiple onChange={onChangeVideoFiles} className="block w-full rounded-md border p-2 text-sm" />
                  <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                    {videoNames.map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Section: Extra Details */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-medium text-slate-700 border-b pb-1">
                  <BookOpen className="w-5 h-5 text-sky-500" /> Extra Details
                </h3>
                <textarea
                  name="publications"
                  value={form.publications}
                  onChange={onChange}
                  placeholder="Publications (Title|URL per line)"
                  className="min-h-[90px] rounded-md border p-2 text-sm w-full"
                />
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={onChange}
                  placeholder="Short summary (1–2 lines)"
                  className="min-h-[90px] rounded-md border p-2 text-sm w-full"
                />
                <label className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} />
                  Show on habitat cards
                </label>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 shadow"
                >
                  {loading ? (editingId ? "Updating…" : "Saving…") : (editingId ? "Update Animal" : "Add Animal")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Animals Table */}
        <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-100 shadow">
              <tr className="text-left border-b">
                <th className="p-3">Card</th>
                <th className="p-3">Name</th>
                <th className="p-3">Habitat</th>
                <th className="p-3">Diet</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    <div className="animate-pulse flex justify-center gap-4">
                      <div className="w-16 h-12 bg-slate-200 rounded" />
                      <div className="w-32 h-6 bg-slate-200 rounded" />
                      <div className="w-24 h-6 bg-slate-200 rounded" />
                    </div>
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">🦊</span>
                      <p>No animals yet. Add your first one!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((a, idx) => {
                  const imgSrc = a.cardImage
                    ? a.cardImage.startsWith("http")
                      ? a.cardImage
                      : `${API}${a.cardImage}`
                    : null;

                  return (
                    <tr key={a._id} className={`${idx % 2 === 0 ? "bg-slate-50/70" : "bg-white/70"} border-b hover:bg-sky-50 transition ${editingId === a._id ? "bg-sky-100/70" : ""}`}>
                      <td className="p-3">
                        {imgSrc ? (
                          <img src={imgSrc} alt="" className="w-16 h-12 object-cover rounded border" />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-3 font-medium">
                        <div className="flex flex-col">
                          <span>{a.name}</span>
                          {a.summary ? <span className="text-xs text-gray-500 line-clamp-2">{a.summary}</span> : null}
                        </div>
                      </td>
                      <td className="p-3">{a.habitat}</td>
                      <td className="p-3">{a.diet || "—"}</td>
                      <td className="p-3">{a.featured === false ? "—" : "⭐"}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => onEdit(a)}
                            variant="outline"
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 border-0"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(a._id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

async function safeMessage(res) {
  try {
    const j = await res.json();
    return j?.message || j?.error;
  } catch {
    return await res.text();
  }
}