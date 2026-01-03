const express = require("express");
const router = express.Router();
const {
  submitSleepFamilyData
} = require("../controllers/sleepFamilyController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/sleep-family", authMiddleware, submitSleepFamilyData);

module.exports = router;
