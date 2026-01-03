const calculatePHQ9 = (answers) => {
  const questions = ["q1","q2","q3","q4","q5","q6","q7","q8","q9"];

  let total = 0;

  for (const q of questions) {
    const val = answers[q];

    if (typeof val !== "number" || val < 0 || val > 3) {
      throw new Error(`Invalid PHQ-9 answer for ${q}`);
    }

    total += val;
  }

  let severity = "Minimal";
  if (total >= 20) severity = "Severe";
  else if (total >= 15) severity = "Moderately Severe";
  else if (total >= 10) severity = "Moderate";
  else if (total >= 5) severity = "Mild";

  return {
    score: total,
    severity
  };
};

module.exports = calculatePHQ9;
