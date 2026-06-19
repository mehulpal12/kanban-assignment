import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';

export const Column = ({ title, id, taskIds, tasks }) => {
  return (
    <div className="flex flex-col w-full min-w-[280px] bg-slate-50 rounded-xl border border-slate-200/60 p-4 h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-700 text-sm tracking-wide uppercase">{title}</h3>
          <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">
            {taskIds.length}
          </span>
        </div>
      </div>

      {/* Inject the Droppable wrapping mechanics */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-3 overflow-y-auto pr-1 flex-1 rounded-lg transition-colors duration-150 custom-scrollbar ${
              snapshot.isDraggingOver ? 'bg-slate-200/50' : ''
            }`}
          >
            {taskIds.map((taskId, index) => {
              const task = tasks[taskId];
              if (!task) return null;
              return <TaskCard key={taskId} task={task} index={index} />;
            })}
            {provided.placeholder}
            
            {taskIds.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-400 mt-2">
                <p className="text-xs">Drop items here</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};