const ParentRequest = require("../models/ParentRequest");
const sendEmail = require("../utils/sendEmail");

// Create Parent Request
exports.createParentRequest = async (req, res) => {
  try {
    const {
      parent_name,
      student_name,
      class: studentClass,
      subjects,
      mode,
      number_of_students,
      location,
      preferred_time,
      phone,
      whatsapp,
      message,
    } = req.body;

    // 🔴 Duplicate Check
    const existingRequest = await ParentRequest.findOne({
      phone,
      subjects,
      class: studentClass,
      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Duplicate request detected within 24 hours",
      });
    }

    // Create request
    const newRequest = await ParentRequest.create({
      parent_name,
      student_name,
      class: studentClass,
      subjects,
      mode,
      number_of_students,
      location,
      preferred_time,
      phone,
      whatsapp,
      message,
    });

    // Respond first so slow SMTP does not delay form submission.
    res.status(201).json({
      success: true,
      message: "Tutor request submitted successfully",
      data: newRequest,
    });

    console.log("Calling email in background...");
    void sendEmail(
      "New Tutor Request",
      `New request from ${parent_name} for ${subjects}. Location: ${location}. Phone: ${phone}`
    ).catch((emailError) => {
      console.error("Parent request saved, but email notification failed:", emailError.message);
    });

    return;
  } catch (error) {
    console.error("Parent Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
