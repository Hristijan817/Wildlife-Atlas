// routes/animalRoutes.js
const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();

const {
  createAnimal,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
} = require("../controllers/animalController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// === Multer setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder where images are stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// === Routes ===

// Public: list animals (supports ?habitat=kopno/voda/vozduh)
router.get("/", getAnimals);

// Public: single animal by id
router.get("/:id", getAnimalById);

// Admin only: create with image upload
router.post("/", protect, adminOnly, upload.single("cardImage"), createAnimal);

// Admin only: update with optional image upload
router.put("/:id", protect, adminOnly, upload.single("cardImage"), updateAnimal);

// Admin only: delete
router.delete("/:id", protect, adminOnly, deleteAnimal);

module.exports = router;
