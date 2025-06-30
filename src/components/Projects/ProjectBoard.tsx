import React, { useState, useEffect } from 'react';
import TaskColumn from './TaskColumn';
import TaskDetailModal from './TaskDetailModal';
import CreateTaskModal from './CreateTaskModal';
import { useApp } from '../../contexts/AppContext';
import { Task } from '../../types';

interface ProjectBoardProps {
  projectId: string;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ projectId }) => {
  const { tasks, users } = useApp();
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('todo');

  useEffect(() => {
    let filteredTasks = tasks.filter(t => t.projectId === projectId);

    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
    }
    if (assigneeFilter !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.assignee?.id === assigneeFilter);
    }

    setProjectTasks(filteredTasks);
  }, [tasks, projectId, priorityFilter, assigneeFilter]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleOpenCreateTaskModal = (status: string) => {
    setDefaultTaskStatus(status);
    setCreateTaskModalOpen(true);
  };

  const columns = ['todo', 'in-progress', 'review', 'completed'];

  return (
    <div>
      {/* Filter Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex items-center space-x-4">
        <h3 className="font-semibold text-gray-700">Filters:</h3>
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignees</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex space-x-4 p-4 bg-gray-100 rounded-lg overflow-x-auto">
        {columns.map(status => (
          <TaskColumn
            key={status}
            status={status}
            tasks={projectTasks.filter(t => t.status === status)}
            onTaskClick={handleTaskClick}
            onNewTaskClick={handleOpenCreateTaskModal}
          />
        ))}
        <TaskDetailModal 
          task={selectedTask}
          onClose={handleCloseModal}
        />
        <CreateTaskModal 
          isOpen={isCreateTaskModalOpen}
          onClose={() => setCreateTaskModalOpen(false)}
          projectId={projectId}
          defaultStatus={defaultTaskStatus}
        />
      </div>
    </div>
  );
};

export default ProjectBoard;
