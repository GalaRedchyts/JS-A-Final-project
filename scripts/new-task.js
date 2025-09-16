import LocalStorageService from "./services/local-storage-service.js";

document.addEventListener("DOMContentLoaded", () => {
  const tasksList = document.querySelector(".content-new-task");
  const storage = new LocalStorageService();
  const tasks = storage.getTasks();
  const lastTaskId = localStorage.getItem("lastCreatedTaskId");

  const backTasksBtn = document.querySelector(".back-to-tasks");
  if (backTasksBtn) {
    backTasksBtn.addEventListener("click", () => {
      window.location.href = "tasks.html";
    });
  }

  if (!tasksList) return;

  tasksList.innerHTML = "";

  const lastTask = tasks.find(task => String(task.id) === String(lastTaskId));

  if (lastTask) {
    const assignee = storage.getUsers().find(u => u.id === lastTask.userId);
    const assigneeName = assignee ? assignee.name : "Unassigned";
    const assigneeImage = assignee ? assignee.avatar : "/images/user-image.webp";

    const li = document.createElement("li");
    li.classList.add("task-item");
    li.innerHTML = `
      <h4>${lastTask.title}</h4>

      <div class="task-field">
        <span class="task-label">Description</span>
        <p class="task-value">${lastTask.description || "No description"}</p>
      </div>

      <div class="task-field">
        <span class="task-label">Assignee</span>
        <div class="task-value task-assignee">
          <img 
            src="${assigneeImage}" 
            alt="Avatar of ${assigneeName}" 
            class="task-assignee__avatar">
          <span class="task-assignee__name">${assigneeName}</span>
        </div>
      </div>

      <div class="task-field">
        <span class="task-label">Priority</span>
        <div class="task-value" data-priority>${lastTask.priority} Priority</div>
      </div>

      <div class="task-field">
        <span class="task-label">Status</span>
        <div class="task-value status" data-status>${lastTask.status}</div>
      </div>

      <div class="task-field">
        <span class="task-label">Due Date</span>
        <div class="task-value date">${lastTask.dueDate || "No date"}</div>
      </div>
    `;
    tasksList.appendChild(li);

    const completeBtn = document.querySelector(".complete");
    const editBtn = document.querySelector(".edit");

    if (completeBtn) {
      if (lastTask.status === "Done") {
        completeBtn.style.display = "none";
      } else {
        completeBtn.style.display = "inline-block";
        completeBtn.addEventListener("click", () => {
          storage.updateTask(lastTask.id, { status: "Done" });

          const statusEl = li.querySelector("[data-status]");
          if (statusEl) {
            statusEl.textContent = "Done";
          }

          completeBtn.style.display = "none";
        });
      }
    }

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        localStorage.setItem("lastEditedTaskId", lastTask.id);
        
        window.location.href = "edit-task.html";
      });
    }

    localStorage.removeItem("lastCreatedTaskId");
  }
});
