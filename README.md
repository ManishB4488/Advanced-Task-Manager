# Advanced Task Manager (Full Stack)

A task management app upgraded from a localStorage-only frontend to a full-stack
application with a Node.js/Express REST API and MongoDB persistence.

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Fetch API)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)

## Features
- Add / Edit / Delete tasks (persisted in MongoDB, not localStorage)
- Categories, due dates, priority levels
- Search & filter
- Dark / Light mode
- REST API: `GET`, `POST`, `PUT`, `DELETE` on `/api/tasks`

## Project Structure
```
Advanced-Task-Manager/
├── client/          # Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
└── server/          # Backend (Express + MongoDB)
    ├── server.js
    ├── models/Task.js
    ├── routes/tasks.js
    ├── package.json
    └── .env.example
```

## Running Locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
# edit .env and paste your MongoDB Atlas connection string into MONGO_URI
npm run dev
```
Server runs on `http://localhost:5000`.

### 2. Frontend
Just open `client/index.html` in your browser (or use the VS Code "Live Server"
extension). Make sure the backend is running first — the frontend fetches from
`http://localhost:5000/api/tasks`.

## API Endpoints
| Method | Endpoint          | Description       |
|--------|-------------------|--------------------|
| GET    | /api/tasks        | Get all tasks      |
| POST   | /api/tasks        | Create a task       |
| PUT    | /api/tasks/:id    | Update a task       |
| DELETE | /api/tasks/:id    | Delete a task       |

## Roadmap
- [ ] Dockerize backend + frontend
- [ ] CI/CD via GitHub Actions
- [ ] Deploy backend (Render/Railway) + frontend (Vercel/Netlify)
- [ ] JWT-based auth (per-user tasks)
