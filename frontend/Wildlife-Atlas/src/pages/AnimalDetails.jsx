import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "@/services/api";

export default function AnimalDetails() {
  const { id } = useParams();
  const { get } = useApi();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await get(`/api/animals/${id}`);
        const data = await res.json();
        if (!cancelled) setAnimal(data);
      } catch {
        if (!cancelled) setAnimal(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [get, id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!animal || animal?.error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <p className="text-sm text-muted-foreground">Animal not found.</p>
        <Link to="/" className="text-sm text-primary hover:underline">Back home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="text-sm text-primary hover:underline">← Back</Link>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 rounded-xl overflow-hidden border border-border bg-card">
          {animal.cardImage ? (
            <img
              src={animal.cardImage}
              alt={animal.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="aspect-[4/3] flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold">{animal.name}</h1>
          <div className="text-sm text-muted-foreground">
            <span className="mr-3">Habitat: <b>{animal.habitat}</b></span>
            {animal.family && <span className="mr-3">Family: <b>{animal.family}</b></span>}
            {animal.lifespan && <span className="mr-3">Lifespan: <b>{animal.lifespan}</b></span>}
            {animal.diet && <span>Diet: <b>{animal.diet}</b></span>}
          </div>

          {animal.summary && <p className="text-base">{animal.summary}</p>}
          {animal.description && <p className="text-sm text-muted-foreground">{animal.description}</p>}

          {Array.isArray(animal.prey) && animal.prey.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">Prey:</span> {animal.prey.join(", ")}
            </div>
          )}

          {Array.isArray(animal.predators) && animal.predators.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">Predators:</span> {animal.predators.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
