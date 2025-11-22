# 📘 Habits App – Full Documentation (README.md)

A complete Habit Tracking application built with **Node.js (Express)** for backend and **React + Vite** for frontend.  
The backend uses simple **file-based JSON storage** and provides full CRUD operations plus AI-based habit suggestions.

---

# 🚀 Features

### ✅ Backend (Node + Express)
- Create new habits  
- Delete habits  
- List all habits  
- Mark habit as completed  
- Track streak and last completed date  
- AI habit suggestion route  
- Stores data in `habits.json`  
- Support to add custom fields like `company`

### ✅ Frontend (React + Vite)
- Clean Vite template  
- Ready to integrate with backend  
- Components to be added: HabitForm, HabitList, HabitItem

---

# 📁 Project Structure

Backend/
└── src/
├── app.js
├── routes/
│ └── habits.js
├── utils/
│ └── llm.js
└── data/
└── habits.json

Frontend/
└── src/
├── App.jsx
├── main.jsx
└── (default Vite project)

yaml
Copy code

---

# 🛠 Backend API (All Routes)

Assumes routes are mounted as:
app.use("/habits", habitRoutes);

yaml
Copy code

---

## 1️⃣ Create Habit
POST /habits

css
Copy code

## 📌 API Endpoints (Backend)

---

### **1️⃣ Create Habit**
**POST /habits**

#### Body:
```json
{
  "name": "Drink Water"
}
Response:
json
Copy code
{
  "id": "uuid",
  "name": "Drink Water",
  "streak": 0,
  "lastCompleted": null
}
2️⃣ Get All Habits
GET /habits

3️⃣ Complete Habit
PATCH /habits/:id/complete

Updates performed:

streak += 1

lastCompleted = YYYY-MM-DD

4️⃣ Delete Habit
DELETE /habits/:id

Response:
json
Copy code
{
  "message": "Habit deleted"
}
5️⃣ AI Habit Suggestions
POST /habits/suggest-habits

Body:
json
Copy code
{
  "goal": "gain muscle"
}
Response:
json
Copy code
{
  "goal": "gain muscle",
  "suggestions": ["habit1", "habit2"]
}
📦 Habit Object Format
json
Copy code
{
  "id": "uuid",
  "name": "Read Books",
  "streak": 0,
  "lastCompleted": null
}
📍 Data Storage
Your habits are stored in:

bash
Copy code
src/data/habits.json
🏢 Adding a company Field (Optional)
Modify the POST route:

js
Copy code
const { name, company } = req.body;

const newHabit = {
  id: uuidv4(),
  name,
  company: company || null,
  streak: 0,
  lastCompleted: null
};
Filtering habits by company:
js
Copy code
if (req.query.company) {
  habits = habits.filter(h => h.company === req.query.company);
}
🎨 Frontend (React + Vite)
The frontend is currently a Vite React template.
You must create these components:

HabitForm.jsx

HabitList.jsx

HabitItem.jsx

Example API call:
js
Copy code
await fetch("http://localhost:5000/habits", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, company })
});
▶️ How to Run the Project
Backend
bash
Copy code
cd backend
npm install
node src/app.js
Make sure this file exists:

css
Copy code
src/data/habits.json → []
Frontend
bash
Copy code
cd frontend
npm install
npm run dev
📌 API Examples (cURL)
Create Habit
bash
Copy code
curl -X POST http://localhost:5000/habits \
-H "Content-Type: application/json" \
-d "{\"name\":\"Read Docs\"}"
Get All Habits
bash
Copy code
curl http://localhost:5000/habits
Mark Completed
bash
Copy code
curl -X PATCH http://localhost:5000/habits/<id>/complete
Delete Habit
bash
Copy code
curl -X DELETE http://localhost:5000/habits/<id>
AI Suggestions
bash
Copy code
curl -X POST http://localhost:5000/habits/suggest-habits \
-H "Content-Type: application/json" \
-d "{\"goal\":\"get fit\"}"
🖼 Add Screenshot (Optional)
markdown
Copy code
![App Screenshot](your-image-path.png)
