"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const backTasksBtn = document.querySelector(".back-to-tasks");
  if (backTasksBtn) {
    backTasksBtn.addEventListener("click", () => {
      window.location.href = "tasks.html";
    });
  }

  const form = document.querySelector(".create-new-task");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      assignee: form.assignee.value,
      priority: form.priority.value,
      status: form.status.value,
      dueDate: form["due-date"].value,
    };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("lastCreatedTaskId", newTask.id);

    window.location.href = "new-task.html";
  })
});




  
  
