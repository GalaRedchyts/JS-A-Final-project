import LocalStorageService from "./services/local-storage-service.js";

document.addEventListener("DOMContentLoaded", () => {
    const storage = new LocalStorageService();
    const tasks = storage.getTasks();
    const users = storage.getUsers();

    const form = document.querySelector(".edit-task");
    const deleteBtn = document.querySelector(".delete");
    const backBtn = document.querySelector(".back-to-tasks");

    const modal = document.getElementById("confirmModal");
    const cancelBtn = modal.querySelector(".cancel-btn");
    const confirmBtn = modal.querySelector(".confirm-btn");
    const closeBtn = modal.querySelector(".close-btn");

    const lastTaskId = localStorage.getItem("lastEditedTaskId");

    if (!lastTaskId) {
        alert("There is no task selected for editing.");
        window.location.href = "tasks.html";
        return;
    }

    const task = tasks.find(t => String(t.id) === String(lastTaskId));

    if (!task) {
        alert("Task not found");
        window.location.href = "tasks.html";
        return;
    }

    document.querySelector("#title").value = task.title || "";
    document.querySelector("#description").value = task.description || "";
    document.querySelector("#priority").value = task.priority || "Medium";
    document.querySelector("#status").value = task.status || "To do";

    const assigneeSelect = document.querySelector("#assignee");
    assigneeSelect.innerHTML = `<option value="">Unassigned</option>`;
    users.forEach(u => {
        const option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.name;
        if (String(u.id) === String(task.userId)) {
            option.selected = true;
        }
        assigneeSelect.appendChild(option);
    });

    if (backBtn) {
        backBtn.addEventListener("click", e => {
            e.preventDefault();
            window.location.href = "tasks.html";
        });
    }

    form.addEventListener("submit", e => {
        e.preventDefault();

        const updateTask = {
            ...task,
            title: document.querySelector("#title").value.trim(),
            description: document.querySelector("#description").value.trim(),
            priority: document.querySelector("#priority").value,
            status: document.querySelector("#status").value,
            userId: document.querySelector("#assignee").value || null,
        };

        storage.updateTask(task.id, updateTask);

        localStorage.removeItem("lastEditedTaskId");
        window.location.href = "tasks.html";
    });

    if (deleteBtn) {
        deleteBtn.addEventListener("click", e => {
            e.preventDefault();
            modal.classList.add("active");
        });
    }

    const cleanup = () => {
        cancelBtn.removeEventListener("click", handleCancel);
        confirmBtn.removeEventListener("click", handleConfirm);
        closeBtn.removeEventListener("click", handleClose);
    };

    const handleCancel = () => {
        modal.classList.remove("active");
        cleanup();
    };

    const handleClose = () => {
        modal.classList.remove("active");
        cleanup();
    };

    const handleConfirm = () => {
        storage.deleteTask(task.id);
        localStorage.removeItem("lastEditedTaskId");
        modal.classList.remove("active");
        cleanup();
        window.location.href = "tasks.html";
    };

    cancelBtn.addEventListener("click", handleCancel);
    closeBtn.addEventListener("click", handleClose);
    confirmBtn.addEventListener("click", handleConfirm);
});