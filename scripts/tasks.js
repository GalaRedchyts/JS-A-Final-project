import LocalStorageService from "./services/local-storage-service.js";

document.addEventListener("DOMContentLoaded", () => {
  const storage = new LocalStorageService();

  const cardsView = document.querySelector(".tasks-view-cards");
  const listView = document.querySelector(".tasks-view-list");
  const viewSwitcher = document.getElementById("view");
  const statusFilter = document.getElementById("status");
  const userFilter = document.getElementById("user");
  const textFilter = document.getElementById("filter");
  const createBtn = document.querySelector(".tasks-actions button");

  function populateUserFilter() {
    const users = storage.getUsers();
    userFilter.innerHTML = `<option value="All">All</option>`;
    users.forEach(user => {
      const opt = document.createElement("option");
      opt.value = String(user.id);
      opt.textContent = user.name;
      userFilter.appendChild(opt);
    });

    const savedUser = sessionStorage.getItem("user") || "All";
    if ([...userFilter.options].some(opt => opt.value === savedUser)) {
      userFilter.value = savedUser;
    } else {
      userFilter.value = "All";
    }
  }

  function renderTasks() {
    const tasks = storage.getTasks();
    const users = storage.getUsers();

    const selectedStatus = sessionStorage.getItem("status") || "All";
    const selectedUser = sessionStorage.getItem("user") || "All";
    const searchText = sessionStorage.getItem("filter")?.toLowerCase() || "";
    const currentView = sessionStorage.getItem("view") || "cards";

    cardsView.innerHTML = "";
    listView.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
      const assignee = users.find(u => String(u.id) === String(task.userId));
      const matchStatus = selectedStatus === "All" || task.status === selectedStatus;
      const matchUser = selectedUser === "All" || (assignee && String(assignee.id) === selectedUser);
      const matchText = task.title.toLowerCase().includes(searchText);
      return matchStatus && matchUser && matchText;
    });

    filteredTasks.forEach(task => {
      const assignee = users.find(u => String(u.id) === String(task.userId));
      const assigneeName = assignee ? assignee.name : "Unassigned";
      const assigneeImage = assignee ? assignee.avatar : "/images/user-image.webp";

      // CARD view
      const cardItem = document.createElement("li");
      cardItem.className = "card";
      cardItem.dataset.id = task.id;
      cardItem.innerHTML = `
        <div class="card_name">
          <h4>${task.title}</h4>
          <span class="status status_${task.status.toLowerCase().replace(" ", "-")}" data-status="${task.status}">
            ${task.status}
          </span>
        </div>
        <div class="card_user">
          <img src="${assigneeImage}" alt="Avatar of ${assigneeName}">
          <h5>${assigneeName}</h5>
        </div>
        <div class="card_priority" data-priority="${task.priority}">${task.priority} Priority</div>
        <time class="date" datetime="${task.dueDate}">Due: ${task.dueDate || "No date"}</time>
        <div class="card_actions">
          <button class="action-btn done" aria-label="Mark as done">
            <img src="/images/icons/check.svg" alt="Done">
          </button>
          <button class="action-btn edit" aria-label="Edit task">
            <img src="/images/icons/edit.svg" alt="Edit">
          </button>
        </div>
      `;

      const doneBtnCard = cardItem.querySelector(".action-btn.done");
      if (task.status === "done" && doneBtnCard) doneBtnCard.style.display = "none";

      cardsView.appendChild(cardItem);

      // LIST view
      const listItem = document.createElement("li");
      listItem.className = "card";
      listItem.dataset.id = task.id;
      listItem.innerHTML = `
        <div class="card_name">
          <span class="status status_${task.status.toLowerCase().replace(" ", "-")}" data-status="${task.status}">
            ${task.status}
          </span>
          <h4>${task.title}</h4>
        </div>
        <div class="card_priority" data-priority="${task.priority}">${task.priority} Priority</div>
        <div class="card_user">
          <img src="${assigneeImage}" alt="Avatar of ${assigneeName}">
          <h5>${assigneeName}</h5>
        </div>
        <time class="date" datetime="${task.dueDate}">Due: ${task.dueDate || "No date"}</time>
        <div class="card_actions">
          <button class="action-btn done" aria-label="Mark as done">
            <img src="/images/icons/check.svg" alt="Done">
          </button>
          <button class="action-btn edit" aria-label="Edit task">
            <img src="/images/icons/edit.svg" alt="Edit">
          </button>
        </div>
      `;
      const doneBtnList = listItem.querySelector(".action-btn.done");
      if (task.status === "done" && doneBtnList) doneBtnList.style.display = "none";

      listView.appendChild(listItem);
    });

    if (currentView === "list") {
      cardsView.classList.remove("active");
      listView.classList.add("active");
    } else {
      listView.classList.remove("active");
      cardsView.classList.add("active");
    }
  }

  [statusFilter, userFilter, textFilter, viewSwitcher].forEach(filter => {
    filter.addEventListener("change", () => {
      sessionStorage.setItem(filter.id, filter.value);
      renderTasks();
    });
    filter.addEventListener("input", () => {
      sessionStorage.setItem(filter.id, filter.value);
      renderTasks();
    });
  });

  document.addEventListener("click", (e) => {
    const card = e.target.closest("li.card");
    if (!card) {
      return;
    } 
  
    const id = String(card.dataset.id);
  
    if (e.target.closest(".done")) {
      storage.updateTask(id, { status: "done" });

      const statusEl = card.querySelector("[data-status]");
      if (statusEl) {
        statusEl.textContent = "done";
        statusEl.className = "status status_done";
        statusEl.dataset.status = "done";
      }
  
      const doneBtn = card.querySelector(".action-btn.done");
      if (doneBtn) doneBtn.remove();
    }
  
    if (e.target.closest(".edit")) {
      localStorage.setItem("lastEditedTaskId", id);
      window.location.href = "edit-task.html";
    }
  });  

  createBtn.addEventListener("click", () => {
    window.location.href = "create-task.html";
  });

  populateUserFilter();
  viewSwitcher.value = sessionStorage.getItem("view") || "cards";
  statusFilter.value = sessionStorage.getItem("status") || "All";
  textFilter.value = sessionStorage.getItem("filter") || "";

  renderTasks();
});
