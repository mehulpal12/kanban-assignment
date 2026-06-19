import { nanoid } from 'nanoid';
import { COLUMNS } from './constants.js';

class TaskStore {
  constructor() {
    this.tasks = new Map();
    // Track ordered arrays of IDs per column to enable predictable layout serialization
    this.columnOrder = {
      [COLUMNS.TODO]: [],
      [COLUMNS.IN_PROGRESS]: [],
      [COLUMNS.DONE]: [],
    };
  }

  getBoardState() {
    const tasksObj = {};
    this.tasks.forEach((task, id) => {
      tasksObj[id] = task;
    });
    return {
      tasks: tasksObj,
      columnOrder: this.columnOrder,
    };
  }

  createTask({ title, description, column, priority, category }) {
    const id = nanoid();
    const now = new Date().toISOString();

    const newTask = {
      id,
      title: title || 'Untitled Task',
      description: description || '',
      column: column || COLUMNS.TODO,
      priority: priority || 'Medium',
      category: category || 'Feature',
      attachments: [],
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(id, newTask);
    this.columnOrder[newTask.column].push(id);
    return newTask;
  }

  updateTask(id, changes) {
    if (!this.tasks.has(id)) return null;

    const currentTask = this.tasks.get(id);
    const updatedTask = {
      ...currentTask,
      ...changes,
      id, // Protect key identity integrity
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  moveTask(id, fromColumn, toColumn, newIndex) {
    if (!this.tasks.has(id)) return false;

    // 1. Remove from origin order array
    this.columnOrder[fromColumn] = this.columnOrder[fromColumn].filter((taskId) => taskId !== id);

    // 2. Insert into destination order array
    this.columnOrder[toColumn].splice(newIndex, 0, id);

    // 3. Update the task entity's column field status
    const task = this.tasks.get(id);
    task.column = toColumn;
    task.updatedAt = new Date().toISOString();

    return true;
  }

  deleteTask(id) {
    if (!this.tasks.has(id)) return false;

    const task = this.tasks.get(id);
    const column = task.column;

    this.columnOrder[column] = this.columnOrder[column].filter((taskId) => taskId !== id);
    this.tasks.delete(id);

    return true;
  }
}

export const taskStore = new TaskStore();