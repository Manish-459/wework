import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { suggestHabits } from "../utils/llm.js";

const router = express.Router();
const dataFile = "./data/habits.json";

// Helper: read habits
function getHabits() {
  const data = fs.readFileSync(dataFile);
  return JSON.parse(data);
}

// Helper: write habits
function saveHabits(habits) {
  fs.writeFileSync(dataFile, JSON.stringify(habits, null, 2));
}

// CREATE habit
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });

  const habits = getHabits();
  const newHabit = {
    id: uuidv4(),
    name,
    streak: 0,
    lastCompleted: null,
  };

  habits.push(newHabit);
  saveHabits(habits);
  res.status(201).json(newHabit);
});

// READ habits
router.get("/", (req, res) => {
  res.json(getHabits());
});

// MARK habit as completed
router.patch("/:id/complete", (req, res) => {
  const habits = getHabits();
  const habit = habits.find(h => h.id === req.params.id);

  if (!habit) return res.status(404).json({ error: "Habit not found" });

  habit.streak += 1;
  habit.lastCompleted = new Date().toISOString().split("T")[0];

  saveHabits(habits);
  res.json(habit);
});

// DELETE habit
router.delete("/:id", (req, res) => {
  const habits = getHabits();
  const filtered = habits.filter(h => h.id !== req.params.id);

  if (filtered.length === habits.length)
    return res.status(404).json({ error: "Habit not found" });

  saveHabits(filtered);
  res.json({ message: "Habit deleted" });
});

// BONUS AI HABIT SUGGESTIONS
router.post("/suggest-habits", async (req, res) => {
  const { goal } = req.body;
  if (!goal) return res.status(400).json({ error: "Goal is required" });

  const suggestions = await suggestHabits(goal);
  res.json({ goal, suggestions });
});

export default router;
