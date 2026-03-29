const express = require("express");
const router = express.Router();

const {
  registerTutor,
} = require("../controllers/tutor.controller");

// POST /api/tutor-register
router.post("/tutor-register", registerTutor);

module.exports = router;