import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useBoard } from '../context/BoardContext';

export const TaskCard = ({ task, index }) => {
  const { deleteTask } = useBoard();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Bug': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Feature': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'none' // Clears layout shifting anomalies
          }}
          className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 group relative select-none ${
            snapshot.isDragging ? 'shadow-lg border-indigo-300 ring-2 ring-indigo-600/5' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{task.title}</h4>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Stop drag activation triggers from intercepting button actions
                deleteTask(task.id);
              }}
              className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-md hover:bg-slate-50"
              title="Delete Task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">{task.description || 'No description provided.'}</p>

          <div className="flex flex-wrap gap-1.5 items-center">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
            
            {task.attachments?.length > 0 && (
              <span className="ml-auto text-slate-400 text-[11px] flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 002 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
                {task.attachments.length}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};