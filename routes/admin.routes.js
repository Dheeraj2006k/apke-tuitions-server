const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getAllParentRequests,
  getAllTutors,
  updateRequestStatus,
  assignTutor,
  changePassword,
} = require("../controllers/admin.controller");

const { verifyAdmin } = require("../middlewares/auth.middleware");

// 🔓 Public
router.post("/admin/login", loginAdmin);

// 🔐 Protected
router.get("/admin/parent-requests",      verifyAdmin, getAllParentRequests);
router.get("/admin/tutors",               verifyAdmin, getAllTutors);
router.patch("/admin/update-status/:id",  verifyAdmin, updateRequestStatus);
router.post("/admin/assign-tutor",        verifyAdmin, assignTutor);
router.patch("/admin/change-password",    verifyAdmin, changePassword); // ← NEW

module.exports = router;