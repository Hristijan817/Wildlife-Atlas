import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useApi } from "@/services/api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { get, del } = useApi();
  const [list, setList] = useState([]);

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

  async function onDelete(id) {
    if (!confirm("Delete this animal?")) return;
    try {
      const res = await del(`/api/animals/${id}`);
      if (!res.ok) throw new Error("Delete failed");
      setList((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin • Animals</h1>
        {/* ✅ Link to AddAnimal page */}
        <Link to="/admin/add">
          <Button>Add Animal</Button>
        </Link>
      </div>

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
            {list.map((a) => (
              <tr key={a._id} className="border-b hover:bg-black/5">
                <td className="p-2">
                  {a.cardImage ? (
                    <img
                      src={a.cardImage}
                      alt=""
                      className="w-16 h-12 object-cover rounded border"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="p-2 font-medium">{a.name}</td>
                <td className="p-2">{a.habitat}</td>
                <td className="p-2">{a.diet}</td>
                <td className="p-2">{a.featured === false ? "No" : "Yes"}</td>
                <td className="p-2">
                  <Button variant="destructive" onClick={() => onDelete(a._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
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
