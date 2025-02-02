const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDesc = document.getElementById("task-desc");
const taskDeadline = document.getElementById("task-deadline");
const taskColorInput = document.getElementById("task-color");
const taskList = document.getElementById("task-list");
const searchTaskInput = document.getElementById("search-task");
const clockDisplay = document.getElementById("clock");

// Fungsi untuk memuat task dari localStorage
const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = "";
  tasks.forEach((task, index) => addTaskToDOM(task, index));
};

// Fungsi untuk menyimpan task ke localStorage
const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Fungsi untuk menambahkan task ke DOM
const addTaskToDOM = (task, index) => {
  const li = document.createElement("li");
  li.className = `list-group-item d-flex justify-content-between align-items-center ${task.done ? "bg-success text-white" : ""}`;

  li.style.color = task.color || "#000";

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

// Fungsi untuk mengedit task
const editTask = (index) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const task = tasks[index];

  taskTitle.value = task.title;
  taskDesc.value = task.description;
  taskDeadline.value = task.deadline;
  taskColorInput.value = task.color;  

  tasks.splice(index, 1);
  saveTasks(tasks);
  loadTasks();
};

// Fungsi untuk menandai task sebagai selesai
const markAsDone = (index) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].done = !tasks[index].done;
  saveTasks(tasks);
  loadTasks();
};

// Fungsi untuk menghapus task
const deleteTask = (index) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(index, 1);
  saveTasks(tasks);
  loadTasks();
};

// Fungsi untuk menangani pencarian task
const searchTask = (e) => {
  const searchText = e.target.value.toLowerCase();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = "";

  tasks
    .filter(task => task.title.toLowerCase().includes(searchText) || task.description.toLowerCase().includes(searchText))
    .forEach((task, index) => addTaskToDOM(task, index));
};

// Fungsi untuk menambahkan task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const description = taskDesc.value.trim();
  const deadline = taskDeadline.value.trim();
  const color = taskColorInput.value;

  // Validasi input: title antara 5 dan 25 karakter, description antara 20 dan 100 karakter
  if (title.length < 5 || title.length > 25) {
    alert("Title must be between 5 and 25 characters.");
    return;
  }

  if (description.length < 20 || description.length > 100) {
    alert("Description must be between 20 and 100 characters.");
    return;
  }

  // Jika validasi lolos, simpan task ke localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ title, description, deadline, color, done: false });
  saveTasks(tasks);
  loadTasks();

  // Reset form setelah menambah task
  taskForm.reset();
});

// Fungsi untuk mengupdate jam real-time
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
  clockDisplay.innerText = now.toLocaleDateString("en-US", options);
};

// Event listener untuk input pencarian
searchTaskInput.addEventListener("input", searchTask);

// Fungsi untuk mengganti warna teks
const changeTextColor = () => {
  const textColor = document.getElementById("text-color").value;
  document.body.style.color = textColor;
};

// Fungsi untuk mengganti font
const changeFont = () => {
  const font = document.getElementById("font-family").value;
  document.body.style.fontFamily = font;
};

// Menambahkan event listener untuk dropdown warna dan font
document.getElementById("text-color").addEventListener("change", changeTextColor);
document.getElementById("font-family").addEventListener("change", changeFont);

// Menjalankan update jam setiap detik
setInterval(updateClock, 1000);
updateClock();

// Load task saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadTasks);
