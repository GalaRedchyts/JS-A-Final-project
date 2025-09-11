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
        user.id = Date.now();
        users.push(user);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return user;
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
        task.id = Date.now();
        tasks.push(task);
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
        return task;
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