const Animal = require("../models/Animal");

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

exports.getAnimals = async (req, res) => {
  try {
    const q = {};
    if (req.query.habitat) {
      const h = normalizeHabitat(req.query.habitat);
      if (!h) return res.status(400).json({ message: "Invalid habitat" });
      q.habitat = h;
    }
    const animals = await Animal.find(q).sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.json(animal);
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
      name: String(req.body.name).trim(),
      habitat,
      type: { kopno: "land", voda: "water", vozduh: "air" }[habitat],
      family: req.body.family || "",
      lifespan: req.body.lifespan || "",
      diet: req.body.diet || "",
      description: req.body.description || "",
      cardImage,
      summary: req.body.summary || "",
      featured: req.body.featured === "false" ? false : true,
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });

    const fields = ["name", "family", "lifespan", "diet", "description", "summary"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) animal[f] = req.body[f];
    });

    // Handle image update (new file or fallback to body)
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

    // Featured update (only if explicitly sent)
    if (req.body.featured !== undefined) {
      animal.featured = req.body.featured === "false" ? false : true;
    }

    await animal.save();
    res.json(animal);
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
