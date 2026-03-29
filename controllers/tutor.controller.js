const Tutor = require("../models/Tutor");

// Register Tutor
exports.registerTutor = async (req, res) => {
  try {
    const {
      name,
      qualification,
      experience,
      subjects,
      classes,
      mode,
      location,
      available_time,
      phone,
      email,
      bio,
    } = req.body;

    // 🔴 Duplicate Check (same phone)
    const existingTutor = await Tutor.findOne({ phone });

    if (existingTutor) {
      return res.status(400).json({
        success: false,
        message: "Tutor with this phone already exists",
      });
    }

    // Create tutor
    const newTutor = await Tutor.create({
      name,
      qualification,
      experience,
      subjects,
      classes,
      mode,
      location,
      available_time,
      phone,
      email,
      bio,
    });

    return res.status(201).json({
      success: true,
      message: "Tutor registered successfully",
      data: newTutor,
    });
  } catch (error) {
    console.error("Tutor Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};