// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/userController");

// NOTE: in production you might disable public registration and only allow admin creation via script
router.post("/register", register);
router.post("/login", login);

module.exports = router;