// models/Animal.js
const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      trim: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: { type: String, required: true, trim: true },
    habitat: {
      type: String,
      enum: ["kopno", "voda", "vozduh"],
      required: true,
    },
    type: {
      type: String,
      enum: ["land", "water", "air"],
      default: undefined,
    },
    size: { type: String, default: "" },
    family: { type: String, default: "" },
    lifespan: { type: String, default: "" },
    diet: { type: String, default: "" },
    description: { type: String, default: "" },
    summary: { type: String, default: "" },

    // 🟢 NEW fields
    prey: { type: String, default: "" },       // e.g., "grass, small fish"
    predators: { type: String, default: "" },  // e.g., "lions, sharks"

    cardImage: { type: String, default: "" },

    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    videos: {
      type: [String], // Array of video URLs (YouTube, MP4, etc.)
      default: [],
    },
    publications: {
      type: [
        {
          title: { type: String, required: true },
          url: { type: String, default: "" },
        },
      ],
      default: [],
    },

    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Derive type automatically from habitat
animalSchema.pre("validate", function (next) {
  if (!this.type && this.habitat) {
    const map = { kopno: "land", voda: "water", vozduh: "air" };
    this.type = map[this.habitat];
  }
  next();
});

module.exports = mongoose.model("Animal", animalSchema);
