const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDesc = document.getElementById("task-desc");
const taskDeadline = document.getElementById("task-deadline");
const taskList = document.getElementById("task-list");

const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = "";
  tasks.forEach((task, index) => addTaskToDOM(task, index));
};

const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const addTaskToDOM = (task, index) => {
  const li = document.createElement("li");
  li.className = `list-group-item d-flex justify-content-between align-items-center ${task.done ? "bg-success text-white" : ""}`;
  
  li.innerHTML = `
    <div>
      <strong>${task.title}</strong>
      <p>${task.description}</p>
      <small>Deadline: ${task.deadline ? task.deadline : "No deadline"}</small>
    </div>
    <div class="actions">
      <button class="btn btn-warning btn-sm me-1" onclick="editTask(${index})">Edit</button>
      <button class="btn btn-success btn-sm me-1" onclick="markAsDone(${index})">${task.done ? "Undo" : "Done"}</button>
      <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Delete</button>
    </div>
  `;
  taskList.appendChild(li);
};

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const description = taskDesc.value.trim();
  const deadline = taskDeadline.value.trim();

  if (title.length < 5 || title.length > 25) {
    alert("Title must be between 5 and 25 characters.");
    return;
  }

  if (description.length < 20 || description.length > 100) {
    alert("Description must be between 20 and 100 characters.");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ title, description, deadline, done: false });
  saveTasks(tasks);
  loadTasks();

  taskForm.reset();
});

const markAsDone = (index) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].done = !tasks[index].done;
  saveTasks(tasks);
  loadTasks();
};

const deleteTask = (index) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(index, 1);
  saveTasks(tasks);
  loadTasks();
};

document.getElementById("search-task").addEventListener("input", (e) => {
    const searchText = e.target.value.toLowerCase();
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskList.innerHTML = "";
  
    tasks
      .filter(task => task.title.toLowerCase().includes(searchText) || task.description.toLowerCase().includes(searchText))
      .forEach((task, index) => addTaskToDOM(task, index));
});

const editTask = (index) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const task = tasks[index];

  taskTitle.value = task.title;
  taskDesc.value = task.description;
  taskDeadline.value = task.deadline;

  tasks.splice(index, 1);
  saveTasks(tasks);
  loadTasks();
};

const updateClock = () => {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  };
  document.getElementById("clock").innerText = now.toLocaleDateString("en-US", options);
};

setInterval(updateClock, 1000);
updateClock();

// Single event listener for page load
document.addEventListener("DOMContentLoaded", loadTasks);
