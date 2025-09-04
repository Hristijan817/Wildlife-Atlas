import { Link } from "react-router-dom";

export default function AnimalCard({ animal }) {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-muted">
        {animal.cardImage ? (
          <img
            src={animal.cardImage}
            alt={animal.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{animal.name}</h3>
          {animal.featured !== false && (
            <span className="text-xs px-2 py-0.5 rounded bg-primary text-primary-foreground">
              Featured
            </span>
          )}
        </div>

        {animal.summary ? (
          <p className="text-sm text-muted-foreground line-clamp-2">{animal.summary}</p>
        ) : animal.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2">{animal.description}</p>
        ) : null}

        <div className="mt-auto pt-2">
          <Link
            to={`/animals/${animal._id}`}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
