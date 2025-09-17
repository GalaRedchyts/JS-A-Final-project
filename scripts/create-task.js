import LocalStorageService from "./services/local-storage-service.js";

document.addEventListener("DOMContentLoaded", () => {
  const storage = new LocalStorageService();

  const backTasksBtn = document.querySelector(".back-to-tasks");
  if (backTasksBtn) {
    backTasksBtn.addEventListener("click", () => {
      window.location.href = "tasks.html";
    });
  }

  const form = document.querySelector(".create-new-task");
  if (!form) {
    return;
  }

  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const assigneeSelect = document.getElementById("assignee");
  const prioritySelect = document.getElementById("priority");
  const statusSelect = document.getElementById("status");
  const dueInput = document.getElementById("due-date");

  const errorSmall = form.querySelector(".error-message");

  function renderAssignees() {
    const users = storage.getUsers();
    assigneeSelect.innerHTML = "";

    const unassignedOpt = document.createElement("option");
    unassignedOpt.value = "";
    unassignedOpt.textContent = "Unassigned";
    assigneeSelect.appendChild(unassignedOpt);

    if (users.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No users available";
      assigneeSelect.appendChild(opt);
      return;
    }

    users.forEach(user => {
      const opt = document.createElement("option");
      opt.value = String(user.id);
      opt.textContent = user.name;
      if (user.current) {
        opt.selected = true;
      }
      assigneeSelect.appendChild(opt);
    });
  }

  renderAssignees();

  function validateTitle() {
    const value = titleInput.value.trim();
    if (value.length < 2) {
      errorSmall.textContent = "Title must be at least 2 characters.";
      errorSmall.style.display = "block";
      return false;
    }
    if (value.length > 50) {
      errorSmall.textContent = "Title must be less than 50 characters";
      errorSmall.style.display = "block";
      return false;
    }
    errorSmall.style.display = "none";
    return true;
  }

  titleInput.addEventListener("input", validateTitle);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateTitle()) {
      return;
    }

    const newTask = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      userId: assigneeSelect.value ? String(assigneeSelect.value) : null,
      priority: prioritySelect.value,
      status: statusSelect.value,
      dueDate: dueInput.value || null,
    };

    const createdTask = storage.addTask(newTask);

    localStorage.setItem("lastCreatedTaskId", String(createdTask.id));

    window.location.href = "new-task.html";
  });
});
