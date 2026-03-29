const mongoose = require("mongoose");

const parentRequestSchema = new mongoose.Schema(
  {
    parent_name: {
      type: String,
      required: true,
      trim: true,
    },
    student_name: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
    },
    subjects: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    number_of_students: {
      type: Number,
      default: 1,
    },
    location: {
      type: String,
      required: true,
    },
    preferred_time: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "assigned", "closed"],
      default: "new",
    },
    assigned_tutor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      default: null,
    },
    assigned_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParentRequest", parentRequestSchema);