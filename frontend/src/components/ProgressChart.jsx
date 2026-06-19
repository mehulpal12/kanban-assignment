import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useBoard } from '../context/BoardContext';

export const ProgressChart = () => {
  const { boardState } = useBoard();

  const data = [
    {
      name: 'To Do',
      count: boardState.columnOrder.todo.length,
      color: '#6366f1'
    },
    {
      name: 'In Progress',
      count: boardState.columnOrder['in-progress'].length,
      color: '#f59e0b'
    },
    {
      name: 'Done',
      count: boardState.columnOrder.done.length,
      color: '#10b981'
    }
  ];

  return (
    // FIX 1: Add min-w-0 to prevent layout collapse inside flex/grid contexts
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm max-w-7xl mx-auto w-full min-w-0 mb-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Workspace Velocity</h3>
        <p className="text-xs text-slate-500">Real-time status metrics distribution</p>
      </div>

      {/* FIX 2: Explicitly provide an absolute height value (h-[180px]) instead of a relative parent class */}
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} 
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};