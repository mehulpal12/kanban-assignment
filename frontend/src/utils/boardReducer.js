export const initialState = {
  tasks: {},
  columnOrder: {
    todo: [],
    'in-progress': [],
    done: []
  }
};

export const BOARD_ACTIONS = {
  SYNC_BOARD: 'SYNC_BOARD',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  MOVE_TASK: 'MOVE_TASK',
  DELETE_TASK: 'DELETE_TASK'
};

export function boardReducer(state, action) {
  switch (action.type) {
    case BOARD_ACTIONS.SYNC_BOARD: {
      // Expects payload: { tasks: Record<id, Task>, columnOrder: { todo: [], ... } }
      return {
        ...state,
        tasks: action.payload.tasks || {},
        columnOrder: action.payload.columnOrder || initialState.columnOrder
      };
    }

    case BOARD_ACTIONS.ADD_TASK: {
      // Expects payload: { task: Task, columnOrder: { ... } }
      const { task, columnOrder } = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task.id]: task
        },
        columnOrder: columnOrder || {
          ...state.columnOrder,
          [task.column]: [...state.columnOrder[task.column], task.id]
        }
      };
    }

    case BOARD_ACTIONS.UPDATE_TASK: {
      // Expects payload: Task (fully updated instance)
      const updatedTask = action.payload;
      if (!state.tasks[updatedTask.id]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [updatedTask.id]: updatedTask
        }
      };
    }

    case BOARD_ACTIONS.MOVE_TASK: {
      // Expects payload: { id, fromColumn, toColumn, newIndex, columnOrder }
      const { id, toColumn, columnOrder } = action.payload;
      if (!state.tasks[id]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: { ...state.tasks[id], column: toColumn }
        },
        columnOrder: columnOrder // Trust the server's ordered calculation
      };
    }

    case BOARD_ACTIONS.DELETE_TASK: {
      // Expects payload: { id, columnOrder }
      const { id, columnOrder } = action.payload;
      const nextTasks = { ...state.tasks };
      delete nextTasks[id];

      return {
        ...state,
        tasks: nextTasks,
        columnOrder: columnOrder
      };
    }

    default:
      return state;
  }
}