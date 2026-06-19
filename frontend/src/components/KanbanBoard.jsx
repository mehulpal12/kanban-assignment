import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useBoard } from '../context/BoardContext';
import { useSocket } from '../context/SocketContext';
import { Column } from './Column';
import { TaskModal } from './TaskModal';
import { ProgressChart } from './ProgressChart'; // Import the new metrics view

const BoardHeader = ({ isConnected, onAddTask }) => (
  <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
    <div className="flex items-center gap-3">
      <h1 className="text-xl font-black text-slate-800 tracking-tight">Vibe Workspace</h1>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50">
        <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
        <span className="text-slate-600">{isConnected ? 'Synced' : 'Disconnecting...'}</span>
      </div>
    </div>
    <button
      onClick={onAddTask}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors duration-150 flex items-center gap-1.5"
    >
      Add Task
    </button>
  </header>
);

export const KanbanBoard = () => {
  const { boardState, createTask, moveTask } = useBoard();
  const { isConnected } = useSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalSubmit = (taskData) => {
    createTask({
      ...taskData,
      column: 'todo'
    });
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    moveTask(draggableId, source.droppableId, destination.droppableId, destination.index);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <BoardHeader isConnected={isConnected} onAddTask={() => setIsModalOpen(true)} />

      <main className="flex-1 p-8 overflow-x-auto space-y-6">
        {/* Real-time analytical matrix overview */}
        <ProgressChart />

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto items-start">
            <Column title="To Do" id="todo" taskIds={boardState.columnOrder.todo} tasks={boardState.tasks} />
            <Column title="In Progress" id="in-progress" taskIds={boardState.columnOrder['in-progress']} tasks={boardState.tasks} />
            <Column title="Done" id="done" taskIds={boardState.columnOrder.done} tasks={boardState.tasks} />
          </div>
        </DragDropContext>
      </main>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} />
    </div>
  );
};