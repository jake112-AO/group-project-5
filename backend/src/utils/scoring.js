export function pointsForAnswer(answer, isCorrect) {
  if (answer === "unsure") return 1;
  return isCorrect ? 10 : 2;
}

export function levelFromScore(score) {
  return Math.max(1, Math.floor(score / 100) + 1);
}

export function accuracyRate(correctVotes, totalVotes) {
  if (!totalVotes) return 0;
  return Math.round((correctVotes / totalVotes) * 100);
}

export function computeBadges(user) {
  const badges = new Set(user.badges || []);
  if (user.totalVotes >= 1) badges.add("first_vote");
  if (user.totalVotes >= 20 && user.accuracyRate >= 80) badges.add("sharp_eye");
  if (user.reputationScore >= 200) badges.add("cyber_guard");
  return Array.from(badges);
}
