import LocalStorageService from "./services/local-storage-service.js";
import { avatars } from "./data/avatars.js";
import { renderCurrentUserAvatar } from "./services/current-user.js";

document.addEventListener("DOMContentLoaded", () => {
  const storage = new LocalStorageService();

  const listUsers = document.querySelector(".list-users");
  const userCountSpan = document.querySelector("[data-user-count]");
  const addMemberBtn = document.querySelector(".add-member button");

  // MODAL ADD USER
  const addModal = document.getElementById("addMemberModal");
  const addNameInput = addModal?.querySelector("input[name='memberName']");
  const avatarContainer = addModal?.querySelector(".avatars");
  const addConfirmBtn = addModal?.querySelector(".confirm-add");
  const addCancelBtn = addModal?.querySelector(".cancel-add");

  // RENDER USERS
  function renderUsers() {
    const users = storage.getUsers();
    listUsers.innerHTML = "";

    users.forEach((user, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${user.avatar}" alt="user image">
        <h5 class="user-name" data-name>${user.name}</h5>
        ${index === 0 ? "<span>Current User</span>" : `
          <button class="delete-button" aria-label="Delete">
            <img src="/images/icons/trash.svg" alt="icon trash">
          </button>
        `}
      `;

      if (index !== 0) {
        const deleteBtn = li.querySelector(".delete-button");
        deleteBtn?.addEventListener("click", () => {
          const tasks = storage.getTasks();
          const updatedTasks = tasks.map(task =>
            String(task.userId) === String(user.id) ? { ...task, userId: null } : task
          );
          storage.saveTasks(updatedTasks);

          storage.deleteUser(user.id);

          renderUsers();
        });
      }

      listUsers.appendChild(li);
    });

    userCountSpan.textContent = users.length;
  }

  renderUsers();

  // AVATAR SELECTION
  function renderAvatars() {
    if (!avatarContainer) return;
    avatarContainer.innerHTML = "";

    avatars.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "avatar option";
      img.classList.add("avatar-option");
      img.dataset.avatar = src;

      img.addEventListener("click", () => {
        avatarContainer.querySelectorAll(".avatar-option").forEach(a => a.classList.remove("selected"));
        img.classList.add("selected");
      });

      avatarContainer.appendChild(img);
    });
  }

  // OPEN ADD USER MODAL
  addMemberBtn?.addEventListener("click", () => {
    if (!addModal) return;
    renderAvatars();
    addModal.classList.add("active");
    document.body.classList.add("blurred");
  });

  addCancelBtn?.addEventListener("click", () => {
    addModal.classList.remove("active");
    document.body.classList.remove("blurred");
    clearAddModal();
  });

  function clearAddModal() {
    if (addNameInput) addNameInput.value = "";
    if (avatarContainer) {
      avatarContainer.querySelectorAll(".avatar-option").forEach(a => a.classList.remove("selected"));
    }
  }

  addConfirmBtn?.addEventListener("click", () => {
    const name = addNameInput.value.trim();
    const avatarEl = avatarContainer?.querySelector(".avatar-option.selected");

    if (!name || name.length < 2 || name.length > 30) {
      alert("Name must be between 2 and 30 characters.");
      return;
    }
    if (!avatarEl) {
      alert("Please select an avatar.");
      return;
    }

    const avatar = avatarEl.dataset.avatar;
    const users = storage.getUsers();
    const isFirst = users.length === 0;

    storage.addUser({ name, avatar, current: isFirst });
    addModal.classList.remove("active");
    document.body.classList.remove("blurred");
    clearAddModal();
    renderUsers();
  });

  renderCurrentUserAvatar();
});
