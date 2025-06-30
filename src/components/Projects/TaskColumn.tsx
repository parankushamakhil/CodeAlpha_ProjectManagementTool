import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '../../types';
import { Plus } from 'lucide-react';

interface TaskColumnProps {
  status: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onNewTaskClick: (status: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks, onTaskClick, onNewTaskClick }) => {
  const statusText = status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="bg-gray-50 rounded-lg p-4 w-80 flex-shrink-0">
      <h3 className="font-bold mb-4 text-gray-700">{statusText}</h3>
      <div className="space-y-3 min-h-[100px]">
        {tasks.map(task => (
          <TaskCard 
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-sm text-gray-400 text-center pt-4">No tasks here.</div>
        )}
      </div>
      <button 
        onClick={() => onNewTaskClick(status)}
        className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Plus size={16} />
        <span>New Task</span>
      </button>
    </div>
  );
};

export default TaskColumn;
