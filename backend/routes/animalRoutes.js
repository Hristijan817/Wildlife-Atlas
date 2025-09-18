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

const { protect } = require("../middleware/authMiddleware");

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// --- Routes ---

// Public
router.get("/", getAnimals);
router.get("/:id", getAnimalById);

// Authenticated create with file fields
router.post(
  "/",
  protect,
  upload.fields([
    { name: "cardImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 }, // accept video files too
  ]),
  createAnimal
);

// Authenticated update with file fields (optional uploads)
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "cardImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  updateAnimal
);

// Authenticated delete
router.delete("/:id", protect, deleteAnimal);

module.exports = router;
