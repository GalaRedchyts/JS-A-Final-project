import LocalStorageService from "./local-storage-service.js";

export function renderCurrentUserAvatar() {
    const storage = new LocalStorageService();

    const users = storage.getUsers();
    const currentUser = users.find(u => u.current);

    if (!currentUser) {
        return;
    }

    document.querySelectorAll(".user-image img").forEach(imgEl => {
        imgEl.src = currentUser.avatar;
        imgEl.alt = `${currentUser.name}'s avatar`;
    });
}