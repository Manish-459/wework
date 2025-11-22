# Habits App (Precise README)

**Uploaded bundles (local paths)**

* Backend zip (uploaded): `/mnt/data/src (1).zip`
* Frontend zip (uploaded): `/mnt/data/frontend.zip`

> I inspected the uploaded files and wrote this README to precisely match what is present in your project. Below I list the exact backend routes, data file location, and frontend status, and I also explain how to add the `company` selection to the habit model and frontend.

---

## Project structure (important files I found)

**Backend (unpacked to `/mnt/data/backend_unzip`)**

* Main server (partially present): `src/app.js`
* Habit routes: `src/routes/habits.js`
* Utility used for AI suggestions: `src/utils/llm.js`
* Data storage (file-based): `data/habits.json` (relative to backend runtime path) — the routes read and write this JSON file.

**Frontend (unpacked to `/mnt/data/frontend_unzip/frontend/frontend`)**

* React (Vite) starter app: `src/App.jsx`, `src/main.jsx`, etc. This is the default Vite + React template and currently does not contain habit-related UI.

---

## Backend – Exact implemented endpoints (from `src/routes/habits.js`)

All habit routes are mounted at the route you choose in `src/app.js` (the file contains a commented example to `app.use("/habits", habitRoutes);`). The routes implement a simple file-based storage using `./data/habits.json`.

### 1) Create habit

```
POST /           (when router mounted at /habits this becomes POST /habits)
```

* Request JSON body expected (current implementation):

```json
{ "name": "Habit name" }
```

* Behavior: creates a new habit object with fields:

  * `id` (uuid)
  * `name` (string)
  * `streak` (number, initial 0)
  * `lastCompleted` (null)
* Response: `201` with the created habit JSON.

### 2) Read (list) habits

```
GET /
```

* Returns the full array read from `data/habits.json`.
* If router is mounted at `/habits`, call `GET /habits`.

### 3) Mark habit as completed

```
PATCH /:id/complete
```

* Behavior: finds habit by `id`, increments `streak` by `1`, sets `lastCompleted` to the current date (YYYY-MM-DD), saves the file, and returns the updated habit.
* Error: `404` if habit not found.

### 4) Delete habit

```
DELETE /:id
```

* Behavior: removes the habit with the given `id` from the JSON file and returns `{ message: "Habit deleted" }`.
* Error: `404` if habit id not found.

### 5) AI habit suggestions (bonus)

```
POST /suggest-habits
```

* Body: `{ "goal": "some goal text" }`
* Behavior: calls `suggestHabits(goal)` from `src/utils/llm.js` and returns `{ goal, suggestions }`.
* Error: `400` if `goal` missing.

---

## Exact habit object shape (current implementation)

When created, a habit object looks like:

```json
{
  "id": "<uuid>",
  "name": "Read docs",
  "streak": 0,
  "lastCompleted": null
}
```

Note: There is currently **no `company` field** in the stored habit objects.

---

## Where data is stored

* `src/routes/habits.js` reads and writes to `./data/habits.json` using `fs.readFileSync` and `fs.writeFileSync`.
* This is a simple file-based approach useful for demos and local usage. For production, replace with a real DB (MongoDB, PostgreSQL, etc.).

---

## Frontend status

* The uploaded frontend at `/mnt/data/frontend_unzip/frontend/frontend` is a **default Vite + React template** (see `src/App.jsx`). It does not currently implement any UI for creating/listing habits or selecting a company.
* To wire the frontend to the backend you will need to:

  1. Create UI components: `HabitList`, `HabitForm` (with company select), `HabitItem`.
  2. Call the API endpoints above (`POST /habits`, `GET /habits`, `PATCH /habits/:id/complete`, `DELETE /habits/:id`, `POST /habits/suggest-habits`).
  3. Add a proxy or set the API base URL to the backend (e.g. `http://localhost:5000/habits`).

---

## How to add `company` selection (exact code guidance)

You wrote: "about the habit i just want to select the comapny" — the backend currently doesn't store a `company` field. Here's how to add it precisely.

### Backend changes (edit `src/routes/habits.js`)

1. Update the create route to accept `company` (and optionally `description`, `frequency`):

```js
// inside router.post('/', (req, res) => {
const { name, company } = req.body;
if (!name) return res.status(400).json({ error: 'Name required' });
// optional: validate company presence
const newHabit = {
  id: uuidv4(),
  name,
  company: company || null,
  streak: 0,
  lastCompleted: null
};
```

2. If you want to support filtering by company add to `GET /` handler:

```js
// before returning
const { company } = req.query;
let habits = getHabits();
if (company) habits = habits.filter(h => h.company === company);
res.json(habits);
```

3. Update other operations (PATCH/DELETE) to keep `company` unchanged — they will work automatically if you store it as part of the object.

### Frontend changes (React)

1. In `HabitForm` create a `<select>` or `<input>` for `company`. Example JSX (controlled component):

```jsx
<select value={company} onChange={e => setCompany(e.target.value)}>
  <option value="">Select company...</option>
  <option value="Acme Corp">Acme Corp</option>
  <option value="Parker Inc">Parker Inc</option>
</select>
```

2. When submitting the POST request include `company`:

```js
fetch('/habits', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, company })
})
```

3. To filter by company client-side, either call `GET /habits?company=Acme%20Corp` (if you implemented server-side filtering) or fetch all and filter in JavaScript.

---

## How to run the project locally (exact steps)

**Backend**

1. Unzip and `cd` into backend folder you created from `/mnt/data/src (1).zip` (example path when unzipped: `/mnt/data/backend_unzip`).
2. `npm install` (installs dependencies used in `src/`, such as `express`, `uuid`).
3. Ensure `data/habits.json` exists. If it doesn't, create it with `[]` (empty array).
4. Start server. The repo includes `src/app.js`: either run with `node` if transpilation works, or adjust package.json scripts. The app may be using ES modules (`import`), so run with a Node version that supports ESM.

**Frontend**

1. `cd /mnt/data/frontend_unzip/frontend/frontend`
2. `npm install`
3. `npm run dev` (starts Vite dev server). Update frontend API calls to point to the backend URL (see above).

---

## Example requests (exact to current implementation)

Create habit (no company currently):

```bash
curl -X POST http://localhost:5000/habits \
  -H "Content-Type: application/json" \
  -d '{"name":"Read docs"}'
```

Mark complete:

```bash
curl -X PATCH http://localhost:5000/habits/<id>/complete
```

Get list:

```bash
curl http://localhost:5000/habits
```

Delete:

```bash
curl -X DELETE http://localhost:5000/habits/<id>
```

AI suggestions:

```bash
curl -X POST http://localhost:5000/habits/suggest-habits \
  -H "Content-Type: application/json" \
  -d '{"goal":"become fitter"}'
```

![alt text](image-1.png)


