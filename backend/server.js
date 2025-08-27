// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");
const animalRoutes = require("./routes/animalRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));

// CORS
const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow curl/postman/no-origin
      if (!origin) return callback(null, true);
      if (allowed.includes(origin) || /localhost:(5173|5174|3000)$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin), false);
    },
    credentials: true,
  })
);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// routes
app.use("/api/users", userRoutes);
app.use("/api/animals", animalRoutes);

// errors
app.use(notFound);
app.use(errorHandler);

// start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
