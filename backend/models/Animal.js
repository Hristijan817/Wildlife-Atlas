const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: String,
  habitat: String, // kopno, voda, vozduh
  family: String,
  lifespan: String,
  prey: [String],
  predators: [String],
  diet: String,
  origin: String,
  sound: String // filename or URL
});

module.exports = mongoose.model("Animal", animalSchema);
