const ParentRequest = require("../models/ParentRequest");
const Tutor = require("../models/Tutor");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { REQUEST_STATUS } = require("../constants/status.constants");

// 1. Get All Parent Requests
exports.getAllParentRequests = async (req, res) => {
  try {
    const requests = await ParentRequest.find()
      .populate("assigned_tutor_id")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Get Parent Requests Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. Get All Tutors
exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tutors });
  } catch (error) {
    console.error("Get Tutors Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. Update Request Status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = Object.values(REQUEST_STATUS);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updated = await ParentRequest.findByIdAndUpdate(
      id, { status }, { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, message: "Status updated", data: updated });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 4. Assign Tutor
exports.assignTutor = async (req, res) => {
  try {
    const { requestId, tutorId } = req.body;

    if (!requestId || !tutorId) {
      return res.status(400).json({
        success: false,
        message: "requestId and tutorId are required",
      });
    }

    const updated = await ParentRequest.findByIdAndUpdate(
      requestId,
      {
        assigned_tutor_id: tutorId,
        assigned_at: new Date(),
        status: REQUEST_STATUS.ASSIGNED,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Tutor assigned successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Assign Tutor Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 5. Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 6. Change Password ← NEW
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Basic validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Get admin from token (req.admin set by verifyAdmin middleware)
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash and save new password
    const hash = await bcrypt.hash(newPassword, 10);
    admin.password = hash;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};