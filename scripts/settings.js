import LocalStorageService from "./services/local-storage-service.js";
import { avatars } from "./data/avatars.js";

document.addEventListener("DOMContentLoaded", () => {
    const storage = new LocalStorageService();

    const listUsers = document.querySelector(".list-users");
    const userCountSpan = document.querySelector("[data-user-count]");
    const addMemberBtn = document.querySelector(".add-member button");

    //MODAL
    const addModal = document.getElementById("addMemberModal");
    const addNameInput = addModal?.querySelector("input[name='memberName']");
    const avatarContainer = addModal?.querySelector(".avatars");
    const addConfirmBtn = addModal?.querySelector(".confirm-add");
    const addCancelBtn = addModal?.querySelector(".cancel-add");

    const deleteModal = document.getElementById("confirmDeleteModal");
    const deleteConfirmBtn = deleteModal?.querySelector(".confirm-btn");
    const deleteCancelBtn = deleteModal?.querySelector(".cancel-btn");

    let userToDeleteId = null;

    //USER RENDER
    function renderUsers() {
        const users = storage.getUsers();
        listUsers.innerHTML = "";

        users.forEach((user, index) => {
            const li = document.createElement("li");

            if(index === 0) {
                li.setAttribute("data-current-user", "");
                li.innerHTML = `
                    <img src="${user.avatar}" alt="user image">
                    <h5 class="user-name" data-name>${user.name}</h5>
                    <span>Current User</span>
                `;  
            } else {
                li.innerHTML = `
                    <img src="${user.avatar}" alt="user image">
                    <h5 class="user-name" data-name>${user.name}</h5>
                    <button class="delete-button" aria-label="Delete">
                        <img src="/images/icons/trash.svg" alt="icon trash">
                    </button>
                `;

                const deleteBtn = li.querySelector(".delete-button");
                deleteBtn.addEventListener("click", () => {
                    userToDeleteId = user.id;
                    deleteModal.classList.add("active");
                    document.body.classList.add("blurred");
                });
            }

            listUsers.appendChild(li);
        });

        userCountSpan.textContent = users.length;
    }

    renderUsers();

    //AVATAR
    function renderAvatars() {
        if(!avatarContainer) {
           return; 
        } 

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

    //ADD NEW USER
    addMemberBtn.addEventListener("click", () => {
        if(!addModal) return;

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
        addNameInput.value = "";
        avatarContainer.querySelectorAll(".avatar-option").forEach(a => a.classList.remove("selected"));
    }

    addConfirmBtn?.addEventListener("click", () => {
        const name = addNameInput.value.trim();
        const avatarEl = document.querySelector(".avatar-option.selected");

        if (!name || name.length < 2 || name.length > 30) {
            alert("Name must be between 2 and 30 characters.");
            return;
        }

        if(!avatarEl){
            alert("Please select an avatar.");
            return;
        }

        const avatar = avatarEl.dataset.avatar;

        const users = storage.storage.getUsers();
        const isFirst = users.length === 0;

        storage.addUser({ name, avatar, current: isFirst });
        addModal.classList.remove("active");
        document.body.classList.remove("blurred");
        clearAddModal();
        renderUsers();
    });

    //DELETE USER
    deleteCancelBtn?.addEventListener("click", () => {
        deleteModal.classList.remove("active");
        document.body.classList.remove("blurred");
        userToDeleteId = null;
    });

    deleteConfirmBtn?.addEventListener("click", () => {
        if(userToDeleteId) {
            const tasks = storage.getTasks();
            tasks.forEach(task => {
                if (task.userId === userToDeleteId) {
                    task.userId = null;
                }
            });
            storage.saveTasks(tasks);

            storage.deleteUser(userToDeleteId);
            userToDeleteId = null;
            deleteModal.classList.remove("active");
            document.body.classList.remove("blurred");
            renderUsers();
        }
    });
});
