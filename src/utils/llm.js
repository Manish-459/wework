export async function suggestHabits(goal) {
  const lower = goal.toLowerCase();
  if (lower.includes("health"))
    return ["Drink 2L water", "Walk 5k steps", "Sleep 8 hours"];

  if (lower.includes("study"))
    return ["Study 1 hour", "Read one chapter", "Write notes"];

  return ["Daily reflection", "Plan next day", "Meditation"];
}
