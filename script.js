let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderCategories(){
  const categories = [...new Set(tasks.map(t => t.category))];
  const filterCategory = document.getElementById("filterCategory");
  filterCategory.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(cat=>{
    filterCategory.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function renderTasks(){
  const search = document.getElementById("search").value.toLowerCase();
  const fCategory = document.getElementById("filterCategory").value;
  const fPriority = document.getElementById("filterPriority").value;
  const fStatus = document.getElementById("filterStatus").value;

  taskList.innerHTML = "";

  tasks
  .filter(t =>
    t.title.toLowerCase().includes(search) &&
    (fCategory === "" || t.category === fCategory) &&
    (fPriority === "" || t.priority === fPriority) &&
    (fStatus === "" ||
      (fStatus === "completed" && t.completed) ||
      (fStatus === "pending" && !t.completed))
  )
  .forEach(task=>{
    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <div class="task-top">
        <div class="task-title ${task.completed ? "completed":""}">
          ${task.title}
        </div>
        <span class="badge ${task.priority}">
          ${task.priority.toUpperCase()}
        </span>
      </div>
      <small>Category: ${task.category}</small>
      <small>Due: ${task.dueDate}</small>
      <div class="task-actions">
        <button onclick="toggleComplete(${task.id})">
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button onclick="editTask(${task.id})" class="secondary">Edit</button>
        <button onclick="deleteTask(${task.id})" class="secondary">Delete</button>
      </div>
    `;
    taskList.appendChild(div);
  });

  renderCategories();
}

form.addEventListener("submit", e=>{
  e.preventDefault();

  const id = document.getElementById("taskId").value;
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if(id){
    const task = tasks.find(t => t.id == id);
    task.title = title;
    task.category = category;
    task.dueDate = dueDate;
    task.priority = priority;
  } else {
    tasks.push({
      id: Date.now(),
      title,
      category,
      dueDate,
      priority,
      completed: false
    });
  }

  form.reset();
  document.getElementById("taskId").value = "";
  saveTasks();
  renderTasks();
});

function deleteTask(id){
  tasks = tasks.filter(t=>t.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id){
  const task = tasks.find(t=>t.id === id);
  document.getElementById("taskId").value = task.id;
  document.getElementById("title").value = task.title;
  document.getElementById("category").value = task.category;
  document.getElementById("dueDate").value = task.dueDate;
  document.getElementById("priority").value = task.priority;
}

function toggleComplete(id){
  const task = tasks.find(t=>t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

document.getElementById("search").addEventListener("input", renderTasks);
document.getElementById("filterCategory").addEventListener("change", renderTasks);
document.getElementById("filterPriority").addEventListener("change", renderTasks);
document.getElementById("filterStatus").addEventListener("change", renderTasks);

document.getElementById("toggleTheme").addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
});

if(localStorage.getItem("theme") === "true"){
  document.body.classList.add("dark");
}

renderTasks();