import { EVENTS } from './constants.js';
import { taskStore } from './taskStore.js';

export const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Immediately push current baseline board state to the new client
    socket.emit(EVENTS.SYNC_TASKS, taskStore.getBoardState());

    // Handle creation
    socket.on(EVENTS.TASK_CREATE, (payload) => {
      const newTask = taskStore.createTask(payload);
      io.emit(EVENTS.TASK_CREATE, { task: newTask, columnOrder: taskStore.columnOrder });
    });

    // Handle basic inline field updates
    socket.on(EVENTS.TASK_UPDATE, ({ id, changes }) => {
      const updatedTask = taskStore.updateTask(id, changes);
      if (updatedTask) {
        io.emit(EVENTS.TASK_UPDATE, updatedTask);
      }
    });

    // Handle multi-column drag movements
    socket.on(EVENTS.TASK_MOVE, ({ id, fromColumn, toColumn, newIndex }) => {
      const success = taskStore.moveTask(id, fromColumn, toColumn, newIndex);
      if (success) {
        io.emit(EVENTS.TASK_MOVE, { id, fromColumn, toColumn, newIndex, columnOrder: taskStore.columnOrder });
      }
    });

    // Handle deletions
    socket.on(EVENTS.TASK_DELETE, ({ id }) => {
      const success = taskStore.deleteTask(id);
      if (success) {
        io.emit(EVENTS.TASK_DELETE, { id, columnOrder: taskStore.columnOrder });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });
};