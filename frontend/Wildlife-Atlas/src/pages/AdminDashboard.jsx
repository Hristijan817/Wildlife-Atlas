// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "../services/api";
import { Info, Image as ImageIcon, Video, BookOpen, Star, Plus, Edit3, Trash2, BarChart3, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const HABITATS = [
  { value: "", label: "Habitat" },
  { value: "kopno", label: "Kopno" },
  { value: "voda", label: "Voda" },
  { value: "vozduh", label: "Vozduh" },
];

const ANIMAL_TYPES = [
  { value: "", label: "Select Animal Type" },
  { value: "mammal", label: "Mammal" },
  { value: "bird", label: "Bird" },
  { value: "fish", label: "Fish" },
  { value: "reptile", label: "Reptile" },
];

const DIET_TYPES = [
  { value: "", label: "Select Diet Type" },
  { value: "omnivore", label: "Omnivore" },
  { value: "carnivore", label: "Carnivore" },
  { value: "herbivore", label: "Herbivore" },
];

export default function AdminDashboard() {
  const { get, post, put, del } = useApi();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "",
    sizeMin: "",
    sizeMax: "",
    sizeUnit: "cm",
    habitat: "",
    family: "",
    lifespanMin: "",
    lifespanMax: "",
    lifespanUnit: "years",
    diet: "",
    description: "",
    summary: "",
    publications: "",
    featured: true,
  });

  const [editingId, setEditingId] = useState(null);

  const [cardFile, setCardFile] = useState(null);
  const [cardPreview, setCardPreview] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoNames, setVideoNames] = useState([]);

  // New state for existing media when editing
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [videosToDelete, setVideosToDelete] = useState([]);

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

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function onChangeHabitat(e) {
    setForm((prev) => ({ ...prev, habitat: e.target.value }));
  }

  function onChangeCardFile(e) {
    const f = e.target.files?.[0] || null;
    setCardFile(f);
    setCardPreview(f ? URL.createObjectURL(f) : "");
  }

  // Modified to add individual images
  function onAddImages(e) {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  }

  // Function to remove individual images
  function removeImage(index) {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      // Clean up the URL object
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }

  // Function to remove existing images (mark for deletion)
  function removeExistingImage(imagePath) {
    setImagesToDelete(prev => [...prev, imagePath]);
    setExistingImages(prev => prev.filter(img => img !== imagePath));
  }

  // Modified to add individual videos
  function onAddVideos(e) {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      setVideoFiles(prev => [...prev, ...newFiles]);
      setVideoNames(prev => [...prev, ...newFiles.map(f => f.name)]);
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  }

  // Function to remove individual videos
  function removeVideo(index) {
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
    setVideoNames(prev => prev.filter((_, i) => i !== index));
  }

  // Function to remove existing videos (mark for deletion)
  function removeExistingVideo(videoPath) {
    setVideosToDelete(prev => [...prev, videoPath]);
    setExistingVideos(prev => prev.filter(vid => vid !== videoPath));
  }

  function validate() {
    if (!form.name.trim()) return "Name is required.";
    if (!["kopno", "voda", "vozduh"].includes(form.habitat)) {
      return "Habitat must be one of: kopno, voda, vozduh.";
    }
    return "";
  }

  function resetForm() {
    setForm({
      name: "",
      type: "",
      sizeMin: "",
      sizeMax: "",
      sizeUnit: "cm",
      habitat: "",
      family: "",
      lifespanMin: "",
      lifespanMax: "",
      lifespanUnit: "years",
      diet: "",
      description: "",
      summary: "",
      publications: "",
      featured: true,
    });
    setEditingId(null);
    setCardFile(null);
    setCardPreview("");
    setImageFiles([]);
    // Clean up preview URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setVideoFiles([]);
    setVideoNames([]);
    // Reset existing media state
    setExistingImages([]);
    setExistingVideos([]);
    setImagesToDelete([]);
    setVideosToDelete([]);
  }

  function onEdit(animal) {
    const publications = animal.publications 
      ? animal.publications.map(p => `${p.title}${p.url ? '|' + p.url : ''}`).join('\n')
      : '';
    
    // Parse size range from existing data (e.g., "20-100 cm" or "20cm")
    let sizeMin = "", sizeMax = "", sizeUnit = "cm";
    if (animal.size) {
      const sizeMatch = animal.size.match(/(\d+)(?:-(\d+))?\s*(cm|m|mm)?/i);
      if (sizeMatch) {
        sizeMin = sizeMatch[1] || "";
        sizeMax = sizeMatch[2] || "";
        sizeUnit = sizeMatch[3] || "cm";
      }
    }
    
    // Parse lifespan range from existing data (e.g., "2-5 years" or "3 years")
    let lifespanMin = "", lifespanMax = "", lifespanUnit = "years";
    if (animal.lifespan) {
      const lifespanMatch = animal.lifespan.match(/(\d+)(?:-(\d+))?\s*(years?|months?)?/i);
      if (lifespanMatch) {
        lifespanMin = lifespanMatch[1] || "";
        lifespanMax = lifespanMatch[2] || "";
        lifespanUnit = lifespanMatch[3] || "years";
      }
    }
    
    setForm({
      name: animal.name || "",
      type: animal.type || "",
      sizeMin,
      sizeMax,
      sizeUnit,
      habitat: animal.habitat || "",
      family: animal.family || "",
      lifespanMin,
      lifespanMax,
      lifespanUnit,
      diet: animal.diet || "",
      description: animal.description || "",
      summary: animal.summary || "",
      publications: publications,
      featured: animal.featured !== false,
    });
    
    setEditingId(animal._id);
    
    // Set existing card image preview if available
    if (animal.cardImage) {
      const imgSrc = animal.cardImage.startsWith("http")
        ? animal.cardImage
        : `${API}${animal.cardImage}`;
      setCardPreview(imgSrc);
    }
    
    // Load existing images and videos
    setExistingImages(animal.images || []);
    setExistingVideos(animal.videos || []);
    
    // Clear file inputs since we can't pre-populate file inputs
    setCardFile(null);
    setImageFiles([]);
    // Clean up existing preview URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setVideoFiles([]);
    setVideoNames([]);
    
    // Reset deletion arrays
    setImagesToDelete([]);
    setVideosToDelete([]);
  }

  function onCancelEdit() {
    resetForm();
  }

  async function onCreate(e) {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("habitat", form.habitat);
      if (form.type) fd.append("type", form.type);
      
      // Build size string from range values
      if (form.sizeMin || form.sizeMax) {
        let sizeString = "";
        if (form.sizeMin && form.sizeMax && form.sizeMin !== form.sizeMax) {
          sizeString = `${form.sizeMin}-${form.sizeMax} ${form.sizeUnit}`;
        } else if (form.sizeMin) {
          sizeString = `${form.sizeMin} ${form.sizeUnit}`;
        } else if (form.sizeMax) {
          sizeString = `${form.sizeMax} ${form.sizeUnit}`;
        }
        if (sizeString) fd.append("size", sizeString);
      }
      
      if (form.family) fd.append("family", form.family.trim());
      
      // Build lifespan string from range values
      if (form.lifespanMin || form.lifespanMax) {
        let lifespanString = "";
        if (form.lifespanMin && form.lifespanMax && form.lifespanMin !== form.lifespanMax) {
          lifespanString = `${form.lifespanMin}-${form.lifespanMax} ${form.lifespanUnit}`;
        } else if (form.lifespanMin) {
          lifespanString = `${form.lifespanMin} ${form.lifespanUnit}`;
        } else if (form.lifespanMax) {
          lifespanString = `${form.lifespanMax} ${form.lifespanUnit}`;
        }
        if (lifespanString) fd.append("lifespan", lifespanString);
      }
      
      if (form.diet) fd.append("diet", form.diet);
      if (form.description) fd.append("description", form.description.trim());
      if (form.summary) fd.append("summary", form.summary.trim());
      fd.append("featured", String(!!form.featured));

      if (form.publications) {
        const pubs = form.publications
          .split("\n")
          .map((line) => {
            const [title, url] = line.split("|").map((s) => s.trim());
            return title ? { title, url: url || "" } : null;
          })
          .filter(Boolean);
        fd.append("publications", JSON.stringify(pubs));
      }

      if (cardFile) fd.append("cardImage", cardFile);
      imageFiles.forEach((f) => fd.append("images", f));
      videoFiles.forEach((f) => fd.append("videos", f));

      // When editing, send arrays of media to delete
      if (editingId) {
        if (imagesToDelete.length > 0) {
          fd.append("imagesToDelete", JSON.stringify(imagesToDelete));
        }
        if (videosToDelete.length > 0) {
          fd.append("videosToDelete", JSON.stringify(videosToDelete));
        }
      }

      let res;
      if (editingId) {
        res = await put(`/api/animals/${editingId}`, fd);
      } else {
        res = await post("/api/animals", fd);
      }

      if (!res.ok) {
        const msg = await safeMessage(res);
        throw new Error(msg || `${editingId ? 'Update' : 'Create'} failed (${res.status})`);
      }

      await fetchAnimals();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this animal?")) return;
    try {
      const res = await del(`/api/animals/${id}`);
      if (!res.ok) {
        const msg = await safeMessage(res);
        throw new Error(msg || "Delete failed");
      }
      setList((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  // Quick stats
  const totalAnimals = list.length;
  const featuredCount = list.filter((a) => a.featured !== false).length;
  const habitatsCovered = new Set(list.map((a) => a.habitat)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-purple-50/30 to-cyan-100/20" />
        
        {/* Floating geometric elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-cyan-200/25 to-blue-300/20 rounded-full blur-3xl transform translate-x-40 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-100/20 to-cyan-200/15 rounded-full blur-2xl transform -translate-x-32 -translate-y-32" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(99 102 241) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-xl shadow-indigo-500/10">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-slate-700 text-lg font-light max-w-2xl mx-auto">
            Manage your wildlife collection with powerful tools and intuitive controls
          </p>
        </div>

        {/* Premium Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Total Animals",
              value: totalAnimals,
              icon: Info,
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-50 to-cyan-50",
              shadowColor: "shadow-blue-500/20"
            },
            {
              title: "Featured",
              value: featuredCount,
              icon: Star,
              gradient: "from-amber-500 to-orange-500",
              bgGradient: "from-amber-50 to-orange-50",
              shadowColor: "shadow-amber-500/20"
            },
            {
              title: "Habitats Covered",
              value: habitatsCovered,
              icon: BarChart3,
              gradient: "from-emerald-500 to-teal-500",
              bgGradient: "from-emerald-50 to-teal-50",
              shadowColor: "shadow-emerald-500/20"
            }
          ].map(({ title, value, icon: Icon, gradient, bgGradient, shadowColor }, idx) => (
            <div
              key={idx}
              className={`relative group p-8 rounded-3xl bg-white/30 backdrop-blur-md 
                         border border-white/50 shadow-xl ${shadowColor} hover:shadow-2xl 
                         hover:bg-white/40 transition-all duration-500 hover:scale-105`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 rounded-full blur-xl transform -translate-x-4 translate-y-4" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
                    <Icon className="w-8 h-8 text-white drop-shadow-sm" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-white/60 to-white/40 group-hover:scale-125 transition-all duration-300" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{title}</p>
                  <p className="text-4xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Add Animal Form */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <Card className="relative bg-white/25 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl hover:shadow-3xl hover:bg-white/30 transition-all duration-500">
            <CardContent className="p-10 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    {editingId ? <Edit3 className="w-8 h-8 text-white" /> : <Plus className="w-8 h-8 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {editingId ? 'Edit Animal' : 'Add New Animal'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {editingId ? 'Update existing animal details' : 'Create a new wildlife entry'}
                    </p>
                  </div>
                </div>
                {editingId && (
                  <Button 
                    onClick={onCancelEdit}
                    className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border-0 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-md">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={onCreate} className="space-y-10">
                {/* Section: Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                      <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Animal Name *</label>
                      <Input 
                        name="name" 
                        value={form.name} 
                        onChange={onChange} 
                        placeholder="Enter animal name" 
                        required 
                        className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/40 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Habitat *</label>
                      <select
                        name="habitat"
                        value={form.habitat}
                        onChange={onChangeHabitat}
                        className="h-12 rounded-xl border border-gray-200 px-4 text-sm bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                        required
                      >
                        {HABITATS.map((h) => (
                          <option key={h.value} value={h.value} disabled={h.value === ""}>
                            {h.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Animal Type</label>
                      <select
                        name="type"
                        value={form.type}
                        onChange={onChange}
                        className="h-12 rounded-xl border border-gray-200 px-4 text-sm bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                      >
                        {ANIMAL_TYPES.map((t) => (
                          <option key={t.value} value={t.value} disabled={t.value === ""}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Size Range Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Size Range</label>
                      <div className="flex gap-2">
                        <Input 
                          name="sizeMin" 
                          type="number"
                          value={form.sizeMin} 
                          onChange={onChange} 
                          placeholder="From" 
                          className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/40 backdrop-blur-sm flex-1"
                        />
                        <span className="flex items-center text-gray-500 px-2">to</span>
                        <Input 
                          name="sizeMax" 
                          type="number"
                          value={form.sizeMax} 
                          onChange={onChange} 
                          placeholder="To" 
                          className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/40 backdrop-blur-sm flex-1"
                        />
                        <select
                          name="sizeUnit"
                          value={form.sizeUnit}
                          onChange={onChange}
                          className="h-12 rounded-xl border border-gray-200 px-3 text-sm bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="mm">mm</option>
                          <option value="cm">cm</option>
                          <option value="m">m</option>
                        </select>
                      </div>
                    </div>
                    
                    <Input name="family" value={form.family} onChange={onChange} placeholder="Family" className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/40 backdrop-blur-sm" />
                    
                    {/* Lifespan Range Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Lifespan Range</label>
                      <div className="flex gap-2">
                        <Input 
                          name="lifespanMin" 
                          type="number"
                          value={form.lifespanMin} 
                          onChange={onChange} 
                          placeholder="From" 
                          className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/40 backdrop-blur-sm flex-1"
                        />
                        <span className="flex items-center text-gray-500 px-2">to</span>
                        <Input 
                          name="lifespanMax" 
                          type="number"
                          value={form.lifespanMax} 
                          onChange={onChange} 
                          placeholder="To" 
                          className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/40 backdrop-blur-sm flex-1"
                        />
                        <select
                          name="lifespanUnit"
                          value={form.lifespanUnit}
                          onChange={onChange}
                          className="h-12 rounded-xl border border-gray-200 px-3 text-sm bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="months">months</option>
                          <option value="years">years</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Diet Type</label>
                      <select
                        name="diet"
                        value={form.diet}
                        onChange={onChange}
                        className="h-12 rounded-xl border border-gray-200 px-4 text-sm bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                      >
                        {DIET_TYPES.map((d) => (
                          <option key={d.value} value={d.value} disabled={d.value === ""}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <Input name="description" value={form.description} onChange={onChange} placeholder="Description" className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/40 backdrop-blur-sm" />
                  </div>
                </div>

                {/* Section: Media - ENHANCED WITH EDIT SUPPORT */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Media Uploads</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Card Image */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-gray-700">Main Card Image</label>
                      <div className="relative p-6 rounded-2xl border-2 border-dashed border-white/40 hover:border-indigo-400 transition-colors bg-white/20 backdrop-blur-sm min-h-[200px] flex items-center justify-center">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={onChangeCardFile} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 font-medium">Click to upload card image</p>
                        </div>
                      </div>
                      {cardPreview && (
                        <div className="relative group">
                          <img src={cardPreview} alt="preview" className="w-full h-48 rounded-2xl object-cover shadow-lg border border-gray-200" />
                          <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                    </div>
                    
                    {/* Gallery Images - ENHANCED WITH EDIT SUPPORT */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">Gallery Images</label>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {existingImages.length + imageFiles.length} image{(existingImages.length + imageFiles.length) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {/* Add Images Button */}
                      <div className="relative p-6 rounded-2xl border-2 border-dashed border-white/40 hover:border-purple-400 transition-colors bg-white/20 backdrop-blur-sm min-h-[140px] flex items-center justify-center">
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={onAddImages} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <div className="text-center">
                          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 font-medium">Add more gallery images</p>
                          <p className="text-xs text-gray-500 mt-1">Click to select multiple images</p>
                        </div>
                      </div>
                      
                      {/* Display existing images when editing */}
                      {existingImages.length > 0 && (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Existing Images</p>
                          {existingImages.map((imagePath, i) => {
                            const imgSrc = imagePath.startsWith("http")
                              ? imagePath
                              : `${API}${imagePath}`;
                            return (
                              <div key={i} className="relative group bg-white/20 p-3 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={imgSrc} 
                                    alt={`existing-img-${i}`} 
                                    className="w-16 h-16 object-cover rounded-lg shadow-md flex-shrink-0" 
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                      Existing Image {i + 1}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {imagePath.split('/').pop()}
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={() => removeExistingImage(imagePath)}
                                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg border-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    size="sm"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* New Image Previews with Remove Option */}
                      {imagePreviews.length > 0 && (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">New Images</p>
                          {imagePreviews.map((src, i) => (
                            <div key={i} className="relative group bg-white/20 p-3 rounded-xl border border-gray-200">
                              <div className="flex items-center gap-3">
                                <img src={src} alt={`img-${i}`} className="w-16 h-16 object-cover rounded-lg shadow-md flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-700 truncate">
                                    New Image {i + 1}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {imageFiles[i]?.name}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  onClick={() => removeImage(i)}
                                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg border-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                  size="sm"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Videos - ENHANCED WITH EDIT SUPPORT */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">Videos</label>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {existingVideos.length + videoFiles.length} video{(existingVideos.length + videoFiles.length) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {/* Add Videos Button */}
                      <div className="relative p-6 rounded-2xl border-2 border-dashed border-white/40 hover:border-cyan-400 transition-colors bg-white/20 backdrop-blur-sm min-h-[140px] flex items-center justify-center">
                        <input 
                          type="file" 
                          accept="video/*" 
                          multiple 
                          onChange={onAddVideos} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <div className="text-center">
                          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 font-medium">Add more videos</p>
                          <p className="text-xs text-gray-500 mt-1">Click to select multiple videos</p>
                        </div>
                      </div>
                      
                      {/* Display existing videos when editing */}
                      {existingVideos.length > 0 && (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Existing Videos</p>
                          {existingVideos.map((videoPath, i) => (
                            <div key={i} className="relative group bg-white/20 p-3 rounded-xl border border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Video className="w-6 h-6 text-cyan-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-700 truncate">
                                    Existing Video {i + 1}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {videoPath.split('/').pop()}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  onClick={() => removeExistingVideo(videoPath)}
                                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg border-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                  size="sm"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* New Video List with Remove Option */}
                      {videoNames.length > 0 && (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">New Videos</p>
                          {videoNames.map((name, i) => (
                            <div key={i} className="relative group bg-white/20 p-3 rounded-xl border border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Video className="w-6 h-6 text-cyan-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-700 truncate">{name}</p>
                                  <p className="text-xs text-gray-500">New Video {i + 1}</p>
                                </div>
                                <Button
                                  type="button"
                                  onClick={() => removeVideo(i)}
                                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg border-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                  size="sm"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Extra Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Additional Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Publications</label>
                      <textarea
                        name="publications"
                        value={form.publications}
                        onChange={onChange}
                        placeholder="Publications (Title|URL per line)"
                        className="min-h-[120px] rounded-xl border border-gray-200 p-4 text-sm w-full bg-white/30 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Summary</label>
                      <textarea
                        name="summary"
                        value={form.summary}
                        onChange={onChange}
                        placeholder="Short summary (1–2 lines)"
                        className="min-h-[120px] rounded-xl border border-gray-200 p-4 text-sm w-full bg-white/30 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="featured" 
                        checked={form.featured} 
                        onChange={onChange}
                        className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                      />
                      Show on habitat cards (Featured)
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-600 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {editingId ? "Updating..." : "Saving..."}
                      </div>
                    ) : (
                      editingId ? "Update Animal" : "Add New Animal"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Animals Table */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-white/25 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden hover:bg-white/30 transition-all duration-500">
            <div className="p-8 border-b border-white/30 bg-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                Animals Collection
              </h2>
              <p className="text-gray-600 mt-1">Manage your wildlife database</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/20 backdrop-blur-md border-b border-white/30">
                  <tr className="text-left">
                    <th className="p-6 font-semibold text-gray-700">Image</th>
                    <th className="p-6 font-semibold text-gray-700">Animal</th>
                    <th className="p-6 font-semibold text-gray-700">Habitat</th>
                    <th className="p-6 font-semibold text-gray-700">Diet</th>
                    <th className="p-6 font-semibold text-gray-700">Status</th>
                    <th className="p-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <div className="flex justify-center items-center gap-4">
                          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                          <p className="text-gray-600 font-medium">Loading animals...</p>
                        </div>
                      </td>
                    </tr>
                  ) : list.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-4xl">🦊</span>
                          </div>
                          <div>
                            <p className="text-xl font-semibold text-gray-700 mb-2">No animals yet</p>
                            <p className="text-gray-500">Start building your wildlife collection!</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    list.map((a, idx) => {
                      const imgSrc = a.cardImage
                        ? a.cardImage.startsWith("http")
                          ? a.cardImage
                          : `${API}${a.cardImage}`
                        : null;

                      return (
                        <tr 
                          key={a._id} 
                          className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300 ${
                            editingId === a._id ? "bg-gradient-to-r from-indigo-50 to-purple-50 ring-2 ring-indigo-200 ring-inset" : ""
                          }`}
                        >
                          <td className="p-6">
                            <div className="relative group">
                              {imgSrc ? (
                                <div className="relative">
                                  <img 
                                    src={imgSrc} 
                                    alt="" 
                                    className="w-20 h-16 object-cover rounded-xl border border-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-300" 
                                  />
                                  <div className="absolute inset-0 bg-black/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              ) : (
                                <div className="w-20 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                                  <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-800 text-lg">{a.name}</p>
                              {a.summary && (
                                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                                  {a.summary}
                                </p>
                              )}
                              {a.type && (
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                  {a.type}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-6">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                              a.habitat === 'kopno' ? 'bg-green-100 text-green-800' :
                              a.habitat === 'voda' ? 'bg-blue-100 text-blue-800' :
                              a.habitat === 'vozduh' ? 'bg-sky-100 text-sky-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                a.habitat === 'kopno' ? 'bg-green-500' :
                                a.habitat === 'voda' ? 'bg-blue-500' :
                                a.habitat === 'vozduh' ? 'bg-sky-500' :
                                'bg-gray-500'
                              }`} />
                              {a.habitat || "—"}
                            </div>
                          </td>
                          <td className="p-6">
                            <p className="text-gray-700 font-medium">{a.diet || "—"}</p>
                          </td>
                          <td className="p-6">
                            {a.featured !== false ? (
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                                <Star className="w-3 h-3 fill-current" />
                                Featured
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Standard</span>
                            )}
                          </td>
                          <td className="p-6">
                            <div className="flex gap-3">
                              <Button
                                onClick={() => onEdit(a)}
                                size="sm"
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-xl font-semibold border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => onDelete(a._id)}
                                size="sm"
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-xl font-semibold border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function safeMessage(res) {
  try {
    const j = await res.json();
    return j?.message || j?.error;
  } catch {
    return await res.text();
  }
}