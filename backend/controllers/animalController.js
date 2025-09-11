const Animal = require("../models/Animal");
const { v4: uuidv4 } = require("uuid");
const API_URL = process.env.API_URL || "http://localhost:5000";

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

// Helper: prepend API_URL to relative paths
function withAbsoluteUrls(animal) {
  if (!animal) return animal;

  const doc = { ...animal };

  if (doc.cardImage && doc.cardImage.startsWith("/uploads")) {
    doc.cardImage = `${API_URL}${doc.cardImage}`;
  }
  

  return doc;
}

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

exports.createAnimal = async (req, res) => {
  try {
    const habitat = normalizeHabitat(req.body.habitat || req.body.type);
    if (!req.body.name || !habitat) {
      return res.status(400).json({ message: "Missing required fields: name, habitat" });
    }

    const cardImage = req.file ? `/uploads/${req.file.filename}` : req.body.cardImage || "";

    const doc = new Animal({
      id: uuidv4(),
      name: String(req.body.name).trim(),
      habitat,
      type: { kopno: "land", voda: "water", vozduh: "air" }[habitat],
      family: req.body.family || "",
      lifespan: req.body.lifespan || "",
      diet: req.body.diet || "",
      description: req.body.description || "",
      summary: req.body.summary || "",
      cardImage,
      featured: req.body.featured === "false" ? false : true,

      // new fields
      size: req.body.size || "",
     
    });

    await doc.save();
    res.status(201).json(withAbsoluteUrls(doc.toObject()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });

    const fields = ["name", "family", "lifespan", "diet", "description", "summary", "size"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) animal[f] = req.body[f];
    });

    

    // Handle image update
    if (req.file) {
      animal.cardImage = `/uploads/${req.file.filename}`;
    } else if (req.body.cardImage !== undefined) {
      animal.cardImage = req.body.cardImage;
    }

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

    await animal.save();
    res.json(withAbsoluteUrls(animal.toObject()));
  } catch (err) {
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
