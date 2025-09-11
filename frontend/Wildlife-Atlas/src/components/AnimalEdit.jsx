import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AnimalEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    size: "",
    family: "",
    lifespan: "",
    diet: "",
    description: "",
    summary: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const res = await fetch(`${API}/api/animals/${id}`);
        if (!res.ok) throw new Error("Failed to load animal");
        const data = await res.json();
        setForm({
          name: data.name || "",
          size: data.size || "",
          family: data.family || "",
          lifespan: data.lifespan || "",
          diet: data.diet || "",
          description: data.description || "",
          summary: data.summary || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAnimal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/animals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update animal");
      await res.json();
      alert("Animal updated successfully");
      navigate(`/animals/${id}`); // redirect back to details
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Animal</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "size", "family", "lifespan", "diet", "summary"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 h-32"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(`/animals/${id}`)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
