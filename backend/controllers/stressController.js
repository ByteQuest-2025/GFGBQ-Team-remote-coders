const StressAssessment = require("../models/StressAssessment");
const calculatePHQ9 = require("../utils/phq9Calculator");

exports.submitPHQ9 = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({ message: "PHQ-9 answers are required" });
    }

    const { score, severity } = calculatePHQ9(answers);

    const escalationRecommended = score >= 10;

    const assessment = new StressAssessment({
    user: req.user.id,
    phq9Score: score,
    severity,
    escalationRecommended
    });

    await assessment.save();

    res.status(200).json({
      phq9Score: score,
      severity,
      escalationRecommended,
      message: "PHQ-9 stress assessment recorded successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Stress assessment failed"
    });
  }
};
