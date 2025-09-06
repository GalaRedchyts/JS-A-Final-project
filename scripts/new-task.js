document.addEventListener("DOMContentLoaded", () => {
    const tasksList = document.querySelector(".content-new-task");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const lastTaskId = localStorage.getItem("lastCreatedTaskId");

    if (!tasksList) return;

    tasksList.innerHTML = "";

    const lastTask = tasks.find(task => String(task.id) === String(lastTaskId));

    if (lastTask) {
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
                        src="${lastTask.assigneeImage || '/images/user-image.webp'}" 
                        alt="Avatar of ${lastTask.assignee || 'No assignee'}" 
                        class="task-assignee__avatar">
                    <span class="task-assignee__name">${lastTask.assignee || "No assignee"}</span>
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
        
        localStorage.removeItem("lastCreatedTaskId");
    }
});
