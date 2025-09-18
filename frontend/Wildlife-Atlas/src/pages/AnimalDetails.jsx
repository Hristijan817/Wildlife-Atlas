import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useApi } from "@/services/api";
import { motion } from "framer-motion";
import { Leaf, Ruler, MapPin, BookOpen, Play } from "lucide-react";

export default function AnimalDetails() {
  const { id } = useParams();
  const { get, del } = useApi();
  const getRef = useRef(get); // keep a stable reference to get()
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // keep ref updated if useApi returns a new function (but don't retrigger effect)
  useEffect(() => {
    getRef.current = get;
  }, [get]);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const res = await getRef.current(`/api/animals/${id}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`Failed to fetch animal (${res.status})`);
        const data = await res.json();
        setAnimal(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setAnimal(null);
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();

    return () => ctrl.abort();
    // IMPORTANT: only depend on id to avoid loops
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    const res = await del(`/api/animals/${id}`);
    if (res.ok) {
      navigate("/");
    } else {
      const errMsg = await res.json().catch(() => ({}));
      alert(errMsg.message || "Failed to delete");
    }
  };

  // helper: decide if a video is embeddable (iframe) or file (mp4/webm)
  const videoRenderers = useMemo(() => {
    const isEmbed = (url = "") =>
      /^(https?:)?\/\/(www\.)?(youtube\.com|youtu\.be|player\.vimeo\.com)/i.test(url);

    const isFile = (url = "") => /\.(mp4|webm|ogg)(\?|#|$)/i.test(url) || url.startsWith("/uploads/");

    return { isEmbed, isFile };
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!animal) return <p className="p-6 text-red-600">Animal not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-lime-100">
      {/* Hero Section */}
      <div
        className="relative h-[420px] w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(/public/kopno-bg.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-6"
        >
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 max-w-xl shadow-lg">
            <h1 className="text-5xl font-bold text-white drop-shadow-md mb-2">
              {animal.name}
            </h1>
            <p className="text-lg text-lime-100">{animal.summary}</p>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-10 space-y-16">
        {/* Metadata Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: "Type", value: animal.type, icon: Leaf, color: "emerald" },
            { label: "Size", value: animal.size, icon: Ruler, color: "amber" },
            { label: "Habitat", value: animal.habitat, icon: MapPin, color: "lime" },
          ].map(({ label, value, icon: Icon, color }, idx) => (
            <motion.div
              key={idx}
              className={`p-5 rounded-xl bg-white shadow-md border-t-4 border-${color}-400 
                          hover:shadow-xl hover:-translate-y-1 transition`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-6 h-6 text-${color}-600`} />
                <h5 className="uppercase text-sm font-semibold">{label}</h5>
              </div>
              <p className="text-xl text-gray-800">{value || "—"}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* About */}
        <section className="bg-emerald-50 rounded-xl p-6 border-l-4 border-emerald-400 shadow-inner">
          <h2 className="text-3xl font-semibold mb-4 text-emerald-800">About</h2>
          <p className="text-gray-700 leading-relaxed">{animal.description}</p>
        </section>

        {/* Gallery Section */}
        {animal.images?.length > 0 && (
          <section>
            <h2 className="text-3xl font-semibold mb-6 text-emerald-800">Gallery</h2>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {animal.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className="w-full rounded-xl shadow-md hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {animal.videos?.length > 0 && (
          <section>
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2 text-emerald-800">
              <Play className="w-6 h-6" /> Videos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {animal.videos.map((vid, idx) => {
                if (videoRenderers.isEmbed(vid)) {
                  return (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden shadow-md">
                      <iframe
                        src={vid}
                        title={`Video ${idx}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  );
                }
                if (videoRenderers.isFile(vid)) {
                  return (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden shadow-md">
                      <video src={vid} controls className="w-full h-full" />
                    </div>
                  );
                }
                // fallback (try iframe)
                return (
                  <div key={idx} className="aspect-video rounded-xl overflow-hidden shadow-md">
                    <iframe
                      src={vid}
                      title={`Video ${idx}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Publications */}
        {animal.publications?.length > 0 && (
          <section>
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2 text-emerald-800">
              <BookOpen className="w-6 h-6" /> Publications
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {animal.publications.map((pub, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition"
                >
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {pub.title}
                    </a>
                  ) : (
                    <p>{pub.title}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/animals/${id}/edit`)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md shadow-md"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
