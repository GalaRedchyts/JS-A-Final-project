function generateId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export default class LocalStorageService {
  constructor() {
    this.USERS_KEY = "users";
    this.TASKS_KEY = "tasks";

    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.TASKS_KEY)) {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify([]));
    }
  }

  // ===== USERS =====
  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
  }

  addUser(user) {
    const users = this.getUsers();
    const newUser = {
      id: generateId(),
      generated: user.generated ?? false,
      ...user,
    };
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return newUser;
  }

  updateUser(id, updatedData) {
    let users = this.getUsers();
    users = users.map(u =>
      String(u.id) === String(id) ? { ...u, ...updatedData } : u
    );
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  deleteUser(id) {
    let users = this.getUsers();
    users = users.filter(u => String(u.id) !== String(id));
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // ===== TASKS =====
  getTasks() {
    return JSON.parse(localStorage.getItem(this.TASKS_KEY)) || [];
  }

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      id: generateId(),
      generated: task.generated ?? false,
      title: task.title || "Untitled",
      description: task.description || "",
      priority: task.priority || "Medium",
      status: task.status || "To do",
      userId: task.userId || null,
      dueDate: task.dueDate || null,
    };
    tasks.push(newTask);
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  }

  updateTask(id, updatedFields) {
    const tasks = this.getTasks();
    const updatedTasks = tasks.map(task =>
      String(task.id) === String(id) ? { ...task, ...updatedFields } : task
    );
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(updatedTasks));
  }

  deleteTask(id) {
    let tasks = this.getTasks();
    tasks = tasks.filter(t => String(t.id) !== String(id));
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  saveTasks(tasks) {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  clearAll() {
    localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    localStorage.setItem(this.TASKS_KEY, JSON.stringify([]));
  }
}
