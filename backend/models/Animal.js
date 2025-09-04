// models/Animal.js
const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // Store habitat in Macedonian to match the UI:
    // 'kopno' (land), 'voda' (water), 'vozduh' (air)
    habitat: { type: String, enum: ["kopno", "voda", "vozduh"], required: true },

    // Optional derived English type for convenience
    type: { type: String, enum: ["land", "water", "air"], default: undefined },

    family: { type: String, default: "" },
    lifespan: { type: String, default: "" },   // e.g., "10-15 years"
    diet: { type: String, default: "" },
    description: { type: String, default: "" },
    cardImage: { type: String, default: "" },
    summary: { type: String, default: "" },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Derive type from habitat if not explicitly provided
animalSchema.pre("validate", function (next) {
  if (!this.type && this.habitat) {
    const map = { kopno: "land", voda: "water", vozduh: "air" };
    this.type = map[this.habitat];
  }
  next();
});

module.exports = mongoose.model("Animal", animalSchema);
