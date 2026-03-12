const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const totalTasksSpan = document.getElementById("total-tasks");
const clearAllBtn = document.getElementById("clear-all");

let tasks = [];

// Carregar tarefas do localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

// Salvar tarefas no localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Atualizar contador e estado vazio
function updateUI() {
  const taskCount = tasks.length;
  totalTasksSpan.textContent = `${taskCount} ${taskCount === 1 ? "tarefa" : "tarefas"}`;
  
  if (tasks.length === 0) {
    taskList.style.display = "none";
    emptyState.style.display = "block";
  } else {
    taskList.style.display = "block";
    emptyState.style.display = "none";
  }
}

// Renderizar tarefas
function renderTasks() {
  taskList.innerHTML = "";
  
  tasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
    
    taskItem.innerHTML = `
      <input 
        type="checkbox" 
        class="task-checkbox" 
        ${task.completed ? "checked" : ""}
        onchange="toggleTask(${index})"
      />
      <span class="task-text">${escapeHtml(task.text)}</span>
      <div class="task-buttons">
        <button class="btn-edit" onclick="editTask(${index})" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-delete" onclick="deleteTask(${index})" title="Deletar">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    taskList.appendChild(taskItem);
  });
  
  updateUI();
}

// Adicionar nova tarefa
function addTask(text) {
  if (text.trim() === "") return;
  
  tasks.push({
    id: Date.now(),
    text: text.trim(),
    completed: false,
    createdAt: new Date()
  });
  
  saveTasks();
  renderTasks();
  input.focus();
}

// Deletar tarefa
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Marcar tarefa como concluída
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Editar tarefa
function editTask(index) {
  const newText = prompt("Edite sua tarefa:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Limpar todas as tarefas
function clearAllTasks() {
  if (tasks.length === 0) return;
  
  if (confirm("Tem certeza que deseja deletar TODAS as tarefas?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Escapar HTML para segurança
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Event Listeners
form.addEventListener("submit", function(event) {
  event.preventDefault();
  addTask(input.value);
  input.value = "";
});

clearAllBtn.addEventListener("click", clearAllTasks);

// Permitir enter para adicionar tarefas
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    form.dispatchEvent(new Event("submit"));
  }
});

// Carregar tarefas ao iniciar
loadTasks();