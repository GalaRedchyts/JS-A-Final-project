import { renderCurrentUserAvatar } from "./services/current-user.js";
import LocalStorageService from "./services/local-storage-service.js";

document.addEventListener("DOMContentLoaded", () => {
    const storage = new LocalStorageService();
    const tasks = storage.getTasks();
    const users = storage.getUsers();

    const statusCounts = tasks.reduce((acc, task) => {
        const status = (task.status || "to-do").toLowerCase();
      
        switch(status) {
          case "done": acc["done"]++; break;
          case "in-progress": acc["in-progress"]++; break;
          case "on-hold": acc["on-hold"]++; break;
          case "canceled": acc["canceled"]++; break;
          case "to-do": acc["to-do"]++; break;
          default: acc["to-do"]++; break;
        }
      
        return acc;
      }, {
        "done": 0,
        "in-progress": 0,
        "on-hold": 0,
        "canceled": 0,
        "to-do": 0
      });
  
      document.querySelector("[data-tasks-done]").textContent = statusCounts["done"];
      document.querySelector("[data-tasks-in-progress]").textContent = statusCounts["in-progress"];
      document.querySelector("[data-tasks-on-hold]").textContent = statusCounts["on-hold"];
      document.querySelector("[data-tasks-canceled]").textContent = statusCounts["canceled"];
      document.querySelector("[data-tasks-to-do]").textContent = statusCounts["to-do"];

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === "done" || t.status === "canceled").length;
    const overallPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const teamProgressEl = document.querySelector("[data-user-count]");
    if (teamProgressEl) {
        teamProgressEl.textContent = `${overallPercent}%`;
    }

    const progressBarFill = document.querySelector("[data-progress-bar-fill]");
    const progressBarPercent = document.querySelector("[data-progress-bar-percent]");
    if (progressBarFill) {
        progressBarFill.style.width = `${overallPercent}%`;
    }
    if (progressBarPercent) {
        progressBarPercent.textContent = `${overallPercent}% (${doneTasks}/${totalTasks})`;
    }

    const usersContainer = document.querySelector(".users-statistics-content");
    if (usersContainer) {
        usersContainer.innerHTML = "";

        users.forEach(user => {
            const userTasks = tasks.filter(t => String(t.userId) === String(user.id));
            const userTotal = userTasks.length;
            const userDone = userTasks.filter(t => t.status === "done" || t.status === "canceled").length;
            const userPercent = userTotal > 0 ? Math.round((userDone / userTotal) * 100) : 0;

            const userDiv = document.createElement("div");
            userDiv.classList.add("user-content");
            userDiv.innerHTML = `
                <div class="user">
                <img src="${user.avatar}" alt="${user.name}">
                <span>${user.name}</span>
                </div>
                <div class="progress-bar-wrapper">
                <div class="progress-bar">
                    <div class="progress-bar__fill" style="width: ${userPercent}%"></div>
                </div>
                <span class="progress-bar_percent">${userPercent}% (${userDone}/${userTotal})</span>
                </div>
            `;
            usersContainer.appendChild(userDiv);
        });
    }

    const teamDiv = document.querySelector(".team-statistics .team");
    if (teamDiv) {
        const assignedUserIds = [...new Set(tasks.map(t => t.userId).filter(id => id !== null))];

        assignedUserIds.forEach(id => {
        const user = users.find(u => String(u.id) === String(id));
        if (user) {
            const img = document.createElement("img");
            img.src = user.avatar;
            img.alt = user.name;
            teamDiv.prepend(img);
        }
        });
    }
    renderCurrentUserAvatar();
});