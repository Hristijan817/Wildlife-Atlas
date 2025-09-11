import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function AnimalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const fetchAnimal = async () => {
      try {
        const res = await fetch(`${API}/api/animals/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        if (active) {
          setAnimal(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchAnimal();
    return () => { active = false };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${animal.name}?`)) return;
    try {
      const res = await fetch(`${API}/api/animals/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete animal");
      alert("Animal deleted successfully");
      navigate("/"); // redirect to home or animal list page
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API}/api/animals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 📝 Example update: you can replace this with a form later
          name: animal.name + " (Updated)",
        }),
      });
      if (!res.ok) throw new Error("Failed to update animal");
      const updated = await res.json();
      setAnimal(updated);
      alert("Animal updated successfully");
    } catch (err) {
      alert("Error updating: " + err.message);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!animal) return <p className="p-6">No animal found.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-[400px] w-full bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(${animal.cardImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-6 pb-10 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-bold text-white">{animal.name}</h1>
            <p className="text-lg text-gray-200">{animal.summary}</p>
          </div>
          {/* Admin buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pt-8">
        {/* … keep your metadata, about, gallery, videos, publications … */}
      </div>
    </div>
  );
}
