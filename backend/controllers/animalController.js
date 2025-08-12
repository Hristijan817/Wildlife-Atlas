// controllers/animalController.js
const Animal = require("../models/Animal");

exports.createAnimal = async (req, res) => {
  try {
    const { name, type, habitat, family, lifespan, description } = req.body;
    if (!name || !type || !habitat || !family || !lifespan) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!["water","air","land"].includes(type)) {
      return res.status(400).json({ message: "Invalid animal type" });
    }
    const animal = new Animal({ name, type, habitat, family, lifespan, description });
    await animal.save();
    res.status(201).json(animal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnimals = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.family) filter.family = req.query.family;
    // add more query options as needed
    const animals = await Animal.find(filter).sort({ createdAt: -1 });
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

exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Not found" });

    const updates = ["name","type","habitat","family","lifespan","description"];
    updates.forEach(field => {
      if (req.body[field] !== undefined) animal[field] = req.body[field];
    });

    if (animal.type && !["water","air","land"].includes(animal.type)) {
      return res.status(400).json({ message: "Invalid type" });
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
    if (!animal) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};