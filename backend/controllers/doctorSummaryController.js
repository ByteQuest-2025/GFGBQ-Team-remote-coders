const StressAssessment = require("../models/StressAssessment");
const SleepFamilyAssessment = require("../models/SleepFamilyAssessment");
const DoctorVisitSummary = require("../models/DoctorVisitSummary");
const { callLLM } = require("../services/llmService");

// helper (keep outside controller)
const extractJSON = (text) => {
  try {
    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON found");
    }

    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

exports.generateDoctorSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = req.body.time_window_days || 90;

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    // 1️⃣ Fetch data
    const stressRecords = await StressAssessment.find({
      user: userId,
      createdAt: { $gte: sinceDate }
    }).sort({ createdAt: 1 });

    const sleepFamily = await SleepFamilyAssessment.findOne({
      user: userId
    }).sort({ createdAt: -1 });

    if (!stressRecords.length || !sleepFamily) {
      return res.status(400).json({
        message: "Insufficient data to generate visit summary"
      });
    }

    // 2️⃣ Derive trends
    const latestStress = stressRecords[stressRecords.length - 1];
    const stressTrend =
      stressRecords.length > 1 &&
      latestStress.phq9Score > stressRecords[0].phq9Score
        ? "increasing"
        : "stable";

    // 3️⃣ Normalize context
    const healthContext = {
      mental_health: {
        latest_phq9_score: latestStress.phq9Score,
        severity: latestStress.severity,
        trend: stressTrend
      },
      sleep: {
        average_sleep_hours: sleepFamily.averageSleepHours,
        sleep_consistency: sleepFamily.sleepConsistency,
        sleep_quality: sleepFamily.sleepQuality
      },
      family_history: sleepFamily.familyHistory
    };

    // 4️⃣ Build prompt
    const prompt = `
You MUST return ONLY a valid JSON object.
DO NOT include explanations, markdown, or comments.

Return JSON in EXACTLY this structure:
{
  "reason_for_visit": "",
  "key_risk_drivers": [],
  "relevant_trends": [],
  "suggested_evaluations": []
}

Health context:
${JSON.stringify(healthContext, null, 2)}
`;

    // 5️⃣ Call LLM
    const rawOutput = await callLLM(prompt);
    const summary = extractJSON(rawOutput);

    if (!summary) {
      return res.status(500).json({
        message: "LLM returned invalid JSON",
        raw_output: rawOutput
      });
    }

    // ===============================
    // ✅ SAVE TO DB (CRITICAL STEP)
    // ===============================
    const savedSummary = await DoctorVisitSummary.create({
      user: userId,
      summary
    });

    // 6️⃣ Respond
    res.json({
      summary_id: savedSummary._id,
      visit_summary: summary,
      generated_at: savedSummary.generatedAt
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to generate doctor summary"
    });
  }
};
