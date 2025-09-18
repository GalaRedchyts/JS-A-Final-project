import LocalStorageService from "./services/local-storage-service.js";
import { userNames, taskTitles } from "./data/sample-data.js";
import { avatars } from "./data/avatars.js";

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomStatus() {
    return  getRandomItem(["to-do", "in-progress", "done", "on-hold", "canceled"]);
}

function getRandomPriority() {
    return getRandomItem(["Low", "Medium", "High"]);
}

function getRandomDueDate() {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 31);
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + randomDays);
    return dueDate.toISOString().split("T")[0];
}

// MODAL
const modal = document.getElementById("confirmModal");
const cancelBtn = modal.querySelector(".cancel-btn");
const confirmBtn = modal.querySelector(".confirm-btn");
const closeBtn = modal.querySelector(".close-btn");

function showModal(onConfirm) {
    modal.classList.add("active");

    const handleCancel = () => {
        modal.classList.remove("active");
        cleanup();
    };

    const handleConfirm = () => {
        onConfirm();
        modal.classList.remove("active");
        cleanup();
    };

    const handleClose = () => {
        modal.classList.remove("active");
        cleanup();
    };

    function cleanup() {
        cancelBtn.removeEventListener("click", handleCancel);
        confirmBtn.removeEventListener("click", handleConfirm);
        closeBtn.removeEventListener("click", handleClose);
    }

    cancelBtn.addEventListener("click", handleCancel);
    confirmBtn.addEventListener("click", handleConfirm);
    closeBtn.addEventListener("click", handleClose);
}

//PROJECT GENERATION
function generateProject(storage, generateSection, readySection) {
    storage.clearAll();

    const users = [];
    for (let i = 0; i < 5; i++) {
        const user = storage.addUser({ 
            name: getRandomItem(userNames),
            avatar: getRandomItem(avatars),
            current: i === 0,
            generated: true
        });
        users.push(user);
    }

    for (let i = 0; i < 15; i++) {
        const randomUser = getRandomItem(users);
        storage.addTask({
            title: getRandomItem(taskTitles),
            status: getRandomStatus(),
            priority: getRandomPriority(),
            userId: randomUser.id,
            dueDate: getRandomDueDate(),
            generated: true
        });
    }

    generateSection.style.display = "none";
    readySection.style.display = "flex";
}

//MAIN
document.addEventListener("DOMContentLoaded", () => {
    const storage = new LocalStorageService();

    const generateSection = document.querySelector("[data-generate-sample-project]");
    const readySection = document.querySelector("[data-project-ready]");
    const generateBtn = generateSection.querySelector("button");
    const clearBtn = readySection.querySelector(".clear-all-data");
    const exploreTasksBtn = document.querySelector(".explore-tasks");

    function hasGeneratedData() {
        const generatedUsers = storage.getUsers().filter(u => u.generated);
        const generatedTasks = storage.getTasks().filter(t => t.generated);
        return generatedUsers.length || generatedTasks.length;
    }

    function hasManualData() {
        const manualUsers = storage.getUsers().filter(u => !u.generated);
        const manualTasks = storage.getTasks().filter(t => !t.generated);
        return manualUsers.length || manualTasks.length;
    }

    if (hasGeneratedData()) {
        generateSection.style.display = "none";
        readySection.style.display = "flex";
    } else {
        generateSection.style.display = "flex";
        readySection.style.display = "none";
    }

    generateBtn.addEventListener("click", () => {
        if (hasManualData()) {
            showModal(() => generateProject(storage, generateSection, readySection));
        } else {
            generateProject(storage, generateSection, readySection);
        }
    });

    clearBtn.addEventListener("click", () => {
        showModal(() => {
            storage.clearAll();
            generateSection.style.display = "flex";
            readySection.style.display = "none";
        });
    });

    if (exploreTasksBtn) {
        exploreTasksBtn.addEventListener("click", () => {
            window.location.href = "pages/tasks.html";
        })
    }
});