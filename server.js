const express = require("express");
const cors = require("cors");
require("dotenv").config();
const adminRoutes = require("./routes/admin.routes");

const connectDB = require("./config/db");

const app = express();
const parentRoutes = require("./routes/parent.routes");
const tutorRoutes = require("./routes/tutor.routes");

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api", parentRoutes);
app.use("/api", tutorRoutes);
app.use("/api", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Apke Tuitions API Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});