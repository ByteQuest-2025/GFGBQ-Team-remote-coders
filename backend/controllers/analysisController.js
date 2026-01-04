const User = require("../models/User");
const StressAssessment = require("../models/StressAssessment");
const SleepFamilyAssessment = require("../models/SleepFamilyAssessment");
const { calculateHealthScore } = require("../utils/healthScoreCalculator");

const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Ensure this is set in .env
});

exports.analyzeHealth = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch all user data
    const user = await User.findById(userId);
    const stress = await StressAssessment.findOne({ user: userId }).sort({ createdAt: -1 });
    const sleepFamily = await SleepFamilyAssessment.findOne({ user: userId }).sort({ createdAt: -1 });

    if (!user || !stress || !sleepFamily) {
      return res.status(400).json({ message: "Incomplete data. Please complete all assessments first." });
    }

    const healthScore = calculateHealthScore({
      profile: user.profileContext,
      stress,
      sleep: sleepFamily
    });


    let summaryText = "Your health indicators are stable.";

    if (healthScore < 80)
      summaryText = "Some lifestyle and mental health indicators need attention.";

    if (healthScore < 60)
      summaryText = "Multiple health signals indicate elevated risk.";



    // 2. Prepare the prompt
    const prompt = `
      You are an expert health assistant. Analyze the following user data and provide a concise, summarized health report.
      
      **User Profile:**
      - Age: ${user.profileContext.age}
      - Occupation: ${user.profileContext.occupationType}
      - Work Hours: ${user.profileContext.workingHoursPerDay}
      - Work Mode: ${user.profileContext.workMode}
      - Medical Issues: ${JSON.stringify(user.profileContext.recentMedicalIssues)}

      **Mental Health (PHQ-9):**
      - Score: ${stress.phq9Score}
      - Severity: ${stress.severity}

      **Sleep & Lifestyle:**
      - Avg Sleep: ${sleepFamily.averageSleepHours} hours
      - Consistency: ${sleepFamily.sleepConsistency}
      - Quality: ${sleepFamily.sleepQuality}
      - Screen Time Before Bed: ${sleepFamily.screenTimeBeforeSleepMinutes} mins
      - Family History: ${JSON.stringify(sleepFamily.familyHistory)}

      **Task:**
      1. **Summary**: Provide a 2-3 sentence summary of the user's overall health status.
      2. **Key Risks**: Bullet point 2-3 potential risks (only if present).
      3. **Recommendations**: Provide exactly 3 short, actionable tips.

      Keep the response very concise and avoid long paragraphs. Use simple formatting.
    `;

    // 3. Call LLM
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        { role: "system", content: "You are a helpful medical AI assistant." },
        { role: "user", content: prompt },
      ],
    });

    const recommendation = completion.choices[0].message.content;

    res.json({
      healthScore,
      summaryText,
      recommendation
    });


  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ message: "Failed to generate analysis" });
  }
};
