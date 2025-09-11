import LocalStorageService from "./services/local-storage-service.js";

document.addEventListener("DOMContentLoaded", () => {
    const storage = new LocalStorageService();

    const generateSection = document.querySelector("[data-generate-sample-project]");
    const readySection = document.querySelector("[data-project-ready]");
    const generateBtn = generateSection.querySelector("button");
    const clearBtn = readySection.querySelector(".clear-all-data");

    generateBtn.addEventListener("click", () => {
        const user1 = storage.addUser({ name: "Alice" });
        const user2 = storage.addUser({ name: "Bob" });

        storage.addTask({ title: "Design homepage", status: "in-progress", userId: user1.id });
        storage.addTask({ title: "Fix logen bug", status: "to-do", userId: user2.id });
        storage.addTask({ title: "Prepare presentation", status: "done", userId: user1.id });

        generateSection.style.display = "none";
        readySection.style.display = "flex";
    });

    clearBtn.addEventListener("click", () => {
        storage.clearAll();
        generateSection.style.display = "flex";
        readySection.style.display = "none";
    });

    if (storage.getUsers().length || storage.getTasks().length) {
        generateSection.style.display = "none";
        readySection.style.display = "flex";
    } else {
        generateSection.style.display = "flex";
        readySection.style.display = "none";
    }
});