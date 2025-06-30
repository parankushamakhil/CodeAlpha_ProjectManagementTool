import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ProjectReports = () => {
  const { projects, tasks, users } = useApp();

  // Data for Task Status Pie Chart
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: statusCounts[status]
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Data for Tasks per User Bar Chart
  const tasksPerUser = users.map(user => {
    const userTasks = tasks.filter(task => task.assignee?.id === user.id);
    return {
      name: user.name,
      completed: userTasks.filter(t => t.status === 'completed').length,
      active: userTasks.filter(t => t.status !== 'completed').length
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Project Reports</h1>
        <p className="text-gray-600 mt-1">
          An overview of project and task metrics.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Status Distribution */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks per User */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Tasks Per User</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksPerUser}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#82ca9d" name="Completed" />
              <Bar dataKey="active" stackId="a" fill="#8884d8" name="Active" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProjectReports;
