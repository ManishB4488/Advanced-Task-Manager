// Point this to your deployed backend URL once deployed.
// For local development, keep it as http://localhost:5000
const API_URL = "http://localhost:5000/api/tasks";

let tasks = [];
const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    taskList.innerHTML = `<p style="color:red">Could not load tasks. Is the server running?</p>`;
  }
}

function renderCategories() {
  const categories = [...new Set(tasks.map((t) => t.category))];
  const filterCategory = document.getElementById("filterCategory");
  filterCategory.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach((cat) => {
    filterCategory.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function renderTasks() {
  const search = document.getElementById("search").value.toLowerCase();
  const fCategory = document.getElementById("filterCategory").value;
  const fPriority = document.getElementById("filterPriority").value;
  const fStatus = document.getElementById("filterStatus").value;

  taskList.innerHTML = "";

  tasks
    .filter(
      (t) =>
        t.title.toLowerCase().includes(search) &&
        (fCategory === "" || t.category === fCategory) &&
        (fPriority === "" || t.priority === fPriority) &&
        (fStatus === "" ||
          (fStatus === "completed" && t.completed) ||
          (fStatus === "pending" && !t.completed))
    )
    .forEach((task) => {
      const div = document.createElement("div");
      div.className = "task";

      div.innerHTML = `
        <div class="task-top">
          <div class="task-title ${task.completed ? "completed" : ""}">
            ${task.title}
          </div>
          <span class="badge ${task.priority}">
            ${task.priority.toUpperCase()}
          </span>
        </div>
        <small>Category: ${task.category}</small>
        <small>Due: ${task.dueDate || ""}</small>
        <div class="task-actions">
          <button onclick="toggleComplete('${task._id}')">
            ${task.completed ? "Undo" : "Complete"}
          </button>
          <button onclick="editTask('${task._id}')" class="secondary">Edit</button>
          <button onclick="deleteTask('${task._id}')" class="secondary">Delete</button>
        </div>
      `;
      taskList.appendChild(div);
    });

  renderCategories();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("taskId").value;
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  const payload = { title, category, dueDate, priority };

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    form.reset();
    document.getElementById("taskId").value = "";
    await fetchTasks();
  } catch (err) {
    console.error("Failed to save task:", err);
  }
});

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await fetchTasks();
  } catch (err) {
    console.error("Failed to delete task:", err);
  }
}

function editTask(id) {
  const task = tasks.find((t) => t._id === id);
  document.getElementById("taskId").value = task._id;
  document.getElementById("title").value = task.title;
  document.getElementById("category").value = task.category;
  document.getElementById("dueDate").value = task.dueDate;
  document.getElementById("priority").value = task.priority;
}

async function toggleComplete(id) {
  const task = tasks.find((t) => t._id === id);
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    await fetchTasks();
  } catch (err) {
    console.error("Failed to update task:", err);
  }
}

document.getElementById("search").addEventListener("input", renderTasks);
document.getElementById("filterCategory").addEventListener("change", renderTasks);
document.getElementById("filterPriority").addEventListener("change", renderTasks);
document.getElementById("filterStatus").addEventListener("change", renderTasks);

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
});

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

fetchTasks();
