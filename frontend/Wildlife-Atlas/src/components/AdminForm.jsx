import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HABITATS = [
  { value: "", label: "Habitat" },
  { value: "kopno", label: "Kopno" },
  { value: "voda", label: "Voda" },
  { value: "vozduh", label: "Vozduh" },
];

const DEFAULT_VALUES = {
  name: "",
  type: "",
  habitat: "",
  size: "",
  family: "",
  lifespan: "",
  diet: "",
  description: "",
  cardImage: "",
  images: "",
  videos: "",
  publications: "",
  summary: "",
  featured: true,
};

export default function AdminForm({
  initialValues = {},
  onSubmit,
  submitting = false,
  submitText = "Add Animal",
}) {
  const [values, setValues] = useState({ ...DEFAULT_VALUES, ...initialValues });
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onChangeHabitat = (e) => {
    setValues((prev) => ({ ...prev, habitat: e.target.value }));
  };

  const validate = () => {
    if (!values.name.trim()) return "Name is required.";
    if (!["kopno", "voda", "vozduh"].includes(values.habitat)) {
      return "Habitat must be one of: kopno, voda, vozduh.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");

    // Normalize arrays
    const payload = {
      ...values,
      images: values.images
        ? values.images.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      videos: values.videos
        ? values.videos.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      publications: values.publications
        ? values.publications
            .split("\n")
            .map((line) => {
              const [title, url] = line.split("|").map((s) => s.trim());
              return title ? { title, url: url || "" } : null;
            })
            .filter(Boolean)
        : [],
    };

    await onSubmit?.(payload);

    if (!initialValues || !initialValues._id) {
      setValues({ ...DEFAULT_VALUES });
    }
  };

  return (
    <Card className="bg-card text-card-foreground border border-border">
      <CardContent className="p-4 space-y-3">
        {error && (
          <div className="text-sm text-red-600 border border-red-300 bg-red-50 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <Input
            name="name"
            value={values.name}
            onChange={onChange}
            placeholder="Name"
            required
          />

          <select
            name="habitat"
            value={values.habitat}
            onChange={onChangeHabitat}
            className="h-10 rounded-md border border-border bg-background text-foreground px-3 text-sm"
            required
          >
            {HABITATS.map((h) => (
              <option
                key={h.value}
                value={h.value}
                disabled={h.value === ""}
              >
                {h.label}
              </option>
            ))}
          </select>

          <Input name="type" value={values.type} onChange={onChange} placeholder="Type" />
          <Input name="size" value={values.size} onChange={onChange} placeholder="Size" />
          <Input name="family" value={values.family} onChange={onChange} placeholder="Family" />
          <Input name="lifespan" value={values.lifespan} onChange={onChange} placeholder="Lifespan" />
          <Input name="diet" value={values.diet} onChange={onChange} placeholder="Diet" />
          <Input name="description" value={values.description} onChange={onChange} placeholder="Description" />

          <Input
            name="cardImage"
            value={values.cardImage}
            onChange={onChange}
            placeholder="Card image (URL)"
            className="md:col-span-3"
          />

          {/* ✅ New fields */}
          <Input
            name="images"
            value={values.images}
            onChange={onChange}
            placeholder="Images (comma-separated URLs)"
            className="md:col-span-3"
          />

          <Input
            name="videos"
            value={values.videos}
            onChange={onChange}
            placeholder="Videos (comma-separated URLs)"
            className="md:col-span-3"
          />

          <textarea
            name="publications"
            value={values.publications}
            onChange={onChange}
            placeholder="Publications (one per line, format: Title|URL)"
            className="min-h-[90px] rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground p-2 text-sm md:col-span-3"
          />

          <textarea
            name="summary"
            value={values.summary}
            onChange={onChange}
            placeholder="Short summary for card (1–2 lines)"
            className="min-h-[90px] rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground p-2 text-sm md:col-span-3"
          />

          <label className="flex items-center gap-2 text-sm md:col-span-3">
            <input
              type="checkbox"
              name="featured"
              checked={values.featured}
              onChange={onChange}
            />
            Show on habitat cards (featured)
          </label>

          <div className="md:col-span-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
