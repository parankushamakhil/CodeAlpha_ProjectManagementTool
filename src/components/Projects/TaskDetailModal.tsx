import React from 'react';
import { X } from 'lucide-react';
import TaskComments from './TaskComments';
import { useApp } from '../../contexts/AppContext';
import { Task } from '../../types';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const { users, projects } = useApp();
  if (!task) return null;

  const assignee = users.find(u => u.id === task.assignee?.id);
  const project = projects.find(p => p.id === task.projectId);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          
          <p className="text-gray-600">{task.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-500">Status:</span>
              <span className="ml-2 capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{task.status}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-500">Priority:</span>
              <span className="ml-2 capitalize px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">{task.priority}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-500">Assignee:</span>
              <span className="ml-2 text-gray-800">{assignee ? assignee.name : 'Unassigned'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-500">Project:</span>
              <span className="ml-2 text-gray-800">{project ? project.name : 'Unknown'}</span>
            </div>
          </div>
        </div>

        <TaskComments taskId={task.id} projectId={task.projectId} />
      </div>
    </div>
  );
};

export default TaskDetailModal;
