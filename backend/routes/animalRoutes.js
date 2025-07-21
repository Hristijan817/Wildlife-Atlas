const express = require("express");
const router = express.Router();
const {
  getAllAnimals,
  getAnimalById,
  filterAnimals,
  getRandomAnimal,
  compareAnimals,
  createAnimal
} = require("../controllers/animalController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllAnimals);
router.get("/filter", filterAnimals);
router.get("/random", getRandomAnimal);
router.get("/compare", compareAnimals);
router.get("/:id", getAnimalById);
router.post("/", protect, createAnimal); // Admin only
router.put("/:id", protect, updateAnimal);     // Admin only
router.delete("/:id", protect, deleteAnimal);  // Admin only

module.exports = router;
