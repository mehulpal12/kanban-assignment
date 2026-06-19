import React, { useState } from 'react';
import Select from 'react-select';

const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' }
];

const CATEGORY_OPTIONS = [
  { value: 'Bug', label: 'Bug' },
  { value: 'Feature', label: 'Feature' },
  { value: 'Enhancement', label: 'Enhancement' }
];

export const TaskModal = ({ isOpen, onClose, onSubmit, initialTask = null }) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState(initialTask ? { value: initialTask.priority, label: initialTask.priority } : PRIORITY_OPTIONS[1]);
  const [category, setCategory] = useState(initialTask ? { value: initialTask.category, label: initialTask.category } : CATEGORY_OPTIONS[1]);
  
  const [attachments, setAttachments] = useState(initialTask?.attachments || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!isOpen) return null;

  // Handle file streaming to our functional backend upload endpoint
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData, // Browser sets multipart headers automatically
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      // Append new file metadata into state array tracking
      setAttachments((prev) => [...prev, { name: data.name, url: data.url, type: data.type }]);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority: priority.value,
      category: category.value,
      attachments
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-base">
            {initialTask ? 'Edit Task Matrix' : 'Create Rich Task'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Fix broken websocket handshake boundaries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              placeholder="Provide clean technical implementation detail context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Priority Level</label>
              <Select options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} className="text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Category</label>
              <Select options={CATEGORY_OPTIONS} value={category} onChange={setCategory} className="text-sm" />
            </div>
          </div>

          {/* Asset Upload Component Boundary */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Document Attachments</label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 text-center relative hover:bg-slate-100/50 transition-colors">
              <input 
                type="file" 
                onChange={handleFileUpload} 
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="text-xs text-slate-500 flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>{isUploading ? 'Streaming file to storage backend...' : 'Click or drop system assets (PNG, JPEG, PDF up to 5MB)'}</span>
              </div>
            </div>

            {uploadError && <p className="text-red-500 text-xs mt-1 font-medium">{uploadError}</p>}

            {/* List Attached Previews */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-slate-100 rounded-lg border border-slate-200">
                    <a href={file.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-medium truncate max-w-[80%]">
                      📎 {file.name}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer Button Group */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
              Save Matrix Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};