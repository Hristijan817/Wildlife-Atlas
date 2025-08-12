// routes/animalRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAnimal, getAnimals, getAnimalById, updateAnimal, deleteAnimal
} = require("../controllers/animalController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public: list (supports ?type=water)
router.get("/", getAnimals);

// Public: single
router.get("/:id", getAnimalById);

// Admin only
router.post("/", protect, adminOnly, createAnimal);
router.put("/:id", protect, adminOnly, updateAnimal);
router.delete("/:id", protect, adminOnly, deleteAnimal);

module.exports = router;