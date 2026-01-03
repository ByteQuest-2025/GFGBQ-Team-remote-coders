const express = require("express");
const router = express.Router();
const { analyzeHealth } = require("../controllers/analysisController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/analyze", authMiddleware, analyzeHealth);

module.exports = router;
