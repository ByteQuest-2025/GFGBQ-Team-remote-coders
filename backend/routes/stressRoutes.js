const express = require("express");
const router = express.Router();
const { submitPHQ9 } = require("../controllers/stressController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/phq9", authMiddleware, submitPHQ9);

module.exports = router;
