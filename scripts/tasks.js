"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const viewSwitcher = document.getElementById("view");
  const cardsView = document.querySelector(".tasks-view-cards");
  const listView = document.querySelector(".tasks-view-list");

  cardsView.classList.add("active");


  viewSwitcher.addEventListener("change", () => {
    if (viewSwitcher.value === "list") {
      cardsView.classList.remove("active");
      listView.classList.add("active");
    } else {
      listView.classList.remove("active");
      cardsView.classList.add("active");
    }
  });

  const createBtn = document.querySelector(".tasks-actions button");
  createBtn.addEventListener("click", () => {
    window.location.href = "create-tasks.html";
  });
});




  
  
