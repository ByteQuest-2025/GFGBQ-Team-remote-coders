const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// SAVE PROFILE CONTEXT (BLOCK 1)
// ===============================
router.post("/profile/context", authMiddleware, async (req, res) => {
  try {
    const {
      age,
      occupationType,
      workingHoursPerDay,
      workMode,
      recentMedicalIssues,
    } = req.body;

    // Basic validation
    if (!age || !occupationType || !workMode) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const userId = req.user.id;
    console.log("USER ID FROM TOKEN:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ===============================
    // SAVE PROFILE CONTEXT + MEDICAL ISSUES
    // ===============================
    user.profileContext = {
      age,
      occupationType,
      workingHoursPerDay,
      workMode,
      recentMedicalIssues: {
        frequentHeadaches:
          recentMedicalIssues?.frequentHeadaches || false,
        persistentFatigue:
          recentMedicalIssues?.persistentFatigue || false,
        suddenWeightChanges:
          recentMedicalIssues?.suddenWeightChanges || false,
        digestiveDiscomfort:
          recentMedicalIssues?.digestiveDiscomfort || false,
      },
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile context saved successfully",
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
