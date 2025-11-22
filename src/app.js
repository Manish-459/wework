// import express from "express";
// import dotenv from "dotenv";
// import habitRoutes from "./routes/habits.js";

// dotenv.config();
// const app = express();
// app.use(express.json());

// // Routes
// app.use("/habits", habitRoutes);

// // Health check
// app.get("/", (req, res) => {
//   res.send("Habit Tracker API is running 🚀");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));
// src/app.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/conn.js";
import habitRoutes from "./routes/habits.js";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/habits", habitRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Habit Tracker API is running 🚀");
});

const PORT = process.env.PORT || 5000;

// connect to DB and then start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}).catch((err) => {
  console.error("Failed to start server:", err);
});
