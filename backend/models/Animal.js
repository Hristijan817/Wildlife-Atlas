// models/Animal.js
const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["water", "air", "land"], required: true },
  habitat: { type: String, required: true },
  family: { type: String, required: true },
  lifespan: { type: String, required: true }, // e.g. "10-15 years"
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Animal", animalSchema);