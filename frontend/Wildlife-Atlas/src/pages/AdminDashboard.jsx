import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/services/api";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const HABITATS = [
  { value: "", label: "Habitat" },
  { value: "kopno", label: "Kopno" },
  { value: "voda", label: "Voda" },
  { value: "vozduh", label: "Vozduh" },
];

export default function AdminDashboard() {
  const { get, post, del } = useApi();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // form fields (no cardImage URL here anymore)
  const [form, setForm] = useState({
    name: "",
    type: "",
    habitat: "",
    family: "",
    lifespan: "",
    diet: "",
    description: "",
    summary: "",
    featured: true,
  });

  // image file state + preview
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

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

  function onChangeFile(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview("");
    }
  }

  function validate() {
    if (!form.name.trim()) return "Name is required.";
    if (!["kopno", "voda", "vozduh"].includes(form.habitat)) {
      return "Habitat must be one of: kopno, voda, vozduh.";
    }
    // Image is optional on client; backend accepts without file.
    return "";
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
      // Build FormData for Multer (IMPORTANT: do not set Content-Type header yourself)
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("habitat", form.habitat);
      if (form.type) fd.append("type", form.type.trim());
      if (form.family) fd.append("family", form.family.trim());
      if (form.lifespan) fd.append("lifespan", form.lifespan.trim());
      if (form.diet) fd.append("diet", form.diet.trim());
      if (form.description) fd.append("description", form.description.trim());
      if (form.summary) fd.append("summary", form.summary.trim());
      fd.append("featured", String(!!form.featured));
      if (file) fd.append("cardImage", file); // <-- field name for Multer

      const res = await post("/api/animals", fd);
      if (!res.ok) {
        const msg = await safeMessage(res);
        throw new Error(msg || `Create failed (${res.status})`);
      }

      await fetchAnimals();
      // reset form
      setForm({
        name: "",
        type: "",
        habitat: "",
        family: "",
        lifespan: "",
        diet: "",
        description: "",
        summary: "",
        featured: true,
      });
      setFile(null);
      setPreview("");
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Add New Animal</h1>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Name"
              required
            />

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
            <Input name="family" value={form.family} onChange={onChange} placeholder="Family (optional)" />
            <Input name="lifespan" value={form.lifespan} onChange={onChange} placeholder="Lifespan (optional)" />
            <Input name="diet" value={form.diet} onChange={onChange} placeholder="Diet (optional)" />
            <Input name="description" value={form.description} onChange={onChange} placeholder="Description (optional)" />

            {/* Image file input + preview (replaces URL field) */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium">Card image (file)</label>
              <input
                type="file"
                accept="image/*"
                onChange={onChangeFile}
                className="block w-full rounded-md border p-2 text-sm"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 h-40 w-auto rounded-md border object-cover"
                />
              )}
            </div>

            <textarea
              name="summary"
              value={form.summary}
              onChange={onChange}
              placeholder="Short summary for card (1–2 lines) (optional)"
              className="min-h-[90px] rounded-md border p-2 text-sm md:col-span-3"
            />

            <label className="flex items-center gap-2 text-sm md:col-span-3">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={onChange}
              />
              Show on habitat cards (featured)
            </label>

            <div className="md:col-span-3 flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Add Animal"}
              </Button>

              {/* Debug payload (remove after testing) */}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log("Will POST /api/animals (FormData):", {
                    ...form,
                    fileSelected: !!file,
                  });
                }}
              >
                Debug payload
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Card</th>
              <th className="p-2">Name</th>
              <th className="p-2">Habitat</th>
              <th className="p-2">Diet</th>
              <th className="p-2">Featured</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => {
              // Support both absolute URLs and backend-served /uploads/ paths
              const imgSrc = a.cardImage
                ? (a.cardImage.startsWith("http") ? a.cardImage : `${API}${a.cardImage}`)
                : null;

              return (
                <tr key={a._id} className="border-b hover:bg-black/5">
                  <td className="p-2">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt=""
                        className="w-16 h-12 object-cover rounded border"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-2 font-medium">
                    <div className="flex flex-col">
                      <span>{a.name}</span>
                      {a.summary ? (
                        <span className="text-xs text-gray-500 line-clamp-2">
                          {a.summary}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="p-2">{a.habitat}</td>
                  <td className="p-2">{a.diet || "—"}</td>
                  <td className="p-2">{a.featured === false ? "No" : "Yes"}</td>
                  <td className="p-2">
                    <Button variant="destructive" onClick={() => onDelete(a._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  No animals yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
