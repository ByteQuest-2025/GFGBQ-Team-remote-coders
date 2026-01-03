const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// SAVE PROFILE CONTEXT (BLOCK 1)
// ===============================
router.post("/profile/context", authMiddleware, async (req, res) => {
  try {
    const { age, occupationType, workingHoursPerDay, workMode } = req.body;

    if (!age || !occupationType || !workMode) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const userId = req.user.id; // comes from auth middleware


    const user = await User.findById(userId);
    console.log("USER ID FROM TOKEN:", req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Save data
    user.profileContext = {
      age,
      occupationType,
      workingHoursPerDay,
      workMode,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile context saved",
      data: user.profileContext,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
