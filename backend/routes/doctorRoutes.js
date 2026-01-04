const express = require("express");
const router = express.Router();
const { findNearbyDoctors } = require("../controllers/doctorController");
const auth = require("../middleware/authMiddleware");

router.post("/nearby", auth, findNearbyDoctors);

module.exports = router;
