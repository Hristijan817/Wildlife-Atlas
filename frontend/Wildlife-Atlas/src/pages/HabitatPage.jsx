import { useEffect, useMemo, useState } from "react";
import { useApi } from "@/services/api";
import AnimalCard from "@/components/AnimalCard";

const TITLES = {
  kopno: "Копно (Land)",
  voda: "Вода (Water)",
  vozduh: "Воздух (Air)",
};

export default function HabitatPage({ habitat }) {
  const { get } = useApi();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await get("/api/animals"); // if your API supports ?habitat=, you can use `/api/animals?habitat=${habitat}`
        const data = await res.json();
        if (!cancelled) setAll(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setAll([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [get]);

  const list = useMemo(
    () => all.filter((a) => a.habitat === habitat),
    [all, habitat]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">{TITLES[habitat] || "Animals"}</h1>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : list.length === 0 ? (
        <div className="text-sm text-muted-foreground">No animals yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((a) => (
            <AnimalCard key={a._id} animal={a} />
          ))}
        </div>
      )}
    </div>
  );
}
