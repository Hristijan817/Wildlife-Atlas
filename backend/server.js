// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const animalRoutes = require("./routes/animalRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*"
}));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);

// error handlers
app.use(notFound);
app.use(errorHandler);

// db + start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error("DB connection error:", err);
  process.exit(1);
});