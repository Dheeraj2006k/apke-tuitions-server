const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    subjects: {
      type: String,
      required: true,
    },
    classes: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["online", "offline", "both"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    available_time: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    bio: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tutor", tutorSchema);