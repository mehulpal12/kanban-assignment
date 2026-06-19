import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { boardReducer, initialState, BOARD_ACTIONS } from '../utils/boardReducer';
import { useSocket } from './SocketContext';

const BoardContext = createContext(null);

// Mirroring centralized backend constants to avoid drift
const EVENTS = {
  SYNC_TASKS: 'sync:tasks',
  TASK_CREATE: 'task:create',
  TASK_UPDATE: 'task:update',
  TASK_MOVE: 'task:move',
  TASK_DELETE: 'task:delete',
};

export const BoardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // 1. Initial State Baseline Synchronization
    socket.on(EVENTS.SYNC_TASKS, (boardSnapshot) => {
      dispatch({ type: BOARD_ACTIONS.SYNC_BOARD, payload: boardSnapshot });
    });

    // 2. Broadcast listeners
    socket.on(EVENTS.TASK_CREATE, (data) => {
      dispatch({ type: BOARD_ACTIONS.ADD_TASK, payload: data });
    });

    socket.on(EVENTS.TASK_UPDATE, (updatedTask) => {
      dispatch({ type: BOARD_ACTIONS.UPDATE_TASK, payload: updatedTask });
    });

    socket.on(EVENTS.TASK_MOVE, (moveData) => {
      dispatch({ type: BOARD_ACTIONS.MOVE_TASK, payload: moveData });
    });

    socket.on(EVENTS.TASK_DELETE, (deleteData) => {
      dispatch({ type: BOARD_ACTIONS.DELETE_TASK, payload: deleteData });
    });

    // Clean up event listeners on teardown
    return () => {
      socket.off(EVENTS.SYNC_TASKS);
      socket.off(EVENTS.TASK_CREATE);
      socket.off(EVENTS.TASK_UPDATE);
      socket.off(EVENTS.TASK_MOVE);
      socket.off(EVENTS.TASK_DELETE);
    };
  }, [socket]);

  // Outbound Emitters (Triggered by UI Actions)
  const createTask = (taskData) => {
    socket?.emit(EVENTS.TASK_CREATE, taskData);
  };

  const updateTask = (id, changes) => {
    socket?.emit(EVENTS.TASK_UPDATE, { id, changes });
  };

  const moveTask = (id, fromColumn, toColumn, newIndex) => {
    socket?.emit(EVENTS.TASK_MOVE, { id, fromColumn, toColumn, newIndex });
  };

  const deleteTask = (id) => {
    socket?.emit(EVENTS.TASK_DELETE, { id });
  };

  return (
    <BoardContext.Provider value={{ boardState: state, createTask, updateTask, moveTask, deleteTask }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within a BoardProvider');
  return context;
};