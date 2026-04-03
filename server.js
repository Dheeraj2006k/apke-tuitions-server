const express = require("express");
const cors = require("cors");
require("dotenv").config();
const adminRoutes = require("./routes/admin.routes");

const connectDB = require("./config/db");

const app = express();
const parentRoutes = require("./routes/parent.routes");
const tutorRoutes = require("./routes/tutor.routes");

const configuredOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([
    "http://localhost:3000",
    "http://localhost:5173",
    "https://apketuitions.com",
    "https://www.apketuitions.com",
    ...configuredOrigins,
  ])
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.use("/api", parentRoutes);
app.use("/api", tutorRoutes);
app.use("/api", adminRoutes);

app.get("/", (req, res) => {
  res.send("Apke Tuitions API Running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
