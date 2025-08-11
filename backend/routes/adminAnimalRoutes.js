// backend/routes/adminAnimalRoutes.js
const express = require("express");
const router = express.Router();
const Animal = require("../models/Animal");
const adminKey = require("../middleware/adminKey");

// All routes here require admin key
router.use(adminKey);

// List (with optional search and habitat)
router.get("/", async (req, res) => {
  try {
    const { q, habitat } = req.query;
    const filter = {};
    if (habitat) filter.habitat = habitat;
    if (q) filter.name = { $regex: q, $options: "i" };
    const animals = await Animal.find(filter).sort({ name: 1 });
    res.json(animals);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const doc = await Animal.create({
      name: body.name,
      habitat: body.habitat,    // "kopno" | "voda" | "vozduh"
      family: body.family,
      lifespan: body.lifespan,
      prey: Array.isArray(body.prey) ? body.prey : (body.prey ? String(body.prey).split(",").map(s=>s.trim()).filter(Boolean) : []),
      predators: Array.isArray(body.predators) ? body.predators : (body.predators ? String(body.predators).split(",").map(s=>s.trim()).filter(Boolean) : []),
      diet: body.diet,
      origin: body.origin,
      sound: body.sound
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const body = req.body || {};
    const update = { ...body };
    if (typeof body.prey === "string") update.prey = body.prey.split(",").map(s=>s.trim()).filter(Boolean);
    if (typeof body.predators === "string") update.predators = body.predators.split(",").map(s=>s.trim()).filter(Boolean);
    const doc = await Animal.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const del = await Animal.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
