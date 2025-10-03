// controllers/animalController.js
const Animal = require("../models/Animal");
const { v4: uuidv4 } = require("uuid");

const API_URL = process.env.API_URL || "http://localhost:5000";

/* ----------------------------- Helpers ---------------------------------- */

function normalizeHabitat(value) {
  const v = String(value || "").toLowerCase();
  const map = {
    kopno: "kopno",
    land: "kopno",
    voda: "voda",
    water: "voda",
    vozduh: "vozduh",
    air: "vozduh",
  };
  return map[v] || null;
}

// Prepend API_URL to relative /uploads paths.
// Works for single strings or arrays of strings.
function absolutizePath(p) {
  if (typeof p !== "string") return p;
  return p.startsWith("/uploads") ? `${API_URL}${p}` : p;
}

function withAbsoluteUrls(animal) {
  if (!animal) return animal;
  const doc = { ...animal };

  if (doc.cardImage) {
    doc.cardImage = absolutizePath(doc.cardImage);
  }
  if (Array.isArray(doc.images)) {
    doc.images = doc.images.map(absolutizePath);
  }
  if (Array.isArray(doc.videos)) {
    doc.videos = doc.videos.map(absolutizePath);
  }

  return doc;
}

// Safe JSON parse helper
function tryParseJson(str, fallback = []) {
  try {
    const parsed = JSON.parse(str);
    return parsed;
  } catch {
    return fallback;
  }
}

/* ------------------------------- CRUD ----------------------------------- */

exports.getAnimals = async (req, res) => {
  try {
    const q = {};
    if (req.query.habitat) {
      const h = normalizeHabitat(req.query.habitat);
      if (!h) return res.status(400).json({ message: "Invalid habitat" });
      q.habitat = h;
    }
    const animals = await Animal.find(q).sort({ createdAt: -1 }).lean();
    res.json(animals.map(withAbsoluteUrls));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).lean();
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.json(withAbsoluteUrls(animal));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Create Animal
 * Accepts multipart/form-data via Multer with fields:
 * - files: cardImage (single), images (array), videos (array)
 * - text: name, habitat, type (alt), size, family, lifespan, diet, description, summary, featured
 * - text: publications (JSON stringified array of {title, url})
 * - optional: images (CSV URLs), videos (CSV URLs), cardImage (URL fallback)
 */
exports.createAnimal = async (req, res) => {
  try {
    // Multipart text fields arrive in req.body as strings
    const habitat = normalizeHabitat(req.body.habitat || req.body.type);
    if (!req.body.name || !habitat) {
      return res.status(400).json({ message: "Missing required fields: name, habitat" });
    }

    // Publications may be sent as JSON string (from FormData)
    let publications = [];
    if (typeof req.body.publications === "string" && req.body.publications.trim()) {
      const parsed = tryParseJson(req.body.publications, []);
      publications = Array.isArray(parsed) ? parsed : [];
    }

    // Optional URLs in body (if you also support URLs alongside files)
    const imagesFromBody =
      typeof req.body.images === "string" && req.body.images.trim()
        ? req.body.images.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    const videosFromBody =
      typeof req.body.videos === "string" && req.body.videos.trim()
        ? req.body.videos.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    // Files from Multer (expecting multer.fields in the route)
    const cardImageFromFile = req.files?.cardImage?.[0]
      ? `/uploads/${req.files.cardImage[0].filename}`
      : (req.body.cardImage || ""); // allow URL fallback

    const imagesFromFiles = (req.files?.images || []).map((f) => `/uploads/${f.filename}`);
    const videosFromFiles = (req.files?.videos || []).map((f) => `/uploads/${f.filename}`);

    const doc = new Animal({
      id: uuidv4(), // keep your custom id if you rely on it elsewhere
      name: String(req.body.name).trim(),
      habitat,
      type: { kopno: "land", voda: "water", vozduh: "air" }[habitat],
      size: req.body.size || "",
      family: req.body.family || "",
      lifespan: req.body.lifespan || "",
      diet: req.body.diet || "",
      description: req.body.description || "",
      summary: req.body.summary || "",
      cardImage: cardImageFromFile,
      images: [...imagesFromFiles, ...imagesFromBody],
      videos: [...videosFromFiles, ...videosFromBody],
      publications,
      featured: req.body.featured === "false" ? false : true,
    });

    await doc.save();

    // Expand paths to absolute URLs for the response
    const out = withAbsoluteUrls(doc.toObject());
    res.status(201).json(out);
  } catch (err) {
    console.error("createAnimal error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Update Animal
 * Supports:
 * - Text fields in req.body
 * - File replacements/additions via Multer: cardImage (single), images (array), videos (array)
 * - URL additions for images/videos via CSV strings (same keys)
 * - publications as JSON string (replaces full publications array)
 *
 * NOTE: For images/videos:
 * - If files/URLs are provided, they will be **appended** to existing arrays unless
 *   you also pass `replaceMedia=true` to replace them entirely.
 */
exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });

    const fields = ["name", "family", "lifespan", "diet", "description", "summary", "size", "prey", "predators"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) animal[f] = req.body[f];
    });

    // Habitat/type update
    if (req.body.habitat || req.body.type) {
      const h = normalizeHabitat(req.body.habitat || req.body.type);
      if (!h) return res.status(400).json({ message: "Invalid habitat" });
      animal.habitat = h;
      animal.type = { kopno: "land", voda: "water", vozduh: "air" }[h];
    }

    if (req.body.featured !== undefined) {
      animal.featured = req.body.featured === "false" ? false : true;
    }

    // Publications (JSON string replaces entire array)
    if (typeof req.body.publications === "string") {
      const pubs = tryParseJson(req.body.publications, []);
      if (Array.isArray(pubs)) animal.publications = pubs;
    }

    // Handle card image update: file has priority; otherwise allow URL fallback
    if (req.files?.cardImage?.[0]) {
      animal.cardImage = `/uploads/${req.files.cardImage[0].filename}`;
    } else if (req.body.cardImage !== undefined) {
      animal.cardImage = req.body.cardImage;
    }

    // Images/videos handling
    const replaceMedia = String(req.body.replaceMedia || "").toLowerCase() === "true";

    // New files
    const newImageFiles = (req.files?.images || []).map((f) => `/uploads/${f.filename}`);
    const newVideoFiles = (req.files?.videos || []).map((f) => `/uploads/${f.filename}`);

    // New URLs from body (CSV)
    const newImageUrls =
      typeof req.body.images === "string" && req.body.images.trim()
        ? req.body.images.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    const newVideoUrls =
      typeof req.body.videos === "string" && req.body.videos.trim()
        ? req.body.videos.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    if (replaceMedia) {
      // Replace arrays completely
      if (newImageFiles.length || newImageUrls.length) {
        animal.images = [...newImageFiles, ...newImageUrls];
      }
      if (newVideoFiles.length || newVideoUrls.length) {
        animal.videos = [...newVideoFiles, ...newVideoUrls];
      }
    } else {
      // Append to existing arrays
      if (newImageFiles.length || newImageUrls.length) {
        animal.images = [...(animal.images || []), ...newImageFiles, ...newImageUrls];
      }
      if (newVideoFiles.length || newVideoUrls.length) {
        animal.videos = [...(animal.videos || []), ...newVideoFiles, ...newVideoUrls];
      }
    }

    await animal.save();
    res.json(withAbsoluteUrls(animal.toObject()));
  } catch (err) {
    console.error("updateAnimal error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
