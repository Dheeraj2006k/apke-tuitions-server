const express = require("express");
const router = express.Router();

const {
  createParentRequest,
} = require("../controllers/parent.controller");

// POST /api/parent-request
router.post("/parent-request", createParentRequest);

module.exports = router;