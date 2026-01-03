const SleepFamilyAssessment = require("../models/SleepFamilyAssessment");

exports.submitSleepFamilyData = async (req, res) => {
  try {
    const { sleep, family_history } = req.body;

    if (!sleep || !family_history) {
      return res.status(400).json({
        message: "Sleep data and family history are required"
      });
    }

    const assessment = new SleepFamilyAssessment({
      user: req.user.id,

      averageSleepHours: sleep.average_sleep_hours,
      sleepConsistency: sleep.sleep_consistency,
      screenTimeBeforeSleepMinutes:
        sleep.screen_time_before_sleep_minutes || 0,
      sleepQuality: sleep.sleep_quality,

      familyHistory: {
        diabetes: family_history.diabetes,
        hypertension: family_history.hypertension,
        heartDisease: family_history.heart_disease,
        mentalHealthConditions:
          family_history.mental_health_conditions
      }
    });

    await assessment.save();

    res.status(200).json({
      message: "Sleep and family background data saved successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to save sleep/family data"
    });
  }
};
