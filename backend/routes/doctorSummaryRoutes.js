const express = require("express");
const router = express.Router();
const {
  generateDoctorSummary
} = require("../controllers/doctorSummaryController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/doctor-summary", authMiddleware, generateDoctorSummary);

module.exports = router;
