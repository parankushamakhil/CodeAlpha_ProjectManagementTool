import React from 'react';
import { Task } from '../../types';
import { User, Flag, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const priorityMap: { [key in Task['priority']]: { color: string; icon: React.ReactNode } } = {
    low: { color: 'bg-green-100 text-green-800', icon: <Flag className="w-3 h-3" /> },
    medium: { color: 'bg-yellow-100 text-yellow-800', icon: <Flag className="w-3 h-3" /> },
    high: { color: 'bg-orange-100 text-orange-800', icon: <Flag className="w-3 h-3" /> },
    urgent: { color: 'bg-red-100 text-red-800', icon: <Flag className="w-3 h-3" /> }
  };

  return (
    <div
      onClick={() => onClick(task)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
    >
      <h4 className="font-semibold text-sm text-gray-800 mb-2 group-hover:text-blue-600">{task.title}</h4>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${priorityMap[task.priority].color}`}>
          {priorityMap[task.priority].icon}
          <span>{task.priority}</span>
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        {task.dueDate && (
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        )}
        {task.assignee && (
          <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center" title={task.assignee.name}>
            <span className="text-xs text-gray-600">
              {task.assignee.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TaskCard);
