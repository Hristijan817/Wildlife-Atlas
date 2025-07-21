const Animal = require("../models/Animal");

// @desc    Get all animals
// @route   GET /api/animals
exports.getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get animal by ID
// @route   GET /api/animals/:id
exports.getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Filter animals by query (habitat, diet, etc.)
// @route   GET /api/animals/filter
exports.filterAnimals = async (req, res) => {
  try {
    const filters = {};

    if (req.query.habitat) filters.habitat = req.query.habitat;
    if (req.query.diet) filters.diet = req.query.diet;
    if (req.query.family) filters.family = req.query.family;

    const animals = await Animal.find(filters);
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get a random animal ("Animal of the Day")
// @route   GET /api/animals/random
exports.getRandomAnimal = async (req, res) => {
  try {
    const count = await Animal.countDocuments();
    const random = Math.floor(Math.random() * count);
    const animal = await Animal.findOne().skip(random);
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Compare animals by IDs
// @route   GET /api/animals/compare?ids=id1,id2
exports.compareAnimals = async (req, res) => {
  try {
    const ids = req.query.ids?.split(",");
    if (!ids || ids.length < 2)
      return res.status(400).json({ message: "Please provide at least two IDs to compare." });

    const animals = await Animal.find({ _id: { $in: ids } });
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Create a new animal (Admin only)
// @route   POST /api/animals
exports.createAnimal = async (req, res) => {
  try {
    const newAnimal = new Animal(req.body);
    const savedAnimal = await newAnimal.save();
    res.status(201).json(savedAnimal);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

// BONUS:
// @desc    Update animal
// @route   PUT /api/animals/:id
exports.updateAnimal = async (req, res) => {
  try {
    const updated = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Animal not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating", error });
  }
};

// @desc    Delete animal
// @route   DELETE /api/animals/:id
exports.deleteAnimal = async (req, res) => {
  try {
    const deleted = await Animal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Animal not found" });
    res.status(200).json({ message: "Animal deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting", error });
  }
};
