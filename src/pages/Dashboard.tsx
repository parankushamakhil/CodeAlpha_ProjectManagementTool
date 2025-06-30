import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  DollarSign,
  Activity,
  Plus
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import CreateProjectModal from '../components/Projects/CreateProjectModal';

const Dashboard: React.FC = () => {
  const { projects, tasks } = useApp();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    spentBudget: projects.reduce((sum, p) => sum + (p.spentBudget || 0), 0)
  };

  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const upcomingDeadlines = tasks
    .filter(t => t.dueDate && t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      subtext: `${stats.totalProjects} total projects`,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      subtext: `${stats.totalTasks} total tasks`,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Overdue Tasks',
      value: stats.overdueTasks,
      subtext: 'Needs attention',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Budget Spent',
      value: `$${(stats.spentBudget / 1000).toFixed(0)}k`,
      subtext: `$${(stats.totalBudget / 1000).toFixed(0)}k total budget`,
      icon: DollarSign,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 bg-${card.color}-100 rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 text-${card.color}-600`} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm text-${card.color === 'red' ? 'red-600' : 'gray-500'}`}>
                {card.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-4">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in-progress' ? 'bg-blue-500' :
                    task.status === 'review' ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      {task.assignee?.name} • {format(new Date(task.updatedAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                to="/tasks"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all tasks →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {task.assignee?.name}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(task.dueDate!), 'MMM d')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(task.dueDate!), 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                to="/calendar"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View calendar →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Active Projects</h2>
            <div className="flex items-center space-x-4">
              <Link
                to="/projects"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all →
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => p.status === 'active').slice(0, 3).map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm text-gray-500">{project.progress}%</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((member) => (
                      <div
                        key={member.id}
                        className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-xs text-gray-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {project.members.length > 3 && (
                    <span className="text-sm text-gray-500">
                      +{project.members.length - 3}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;