import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Mail, Shield } from 'lucide-react';

const Team = () => {
  const { users } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <p className="text-gray-600 mt-1">
          View and manage your organization's members.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-lg border p-6 text-center">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`} 
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            
            <div className="mt-4 flex items-center justify-center space-x-2">
              <Shield size={14} className="text-gray-400" />
              <span className="text-xs font-medium capitalize">{user.role}</span>
            </div>

            <div className="mt-6 space-x-2">
              <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Edit Role
              </button>
              <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team; 