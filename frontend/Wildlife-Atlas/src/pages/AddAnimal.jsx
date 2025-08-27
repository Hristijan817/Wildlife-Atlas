import { useState } from "react";
import AdminForm from "@/components/AdminForm";
import { useApi } from "@/services/api";

export default function AddAnimal() {
  const { post } = useApi();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(payload) {
    setLoading(true);
    try {
      const res = await post("/api/animals", payload);
      if (!res.ok) throw new Error("Create failed");
      alert("Animal added successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Add New Animal</h1>
      <AdminForm onSubmit={handleSubmit} submitting={loading} submitText="Add Animal" />
    </div>
  );
}
