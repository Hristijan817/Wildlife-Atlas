const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/animals", require("./routes/animalRoutes"));         // public (list/detail if you already had this)
app.use("/api/admin/animals", require("./routes/adminAnimalRoutes")); // protected by x-admin-key

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
