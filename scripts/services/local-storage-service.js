export default class LocalStorageService {
    constructor() {
        this.USERS_KEY = 'users';
        this.TASKS_KEY = 'tasks';

        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }

        if (!localStorage.getItem(this.TASKS_KEY)) {
            localStorage.setItem(this.TASKS_KEY, JSON.stringify([]));
        }
    }

    // USERS

    getUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
    }

    addUser(user) {
        const users = this.getUsers();
        const newId = users.length ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
        const newUser = { id: newId, ...user };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        return newUser;
      }

    updateUser(id, updatedData) {
        let users = this.getUsers();
        users = users.map(u => u.id === id ? { ...u, ...updatedData } : u);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    deleteUser(id) {
        let users = this.getUsers();
        users = users.filter(u => u.id !== id);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    //TASKS

    getTasks() {
        return JSON.parse(localStorage.getItem(this.TASKS_KEY)) || [];
    }

    addTask(task) {
        const tasks = this.getTasks();
        const newId = tasks.length ? Math.max(...tasks.map(t => t.id || 0)) + 1 : 1;
        const newTask = { id: newId, ...task };
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        return newTask;
    }

    updateTask(id, updatedData) {
        let tasks = this.getTasks();
        tasks = tasks.map(t => t.id === id ? { ...t, ...updatedData } : t);
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    }

    deleteTask(id) {
        let tasks = this.getTasks();
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    }

    clearAll() {
        localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        localStorage.setItem(this.TASKS_KEY, JSON.stringify([]));
    }
}