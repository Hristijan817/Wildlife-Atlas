// scripts/createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");

async function createAdmin(email, password, name = "Admin") {
  if (!email || !password) {
    console.error("Usage: node createAdmin.js email password [name]");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hashed, role: "admin" });
  await user.save();
  console.log("Admin created:", email);
  process.exit(0);
}

const [,, email, password, name] = process.argv;
createAdmin(email, password, name).catch(err => {
  console.error(err);
  process.exit(1);
});