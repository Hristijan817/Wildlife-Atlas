import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useApi } from "@/services/api";
import { motion } from "framer-motion";
import { Leaf, Ruler, MapPin, BookOpen, Play } from "lucide-react";

export default function AnimalDetails() {
  const { id } = useParams();
  const { get, del } = useApi();
  const getRef = useRef(get);
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        if (err.name !== "AbortError") setAnimal(null);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    const res = await del(`/api/animals/${id}`);
    if (res.ok) navigate("/");
    else {
      const errMsg = await res.json().catch(() => ({}));
      alert(errMsg.message || "Failed to delete");
    }
  };

  const videoRenderers = useMemo(() => {
    const isEmbed = (url = "") =>
      /^(https?:)?\/\/(www\.)?(youtube\.com|youtu\.be|player\.vimeo\.com)/i.test(url);
    const isFile = (url = "") =>
      /\.(mp4|webm|ogg)(\?|#|$)/i.test(url) || url.startsWith("/uploads/");
    return { isEmbed, isFile };
  }, []);

  if (loading) return <p className="p-6 text-gray-400">Loading...</p>;
  if (!animal) return <p className="p-6 text-red-400">Animal not found.</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div
        className="relative h-[420px] w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(/public/kopno-bg.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-6"
        >
          <div className="bg-gray-800/80 rounded-2xl p-10 max-w-3xl shadow-xl">
            <h1 className="text-6xl font-extrabold text-white mb-5 leading-tight">
              {animal.name}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed font-light">
              {animal.summary}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 space-y-20">
        {/* Metadata */}
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
              className="p-8 rounded-2xl bg-gray-800 shadow-md border border-gray-700 
                         hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-6 h-6 text-${color}-400`} />
                <h5 className="uppercase text-xs tracking-wider font-semibold text-gray-400">
                  {label}
                </h5>
              </div>
              <p className="text-2xl font-semibold text-gray-100 leading-snug">
                {value || "—"}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <hr className="border-gray-700/50" />

        {/* About */}
        <section className="bg-gray-800 rounded-2xl p-8 shadow-md border border-gray-700">
          <h2 className="text-3xl font-bold mb-5 text-emerald-400">About</h2>
          <p className="text-lg leading-relaxed font-light text-gray-300">
            {animal.description}
          </p>
        </section>

        <hr className="border-gray-700/50" />

        {/* Gallery */}
        {animal.images?.length > 0 && (
          <section className="bg-gray-800 rounded-2xl p-8 shadow-md border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-emerald-400">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {animal.images.map((img, idx) => (
                <motion.img
                  key={idx}
                  src={img}
                  alt={animal.name}
                  whileHover={{ scale: 1.03 }}
                  className="w-full rounded-xl shadow-md border border-gray-700"
                />
              ))}
            </div>
          </section>
        )}

        {animal.videos?.length > 0 && <hr className="border-gray-700/50" />}

        {/* Videos */}
        {animal.videos?.length > 0 && (
          <section className="bg-gray-800 rounded-2xl p-8 shadow-md border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-emerald-400">
              <Play className="w-6 h-6" /> Videos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {animal.videos.map((vid, idx) => {
                if (videoRenderers.isEmbed(vid))
                  return (
                    <div
                      key={idx}
                      className="aspect-video rounded-xl overflow-hidden shadow-md border border-gray-700 bg-gray-900"
                    >
                      <iframe src={vid} className="w-full h-full" allowFullScreen />
                    </div>
                  );
                if (videoRenderers.isFile(vid))
                  return (
                    <div
                      key={idx}
                      className="aspect-video rounded-xl overflow-hidden shadow-md border border-gray-700 bg-gray-900"
                    >
                      <video src={vid} controls className="w-full h-full" />
                    </div>
                  );
                return (
                  <div
                    key={idx}
                    className="aspect-video rounded-xl overflow-hidden shadow-md border border-gray-700 bg-gray-900"
                  >
                    <iframe src={vid} className="w-full h-full" allowFullScreen />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {animal.publications?.length > 0 && <hr className="border-gray-700/50" />}

        {/* Publications */}
        {animal.publications?.length > 0 && (
          <section className="bg-gray-800 rounded-2xl p-8 shadow-md border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-emerald-400">
              <BookOpen className="w-6 h-6" /> Publications
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {animal.publications.map((pub, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-900 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition"
                >
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-emerald-300 hover:underline font-medium"
                    >
                      {pub.title}
                    </a>
                  ) : (
                    <p className="text-gray-200 text-lg">{pub.title}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <hr className="border-gray-700/50" />

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => navigate(`/animals/${id}/edit`)}
            className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition text-sm uppercase tracking-wide"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition text-sm uppercase tracking-wide"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
