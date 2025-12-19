// ---------- Storage keys ----------
const TASKS_KEY = "exp10_tasks";
const PREFS_KEY = "exp10_prefs";

// ---------- State ----------
let tasks = [];
let editingTaskId = null;

// ---------- DOM elements ----------
const themeSelect = document.getElementById("themeSelect");
const filterSelect = document.getElementById("filterSelect");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formMessage = document.getElementById("formMessage");
const taskList = document.getElementById("taskList");

const loadTipsBtn = document.getElementById("loadTipsBtn");
const tipsStatus = document.getElementById("tipsStatus");
const tipsList = document.getElementById("tipsList");

// ---------- Local storage helpers ----------
function loadTasks() {
  const saved = localStorage.getItem(TASKS_KEY);
  tasks = saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function loadPrefs() {
  const saved = localStorage.getItem(PREFS_KEY);
  const defaults = { theme: "light", filter: "all" };
  return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
}

function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

// ---------- UI helpers ----------
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
}

function showFormMessage(text, type = "success") {
  formMessage.textContent = text;
  formMessage.classList.remove("error", "success");
  if (text) {
    formMessage.classList.add(type);
  }
}

// Render all tasks based on filter
function renderTasks() {
  taskList.innerHTML = "";

  const filter = filterSelect.value;
  const filtered = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  if (filtered.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No tasks to display.";
    taskList.appendChild(li);
    return;
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const leftDiv = document.createElement("div");
    leftDiv.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskCompleted(task.id));

    const span = document.createElement("span");
    span.className = "task-title";
    if (task.completed) span.classList.add("completed");
    span.textContent = task.title;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEditTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("secondary");
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(actionsDiv);

    taskList.appendChild(li);
  });
}

// ---------- Task operations ----------
function addTask(title) {
  const newTask = {
    id: Date.now().toString(),
    title,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function updateTask(id, newTitle) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, title: newTitle } : t
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTaskCompleted(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

// ---------- Edit flow ----------
function startEditTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  editingTaskId = id;
  taskInput.value = task.title;
  showFormMessage("Editing task. Update text and click Save.", "success");
  cancelEditBtn.hidden = false;
}

function cancelEdit() {
  editingTaskId = null;
  taskInput.value = "";
  cancelEditBtn.hidden = true;
  showFormMessage("");
}

// ---------- Form submit ----------
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();

  if (!title) {
    showFormMessage("Task title cannot be empty.", "error");
    return;
  }

  if (editingTaskId) {
    updateTask(editingTaskId, title);
    showFormMessage("Task updated successfully.", "success");
  } else {
    addTask(title);
    showFormMessage("Task added successfully.", "success");
  }

  taskInput.value = "";
  editingTaskId = null;
  cancelEditBtn.hidden = true;
});

cancelEditBtn.addEventListener("click", cancelEdit);

// ---------- Preferences events ----------
themeSelect.addEventListener("change", () => {
  const prefs = loadPrefs();
  const newPrefs = { ...prefs, theme: themeSelect.value };
  applyTheme(newPrefs.theme);
  savePrefs(newPrefs);
});

filterSelect.addEventListener("change", () => {
  const prefs = loadPrefs();
  const newPrefs = { ...prefs, filter: filterSelect.value };
  savePrefs(newPrefs);
  renderTasks();
});

// ---------- Fetch external data with error handling ----------
// Example API: using JSONPlaceholder posts as "tips" (mock text)
async function loadTips() {
  tipsStatus.textContent = "";
  tipsStatus.classList.remove("error", "success");
  tipsList.innerHTML = "";

  loadTipsBtn.disabled = true;
  loadTipsBtn.textContent = "Loading...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");

    // Handle non-2xx HTTP status codes manually
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.title;
      tipsList.appendChild(li);
    });

    tipsStatus.textContent = "Tips loaded successfully.";
    tipsStatus.classList.add("success");
  } catch (error) {
    // Network errors or thrown errors land here
    tipsStatus.textContent = "Failed to load tips. Please try again.";
    tipsStatus.classList.add("error");
    console.error("Fetch error:", error.message);
  } finally {
    loadTipsBtn.disabled = false;
    loadTipsBtn.textContent = "Load Tips";
  }
}

loadTipsBtn.addEventListener("click", loadTips);

// ---------- Initial load ----------
(function init() {
  // Load tasks from storage
  loadTasks();
  renderTasks();

  // Load preferences and apply
  const prefs = loadPrefs();
  themeSelect.value = prefs.theme;
  filterSelect.value = prefs.filter;
  applyTheme(prefs.theme);
})();
