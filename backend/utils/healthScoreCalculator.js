exports.calculateHealthScore = ({
  profile,
  stress,
  sleep
}) => {
  let score = 100;

  // 1. PHQ-9
  const phq = stress.phq9Score;
  if (phq >= 20) score -= 30;
  else if (phq >= 15) score -= 25;
  else if (phq >= 10) score -= 15;
  else if (phq >= 5) score -= 5;

  // 2. Sleep duration
  const hrs = sleep.averageSleepHours;
  if (hrs < 6 || hrs > 10) score -= 15;
  else if (hrs < 7 || hrs > 9) score -= 5;

  // 3. Sleep consistency
  if (sleep.sleepConsistency === "irregular") score -= 5;
  if (sleep.sleepConsistency === "highly_irregular") score -= 10;

  // 4. Screen time
  const screen = sleep.screenTimeBeforeSleepMinutes;
  if (screen > 60) score -= 10;
  else if (screen > 30) score -= 5;

  // 5. Medical issues
  const issues = Object.values(profile.recentMedicalIssues)
    .filter(Boolean).length;
  score -= issues * 5;

  // 6. Work hours
  const work = profile.workingHoursPerDay;
  if (work > 10) score -= 15;
  else if (work >= 9) score -= 5;

  return Math.max(score, 0);
};
