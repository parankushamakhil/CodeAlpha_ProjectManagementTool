import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ProjectBoard from '../components/Projects/ProjectBoard';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { projects } = useApp();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Project Not Found</h2>
        <Link to="/projects" className="text-blue-600 underline">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Project Info */}
      <div className="bg-white rounded-lg border p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
          <div className="mt-2 text-sm text-gray-500">Status: <span className="font-medium">{project.status}</span></div>
          <div className="mt-2 text-sm text-gray-500">Progress: <span className="font-medium">{project.progress}%</span></div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Team:</span>
            {project.members && project.members.map((member) => (
              <span key={member.id} className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 mr-2">
                {member.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Tasks</h2>
        <ProjectBoard projectId={project.id} />
      </div>

      {/* File Manager Placeholder */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Files</h2>
        <div className="bg-gray-100 rounded-lg p-4 text-gray-500">File management coming soon...</div>
      </div>

      {/* Comments/Activity Placeholder */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Activity & Comments</h2>
        <div className="bg-gray-100 rounded-lg p-4 text-gray-500">Comments and activity feed coming soon...</div>
      </div>
    </div>
  );
};

export default ProjectDetail;
