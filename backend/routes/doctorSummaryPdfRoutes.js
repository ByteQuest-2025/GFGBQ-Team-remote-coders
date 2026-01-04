const express = require("express");
const router = express.Router();
const {
  generateDoctorSummaryPDF
} = require("../controllers/doctorSummaryPdfController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/doctor-summary/:summaryId/pdf",
  authMiddleware,
  generateDoctorSummaryPDF
);

module.exports = router;
